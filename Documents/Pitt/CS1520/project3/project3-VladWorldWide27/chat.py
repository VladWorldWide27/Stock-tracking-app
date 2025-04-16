import os
from datetime import datetime
from flask import (
    Flask,
    request,
    session,
    url_for,
    redirect,
    render_template,
    abort,
    g,
    flash,
    jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash

from models import db, User, ChatRoom, Message, init_db

# Create the application
app = Flask(__name__)

# Configuration
DEBUG = True
SECRET_KEY = "development key"

SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(app.root_path, "chat.db")

app.config['DEBUG'] = DEBUG
app.config['SECRET_KEY'] = SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.cli.command("initdb")
def initdb_command():
    """Initialize the database."""
    init_db()
    # No flash here - just print to console
    print("Database initialized")

# Helper method to look up user by username
def get_user_by_username(username):
    return User.query.filter_by(username=username).first()

@app.before_request
def before_request():
    g.user = None
    if "user_id" in session:
        g.user = User.query.filter_by(id=session["user_id"]).first()

# Root route redirects to login if not logged in, or chatroom list otherwise
@app.route("/")
def index():
    if not g.user:
        return redirect(url_for("login"))
    return redirect(url_for("show_rooms"))

# Show list of chat rooms
@app.route("/rooms")
def show_rooms():
    if not g.user:
        return redirect(url_for("login"))
    
    rooms = ChatRoom.query.all()
    return render_template("index.html", rooms=rooms)  # Using index.html from your code

# Create a new chat room
@app.route("/create_room", methods=["POST"])
def create_room():
    if not g.user:
        return redirect(url_for("login"))
    
    if request.form["name"]:
        room = ChatRoom(
            name=request.form["name"],
            creator_id=g.user.id
        )
        db.session.add(room)
        db.session.commit()
        flash("New chat room created")
    else:
        flash("Room name is required")
        
    return redirect(url_for("index"))

# Join a chat room
@app.route("/join_room/<int:room_id>")
def join_room(room_id):
    if not g.user:
        return redirect(url_for("login"))
    
    room = ChatRoom.query.get_or_404(room_id)
    
    # Remove user from all other rooms first
    for current_room in g.user.current_room:
        current_room.participants.remove(g.user)
    
    # Add user to this room
    room.participants.append(g.user)
    db.session.commit()
    
    return redirect(url_for("chat_room", room_id=room_id))

# Leave the current chat room
@app.route("/leave_room")
def leave_room():
    if not g.user:
        return redirect(url_for("login"))
    
    # Remove user from all rooms
    for room in g.user.current_room:
        room.participants.remove(g.user)
    
    db.session.commit()
    flash("You have left the chat room")
    return redirect(url_for("index"))

# Delete a chat room (creator only)
@app.route("/delete_room/<int:room_id>")
def delete_room(room_id):
    if not g.user:
        return redirect(url_for("login"))
    
    room = ChatRoom.query.get_or_404(room_id)
    
    # Only the creator can delete a room
    if room.creator_id != g.user.id:
        flash("You can only delete rooms you created")
        return redirect(url_for("index"))
    
    db.session.delete(room)
    db.session.commit()
    flash("Chat room deleted")
    
    return redirect(url_for("index"))

# View a chat room
@app.route("/chat_room/<int:room_id>")
def chat_room(room_id):
    if not g.user:
        return redirect(url_for("login"))
    
    room = ChatRoom.query.get_or_404(room_id)
    
    # Ensure user is in this room
    if g.user not in room.participants:
        return redirect(url_for("join_room", room_id=room_id))
    
    messages = Message.query.filter_by(room_id=room_id).order_by(Message.timestamp).all()
    return render_template("chat_room.html", room=room, messages=messages)

# API endpoint to get new messages
@app.route("/api/messages/<int:room_id>", methods=["GET"])
def get_messages(room_id):
    if not g.user:
        return jsonify({"error": "Not logged in"}), 401
    
    # Get the last message ID the client has
    last_id = request.args.get("last_id", 0, type=int)
    
    # Get all messages with ID > last_id
    messages = Message.query.filter_by(room_id=room_id).filter(Message.id > last_id).order_by(Message.timestamp).all()
    
    messages_data = [
        {
            "id": message.id,
            "content": message.content,
            "timestamp": message.timestamp.strftime('%H:%M:%S'),
            "username": message.user.username
        }
        for message in messages
    ]
    
    # Also check if room still exists or was deleted
    room = ChatRoom.query.get(room_id)
    if not room:
        return jsonify({"deleted": True}), 200
    
    return jsonify({"messages": messages_data, "deleted": False})

# API endpoint to post a new message
@app.route("/api/messages/<int:room_id>", methods=["POST"])
def post_message(room_id):
    if not g.user:
        return jsonify({"error": "Not logged in"}), 401
    
    room = ChatRoom.query.get_or_404(room_id)
    
    # Ensure user is in this room
    if g.user not in room.participants:
        return jsonify({"error": "Not in this room"}), 403
    
    data = request.get_json()
    
    if not data or "content" not in data:
        return jsonify({"error": "No message content"}), 400
    
    message = Message(
        content=data["content"],
        user_id=g.user.id,
        room_id=room_id
    )
    db.session.add(message)
    db.session.commit()
    
    return jsonify({
        "id": message.id,
        "content": message.content,
        "timestamp": message.timestamp.strftime('%H:%M:%S'),
        "username": g.user.username
    })

# User registration
@app.route("/register", methods=["GET", "POST"])
def register():
    if g.user:
        return redirect(url_for("index"))
    
    error = None
    if request.method == "POST":
        if not request.form["username"]:
            error = "You have to enter a username"
        elif not request.form["password"]:
            error = "You have to enter a password"
        elif get_user_by_username(request.form["username"]) is not None:
            error = "The username is already taken"
        else:
            user = User(username=request.form["username"])
            user.set_password(request.form["password"])
            db.session.add(user)
            db.session.commit()
            flash("You were successfully registered and can login now")
            return redirect(url_for("login"))
    
    return render_template("register.html", error=error)

# Login
@app.route("/login", methods=["GET", "POST"])
def login():
    if g.user:
        return redirect(url_for("index"))
    
    error = None
    if request.method == "POST":
        user = get_user_by_username(request.form["username"])
        
        if user is None:
            error = "Invalid username"
        elif not user.check_password(request.form["password"]):
            error = "Invalid password"
        else:
            flash("You were logged in")
            session["user_id"] = user.id
            return redirect(url_for("index"))
    
    return render_template("login.html", error=error)

# Logout
@app.route("/logout")
def logout():
    session.pop("user_id", None)
    flash("You were logged out")
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run()
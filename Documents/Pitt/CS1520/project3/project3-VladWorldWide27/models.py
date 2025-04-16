from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Table, DateTime
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

#Author: Vladimir Deianov
#this is a reworked minitwit models file. 



event_staff = Table(
    "event_staff",
    db.metadata,
    Column("event_id", Integer, ForeignKey("event.id")),
    Column("staff_id", Integer, ForeignKey("user.id")),
)

# This table manages the many-to-many relationship between users and chat rooms
# (users currently in a room)
user_room = Table(
    "user_room",
    db.metadata,
    Column("user_id", Integer, ForeignKey("user.id")),
    Column("room_id", Integer, ForeignKey("chatroom.id")),
)

class User(db.Model):
    __tablename__ = "user"
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    user_type = Column(String(20), default="user")  # Keep user_type from original code
    
    #customer created events
    events_created = relationship("Event", back_populates="customer", cascade="all, delete-orphan")
    #staff that works those events
    events_working = relationship("Event", secondary=event_staff, back_populates="staff")
    
    # Rooms created by this user
    rooms_created = relationship("ChatRoom", back_populates="creator", cascade="all, delete-orphan")
    
    # Rooms currently being participated in
    current_room = relationship("ChatRoom", secondary=user_room, back_populates="participants")
    
    # Messages sent by this user
    messages = relationship("Message", back_populates="user", cascade="all, delete-orphan")
    
    # i moved these functions from minitwit.py, the idea never changed.
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def is_owner(self):
        return self.user_type == 'owner'
    
    def is_staff(self):
        return self.user_type == 'staff'
    
    def is_customer(self):
        return self.user_type == 'customer'


#this is a reworked Message class
class Event(db.Model):
    __tablename__ = "event"
    
    id = Column(Integer, primary_key=True)
    date = Column(Date, unique=True, nullable=False)
    description = Column(String(200))
    
    #these databases should be the same as in the user class
    #customer created events
    customer_id = Column(Integer, ForeignKey("user.id"))
    customer = relationship("User", back_populates="events_created")
    #events that staff works
    staff = relationship("User", secondary=event_staff, back_populates="events_working")
    

    #new functions to match the requirements, no more than 3 staff members can work on a event
    def is_fully_staffed(self):
        return len(self.staff) >= 3
    






    def add_staff(self, staff_member):
        if not self.is_fully_staffed() and staff_member not in self.staff:
            self.staff.append(staff_member)
            return True
        
        return False
    
    def remove_staff(self, staff_member):

        if staff_member in self.staff:
            
            self.staff.remove(staff_member)
            return True
        return False
    

class ChatRoom(db.Model):
    __tablename__ = "chatroom"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # User who created this room
    creator_id = Column(Integer, ForeignKey("user.id"))
    creator = relationship("User", back_populates="rooms_created")
    
    # Users currently in this room
    participants = relationship("User", secondary=user_room, back_populates="current_room")
    
    # Messages in this room
    messages = relationship("Message", back_populates="room", cascade="all, delete-orphan")

class Message(db.Model):
    __tablename__ = "message"
    
    id = Column(Integer, primary_key=True)
    content = Column(String(500), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # User who sent this message
    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", back_populates="messages")
    
    # Room this message belongs to
    room_id = Column(Integer, ForeignKey("chatroom.id"))
    room = relationship("ChatRoom", back_populates="messages")

# This function is called from the CLI command and doesn't need flash
def init_db():
    db.create_all()
    
    # Create owner account if it doesn't exist
    owner = User.query.filter_by(username='owner').first()
    if not owner:
        owner = User(username='owner', user_type='owner')
        owner.set_password('pass')
        db.session.add(owner)
        db.session.commit()
    
    print("Database initialized successfully!")  # Use print instead of flash for CLI
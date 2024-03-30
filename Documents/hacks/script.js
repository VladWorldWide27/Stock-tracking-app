const questions = [
    {
        question: "What year of studies are you?",
        answers: [
            { text: "Freshman", response: 1},
            { text: "Sophomore", response: 2},
            { text: "Junior", response: 3},
            { text: "Senior", response: 4},
            
        ]
    },
    {
        question: "I snore/talk in my sleep or make other noise in my sleep",
        answers: [
            { text: "Strongly agree", response: 1},
            { text: "Agree", response: 2},
            { text: "Disagree", response: 3},
            { text: "Strongly disagree", response: 4},
        ]
    },
    {
        question: "It matters to me if my roommate snores, talks or make other noise in their sleep",
        answers: [
            { text: "Strongly agree", response: 1},
            { text: "Agree", response: 2},
            { text: "Disagree", response: 3},
            { text: "Strongly disagree", response: 4},
        ]
    },
    {
        question: "I like white noise or a fan running while I sleep",
        answers: [
            { text: "Strongly agree", response: 1},
            { text: "Agree", response: 2},
            { text: "Disagree", response: 3},
            { text: "Strongly disagree", response: 4},
        ]
    },
    {
        question: "I will not be bothered by noise if my roommate wakes earlier than me",
        answers: [
            { text: "Strongly agree", response: 1},
            { text: "Agree", response: 2},
            { text: "Disagree", response: 3},
            { text: "Strongly disagree", response: 4},
        ]
    },
    {
        question: "I will not be bothered by noise if my roommate goes to bed later than me",
        answers: [
            { text: "Strongly agree", response: 1},
            { text: "Agree", response: 2},
            { text: "Disagree", response: 3},
            { text: "Strongly disagree", response: 4},
        ]
    },
    {
        question: "What light level do you best sleep at",
        answers: [
            { text: "Pitch black", response: 1},
            { text: "Shades open", response: 2},
            { text: "Night light on", response: 3},
            { text: "I do not mind", response: 4},
        ]
    },
    {
        question: "What time do you plan to wake up on weekdays",
        answers: [
            { text: "6:00am-8:00am", response: 1},
            { text: "8:00am-10:00am", response: 2},
            { text: "10:00am-13:00pm", response: 3},
            { text: "I do not have a set schedule", response: 4},
        ]
    },
    {
        question: "What time do you plan to go to sleep on weekdays",
        answers: [
            { text: "6:00pm-8:00pm", response: 1},
            { text: "8:00pm-10:00pm", response: 2},
            { text: "10:00pm-12:00am", response: 3},
            { text: "I do not have a set schedule", response: 4},
        ]
    },
    {
        question: "How frequently are you planning to bring guest to the room",
        answers: [
            { text: "3-5 times a week", response: 1},
            { text: "1-2 times a week", response: 2},
            { text: "1 a month", response: 3},
            { text: "I am not going to bring guests", response: 4},
        ]
    },
    {
        question: "How frequently are you planning to attend parties",
        answers: [
            { text: "3-5 times a week", response: 1},
            { text: "1-2 times a week", response: 2},
            { text: "1 a month", response: 3},
            { text: "I am not a big party guy", response: 4},
        ]
    },
    {
        question: "How often do you plan to clean your room",
        answers: [
            { text: "Weekly", response: 1},
            { text: "Every other week", response: 2},
            { text: "Monthly", response: 3},
            { text: "Less often than these options", response: 4},
        ]
    },
    {
        question: "Rate the cleanliness of this room",
        answers: [
            { text: "Very clean", response: 1},
            { text: "Clean", response: 2},
            { text: "Average", response: 3},
            { text: "Dirty", response: 4},
            { text: "Very dirty", response: 5},
        ]
    },
    {
        question: "Rate the cleanliness of this room",
        answers: [
            { text: "Very clean", response: 1},
            { text: "Clean", response: 2},
            { text: "Average", response: 3},
            { text: "Dirty", response: 4},
            { text: "Very dirty", response: 5},
        ]
    },
    {
        question: "Rate the cleanliness of this room",
        answers: [
            { text: "Very clean", response: 1},
            { text: "Clean", response: 2},
            { text: "Average", response: 3},
            { text: "Dirty", response: 4},
            { text: "Very dirty", response: 5},
        ]
    },
    {
        question: "Rate the cleanliness of this room",
        answers: [
            { text: "Very clean", response: 1},
            { text: "Clean", response: 2},
            { text: "Average", response: 3},
            { text: "Dirty", response: 4},
            { text: "Very dirty", response: 5},
        ]
    },
    {
        question: "Rate the cleanliness of this room",
        answers: [
            { text: "Very clean", response: 1},
            { text: "Clean", response: 2},
            { text: "Average", response: 3},
            { text: "Dirty", response: 4},
            { text: "Very dirty", response: 5},
        ]
    },


];
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answerbuttons"); // Corrected ID
const nextButton = document.getElementById("next-btn");


let currentQuestionIndex = 0;
let score = 0;


function startQuiz(){
   currentQuestionIndex = 0; // Reset to 0, not '0'
   score = 0;
   nextButton.innerHTML = "Next";
   showQuestion();
}


function showQuestion(){
   resetState();
   const currentQuestion = questions[currentQuestionIndex]; // Typo corrected: questions instead of question
   const questionNo = currentQuestionIndex + 1; // Typo corrected: questionNo instead of questionno
   questionElement.innerHTML = questionNo + ". " + currentQuestion.question; // Added space after questionNo


   currentQuestion.answers.forEach(answer => {
       const button = document.createElement("button");
       button.innerHTML = answer.text;
       button.classList.add("btn");
       answerButtons.appendChild(button);
       button.dataset.clicked = answer.clicked;
       button.addEventListener("click", selectAnswer);
   });
}


function resetState(){
   nextButton.style.display = "none";
   while(answerButtons.firstChild){
       answerButtons.removeChild(answerButtons.firstChild);
   }
}


function selectAnswer(e){
   const selectedBtn = e.target;
   const isClicked = selectedBtn.dataset.clicked === "true";
   selectedBtn.classList.add("clicked");

   
   Array.from(answerButtons.children).forEach(button => {
       if(button.dataset.clicked === "true"){
           button.classList.add("clicked");
       }
       button.disabled = true;
   });
   nextButton.style.display = "block";
}


function showScore(){
   resetState();
   questionElement.innerHTML = "Your roommate score is " + score; // Used concatenation instead of string interpolation
   nextButton.innerHTML = "Take the quiz again";
   nextButton.style.display = "block";
}


function handleNextButton(){
   currentQuestionIndex++;
   if(currentQuestionIndex < questions.length){
       showQuestion();
   } else {
       showScore();
   }
}


nextButton.addEventListener("click", () => {
   if(currentQuestionIndex < questions.length){
       handleNextButton();
   } else {
       startQuiz();
   }
});


startQuiz();
const questions = [
    {
        question: "What year of studies are you?",
        answers: [
            { text: "Freshman", correct: true},
            { text: "Sophomore", correct: true},
            { text: "Junior", correct: true},
            { text: "Senior", correct: true},
            
        ]
    },
    {
        question: "I snore/talk in my sleep or make other noise in my sleep",
        answers: [
            { text: "Strongly agree", correct: false},
            { text: "Agree", correct: false},
            { text: "Disagree", correct: true},
            { text: "Strongly disagree", correct: true},
        ]
    },
    {
        question: "It matters to me if my roommate snores, talks or make other noise in their sleep",
        answers: [
            { text: "Strongly agree", correct: false},
            { text: "Agree", correct: false},
            { text: "Disagree", correct: true},
            { text: "Strongly disagree", correct: true},
        ]
    },
    {
        question: "I like white noise or a fan running while I sleep",
        answers: [
            { text: "Strongly agree", correct: false},
            { text: "Agree", correct: false},
            { text: "Disagree", correct: true},
            { text: "Strongly disagree", correct: true},
        ]
    },
    {
        question: "I will not be bothered by noise if my roommate wakes earlier than me",
        answers: [
            { text: "Strongly agree", correct: false},
            { text: "Agree", correct: false},
            { text: "Disagree", correct: true},
            { text: "Strongly disagree", correct: true},
        ]
    },
    {
        question: "I will not be bothered by noise if my roommate goes to bed later than me",
        answers: [
            { text: "Strongly agree", correct: false},
            { text: "Agree", correct: false},
            { text: "Disagree", correct: true},
            { text: "Strongly disagree", correct: true},
        ]
    },
    {
        question: "What light level do you best sleep at",
        answers: [
            { text: "Pitch black", correct: false},
            { text: "Shades open", correct: false},
            { text: "Night light on", correct: true},
            { text: "I do not mind", correct: true},
        ]
    },
    {
        question: "What time do you plan to wake up on weekdays",
        answers: [
            { text: "6:00am-8:00am", correct: false},
            { text: "8:00am-10:00am", correct: false},
            { text: "10:00am-13:00pm", correct: true},
            { text: "I do not have a set schedule", correct: true},
        ]
    },
    {
        question: "What time do you plan to go to sleep on weekdays",
        answers: [
            { text: "6:00pm-8:00pm", correct: false},
            { text: "8:00pm-10:00pm", correct: false},
            { text: "10:00pm-12:00am", correct: true},
            { text: "I do not have a set schedule", correct: true},
        ]
    },
    {
        question: "How frequently are you plannig to bring guest to the room",
        answers: [
            { text: "3-5 times a week", correct: false},
            { text: "1-2 times a week", correct: false},
            { text: "1 a month", correct: true},
            { text: "I am not going to bring guests", correct: true},
        ]
    },
    {
        question: "How frequently are you plannig to attent parties",
        answers: [
            { text: "3-5 times a week", correct: false},
            { text: "1-2 times a week", correct: false},
            { text: "1 a month", correct: true},
            { text: "I am not a big party guy", correct: true},
        ]
    },
    {
        question: "How often do you plan to clean your room",
        answers: [
            { text: "Weekly", correct: false},
            { text: "Every other week", correct: false},
            { text: "Monthly", correct: true},
            { text: "Less often than these options", correct: true},
        ]
    },

];
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    currentQuestionIndex =0;
    score =0;
    nextButton.innerHTML = "Next";
    showQuestion()
}

function showQuestion(){
    resetState();
   let  currentQuestionIndex = question[currentQuestionIndex];
   let questionNo  = currentQuestionIndex + 1;
    questionElement.innerHTML = questionno + "." + currentQuestion.question;
    
    currentQuestion.answers.forEach(answer => 
    {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButton.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState()
{
    nextButton.style.display = "none";
    while(answerButtons.firstChild)
    {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}


function selectAnswer(e){
    const selectedBtn = e.target;
    const isCorrect =  selectedBtn.dataset.correct === "true";
    if(isCorrect)
    {
        selectedBtn.classList.add("correct");
        score++;
    }else{
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button =>{
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block"
}

function showScore(){
    resetState();
    questionElement.innerHTML = "Your roomate score is ${score}";
    nextButton.innerHTML = "Take the quiz again";
    nextButton.style.display = "block";
}

function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length)
    {
        showQuestion();
    }
    else{
        showScore();
    }
}

nextButton.addEventListener("click", ()=>{
    if(currentQuestionIndex < questions.length)
    {
        handleNextButton();
    }
    else
    {
        startQuiz();
    }
});
startQuiz();
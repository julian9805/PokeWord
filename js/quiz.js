// ====== DATOS DEL QUIZ ======
const questions = [
    {
        question: "¿Cuál de estos tipos es completamente inmune a los movimientos de tipo Lucha?",
        answers: [
            { text: "Siniestro", correct: false },
            { text: "Fantasma", correct: true },
            { text: "Psíquico", correct: false },
            { text: "Hada", correct: false }
        ]
    },
    {
        question: "¿Qué objeto necesita Scyther para evolucionar a Scizor?",
        answers: [
            { text: "Piedra Dura", correct: false },
            { text: "Revestimiento Metálico", correct: true },
            { text: "Roca del Rey", correct: false },
            { text: "Escama Dragón", correct: false }
        ]
    },
    {
        question: "¿Cuál es el único Pokémon que aprende 'Esquema' (Sketch) permanentemente?",
        answers: [
            { text: "Ditto", correct: false },
            { text: "Mew", correct: false },
            { text: "Smeargle", correct: true },
            { text: "Zoroark", correct: false }
        ]
    },
    {
        question: "Si un Pokémon es tipo Eléctrico puro, ¿cuál es su única debilidad?",
        answers: [
            { text: "Agua", correct: false },
            { text: "Fuego", correct: false },
            { text: "Tierra", correct: true },
            { text: "Planta", correct: false }
        ]
    },
    {
        question: "¿Cuál es la pre-evolución de Lucario?",
        answers: [
            { text: "Riolu", correct: true },
            { text: "Tyrogue", correct: false },
            { text: "Munchlax", correct: false },
            { text: "Bonsly", correct: false }
        ]
    },
    {
        question: "¿Qué combinación de tipos tiene la línea evolutiva de Gengar?",
        answers: [
            { text: "Fantasma / Siniestro", correct: false },
            { text: "Fantasma / Veneno", correct: true },
            { text: "Fantasma puro", correct: false },
            { text: "Fantasma / Psíquico", correct: false }
        ]
    },
    {
        question: "¿Qué habilidad de Shedinja hace que solo le afecten ataques súper eficaces?",
        answers: [
            { text: "Robustez", correct: false },
            { text: "Superguarda", correct: true },
            { text: "Levitación", correct: false },
            { text: "Espejo Mágico", correct: false }
        ]
    },
    {
        question: "¿A qué nivel evoluciona Magikarp en Gyarados?",
        answers: [
            { text: "Nivel 15", correct: false },
            { text: "Nivel 20", correct: true },
            { text: "Nivel 25", correct: false },
            { text: "Nivel 30", correct: false }
        ]
    },
    {
        question: "¿Cuál de estos NO es un Pokémon inicial (Starter) oficial?",
        answers: [
            { text: "Chespin", correct: false },
            { text: "Mudkip", correct: false },
            { text: "Riolu", correct: true },
            { text: "Piplup", correct: false }
        ]
    },
    {
        question: "¿Cuántas evoluciones posibles tiene Eevee actualmente?",
        answers: [
            { text: "7", correct: false },
            { text: "8", correct: true },
            { text: "9", correct: false },
            { text: "6", correct: false }
        ]
    }
];

// ====== SELECCIÓN DE ELEMENTOS DEL DOM ======
const startSection = document.getElementById("quiz-start");
const quizContainer = document.getElementById("quiz-container");
const startForm = document.getElementById("start-form");
const usernameInput = document.getElementById("username-input");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");
const progressElement = document.getElementById("progress");
const rankingList = document.getElementById("ranking-list");
const timerBar = document.getElementById("timer-bar");

// Variables de estado
let shuffledQuestions, currentQuestionIndex;
let score = 0;
let username = "";
let timeLeft;
let timerInterval;
const TIME_LIMIT = 15;

// ====== EVENTO INICIO ======
startForm.addEventListener("submit", (e) => {
    e.preventDefault();
    username = usernameInput.value.trim() || "Entrenador/a Anónimo";
    startSection.style.display = "none";
    quizContainer.style.display = "block";
    startQuiz();
});

function startQuiz() {
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
    updateRanking();
}

function showQuestion() {
    resetState();
    stopTimer();
    
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    progressElement.innerText = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("answer-btn");
        if (answer.correct) button.dataset.correct = "true";
        button.addEventListener("click", selectAnswer);
        answersElement.appendChild(button);
    });

    startTimer();
}

function resetState() {
    nextButton.style.display = "none";
    timerBar.style.width = "100%";
    while (answersElement.firstChild) {
        answersElement.removeChild(answersElement.firstChild);
    }
}

function selectAnswer(e) {
    stopTimer();
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";

    if (isCorrect) {
        score++;
        selectedBtn.style.backgroundColor = "#4caf50";
        selectedBtn.style.color = "white";
    } else {
        selectedBtn.style.backgroundColor = "#f44336";
        selectedBtn.style.color = "white";
    }

    Array.from(answersElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.style.backgroundColor = "#4caf50";
            button.style.color = "white";
        }
        button.disabled = true;
    });

    nextButton.style.display = "block";
    nextButton.innerText = currentQuestionIndex + 1 < shuffledQuestions.length ? "Siguiente" : "Ver Resultados";
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
});

function finishQuiz() {
    resetState();
    stopTimer();
    saveScore();
    updateRanking();

    questionElement.innerText = `¡Fin del juego, ${username}!`;
    progressElement.innerText = `Puntuación final: ${score} / ${questions.length}`;
    
    const restartBtn = document.createElement("button");
    restartBtn.innerText = "Reintentar";
    restartBtn.classList.add("answer-btn");
    restartBtn.onclick = () => location.reload();
    answersElement.appendChild(restartBtn);
}

// ====== LÓGICA TEMPORIZADOR ======
function startTimer() {
    timeLeft = TIME_LIMIT;
    timerBar.style.backgroundColor = "#4caf50";
    timerInterval = setInterval(() => {
        timeLeft -= 0.1;
        const percentage = (timeLeft / TIME_LIMIT) * 100;
        timerBar.style.width = `${percentage}%`;
        if (percentage < 30) timerBar.style.backgroundColor = "#ef5350";
        if (timeLeft <= 0) handleTimeout();
    }, 100);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function handleTimeout() {
    stopTimer();
    Array.from(answersElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.style.backgroundColor = "#4caf50";
            button.style.color = "white";
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

// ====== RANKING ======
function saveScore() {
    let ranking = JSON.parse(localStorage.getItem("quizRanking")) || [];
    ranking.push({ name: username, score: score });
    ranking.sort((a, b) => b.score - a.score);
    localStorage.setItem("quizRanking", JSON.stringify(ranking.slice(0, 10)));
}

function updateRanking() {
    rankingList.innerHTML = "";
    const ranking = JSON.parse(localStorage.getItem("quizRanking")) || [];
    ranking.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${index + 1}. ${item.name}</span> <strong>${item.score} pts</strong>`;
        rankingList.appendChild(li);
    });
}

// ====== MENÚ HAMBURGUESA ======
function inicializarMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('header nav');
    if (menuToggle && navMenu) {
        menuToggle.onclick = () => {
            menuToggle.classList.toggle('is-active');
            navMenu.classList.toggle('active');
        };
    }
}
document.addEventListener('DOMContentLoaded', inicializarMenu);
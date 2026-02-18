// ====== DATOS DEL QUIZ ======
const questions = [
  {
    question: "¿Qué tipo es fuerte contra Pokémon tipo Planta?",
    answers: [
      { text: "Agua", correct: false },
      { text: "Fuego", correct: true },
      { text: "Eléctrico", correct: false },
      { text: "Normal", correct: false }
    ]
  },
  {
    question: "¿Cuál es la evolución de Charmander?",
    answers: [
      { text: "Charizard", correct: false },
      { text: "Charmeleon", correct: true },
      { text: "Blaziken", correct: false },
      { text: "Charmelon", correct: false }
    ]
  },
  {
    question: "¿Qué tipo es débil contra Pokémon tipo Agua?",
    answers: [
      { text: "Fuego", correct: false },
      { text: "Roca", correct: false },
      { text: "Planta", correct: true },
      { text: "Eléctrico", correct: false }
    ]
  }
];

// ====== ELEMENTOS DEL DOM ======
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");
const scoreElement = document.getElementById("score");
const progressElement = document.getElementById("progress");
const rankingList = document.getElementById("ranking-list");

// Elementos del formulario de inicio
const startSection = document.getElementById("quiz-start");
const startForm = document.getElementById("start-form");
const usernameInput = document.getElementById("username-input");

// Contenedor del quiz
const quizContainer = document.getElementById("quiz-container");

let currentQuestionIndex = 0;
let score = 0;
let username = "";

// ====== INICIO DEL QUIZ CON FORMULARIO ======
startForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Evita recarga de página
  username = usernameInput.value.trim();
  if (!username) username = "Entrenador/a Anónimo";

  // Oculta formulario y muestra quiz
  startSection.style.display = "none";
  quizContainer.style.display = "block";

  // Inicia quiz
  startQuiz();
});

// ====== INICIAR QUIZ ======
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
  updateRanking();
}

// ====== MOSTRAR PREGUNTA ======
function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;
  progressElement.innerText = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("answer-btn");
    if (answer.correct) button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    answersElement.appendChild(button);
  });
}

// ====== RESET ESTADO ======
function resetState() {
  nextButton.style.display = "none";
  answersElement.innerHTML = "";
  scoreElement.innerText = "";
}

// ====== SELECCIONAR RESPUESTA ======
function selectAnswer(e) {
  const selectedBtn = e.target;
  const correct = selectedBtn.dataset.correct === "true";

  if (correct) score++;

  // Resaltar respuestas
  Array.from(answersElement.children).forEach(button => {
    if (button.dataset.correct === "true") button.style.backgroundColor = "green";
    if (button !== selectedBtn && !button.dataset.correct) button.style.backgroundColor = "#fac800";
    button.disabled = true;
  });

  // Resaltar la seleccionada incorrecta
  if (!correct) selectedBtn.style.backgroundColor = "red";

  nextButton.style.display = "block";
}

// ====== SIGUIENTE PREGUNTA ======
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
    saveScore();
    updateRanking();
  }
});

// ====== MOSTRAR PUNTUACIÓN FINAL ======
function showScore() {
  resetState();
  questionElement.innerText = "¡Quiz terminado!";
  progressElement.innerText = "";
  scoreElement.innerText = `Tu puntuación es: ${score} / ${questions.length}`;
  
  //Crear boton de reinicio
  const restartButton = document.createElement("button");
  restartButton.innerHTML = "Volver a jugar";
  restartButton.classList.add("answer-btn");
  restartButton.style.marginTop = "1rem";

  restartButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.innerText = "";
    showQuestion();

    restartButton.remove();
  });

  answersElement.appendChild(restartButton);
}

// ====== GUARDAR PUNTUACIÓN EN LOCALSTORAGE ======
function saveScore() {
  let ranking = JSON.parse(localStorage.getItem("quizRanking")) || [];
  ranking.push({ name: username, score: score });

  // Ordenar de mayor a menor
  ranking.sort((a, b) => b.score - a.score);

  // Mantener solo top 10
  ranking = ranking.slice(0, 10);

  localStorage.setItem("quizRanking", JSON.stringify(ranking));
}

// ====== ACTUALIZAR RANKING EN PANTALLA ======
function updateRanking() {
  rankingList.innerHTML = "";
  const ranking = JSON.parse(localStorage.getItem("quizRanking")) || [];
  ranking.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerText = `${index + 1}. ${item.name} - ${item.score} pts`;
    rankingList.appendChild(li);
  });
}

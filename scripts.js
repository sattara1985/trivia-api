const triviaContainer = document.getElementById('triviaContainer');
const resultadoTrivia = document.getElementById('resultadoTrivia');
const categorySelect = document.getElementById('category');
const difficultySelect = document.getElementById('difficulty');
const typeSelect = document.getElementById('type');
const newTriviaButton = document.querySelector('.mt-4');

const apiUrl = 'https://opentdb.com/api.php?amount=10';

// Obtener las categorías disponibles de la API y cargarlas en el select
async function obtenerCategorias() {
  try {
    const response = await fetch('https://opentdb.com/api_category.php');
    const data = await response.json();
    const categories = data.trivia_categories;
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.text = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
  }
}

// Crear una nueva trivia según los parámetros seleccionados
async function crearTrivia() {
  const selectedCategory = categorySelect.value;
  const selectedDifficulty = difficultySelect.value;
  const selectedType = typeSelect.value;
  const apiUrlWithParams = `${apiUrl}&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=${selectedType}`;

  try {
    const response = await fetch(apiUrlWithParams);
    const data = await response.json();
    const questions = data.results;
    mostrarTrivia(questions);
  } catch (error) {
    console.error('Error al obtener las preguntas:', error);
  }
}

// Mostrar las preguntas y posibles respuestas de la trivia
function mostrarTrivia(questions) {
  triviaContainer.innerHTML = '';
  resultadoTrivia.innerHTML = '';

  questions.forEach((question, index) => {
    const questionCard = document.createElement('div');
    questionCard.className = 'card mb-4';

    const questionCardBody = document.createElement('div');
    questionCardBody.className = 'card-body';

    const questionTitle = document.createElement('h5');
    questionTitle.textContent = `Pregunta ${index + 1}: ${question.question}`;

    const answersList = document.createElement('ul');
    answersList.className = 'list-group';

    const answers = question.incorrect_answers.concat(question.correct_answer);
    shuffleArray(answers); // Mezclar las respuestas para que no estén siempre en el mismo orden

    answers.forEach(answer => {
      const answerItem = document.createElement('li');
      answerItem.className = 'list-group-item';
      answerItem.innerHTML = `
        <input type="${question.type === 'multiple' ? 'checkbox' : 'radio'}" name="question-${index}" value="${answer}">
        <span>${answer}</span>
      `;
      answersList.appendChild(answerItem);
    });

    questionCardBody.appendChild(questionTitle);
    questionCardBody.appendChild(answersList);
    questionCard.appendChild(questionCardBody);
    triviaContainer.appendChild(questionCard);
  });
}

// Obtener el resultado de la trivia y mostrar el puntaje final
function mostrarResultadoTrivia() {
  const triviaQuestions = triviaContainer.querySelectorAll('div.card-body');
  let score = 0;

  triviaQuestions.forEach((question, index) => {
    const selectedAnswer = question.querySelector('input:checked');
    if (selectedAnswer) {
      const correctAnswer = selectedAnswer.value === questions[index].correct_answer;
      score += correctAnswer ? 100 : 0;
    }
  });

  resultadoTrivia.innerHTML = `<h3>Puntaje Final: ${score} puntos</h3>`;
}

// Función para mezclar las respuestas en el array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Crear una nueva trivia al hacer clic en el botón "Crear Nueva Trivia"
function nuevaTrivia() {
  triviaContainer.innerHTML = '';
  resultadoTrivia.innerHTML = '';
}

// Cargar las categorías disponibles al cargar la página
obtenerCategorias();

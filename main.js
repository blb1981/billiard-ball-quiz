// Define elements
const formEl = document.getElementById('form');
const displayEl = document.getElementById('display');
const startGameButtonEl = document.getElementById('startGameButton');
const feedbackEl = document.getElementById('feedback');
const currentYearEl = document.getElementById('currentYear');

// Elements for the ball
const ballDisplayEl = document.querySelector('.ball');
const ballDisplayInnerEl = document.querySelector('.ball__inner');
const ballNumEl = document.querySelector('.ball__num');

// Global variables
let shuffledBalls,
  currentIndex,
  currentAnswer,
  alreadyAnsweredAmount,
  correctAnswers,
  timer,
  isGameOver,
  questionTicker;

// Define colors
const colors = {
  yellow: '#fdc200',
  blue: '#0e276b',
  red: '#cf0000',
  purple: '#4c1764',
  orange: '#cf6400',
  green: '#0d5235',
  burgandy: '#3d0d0d',
  black: '#000',
};

// Time between questions and feedback delay between questions
const timeBetweenQuestions = 15000;
const feedbackTime = 1500;

// Define balls and colors
const balls = [
  {
    number: 1,
    color: colors.yellow,
    striped: false,
  },
  {
    number: 2,
    color: colors.blue,
    striped: false,
  },
  {
    number: 3,
    color: colors.red,
    striped: false,
  },
  {
    number: 4,
    color: colors.purple,
    striped: false,
  },
  {
    number: 5,
    color: colors.orange,
    striped: false,
  },
  {
    number: 6,
    color: colors.green,
    striped: false,
  },
  {
    number: 7,
    color: colors.burgandy,
    striped: false,
  },
  {
    number: 8,
    color: colors.black,
    striped: false,
  },
  {
    number: 9,
    color: colors.yellow,
    striped: true,
  },
  {
    number: 10,
    color: colors.blue,
    striped: true,
  },
  {
    number: 11,
    color: colors.red,
    striped: true,
  },
  {
    number: 12,
    color: colors.purple,
    striped: true,
  },
  {
    number: 13,
    color: colors.orange,
    striped: true,
  },
  {
    number: 14,
    color: colors.green,
    striped: true,
  },
  {
    number: 15,
    color: colors.burgandy,
    striped: true,
  },
];

// Display the current year in the footer
currentYearEl.innerText = new Date().getFullYear()

// Shuffle the order
function shuffle() {
  shuffledBalls = balls.sort(() => Math.random() - 0.5);
}

// Clear the input field
function clearInputField() {
  formEl.elements[0].value = '';
}

// Clear feedback field
function clearFeedback() {
  feedbackEl.innerText = '';
}

// Disable the input field
function disableInput() {
  const elements = formEl.elements;
  for (let i = 0; i < elements.length; i++) {
    elements[i].disabled = true;
  }
}

// Disable the input field
function enableInput() {
  const elements = formEl.elements;
  for (let i = 0; i < elements.length; i++) {
    elements[i].disabled = false;
  }
}

// Display and style the ball
function setBallDisplay(ball) {
  ballDisplayEl.style.backgroundColor = !ball.striped ? ball.color : '#f0ffbe';
  ballDisplayInnerEl.style.backgroundColor = ball.color;
}

function askQuestion() {
  enableInput();
  formEl.elements[0].focus();
  setBallDisplay(shuffledBalls[currentIndex]);

  displayEl.innerText = `What is the correct number?`;
  feedbackEl.innerHTML = `You have ${timeBetweenQuestions / 1000} seconds between questions.<br />${
    shuffledBalls.length - alreadyAnsweredAmount
  } questions remaining`;
  timer = setTimeout(function () {
    checkQuestion(formEl.elements[0].value, currentIndex);
  }, timeBetweenQuestions);
}

function nextQuestion() {
  ballNumEl.innerText = '?';
  currentIndex++;
  askQuestion();
}

function gameOver() {
  displayEl.innerText = `Game over. You scored ${correctAnswers}/${alreadyAnsweredAmount} for a score of ${Math.round(
    (correctAnswers / alreadyAnsweredAmount) * 100
  )}%`;
  removeEventListener('submit', formEl);
  startGameButtonEl.classList.remove('hidden');
  disableInput();
  isGameOver = true;
}

function checkQuestion(answer) {
  disableInput();

  ballNumEl.innerText = shuffledBalls[currentIndex].number;
  if (Number(answer) === shuffledBalls[currentIndex].number) {
    displayEl.innerText = 'Correct! 👍';
    setTimeout(() => {
      clearFeedback();
    }, feedbackTime);
    correctAnswers++;
  } else {
    displayEl.innerText = 'Incorrect 👎';
    setTimeout(() => {
      clearFeedback();
    }, feedbackTime);
  }

  // Increment index
  alreadyAnsweredAmount++;

  // If questions are remaining, call next question
  if (alreadyAnsweredAmount === shuffledBalls.length) {
    gameOver();
  } else {
    setTimeout(() => {
      clearInputField();
      nextQuestion(currentIndex);
    }, feedbackTime);
  }
}

function handleSubmit(e) {
  e.preventDefault();
  if (isGameOver) return;
  clearTimeout(timer);
  currentAnswer = e.target.elements[0].value;
  checkQuestion(currentAnswer, currentIndex);
  clearInputField();
}

function handleStartButtonClick() {
  startGame();
}

function startGame() {
  // Remove event listeners from any previous games
  formEl.removeEventListener('click', handleSubmit);
  startGameButtonEl.removeEventListener('click', handleStartButtonClick);

  // Reset variables
  currentIndex = 0;
  alreadyAnsweredAmount = 0;
  correctAnswers = 0;
  isGameOver = false;

  // Shuffle the order
  shuffle();

  // Hide start button and listen for resets
  startGameButtonEl.classList.add('hidden');
  startGameButtonEl.addEventListener('click', handleStartButtonClick);

  // Reset timers and ...stuff
  clearInputField();
  clearTimeout(timer);
  ballNumEl.innerText = '?';

  // Ask question and set event listener for the form
  askQuestion();
  formEl.addEventListener('submit', handleSubmit);
}

startGame();

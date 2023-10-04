// Define elements
const formEl = <HTMLFormElement>document.getElementById('form');
const displayEl = <HTMLDivElement>document.getElementById('display');
const startGameButtonEl = <HTMLButtonElement>document.getElementById('startGameButton');
const feedbackEl = <HTMLDivElement>document.getElementById('feedback');
const currentYearEl = <HTMLDivElement>document.getElementById('currentYear');
const guessInputEl = <HTMLInputElement>document.getElementById('guessInput');

// Elements for the ball
const ballDisplayEl = <HTMLDivElement>document.querySelector('.ball');
const ballDisplayInnerEl = <HTMLDivElement>document.querySelector('.ball__inner');
const ballNumEl = <HTMLDivElement>document.querySelector('.ball__num');

interface Ball {
  number: number;
  color: Colors;
  striped: boolean;
}

// Define colors
enum Colors {
  Yellow = '#fdc200',
  Blue = '#0e276b',
  Red = '#cf0000',
  Purple = '#4c1764',
  Orange = '#cf6400',
  Green = '#0d5235',
  Burgandy = '#3d0d0d',
  Black = '#000',
}
// const colors = {
//   yellow: '#fdc200',
//   blue: '#0e276b',
//   red: '#cf0000',
//   purple: '#4c1764',
//   orange: '#cf6400',
//   green: '#0d5235',
//   burgandy: '#3d0d0d',
//   black: '#000',
// };

// Global variables
let shuffledBalls: Ball[],
  currentIndex: number,
  currentAnswer: string,
  alreadyAnsweredAmount: number,
  correctAnswers: number,
  timer: number,
  isGameOver: boolean,
  questionTicker;

// Time between questions and feedback delay between questions
const timeBetweenQuestions = 15000;
const feedbackTime = 1500;

// Define balls and colors

const balls: Ball[] = [
  {
    number: 1,
    color: Colors.Yellow,
    striped: false,
  },
  {
    number: 2,
    color: Colors.Blue,
    striped: false,
  },
  {
    number: 3,
    color: Colors.Red,
    striped: false,
  },
  {
    number: 4,
    color: Colors.Purple,
    striped: false,
  },
  {
    number: 5,
    color: Colors.Orange,
    striped: false,
  },
  {
    number: 6,
    color: Colors.Green,
    striped: false,
  },
  {
    number: 7,
    color: Colors.Burgandy,
    striped: false,
  },
  {
    number: 8,
    color: Colors.Black,
    striped: false,
  },
  {
    number: 9,
    color: Colors.Yellow,
    striped: true,
  },
  {
    number: 10,
    color: Colors.Blue,
    striped: true,
  },
  {
    number: 11,
    color: Colors.Red,
    striped: true,
  },
  {
    number: 12,
    color: Colors.Purple,
    striped: true,
  },
  {
    number: 13,
    color: Colors.Orange,
    striped: true,
  },
  {
    number: 14,
    color: Colors.Green,
    striped: true,
  },
  {
    number: 15,
    color: Colors.Burgandy,
    striped: true,
  },
];

// Display the current year in the footer
currentYearEl.innerText = new Date().getFullYear().toString();

// Shuffle the order
function shuffle() {
  shuffledBalls = balls.sort(() => Math.random() - 0.5);
}

// Clear the input field
function clearInputField() {
  guessInputEl.value = '';
}

// Clear feedback field
function clearFeedback() {
  feedbackEl.innerText = '';
}

// Disable the input field
function disableInput() {
  const elements = formEl.elements;
  for (let i = 0; i < elements.length; i++) {
    // elements[i].disabled = true;
    elements[i].setAttribute('disabled', '');
  }
}

// Disable the input field
function enableInput() {
  const elements = formEl.elements;
  for (let i = 0; i < elements.length; i++) {
    // elements[i].disabled = false;
    elements[i].removeAttribute('disabled');
  }
}

// Display and style the ball
function setBallDisplay(ball: Ball) {
  ballDisplayEl.style.backgroundColor = !ball.striped ? ball.color : '#f0ffbe';
  ballDisplayInnerEl.style.backgroundColor = ball.color;
}

function askQuestion() {
  enableInput();
  guessInputEl.focus();
  setBallDisplay(shuffledBalls[currentIndex]);

  displayEl.innerText = `What is the correct number?`;
  feedbackEl.innerHTML = `You have ${timeBetweenQuestions / 1000} seconds between questions.<br />${
    shuffledBalls.length - alreadyAnsweredAmount
  } questions remaining`;
  timer = setTimeout(function () {
    checkQuestion(guessInputEl.value);
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
  removeEventListener('submit', handleSubmit);
  startGameButtonEl.classList.remove('hidden');
  disableInput();
  isGameOver = true;
}

function checkQuestion(answer: string) {
  disableInput();

  ballNumEl.innerText = shuffledBalls[currentIndex].number.toString();
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
      nextQuestion();
      // nextQuestion(currentIndex);
    }, feedbackTime);
  }
}

function handleSubmit(e: SubmitEvent) {
  e.preventDefault();
  if (isGameOver) return;
  clearTimeout(timer);
  // const el = e.target?.elements[0] as HTMLFormElement;
  currentAnswer = guessInputEl.value;
  checkQuestion(currentAnswer);
  // checkQuestion(currentAnswer, currentIndex);
  clearInputField();
}

function handleStartButtonClick() {
  startGame();
}

function startGame() {
  // Remove event listeners from any previous games
  formEl.removeEventListener('submit', handleSubmit);
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

  // Reset timers, inputs, etc
  clearInputField();
  clearTimeout(timer);
  ballNumEl.innerText = '?';

  // Ask question and set event listener for the form
  askQuestion();
  formEl.addEventListener('submit', handleSubmit);
}

startGame();

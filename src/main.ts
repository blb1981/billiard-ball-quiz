// Define elements
const formEl = <HTMLFormElement>document.getElementById('form');
const displayEl = <HTMLDivElement>document.getElementById('display');
const startGameButtonEl = <HTMLButtonElement>document.getElementById('startGameButton');
const feedbackEl = <HTMLDivElement>document.getElementById('feedback');
const currentYearEl = <HTMLDivElement>document.getElementById('currentYear');
const guessInputEl = <HTMLInputElement>document.getElementById('guessInput');
const countdownEl = <HTMLDivElement>document.getElementById('countdown');
const guessButtonContainerEl = <HTMLDivElement>document.getElementById('guessButtonContainer');

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

// Global variables
let shuffledBalls: Ball[],
  currentIndex: number,
  currentAnswer: string,
  alreadyAnsweredAmount: number,
  correctAnswers: number,
  timer: number,
  isGameOver: boolean,
  countdownTimer: number;

// Time between questions and feedback delay between questions
const timeBetweenQuestions = 10000;
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
function shuffle(): void {
  shuffledBalls = balls.sort(() => Math.random() - 0.5);
}

// Clear the input field
function clearInputField(): void {
  guessInputEl.value = '';
}

// Clear feedback field
function clearFeedback(): void {
  feedbackEl.innerText = '';
}

// Disable the input field
function disableInput(): void {
  const elements = formEl.elements;
  for (let i = 0; i < elements.length; i++) {
    // elements[i].disabled = true;
    elements[i].setAttribute('disabled', '');
  }
}

// Disable the input field
function enableInput(): void {
  const elements = formEl.elements;
  for (let i = 0; i < elements.length; i++) {
    // elements[i].disabled = false;
    elements[i].removeAttribute('disabled');
  }
}

// Display and style the ball
function setBallDisplay(ball: Ball): void {
  ballDisplayEl.style.backgroundColor = !ball.striped ? ball.color : '#f0ffbe';
  ballDisplayInnerEl.style.backgroundColor = ball.color;
}

// Display timer between questions
// Help from https://www.w3schools.com/howto/howto_js_countdown.asp
function showCountDownTimer() {
  // Set date/time we're counting down to
  const countdownTime: number = new Date().getTime() + timeBetweenQuestions;
  // const countdownTimeSeconds: number = new Date().getTime() + timeBetweenQuestions;
  countdownEl.innerText = (timeBetweenQuestions / 1000).toString();

  countdownTimer = setInterval(function () {
    // Get current date/time
    const now: number = new Date().getTime();

    // Find the distance between the two times
    const distance: number = countdownTime - now;

    // Convert distance to seconds
    const secondsRemaining: number = Math.round(distance / 1000);

    // Display seconds remaining
    countdownEl.innerText = secondsRemaining.toString();

    // Clear the timer
    if (distance < 0) {
      clearInterval(countdownTimer);
    }
  }, 1000);
}

function removeGuessButtons() {
  guessButtonContainerEl.innerHTML = '';
}

function handleButtonGuess(e: Event) {
  e.preventDefault();
  const buttonEl = <HTMLButtonElement>e.target;
  const guess = buttonEl.innerText;
  if (isGameOver) return;
  clearTimeout(timer);
  clearInterval(countdownTimer);
  currentAnswer = guessInputEl.value;
  checkQuestion(guess);
  clearInputField();
}

function showGuessButtons(currentBallNumber: number) {
  let rangeRandom: number[];
  let availableGuessArray: number[] = [];

  if (currentBallNumber < 9) {
    const range = [1, 2, 3, 4, 5, 6, 7, 8];
    rangeRandom = range.sort(() => Math.random() - 0.5);
  } else {
    const range = [9, 10, 11, 12, 13, 14, 15];
    rangeRandom = range.sort(() => Math.random() - 0.5);
  }
  rangeRandom.forEach(function (num) {
    if (availableGuessArray.length > 2) return;
    if (num === currentBallNumber) return;
    availableGuessArray.push(num);
  });

  availableGuessArray.push(currentBallNumber);
  availableGuessArray = availableGuessArray.sort(() => Math.random() - 0.5);

  availableGuessArray.forEach(function (num) {
    let button = document.createElement('button');
    button.classList.add('guess-button');
    button.innerText = num.toString();
    guessButtonContainerEl.appendChild(button);
    button.addEventListener('click', handleButtonGuess, false);
  });
}

function askQuestion(): void {
  enableInput();
  guessInputEl.focus();
  removeGuessButtons();
  showGuessButtons(shuffledBalls[currentIndex].number);
  setBallDisplay(shuffledBalls[currentIndex]);

  displayEl.innerText = `Guess the correct number`;
  feedbackEl.innerHTML = `You have ${timeBetweenQuestions / 1000} seconds between questions.<br />${
    shuffledBalls.length - alreadyAnsweredAmount
  } questions remaining`;

  showCountDownTimer();

  timer = setTimeout(function () {
    checkQuestion(guessInputEl.value);
  }, timeBetweenQuestions);
}

function nextQuestion(): void {
  ballNumEl.innerText = '?';
  currentIndex++;
  askQuestion();
}

function gameOver(): void {
  displayEl.innerHTML = `Game over.<br />You scored ${correctAnswers}/${alreadyAnsweredAmount} for a score of ${Math.round(
    (correctAnswers / alreadyAnsweredAmount) * 100
  )}%`;
  countdownEl.innerText = '';
  removeEventListener('submit', handleSubmit);
  startGameButtonEl.classList.remove('hidden');
  disableInput();
  isGameOver = true;
}

function checkQuestion(answer: string): void {
  disableInput();
  removeGuessButtons();

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

function handleSubmit(e: SubmitEvent): void {
  e.preventDefault();
  if (isGameOver) return;
  clearTimeout(timer);
  clearTimeout(countdownTimer);
  // const el = e.target?.elements[0] as HTMLFormElement;
  currentAnswer = guessInputEl.value;
  checkQuestion(currentAnswer);
  // checkQuestion(currentAnswer, currentIndex);
  clearInputField();
}

function handleStartButtonClick() {
  startGame();
}

function startGame(): void {
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

// Define elements
const displayEl = document.getElementById('display')
const guessFormEl = document.getElementById('guessForm')
const guessInputEl = document.getElementById('guessInput')

// Set constants and variables
const timeBetweenQuestions = 500
let correctAnswers = 0
let questionsAnswered = 0

let balls = [
  {
    number: 1,
    color: 'yellow',
  },
  {
    number: 2,
    color: 'blue',
  },
  {
    number: 3,
    color: 'red',
  },
]

// let balls = []
const clearGuessValue = () => {
  guessInputEl.value = ''
}
const askQuestions = () => {
  console.log({ balls })
  // Pick a random number in the array
  const rnd = Math.floor(Math.random() * balls.length)

  // if array length is 0 return and clear form input
  if (balls.length === 0) {
    displayEl.innerHTML = `<p>Game over</p><p>You guessed ${correctAnswers}/${questionsAnswered} correct.</p>`
    clearGuessValue()
    return
  } else {
    displayEl.innerHTML = `Color: ${balls[rnd].color}`
    guessFormEl.addEventListener(
      'submit',
      (e) => {
        e.preventDefault()
        if (balls[rnd].number === Number(guessInputEl.value)) {
          correctAnswers++
          console.log('correct')
        }
        questionsAnswered++
        console.log({ correctAnswers }, { questionsAnswered })

        clearGuessValue()
        balls.splice(rnd, 1)
        askQuestions()
      },
      { once: true }
    )
  }
}

askQuestions()

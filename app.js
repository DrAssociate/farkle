const compNum = document.querySelector('#comp-numbers');
const userNum = document.querySelector('#user-numbers');
const throwBtn = document.querySelector('#throw-btn');
const throwAgain = document.querySelector('#throw-again');
const endTurn = document.querySelector('#end-turn');
const compHoldingContainer = document.querySelector('#comp-holding-container');
const userHoldingContainer = document.querySelector('#user-holding-container');
const compScore = document.querySelector('#comp-score');
const userScore = document.querySelector('#user-score');
const dieNumbers = document.querySelector('.die-numbers');
const dice = [
  document.querySelector('#die1'),
  document.querySelector('#die2'),
  document.querySelector('#die3'),
  document.querySelector('#die4'),
  document.querySelector('#die5'),
  document.querySelector('#die6'),
];

// Die Values
dieValues = [100, 2, 3, 4, 50, 6];

// Setting a default value for the players
let compScoreValue = 0;
let userScoreValue = 0;

// Tracks how many die are chosen
let dieCount = {
  100: 0,
  2: 0,
  3: 0,
  4: 0,
  50: 0,
  6: 0,
};

// Throws our dice to start game
throwBtn.addEventListener('click', function (die) {
  dice.forEach((die) => {
    die.style.display = 'block';
    const dieNumber = Math.floor(Math.random() * 6 + 1);
    applyDieImg(die, dieNumber);
    applyDieValue(die, dieNumber);
  });
  resetDieCount(); // Reset die count for each throw
  userScore.textContent = `Your score: ${userScoreValue}`; // Update UI
});

//////////////////////////
//////////////////////////
//////////////////////////
//////////////////////////
//////////////////////////
//////////////////////////
//////////////////////////
// Throws our dice again
throwAgain.addEventListener('click', function () {
  let hasOneOrFive = false;

  dice.forEach((die) => {
    die.style.display = 'block';

    if (die.classList.contains('chosen')) {
      userHoldingContainer.appendChild(die);
      die.classList.add('once-chose');
      die.classList.remove('chosen');
    }
    if (!die.classList.contains('once-chose')) {
      // const dieNumber = Math.floor(Math.random() * 6 + 1);
      const dieNumber = 2;
      applyDieImg(die, dieNumber);
      applyDieValue(die, dieNumber);
    }
    dieCount[die.value]++;
    if (die.value === 100 || die.value === 50) {
      hasOneOrFive = true;
    }
  });

  let hasThreeOfAKind = false;
  for (const count of Object.values(dieCount)) {
    if (count >= 3) {
      hasThreeOfAKind = true;
      break;
    }
  }

  // Ends turn if no play can be made
  if (!hasOneOrFive && !hasThreeOfAKind) {
    userScore.textContent = 'BUST! Turn over.';
  } else {
    userScore.textContent = `Your score: ${userScoreValue}`;
  }
});

// Applies a value on the die based on number
function applyDieValue(die, dieNumber) {
  if ((die.value = 1) || (die.value = 5)) {
    die.value = dieValues[dieNumber - 1];
  }
  // die.value = dieValues[dieNumber - 1];
  let hasThreeOfAKind = false;
  for (const count of Object.values(dieCount)) {
    if (count >= 3) {
      hasThreeOfAKind = true;
      break;
    }
  }
  if ((hasThreeOfAKind = true)) {
    die.value = dieValues[dieNumber - 1];
  }
}

// Applies the image to the die based on value
function applyDieImg(die, dieNumber) {
  die.style.backgroundImage = `url('images/die${dieNumber}.png')`;
}

// Displays our score
dice.forEach((die) => {
  die.addEventListener('click', handleDieClick);
});

// Highlights chosen die and changes userScoreValue
function handleDieClick(e) {
  const die = e.target;
  die.classList.toggle('chosen');
  if (die.classList.contains('chosen')) {
    // userScoreValue += die.value;
    dieCount[die.value]++;
  } else {
    // userScoreValue -= die.value;
    dieCount[die.value]--;
  }
  calculateUserScore();
  userScore.textContent = `Your score: ${userScoreValue}`;
}

// Helps the handleDieClick calculate userScoreValue
function calculateUserScore() {
  // This local userScoreValue declaration may need to be deleted
  userScoreValue = 0;
  for (const [value, count] of Object.entries(dieCount)) {
    if (parseInt(value) === 100 || parseInt(value) === 50) {
      userScoreValue += count * parseInt(value);
    }
    if (count == 3) {
      userScoreValue += value * 100;
      // userScoreValue += count * parseInt(value);
    }
  }
}

// // Resets die count
function resetDieCount() {
  dieCount = {
    100: 0,
    2: 0,
    3: 0,
    4: 0,
    50: 0,
    6: 0,
  };
}

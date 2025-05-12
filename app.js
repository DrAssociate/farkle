window.addEventListener('DOMContentLoaded', () => {
  const throwBtn = document.querySelector('#throw-btn');
  const throwAgain = document.querySelector('#throw-again');
  const endTurn = document.querySelector('#end-turn');
  const compHoldingContainer = document.querySelector(
    '#comp-holding-container'
  );
  const userHoldingContainer = document.querySelector(
    '#user-holding-container'
  );
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

  // SETTING DEFAULT SCORE VALUES
  let globalCompScore = 0;
  let globalUserScore = 0;

  // KEEPING TRACK OF DIE NUMBERS
  const counts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };

  // GLOBAL ROLLSCORE FOR KEEPING TRACK OF CURRENTROLLSCORE
  let currentRollScore = 0;

  // INITIAL THROW BTN FUNCTION
  throwBtn.addEventListener('click', function () {
    currentRollScore = 0;

    // DISPLAYING THE ROLLED DIE ON SCREEN
    // dice.forEach((die) => {
    //   let dieNumber = Math.floor(Math.random() * 6) + 1;
    //   die.value = dieNumber;
    //   die.style.display = 'block';
    //   die.style.backgroundImage = `url(images/die${dieNumber}.png)`;
    //   counts[dieNumber]++;
    // });

    // FOR DEBUGGING BUST ROLL
    // const bustValues = [2, 3, 4, 6, 2, 4]; // any combo with no 1s, no 5s, no 3-of-a-kind
    // dice.forEach((die, index) => {
    //   const dieNumber = bustValues[index];
    //   die.value = dieNumber;
    //   die.style.display = 'block';
    //   die.style.backgroundImage = `url(images/die${dieNumber}.png)`;
    //   counts[dieNumber]++;
    // });

    // FOR DEBUGGING ALL DICE SCORE
    const bustValues = [1, 1, 1, 1, 1, 1]; // any combo with no 1s, no 5s, no 3-of-a-kind
    dice.forEach((die, index) => {
      const dieNumber = bustValues[index];
      die.value = dieNumber;
      die.style.display = 'block';
      die.style.backgroundImage = `url(images/die${dieNumber}.png)`;
      counts[dieNumber]++;
    });

    // CHECKING FOR VALID THROW
    checkForValidThrow(counts, 'initial-roll');
  });

  // SHOWS SELECTED DIE AND ADD SCORE
  dice.forEach((die) => {
    die.addEventListener('click', function () {
      // CHECKING IF DIE HAS BEEN COUNTED AND MOVED TO HOLDING CONTAINER
      if (die.classList.contains('locked')) return;

      die.classList.toggle('chosen');

      // RESETTING CURRENTROLLSCORE
      currentRollScore = 0;

      // KEEPING TRACK OF CURRENT COUNT WHILE CHOOSING DICE
      const countsWhileChoosing = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      };

      // CALCULATE USER SCORE
      const chosenDice = dice.filter((die) => die.classList.contains('chosen'));

      chosenDice.forEach((die) => {
        countsWhileChoosing[die.value]++;
      });

      // 3 OR MORE OF A KIND
      for (let i = 1; i <= 6; i++) {
        if (countsWhileChoosing[i] >= 3) {
          let multiplyer = 1;
          if (countsWhileChoosing[i] === 4) multiplyer = 2;
          if (countsWhileChoosing[i] === 5) multiplyer = 3;
          if (countsWhileChoosing[i] === 6) multiplyer = 4;

          if (i === 1) {
            currentRollScore += 1000 * multiplyer;
          } else {
            currentRollScore += i * 100 * multiplyer;
          }

          // REMOVING MATCHING DIE FOR COUNTS TO
          // ENSURE CORRECT SCORING
          countsWhileChoosing[i] = 0;
        }
      }

      // SETTING SCORE FOR 1/5 LESS THAN 3
      currentRollScore += countsWhileChoosing[1] * 100;
      currentRollScore += countsWhileChoosing[5] * 50;

      throwAgainEligible();

      // UPDATING USER SCORE
      userScore.textContent = globalUserScore + currentRollScore;

      counts[1] = 0;
      counts[2] = 0;
      counts[3] = 0;
      counts[4] = 0;
      counts[5] = 0;
      counts[6] = 0;
    });
  });

  // THROW AGAIN BTN FUNCTION
  throwAgain.addEventListener('click', () => {
    console.log(`You pressed the throw again button`);

    // RESETTING CURRENTROLLSCORE AND CLASSLIST TO BLOCK USER
    // FROM WRONGFUL REROLL
    throwAgain.classList.add('locked');

    // TARGETTING PLAYABLE DIE THAT HAVE BEEN SELECTED FOR SCORING
    const chosenDice = dice.filter(
      (die) =>
        die.classList.contains('chosen') &&
        die.parentElement.id !== 'user-holding-container'
    );

    globalUserScore += currentRollScore;
    userScore.textContent = globalUserScore;

    chosenDice.forEach((die) => {
      userHoldingContainer.appendChild(die);
      die.classList.remove('chosen');
      die.classList.add('locked');
    });

    const dieRemaining = dice.filter(
      (die) => die.parentElement.id !== 'user-holding-container'
    );

    dieRemaining.forEach((die) => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      die.value = newValue;
      die.style.backgroundImage = `url(images/die${newValue}.png)`;
      die.style.display = 'block';
      counts[newValue]++;
    });

    checkForValidThrow(counts, 'reroll');
  });

  // FOR BUSTED ROLL ATTEMPT
  function checkForValidThrow(counts, source) {
    console.log(`Checking here`, counts);

    const hasOne = counts[1] > 0;
    const hasFive = counts[5] > 0;
    const hasThreeOfAkind = Object.values(counts).some((count) => count >= 3);

    if (hasOne || hasFive || hasThreeOfAkind) {
      throwBtn.style.display = 'none';
      throwAgain.style.display = 'block';
      // console.log('has play');
      // console.log(counts);
    } else {
      if (source === 'initial-roll') {
        throwBtn.textContent = 'Sorry, you BUST';
        throwBtn.disabled = true;
        // console.log('initial');
        // console.log(counts);
      }
      if (source === 'reroll') {
        // LOGIC FOR REROLL BUST
        throwAgain.textContent = 'Sorry, you BUST';
        throwAgain.disabled = true;
        // console.log('reroll');
        // console.log(counts);
      }
    }

    // LOGIC FOR WHEN ALL THROWN DIE HAVE BEEN SCORED
    // AND DICE RESET IS POSSIBLE
    const allDiceScored = dice.every(
      (die) =>
        die.classList.contains('locked') ||
        die.parentElement.id.includes('userHoldingContainer')
    );

    console.log(`Checking before rest`, counts);
    if (allDiceScored) {
      resetDiceForReroll();
    }
  }

  // MAKING SURE REROLL IS NOT PERMITTED UNLESS SCORE HAS BEEN MADE
  function throwAgainEligible() {
    if (currentRollScore > 0) {
      throwAgain.classList.remove('locked');
    } else {
      throwAgain.classList.add('locked');
    }
  }

  // FUNCTION FOR RESETTING DICE AFTER SCORING WITH
  // ALL DIE
  function resetDiceForReroll() {
    console.log(`Checking reset`, counts);
    dice.forEach((die) => {
      dieNumbers.appendChild(die);
      die.classList.remove('locked');
      die.classList.remove('chosen');
      die.style.backgroundImage = '';
      die.style.display = 'block';
      const newValue = Math.floor(Math.random() * 6) + 1;
      die.value = newValue;
      counts[newValue]++;
      die.style.backgroundImage = `url(images/die${newValue}.png)`;
    });

    currentRollScore = 0;
    userScore.textContent = globalUserScore;
    throwAgain.classList.remove('locked');
    throwBtn.style.display = 'none';
    throwAgain.style.display = 'block';

    // checkForValidThrow(counts, 'reroll');
  }
  // endTurn.addEventListener('click', () => {});
});

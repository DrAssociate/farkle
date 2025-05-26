window.addEventListener('DOMContentLoaded', () => {
  ////////////////////////////////////////
  //////////////GLOBAL LOGIC//////////////
  ////////////////////////////////////////

  const compScore = document.querySelector('#comp-score');
  const userScore = document.querySelector('#user-score');
  const throwBtn = document.querySelector('#throw-btn');
  const throwAgain = document.querySelector('#throw-again');
  const endTurn = document.querySelector('#end-turn');
  const compHoldingContainer = document.querySelector(
    '#comp-holding-container'
  );
  const compRolledContainer = document.querySelector('.comp-rolled-container');
  const compDice = [
    document.querySelector('#compDie2'),
    document.querySelector('#compDie1'),
    document.querySelector('#compDie3'),
    document.querySelector('#compDie4'),
    document.querySelector('#compDie5'),
    document.querySelector('#compDie6'),
  ];
  const userHoldingContainer = document.querySelector(
    '#user-holding-container'
  );
  const userRolledContainer = document.querySelector('.user-rolled-container');
  const userDice = [
    document.querySelector('#userDie2'),
    document.querySelector('#userDie1'),
    document.querySelector('#userDie3'),
    document.querySelector('#userDie4'),
    document.querySelector('#userDie5'),
    document.querySelector('#userDie6'),
  ];

  // SETTING CURRENT PLAYER AS USER TO INITIATE GAME
  let currentPlayer = 'user';

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

  ////////////////////////////////////////
  //////////////GENERAL LOGIC/////////////
  ////////////////////////////////////////

  // SHOWS SELECTED DIE AND ADD SCORE
  userDice.forEach((die) => {
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
      const chosenDice = userDice.filter((die) =>
        die.classList.contains('chosen')
      );

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

  // FOR BUSTED ROLL ATTEMPT
  function checkForValidThrow(counts, source) {
    const hasOne = counts[1] > 0;
    const hasFive = counts[5] > 0;
    const hasThreeOfAkind = Object.values(counts).some((count) => count >= 3);

    if (hasOne || hasFive || hasThreeOfAkind) {
      throwBtn.style.display = 'none';
      throwAgain.style.display = 'block';
    } else {
      if (source === 'initial-roll') {
        throwBtn.textContent = 'Sorry, you BUST';
        throwBtn.disabled = true;
        userDice.forEach((die) => {
          die.classList.add('locked');
        });
        return;
      }
      if (source === 'reroll') {
        // LOGIC FOR REROLL BUST
        throwAgain.textContent = 'Sorry, you BUST';
        throwAgain.disabled = true;
        userDice.forEach((die) => {
          die.classList.add('locked');
        });
        return;
      }
    }

    // LOGIC FOR WHEN ALL THROWN DIE HAVE BEEN SCORED
    // AND DICE RESET IS POSSIBLE
    const allDiceScored = userDice.every(
      (die) =>
        die.classList.contains('locked') ||
        die.parentElement.id.includes('userHoldingContainer')
    );

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

  // // FUNCTION FOR RESETTING DICE AFTER SCORING WITH
  // // ALL DIE
  function resetDiceForReroll() {
    userDice.forEach((die) => {
      userRolledContainer.appendChild(die);
      die.classList.remove('locked', 'chosen');
      const newValue = Math.floor(Math.random() * 6) + 1;
      die.value = newValue;
      counts[newValue]++;
      die.style.backgroundImage = `url(images/userDie${newValue}.png)`;
      die.style.display = 'block';
    });

    currentRollScore = 0;
    userScore.textContent = globalUserScore;
    throwAgain.classList.remove('locked');
    throwBtn.style.display = 'none';
    throwAgain.style.display = 'block';
  }

  // FUNCTION FOR ENDING CURRENTPLAYER'S TURN
  endTurn.addEventListener('click', () => {
    userDice.forEach((die) => {
      die.classList.add('locked');
      // die.classList.remove('locked');
      die.classList.remove('chosen');

      if (currentPlayer === 'user') {
        currentPlayer = 'computer';
        throwBtn.classList.add('locked');
        throwBtn.style.display = 'none';
        throwAgain.style.display = 'none';
        endTurn.style.display = 'none';
      } else {
        currentPlayer = 'user';
      }

      if (die.parentElement === userHoldingContainer) {
        userHoldingContainer.removeChild(die);
        userRolledContainer.appendChild(die);
      }
      die.style.display = 'none';
    });

    // MAKE SURE COMPUTER GETS FRESH COUNTS OBJECT
    counts[1] = 0;
    counts[2] = 0;
    counts[3] = 0;
    counts[4] = 0;
    counts[5] = 0;
    counts[6] = 0;

    setTimeout(() => {
      computerTurn();
    }, 1500);
  });

  ////////////////////////////////////////
  ///////////////USER LOGIC///////////////
  ////////////////////////////////////////

  // INITIAL THROW BTN FUNCTION
  throwBtn.addEventListener('click', function () {
    currentRollScore = 0;
    console.log('User is playing');

    // DISPLAYING THE ROLLED DIE ON SCREEN
    userDice.forEach((die) => {
      let dieNumber = Math.floor(Math.random() * 6) + 1;
      die.value = dieNumber;
      die.style.display = 'block';
      die.style.backgroundImage = `url(images/userDie${dieNumber}.png)`;
      counts[dieNumber]++;
    });

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
    // const bustValues = [1, 1, 1, 1, 1, 1]; // any combo with no 1s, no 5s, no 3-of-a-kind
    // dice.forEach((die, index) => {
    //   const dieNumber = bustValues[index];
    //   die.value = dieNumber;
    //   die.style.display = 'block';
    //   die.style.backgroundImage = `url(images/die${dieNumber}.png)`;
    //   counts[dieNumber]++;
    // });

    // CHECKING FOR VALID THROW
    checkForValidThrow(counts, 'initial-roll');
  });

  // // THROW AGAIN BTN FUNCTION
  throwAgain.addEventListener('click', () => {
    throwAgain.classList.add('locked');

    // Move chosen dice to holding container and lock them
    const chosenDice = userDice.filter(
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

    // Determine how many dice are remaining
    let dieRemaining = userDice.filter(
      (die) => die.parentElement.id !== 'user-holding-container'
    );

    // If no dice remain, reroll all dice (reset)
    if (dieRemaining.length === 0) {
      dieRemaining = resetDiceForReroll();
    } else {
      // Clear previous counts before rolling again
      counts[1] = 0;
      counts[2] = 0;
      counts[3] = 0;
      counts[4] = 0;
      counts[5] = 0;
      counts[6] = 0;

      dieRemaining.forEach((die) => {
        const newValue = Math.floor(Math.random() * 6) + 1;
        die.value = newValue;
        die.style.backgroundImage = `url(images/userDie${newValue}.png)`;
        die.style.display = 'block';
        counts[newValue]++;
      });
    }

    checkForValidThrow(counts, 'reroll');
  });

  ////////////////////////////////////////
  /////////////COMPUTER LOGIC/////////////
  ////////////////////////////////////////

  function computerTurn() {
    console.log(`Computer's turn begins!`);

    currentRollScore = 0;

    // KEEPING TRACK OF CURRENT COUNT WHILE CHOOSING DICE
    // counts[1] = 0;
    // counts[2] = 0;
    // counts[3] = 0;
    // counts[4] = 0;
    // counts[5] = 0;
    // counts[6] = 0;

    compDice.forEach((die) => {
      let dieNumber = Math.floor(Math.random() * 6 + 1);
      die.value = dieNumber;
      die.style.display = 'block';
      die.style.backgroundImage = `url(images/compDie${dieNumber}.png)`;
      counts[dieNumber]++;
    });

    // FOR SCORING 1's 5's OR 3 OF A KIND
    for (let i = 1; i <= 6; i++) {
      if (counts[i] >= 3) {
        let multiplier = 1;
        // SCORING FOR 4/5/6 OF A KIND
        if (counts[i] === 4) multiplier = 2;
        if (counts[i] === 5) multiplier = 3;
        if (counts[i] === 6) multiplier = 4;

        // SCORING FOR 3 OF A KIND
        if (i === 1) {
          currentRollScore += 1000 * multiplier;
        } else {
          currentRollScore += i * 100 * multiplier;
        }

        // RESETTING DIE
        counts[i] = 0;
      }
    }

    // SCORING FOR LESS THAN 3 OF A KIND 1s AND 5s
    currentRollScore += counts[1] * 100;
    currentRollScore += counts[5] * 50;

    let diceToKeep = [];
    console.log('computer chose die');

    for (let i = 1; i <= 6; i++) {
      if (counts[i] >= 3) {
        let countToKeep = counts[i];
        let keptCount = 0;
        for (const die of dice) {
          if (
            die.value === i &&
            keptCount < countToKeep &&
            !diceToKeep.includes(die)
          ) {
            diceToKeep.push(die);
            keptCount++;
          }
        }
      }
    }

    for (const die of compDice) {
      if ((die.value === 1 || die.value === 5) && !diceToKeep.includes(die)) {
        diceToKeep.push(die);
      }
    }

    diceToKeep.forEach((die) => {
      compHoldingContainer.appendChild(die);
      die.classList.add('locked');
      die.style.display = 'block';
    });

    globalCompScore += currentRollScore;
    compScore.textContent = globalCompScore;
  }
});

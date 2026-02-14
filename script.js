const instructions = document.querySelector(".instructions");
const gameLevelButtons = document.querySelector(".game-level-buttons");
const startButton = document.querySelector(".start-button");
const resetButton = document.querySelector(".reset-button");
const easyButton = document.querySelector(".easy-button");
const mediumButton = document.querySelector(".medium-button");
const hardButton = document.querySelector(".hard-button");
const moveCounters = document.querySelector(".move-counter");
const timerElement = document.querySelector(".timer");
const gameBoard = document.querySelector(".game-board");
const overlay = document.getElementById("overlay-div");
const overlayText = document.getElementById("overlay-text");
const playAgainButton = document.getElementById("play-again-button");

let cardMoveCount = 0;
let timerInterval = null;
let initialTime = 0;
let timeStart = false;
const timeLimit = 300;
let lockBoard = false;
let flippedCards = 0;
let card1,
    card2 = null;
let matchedPairs = 0;
let hasStartedOnce = false;
let totalPairs;
let cardDetails = [];
let currentDifficulty = null;
let flipDelay = 600;

const startTimer = () => {
    timeStart = true;
    timerInterval = setInterval(() => {
        initialTime++;
        timerElement.textContent = `Time: ${initialTime} seconds`;
    }, 1000);
};

const stopTimer = () => {
    clearInterval(timerInterval);
    timeStart = false;
};

const resetTurn = () => {
    card1 = null;
    card2 = null;
    lockBoard = false;
};

const CardFlipped = (cardElement) => {
    //check game is locked
    if (lockBoard) return;
    // check if timer started on first card flip, if not start the timer
    if (!timeStart) startTimer();
    //validate if the same card is clicked twice
    if (cardElement === card1) return;
    // on a click of a 3rd card the previous 2 immediately hide, and the 3rd clicked flips
    if (card1 && card2) {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        resetTurn();
    }
    cardElement.classList.add("flipped");
    //if no card is flipped, set the first card
    if (!card1) {
        card1 = cardElement;
        return;
    }
    //if one card is flipped, set the second card
    card2 = cardElement;
    lockBoard = true;
    revealCard(card1, card2);
};

const createCards = (cardFront, cardBack, pairOfCards) => {
    const frontImage = cardFront[0].img;
    gameBoard.innerHTML = "";
    const getCards = cardBack.slice(0, pairOfCards);
    const cardValues = [...getCards, ...getCards].sort(
        () => 0.5 - Math.random(),
    );
    cardValues.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("flip-card");
        cardElement.innerHTML = `
        <div class="flip-card-inner">
            <div class="card-front" style="background-image: url(${frontImage})"></div>
            <div class="card-back" style="background-image: url(${card.img_url})"></div>
        </div>
    `;
        cardElement.dataset.name = card.name;
        cardElement.addEventListener("click", () => CardFlipped(cardElement));
        gameBoard.appendChild(cardElement);
    });
};

const disappearMatchingCards = (card1, card2) => {
    setTimeout(() => {
        card1.style.visibility = "hidden";
        card2.style.visibility = "hidden";
    }, 500);
};
const saveScore = async () => {
    const playerName = prompt("Enter your name:");
    if (!playerName) return;
    await fetch("/scores", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            playerName,
            difficulty: currentDifficulty,
            moves: cardMoveCount,
            time: initialTime,
        }),
    });
};

const loadScores = async () => {
    const response = await fetch(`/scores?difficulty=${currentDifficulty}`);
    const scores = await response.json();
    const scoreList = document.querySelector(".score-list");
    scoreList.innerHTML = "";
    scores.forEach((score) => {
        const li = document.createElement("li");
        li.textContent = `${score.playerName} | ${score.difficulty} | ${score.moves} moves | ${score.time}s`;
        scoreList.appendChild(li);
    });
};

const disableCards = async (card1, card2) => {
    matchedPairs++;
    card1.classList.add("matched");
    card2.classList.add("matched");
    card1.removeEventListener("click", CardFlipped);
    card2.removeEventListener("click", CardFlipped);
    resetTurn();
    disappearMatchingCards(card1, card2);
    if (matchedPairs === totalPairs) {
        stopTimer();
        resetButton.disabled = true;
        overlay.classList.add("show");
        overlayText.textContent = `You completed the ${currentDifficulty} level game in ${cardMoveCount} moves and ${initialTime} seconds.`;
        await saveScore();
        await loadScores();
    }
};

const revealCard = (firstCard, secondCard) => {
    cardMoveCount++;
    moveCounters.textContent = `Moves: ${cardMoveCount}`;
    setTimeout(() => {
        if (firstCard.dataset.name === secondCard.dataset.name) {
            disableCards(firstCard, secondCard);
        } else {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetTurn();
        }
    }, flipDelay);
};

const loadFrontCardsFromDB = async () => {
    const res = await fetch("/card-front");
    return await res.json();
};

const loadBackCardsFromDB = async () => {
    const res = await fetch("/cards");
    return await res.json();
};

const difficultyConfig = {
    easy: {
        rows: 3,
        cols: 4,
        flipDelay: 800,
    },
    medium: {
        rows: 4,
        cols: 4,
        flipDelay: 600,
    },
    hard: {
        rows: 4,
        cols: 6,
        flipDelay: 350,
    },
};

const setDifficulty = (level) => {
    const config = difficultyConfig[level];
    if (!config) return;
    let rows = config.rows;
    let cols = config.cols;
    if (window.innerWidth < 800 && level === "hard") {
        rows = 6;
        cols = 4;
    }
    totalPairs = (rows * cols) / 2;
    currentDifficulty = level;
    flipDelay = config.flipDelay;
    gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
};

const disableButtons = () => {
    gameLevelButtons.style.display = "none";
};

const selectLevel = () => {
    easyButton.addEventListener("click", () => {
        setDifficulty("easy");
        disableButtons();
        startGame(totalPairs);
    });

    mediumButton.addEventListener("click", () => {
        setDifficulty("medium");
        disableButtons();
        startGame(totalPairs);
    });

    hardButton.addEventListener("click", () => {
        setDifficulty("hard");
        disableButtons();
        startGame(totalPairs);
    });
};

const startGame = async (totalPairs) => {
    const cardBackResult = await loadBackCardsFromDB();
    const cardFrontResult = await loadFrontCardsFromDB();
    //to display only few cards
    cardDetails = cardBackResult.slice(0, totalPairs);
    cardMoveCount = 0;
    initialTime = 0;
    matchedPairs = 0;
    hasStartedOnce = true;
    startButton.style.display = "none";
    resetButton.style.display = "inline-block";
    gameBoard.innerHTML = "";
    moveCounters.textContent = `Moves: ${cardMoveCount}`;
    timerElement.textContent = `Time: ${initialTime}`;
    createCards(cardFrontResult, cardBackResult, totalPairs);
};

const resetGame = () => {
    stopTimer();
    gameBoard.innerHTML = "";
    cardMoveCount = 0;
    initialTime = 0;
    matchedPairs = 0;
    startGame(totalPairs);
};
startButton.addEventListener("click", () => {
    instructions.style.display = "none";
    startButton.style.display = "none";
    gameLevelButtons.style.display = "inline-block";
});
selectLevel();
loadScores();
resetButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", () => {
    overlay.classList.remove("show");
    resetButton.disabled = false;
    resetButton.style.display = "inline-block";
    resetGame();
});

window.addEventListener("resize", () => {
    if (currentDifficulty) {
        setDifficulty(currentDifficulty);
    }
});

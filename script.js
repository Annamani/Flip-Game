const startButton = document.querySelector(".start-button");
const resetButton = document.querySelector(".reset-button");
const easyButton = document.querySelector(".easy-button");
const mediumButton = document.querySelector(".medium-button");
const hardButton = document.querySelector(".hard-button");
const moveCounters = document.querySelector(".move-counter");
const timerElement = document.querySelector(".timer");
const gameBoard = document.querySelector(".game-board");

let cardMoveCount = 0;
let timerInterval = null;
let intialTime = 0;
let timeStart = false;
const timeLimit = 300;
let lockBoard = false;
let flippedCards = 0;
let card1,
    card2 = null;
let matchedPairs = 0;
let hasStartedOnce = false;
let gridSize;
let cardDetails = [];

const startTimer = () => {
    timeStart = true;
    timerInterval = setInterval(() => {
        intialTime++;
        if (intialTime > timeLimit) {
            stopTimer();
            alert(
                `Time's up! You completed ${matchedPairs} pairs and ${cardMoveCount} moves.`,
            );
            resetGame();
        }
        timerElement.textContent = `Time: ${intialTime} seconds`;
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
    const cardValues = [...getCards, ...getCards].sort(() => 0.5 - Math.random());
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
const disapperMatchingCards = (card1, card2) => {
    setTimeout(() => {
        card1.style.visibility = "hidden";
        card2.style.visibility = "hidden";
    }, 500);
};
const disableCards = (card1, card2) => {
    matchedPairs++;
    card1.classList.add("matched");
    card2.classList.add("matched");
    card1.removeEventListener("click", CardFlipped);
    card2.removeEventListener("click", CardFlipped);
    resetTurn();
    disapperMatchingCards(card1, card2);
    if (matchedPairs === cardDetails.length) {
        stopTimer();
        alert(
            `Congratulations! You completed the game in ${cardMoveCount} moves and ${intialTime} seconds.`,
        );
        resetGame();
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
    }, 600);
};
const loadfrontCardsFromDB = async () => {
    const res = await fetch("/card-front");
    return await res.json();
};
const loadBackCardsFromDB = async () => {
    const res = await fetch("/cards");
    return await res.json();
};
const gameLevel = (level) => {
    switch (level) {
        case "easy":
            gridSize = 3;
            return gridSize;
        case "medium":
            gridSize = 6;
            return gridSize;
        case "hard":
            gridSize = 12;
            return gridSize;
        default:
            gridSize = 2;
            return gridSize;
    }
}
const disableButtons = () => {
    easyButton.style.display = "none";
    mediumButton.style.display = "none";
    hardButton.style.display = "none";
}
const selectLevel = () => {
    const levelType = ["easy", "medium", "hard"];
    easyButton.addEventListener("click", () => {
        gameLevel(levelType[0]);
        disableButtons();
        startGame(gridSize);
    });
    mediumButton.addEventListener("click", () => {
        gameLevel(levelType[1]);
        disableButtons();
        startGame(gridSize);
    });
    hardButton.addEventListener("click", () => {
        gameLevel(levelType[2]);
        disableButtons();
        startGame(gridSize);
    });
}

const startGame = async (gridSize) => {
    const cardBackResult = await loadBackCardsFromDB();
    const cardFrontResult = await loadfrontCardsFromDB();
    //to display only few cards
    cardDetails = cardBackResult.slice(0, gridSize);
    cardMoveCount = 0;
    intialTime = 0;
    matchedPairs = 0;
    hasStartedOnce = true;
    startButton.style.display = "none";
    resetButton.style.display = "inline-block";
    gameBoard.innerHTML = "";
    moveCounters.textContent = `Moves: ${cardMoveCount}`;
    timerElement.textContent = `Time: ${intialTime}`;
    createCards(cardFrontResult, cardBackResult, gridSize);
};
const resetGame = () => {
    stopTimer();
    gameBoard.innerHTML = "";
    cardMoveCount = 0;
    intialTime = 0;
    matchedPairs = 0;
    startGame(gridSize);
};

startButton.addEventListener("click", () => {
    startButton.style.display = "none";
    easyButton.style.display = "inline-block";
    mediumButton.style.display = "inline-block";
    hardButton.style.display = "inline-block";
});
selectLevel();

resetButton.addEventListener("click", resetGame);

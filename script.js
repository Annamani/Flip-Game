const startButton = document.querySelector(".start-button");
const resetButton = document.querySelector(".reset-button");
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
const gridSize = 6;
let cardDetails = [];

// Fetch cards from backend
async function loadCardsFromDB() {
    const res = await fetch("/cards");
    return await res.json();
}
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
const createCards = (cards, pairOfCards) => {
    gameBoard.innerHTML = "";
    const getCards = cards.slice(0, pairOfCards);
    const cardValues = [...getCards, ...getCards].sort(() => 0.5 - Math.random());
    cardValues.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("flip-card");
        cardElement.innerHTML = `
        <div class="flip-card-inner">
            <div class="card-front"></div>
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
const startGame = async () => {
    const cards = await loadCardsFromDB();
    //to display only few cards
    cardDetails = cards.slice(0, gridSize);
    cardMoveCount = 0;
    intialTime = 0;
    matchedPairs = 0;
    hasStartedOnce = true;
    startButton.style.display = "none";
    resetButton.style.display = "inline-block";
    gameBoard.innerHTML = "";
    moveCounters.textContent = `Moves: ${cardMoveCount}`;
    timerElement.textContent = `Time: ${intialTime}`;
    createCards(cards, gridSize);
};
const resetGame = () => {
    stopTimer();
    gameBoard.innerHTML = "";
    cardMoveCount = 0;
    intialTime = 0;
    matchedPairs = 0;
    startGame();
};

const renderCards = (cards) => {
    cardDetails = cards;
    createCards(cards);
};

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

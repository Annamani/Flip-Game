const cardDetails = [
    { id: 1, name: "apple", img: "https://i.postimg.cc/28CTB29q/apple.jpg" },
    { id: 2, name: "banana", img: "https://i.postimg.cc/sDKmP7bg/banana.jpg" },
    { id: 3, name: "cherry", img: "https://i.postimg.cc/wTF25LnB/cherry.jpg" },
    { id: 4, name: "kiwi", img: "https://i.postimg.cc/pXkCQz3n/Kiwi.jpg" },
    // { id: 6, name: "grape", img: "https://i.postimg.cc/ZKjHPpXR/grape.jpg" },
    // {id: 7,name: "strawberry",img: "https://i.postimg.cc/Yq8RNYT3/strawberry.jpg"},
    // {id: 8,name: "orange", img: "https://i.postimg.cc/yYnjhc20/orange.jpg" },
    // {id: 9,name: "pineapple",img: "https://i.postimg.cc/zXp7wK4W/pineapple.jpg"},
    // {id: 10,name: "dragon-fruit",img: "https://i.postimg.cc/X7xLKdtq/dragon-fruit.jpg"},
];
const singleCard = {
    id: 5,
    name: "pear",
    img: "https://i.postimg.cc/c4Th7wPQ/pear.jpg",
};

const startButton = document.querySelectorAll(".start-button")[0];
const resetButton = document.querySelectorAll(".reset-button")[0];
const moveCounters = document.querySelectorAll(".move-counter")[0];
const timerElement = document.querySelectorAll(".timer")[0];
const gameBoard = document.querySelectorAll(".game-board")[0];

let cardMoveCount = 0;
let timerInterval = null;
let time = 0;
let timeStart = false;
const timeLimit = 300;
let lockBoard = false;
let flippedCards = 0;
let card1,
    card2 = null;
let matchedPairs = 0;
let hasStartedOnce = false;
const totalPairs = cardDetails.length;

const startTimer = () => {
    timeStart = true;
    timerInterval = setInterval(() => {
        time++;
        if (time > timeLimit) {
            stopTimer();
            alert(
                `Time's up! You completed ${matchedPairs} pairs and ${cardMoveCount} moves.`,
            );
            resetGame();
        }
        timerElement.textContent = `Time: ${time} seconds`;
    }, 1000);
    //check if time exceeds limit
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
    if (lockBoard) return;
    if (!timeStart) startTimer();
    if (cardElement === card1) return;
    cardElement.classList.add("flipped");
    if (!card1) {
        card1 = cardElement;
        return;
    }
    card2 = cardElement;
    lockBoard = true;
    revealCard(card1, card2);
};
const createCards = () => {
    gameBoard.innerHTML = "";
    const cardValues = [...cardDetails, ...cardDetails, singleCard].sort(
        () => 0.5 - Math.random(),
    );
    cardValues.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("flip-card");
        const innerCard = document.createElement("div");
        innerCard.classList.add("flip-card-inner");
        cardElement.appendChild(innerCard);
        const frontFace = document.createElement("div");
        frontFace.classList.add("card-front");
        const backFace = document.createElement("div");
        cardElement.dataset.name = card.name;
        backFace.classList.add("card-back");
        backFace.style.backgroundImage = `url(${card.img})`;
        innerCard.appendChild(frontFace);
        innerCard.appendChild(backFace);
        cardElement.addEventListener("click", () => CardFlipped(cardElement));
        gameBoard.appendChild(cardElement);
    });
};
const disableCards = (card1, card2) => {
    matchedPairs++;
    card1.classList.add("matched");
    card2.classList.add("matched");

    card1.removeEventListener("click", CardFlipped);
    card2.removeEventListener("click", CardFlipped);
    resetTurn();
    if (matchedPairs === totalPairs) {
        stopTimer();
        alert(
            `Congratulations! You completed the game in ${cardMoveCount} moves and ${time} seconds.`,
        );
    }
};

const revealCard = (firstCard, secondCard) => {
    cardMoveCount++;
    moveCounters.textContent = `Moves: ${cardMoveCount}`;
    setTimeout(() => {
        const isCardMatch = firstCard.dataset.name === secondCard.dataset.name;
        if (isCardMatch) {
            disableCards(firstCard, secondCard);
        } else {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetTurn();
        }
    }, 2000);
};
const startGame = () => {
    hasStartedOnce = true;
    startButton.style.display = "none";
    resetButton.style.display = "inline-block";
    gameBoard.innerHTML = "";
    moveCounters.textContent = `Moves: ${cardMoveCount}`;
    timerElement.textContent = `Time: ${time}`;
    createCards();
};
const resetGame = () => {
    stopTimer();
    gameBoard.innerHTML = "";
    cardMoveCount = 0;
    time = 0;
    matchedPairs = 0;
    startGame();
};

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

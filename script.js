const cardDetails = [
    {
        id: 1,
        name: "macao",
        img: "https://i.postimg.cc/02BFTKKv/ara-macao-1675899.png",
    },
    {
        id: 2,
        name: "monkey",
        img: "https://i.postimg.cc/zXc6sHHR/monkey-1675932.png",
    },
    {
        id: 3,
        name: "giraffe",
        img: "https://i.postimg.cc/7YWdFJJ6/giraffe-1675887.png",
    },
    {
        id: 4,
        name: "tiger",
        img: "https://i.postimg.cc/kXpz0RRS/tiger-1675933.png",
    },
    {
        id: 5,
        name: "zebra",
        img: "https://i.postimg.cc/15j2kVV6/zebra-1675910.png",
    },
    {
        id: 6,
        name: "frog",
        img: "https://i.postimg.cc/FsB8Mkkr/frog-1675916.png",
    },
    // {id: 7, name: "bird", img: "https://i.postimg.cc/xT4hwNN9/bird-1675891.png",},
    // {id: 8, name: "elephant", img: "https://i.postimg.cc/vHNkJxxQ/elephant-1675888.png",},
    // {id: 9, name: "crocodile",img: "https://i.postimg.cc/qM5SP660/crocodile-1675915.png"},
    // {id: 10, name: "panther",img: "https://i.postimg.cc/hP56kQQd/panther-1675908.png"},
    // {id: 11, name: "hippopotamus",img: "https://i.postimg.cc/dtxpbZZ3/hippopotamus-1675934.png"},
    // {id: 12, name: "lion",img: "https://i.postimg.cc/5NRThQQN/lion-1675905.png"},
    // {id: 13, name: "butterfly",img: "https://i.postimg.cc/Qxyw2KKh/butterfly-1675930.png"},
];

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
    const cardValues = [...cardDetails, ...cardDetails].sort(
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

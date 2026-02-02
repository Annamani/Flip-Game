const cardDetails = [
    { id: 1, name: 'apple', img: '' },
    { id: 2, name: 'banana', img: '' },
    { id: 3, name: 'cherry', img: '' },
    { id: 4, name: 'kiwi', img: '' },
    { id: 5, name: 'pear', img: '' },
    { id: 6, name: 'grape', img: '' },
    { id: 7, name: 'strawberry', img: '' },
    { id: 8, name: 'orange', img: '' },
    { id: 9, name: 'pineapple', img: '' },
];


const startButton = document.querySelectorAll('.start-button')[0];
const resetButton = document.querySelectorAll('.reset-button')[0];
const moveCounters = document.querySelectorAll('.move-counter')[0];
const timerElement = document.querySelectorAll('.timer')[0];
const gameBoard = document.querySelectorAll('.game-board')[0];
let moveCount = 0;
let timerInterval;
let time = 0;
let timeStart = false;
let matchedPairs = 0;
const totalPairs = 3;
let card1, card2;
let isCardFlipped = false;
let cardStayedFlipped = 10;


const startTimer = () => {
    timeStart = true;
    timerInterval = setInterval(() => {
        time++;
        if (time >= 0)
            timerElement.textContent = `Time: ${time} seconds`;
    }, 1000);
}
const startGame = startButton.addEventListener('click', () => {
    gameBoard.innerHTML = '';
    moveCount = 0;
    timeStart = false;
    moveCounters.textContent = `Moves: ${moveCount}`;
    timerElement.textContent = `Time: ${time}`;
    if (moveCount > 0) {
        startTimer(time);
    } else {
        clearInterval(timerInterval);
    }

});
const resetGame = resetButton.addEventListener('click', () => {
    moveCount = 0;
    moveCounters.textContent = `Moves: ${moveCount} `;
    clearInterval(timerInterval);
});

const flipBackCards = (card1, card2, cardStayedFlipped) => {
    setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        resetGame();
    }, cardStayedFlipped * 1000);
}

const revealCard = () => {
    moveCount++;
    moveCounters.textContent = `Moves: ${moveCount} `;
}



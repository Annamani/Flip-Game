const startButton = document.querySelectorAll('.start-button');
const resetButton = document.querySelectorAll('.reset-button');
const moveCounters = document.querySelectorAll('.move-counter');
const timerElement = document.querySelectorAll('.timer');
let moveCount = 0;
let timerInterval;

function startTimer(duration) {
    let timeLeft = duration;
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft === 15) {
            timerElement[0].style.color = "red";
            alert("Hurry up! Only 15 seconds left.");
        }
        else if (timeLeft >= 0) {
            timerElement[0].textContent = timeLeft;
        }
        else {
            showResult();
        }
    }, 1000);
}
startTimer(120);



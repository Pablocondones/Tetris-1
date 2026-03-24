const canvas = document.getElementById("tetris");
const startBtn = document.getElementById("start-btn");
const gameContainer = document.getElementById("game-container");
const menu = document.getElementById("menu");

const colors = [null, '#FF00DE', '#00F2FF', '#00FF41', '#FFFF00', '#FF8800', '#9D00FF', '#FF0000'];

let totalElapsedTime = 0;
let lastTime = 0;
let gameRunning = false;    

function startGame() {
    totalElapsedTime = 0;
    lastTime = performance.now();
    gameRunning = true;
    
    menu.style.display = "none";
    gameContainer.style.display = "flex";
    gameContainer.style.opacity = "1";
    
    requestAnimationFrame(update);
}

startBtn.addEventListener("click", startGame);

function update(time = 0) {
    if (gameRunning) {
        const deltaTime = time - lastTime;
        lastTime = time;

        totalElapsedTime += deltaTime;
        const totalSeconds = Math.floor(totalElapsedTime / 1000);
        
        const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');
        
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.innerText = `${mins}:${secs}`;
        }

        requestAnimationFrame(update);
    }
}
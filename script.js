const canvas = document.getElementById("tetris");
const startBtn = document.getElementById("start-btn");
const gameContainer = document.getElementById("game-container");
const menu = document.getElementById("menu");

let gameRunning = false;    

function startGame() {
    gameRunning = true;
    
    menu.style.display = "none";
    gameContainer.style.display = "flex";
    gameContainer.style.opacity = "1";
    
    requestAnimationFrame(update);
}

startBtn.addEventListener("click", startGame);


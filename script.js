document.addEventListener("DOMContentLoader", () => {
    const canvas = document.getElementById('tetris');
    const context = canvas.getContext('2d');
    const nextCanvas = document.getElementById('next');
    const nextCtx = nextCanvas.getContext('2d');
    const bgCanvas = document.getElementById('bg-canvas');
    const bgCtx = bgCanvas.getContext('2d');

    context.scale(20, 20);
    nextCtx.scale(20, 20);

    const colors = [null, '#FF00DE', '#00F2FF', '#00FF41', '#FFFF00', '#FF8800', '#9D00FF', '#FF0000'];

    let arena = createMatrix(12, 24);
    const player = { pos: {x: 0, y: 0}, matrix: null, next: null, score: 0 };
    let totalElapsedTime = 0;
    let lastTime = 0;
    let gameRunning = false; 

    function createMatrix(w, h){
        const matrix = [];
        while (h--) matrix.push(new Array (w).fill(0));
        return matrix;
    }

    function createPiece(type){
        if (type === 'I') return [[0,1,0,0]],[[0,1,0,0]],[[0,1,0,0]],[[0,1,0,0]];
        if (type === 'L') return [[0,2,0]],[[0,2,0]],[[0,2,2]];
        if (type === 'J') return [[0,3,0]],[[0,3,0]],[[3,3,0]];
        if (type === 'O') return [[4,4]],[[4,4]];
        if (type === 'Z') return [[5,5,0]],[[0,5,5]],[[0,0,0]];
        if (type === 'S') return [[0,6,6]],[[6,6,0]],[[0,0,0]];
        if (type === 'T') return [[0,7,0]],[[7,7,7]],[[0,0,0]];
    }   

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
});
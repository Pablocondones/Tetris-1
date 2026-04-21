document.addEventListener('DOMContentLoaded', () => {
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
        if (type === 'I') return [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]];
        if (type === 'L') return [[0,2,0],[0,2,0],[0,2,2]];
        if (type === 'J') return [[0,3,0],[0,3,0],[3,3,0]];
        if (type === 'O') return [[4,4],[4,4]];
        if (type === 'Z') return [[5,5,0],[0,5,5],[0,0,0]];
        if (type === 'S') return [[0,6,6],[6,6,0],[0,0,0]];
        if (type === 'T') return [[0,7,0],[7,7,7],[0,0,0]];
    }   

    function rotate(matrix) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    matrix.forEach(row => row.reverse());
   }

    function collide(arena, player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    function merge(arena, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) arena[y + player.pos.y][x + player.pos.x] = value;
            });
        });
    }

    function arenaSweep() {
        let rowCount = 0;
        outer: for (let y = arena.length - 1; y > 0; --y) {
            for (let x = 0; x < arena[y].length; ++x) {
                if (arena[y][x] === 0) continue outer;
            }
            const row = arena.splice(y, 1)[0].fill(0);
            arena.unshift(row);
            ++y;
            rowCount++;
        }
        if (rowCount > 0) {
            const points = {1: 100, 2: 300, 3: 500, 4: 800};
            player.score += points[rowCount] || 0;
            document.getElementById('score').innerText = player.score;
        }
    }

    function playerReset() { 
        const pieces = "ILJOTSZ";
        if (!player.next) player.next = createPiece(pieces[Math.random() * 7 | 0]);
        player.matrix = player.next;
        player.next = createPiece(pieces[Math.random() * 7 | 0]);
        player.pos.y = 1;
        player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

        if (collide(arena, player)) {
        gameRunning = false; 
        document.getElementById('final-score').innerText = player.score; 
        document.getElementById('game-over').style.display = 'flex'; 
        document.getElementById('game-container').style.opacity = "0.2"; 
        }
        drawNext();
    }

    function startGame() {
        const gameContainer = document.getElementById('game-container');
        gameContainer.style.display = 'flex';
        gameContainer.style.opacity = '1';

        document.getElementById('menu').style.display = 'none';
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('pause-overlay').style.display = 'none';

        arena.forEach(row => row.fill(0));
        player.score = 0;
        player.next = null;
        dropInterval = 1000;
        totalElapsedTime = 0;
        gameRunning = true;
        gamePaused = false;
        startTime = Date.now();
    
        document.getElementById('score').innerText = "0";
    }


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

    document.getElementById('start-btn').addEventListener('click', startGame);
}); 
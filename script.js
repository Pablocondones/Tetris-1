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

    

    //background engine
    let particles = [];
    function resize() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    //Hanterar bakgrundens visuella effekter genom att skapa och animera enskilda partiklar med slumpmässig färg och livslängd.
    class Particle {
        constructor(x, y) {
            this.x = x || Math.random() * bgCanvas.width;
            this.y = y || Math.random() * bgCanvas.height;
            this.color = colors[Math.floor(Math.random() * 7) + 1];
            this.size = Math.random() * 2 + 1;
            this.opacity = 0;
            this.life = 0;
            this.maxLife = 120 + Math.random() * 60; //ca 2 - 3 sekunder
            this.velX = (Math.random() - 0.5) * 0.5;
            this.velY = (Math.random() - 0.5) * 0.5;
        }
        update() {
            this.life++;
            this.x += this.velX;
            this.y += this.velY;

            //Bara normal fadinglogik för lugna prickar
            if (this.life < this.maxLife * 0.2) {
                this.opacity += 0.05;
            } else if (this.life > this.maxLife * 0.7) {
                this.opacity -= 0.03;
            }
        }

        draw() {
            if (this.opacity <= 0) return;
            bgCtx.save();
            bgCtx.globalAlpha = this.opacity;
            bgCtx.fillStyle = this.color;
            bgCtx.shadowBlur = 10;
            bgCtx.shadowColor = this.color;
            bgCtx.beginPath();
            bgCtx.arc(this.x, this.y, this.size, 0, Math.PI *2);
            bgCtx.fill();
            bgCtx.restore();
        } 
    }

    //Tetris logic
    let arena = createMatrix(12, 24); // 12 columns to give room, game is 10x20
    const player = { pos: {x: 0, y: 0}, matrix: null, next: null, score: 0 };
    let totalElapsedTime = 0;
    let startTime = 0;
    let lastTime = 0;
    let gameRunning = false; 
    let gamePaused = false; 
    let dropCounter = 0;
    let dropInterval = 1000;

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

   //Kontrollerar om spelarens nuvarande block krockar med existerande block i arenan eller spelplanens väggar
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

    //Identifierar och tar bort fyllda rader, flyttar ner ovanliggande block och uppdaterar spelarens poäng
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

    function drawMatrix(matrix, offset, ctx, isGhost = false) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    ctx.fillStyle = isGhost ? "rgba(255, 255, 255, 0.1)" : colors[value];
                    ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
                    ctx.strokeStyle = "#000000";
                    ctx.lineWidth = 0.035;
                    ctx.strokeRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }

    function drawNext() {
        nextCtx.fillStyle = "#000";
        nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
        drawMatrix(player.next, {x: 0.5, y: 0}, nextCtx);
    }

    ////kod för att skapa nytt block
    function playerReset() { 
        const pieces = "ILJOTSZ";
        if (!player.next) player.next = createPiece(pieces[Math.random() * 7 | 0]);
        player.matrix = player.next;
        player.next = createPiece(pieces[Math.random() * 7 | 0]);
        player.pos.y = 1;
        player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

        if (collide(arena, player)) {
        gameRunning = false; //stoppa spelet
        document.getElementById('final-score').innerText = player.score; //skicka poängen till game over skärmen
        document.getElementById('game-over').style.display = 'flex'; //visa game over menyn
        document.getElementById('game-container').style.opacity = "0.2"; // Gör spelet mörkare i bakgrunden när man förlorar
        }
        drawNext();
    }

    function startGame() {
        // 1. Återställ synligheten på spelplanen (ta bort skuggan)
        const gameContainer = document.getElementById('game-container');
        gameContainer.style.display = 'flex';
        gameContainer.style.opacity = '1';  // Detta fixar "shadowy" problemet

        // 2. Dölj alla menyer
        document.getElementById('menu').style.display = 'none';
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('pause-overlay').style.display = 'none';

        // 3. Återställ speldatan
        arena.forEach(row => row.fill(0));
        player.score = 0;
        player.next = null;
        dropInterval = 1000;
        totalElapsedTime = 0;
        gameRunning = true;
        gamePaused = false;
        startTime = Date.now();
    
        document.getElementById('score').innerText = "0";
        playerReset();
    }

    // Controls
    document.addEventListener('keydown', e => {
        if (!gameRunning || gamePaused) return;
        if(e.keyCode === 37) { // Left
            player.pos.x--;
            if (collide(arena, player)) player.pos.x++;
        }
        if(e.keyCode === 39) { // Right
            player.pos.x++;
            if (collide(arena, player)) player.pos.x--;
        } else if (e.keyCode === 40) { // Down Arrow
            player.pos.y++;
            if (collide(arena, player)) {
                player.pos.y--;
                merge(arena, player);
                playerReset();
                arenaSweep();
            } else {
                // Manual drop bonus
                player.score += 1;
                document.getElementById('score').innerText = player.score;
            }
            dropcounter = 0; // Reset the automatic timer so it doesn't double-drop

        }
        else if (e.keyCode === 38) { // Up (Rotate)
            const oldX = player.pos.x;
            rotate(player.matrix);
            let offset = 1;
            while (collide(arena, player)) {
                player.pos.x += offset;
                offset = -(offset + (offset > 0 ? 1 : -1));
                if (offset > player.matrix[0].length) {
                    rotate(player.matrix); rotate(player.matrix); rotate(player.matrix);
                    player.pos.x = oldX;
                    return;
                }
            }
        }
        else if (e.keyCode === 32) {
            e.preventDefault(); // Hindrar sidan från att scrolla ner när du trycker space

            let dropPoints = 0;
            while (!collide(arena, player)) {
                player.pos.y++;
                dropPoints++;
            }
            player.pos.y--; // Backa ett steg eftersom loopen stannar vid krock
            // Ge extra poäng för Hard Drop (2 poäng per rad är standard)
            player.score += (dropPoints - 1) * 2; 
            document.getElementById('score').innerText = player.score;
            merge(arena, player);
            playerReset();
            arenaSweep();
            dropCounter = 0;
        }
    });


    function update(time = 0) {
        //Handle background dots
        bgCtx.fillStyle = "#000";
        bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
        if (particles.length < 400 && Math.random() < 0.5) particles.push(new Particle());
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].life > particles[i].maxLife) particles.splice(i, 1);
            }
            
        if (gameRunning && !gamePaused) {
            const deltaTime = time - lastTime;
            lastTime = time;
            dropCounter += deltaTime;

            totalElapsedTime += deltaTime;
            const totalSeconds = Math.floor(totalElapsedTime / 1000);
            const displayMinutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
            const displaySeconds = (totalSeconds % 60).toString().padStart(2, '0');
        
            document.getElementById('timer').innerText = `${displayMinutes}:${displaySeconds}`;
            
            if (dropCounter > dropInterval) {
                player.pos.y++;
                if (collide(arena, player)) {
                    player.pos.y--;
                    merge(arena, player);
                    playerReset();
                    arenaSweep();
                }
                dropCounter = 0;
            }

            context.fillStyle = "#000";
            context.fillRect(0, 0, canvas.width, canvas.height);

            // Röda linjen på toppen
            context.fillStyle = 'rgb(255, 0, 0)';
            context.fillRect(0, 1, 12, 0.1);

            drawMatrix(arena, {x: 0, y: 0}, context);
            drawMatrix(player.matrix, player.pos, context);
            } else {
            // Om spelet är pausat måste vi fortfarande uppdatera lastTime
            // så att deltaTime inte blir gigantisk när vi startar igen
            lastTime = performance.now();
        }
        requestAnimationFrame(update); //Huvudloopen som driver spelets animationer och logik synkroniserat med skärmens uppdateringsfrekvens
    }    

    // KNAPP 1: Pausa (den lilla knappen under timern)
    document.getElementById('side-pause-btn').addEventListener('click', () => {
        if (!gameRunning) return;
        gamePaused = true; // Sätt paus till sant
        document.getElementById('pause-score').innerText = player.score;
        document.getElementById('pause-overlay').style.display = 'flex';
        document.getElementById('game-container').style.opacity = "0.5";
    });

    // KNAPP 2: Fortsätt (den stora knappen i paus-menyn)
    document.getElementById('resume-btn').addEventListener('click', () => {
        gamePaused = false; // Sätt paus till falskt
        document.getElementById('pause-overlay').style.display = 'none';
        document.getElementById('game-container').style.opacity = "1";
        lastTime = performance.now(); // Starta om klockan så blocket inte hoppar
    }); 

    // Start och Restart knappar
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', startGame);

    update();
});

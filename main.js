"use strict";
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
;
class Vector2 {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
class Player {
    x;
    y;
    color;
    move;
    angle;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.color = "#ffbbff";
        this.move = [false, false, false, false, false];
        this.angle = 0;
    }
    getPos() {
        return new Vector2(this.x, this.y);
    }
}
class Game {
    display;
    constructor() {
        this.display = createDisplay(800, 600);
    }
}
function createDisplay(width, height) {
    const canvas = document.getElementById("canvas");
    if (canvas === null)
        throw new Error("Couldn't load canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx === null)
        throw new Error("Couldn't get context from canvas");
    const backCanvas = new OffscreenCanvas(width, height);
    if (backCanvas === null)
        throw new Error("Couldn't create backCanvas");
    const backCtx = backCanvas.getContext("2d");
    if (backCtx === null)
        throw new Error("Couldn't get context from backCanvas");
    return ({ width, height, ctx, backCtx });
}
function clearBackground(display, color = "#606060") {
    display.backCtx.clearRect(0, 0, display.width, display.height);
    display.backCtx.fillStyle = color;
    display.backCtx.fillRect(0, 0, display.width, display.height);
}
function swapBuffers(display) {
    display.ctx.drawImage(display.backCtx.canvas, 0, 0);
}
function drawCircle(display, p, radius, color) {
    display.backCtx.beginPath();
    display.backCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    display.backCtx.fillStyle = color;
    display.backCtx.fill();
    display.backCtx.closePath();
}
function drawPlayer(display, player) {
    drawCircle(display, player.getPos(), 2, player.color);
}
function drawLine(display, p1, p2, color) {
    display.backCtx.beginPath();
    display.backCtx.moveTo(p1.x, p1.y);
    display.backCtx.lineTo(p2.x, p2.y);
    display.backCtx.strokeStyle = color;
    display.backCtx.stroke();
    display.backCtx.closePath();
}
function drawGrid(display) {
    const size = 32;
    for (let i = 0; i < display.width; i += size) {
        drawLine(display, new Vector2(i, 0), new Vector2(i, display.height), "#101010");
    }
    for (let i = 0; i < display.height; i += size) {
        drawLine(display, new Vector2(0, i), new Vector2(display.width, i), "#101010");
    }
}
function drawMap(display) {
    const size = 32;
    display.backCtx.fillStyle = "#fe4";
    for (let y = 0; y < map.length; ++y) {
        for (let x = 0; x < map[y].length; ++x) {
            if (map[y][x] === 1) {
                display.backCtx.fillRect(x * size, y * size, size, size);
            }
        }
    }
}
function calculatePoints(p, dir) {
    let p2 = new Vector2();
    for (let i = 0; i < 10000; ++i) {
        p2 = new Vector2(p.x + Math.cos(dir) * i, p.y + Math.sin(dir) * i);
        if (Math.floor(p2.x) % 32 === 0 || Math.floor(p2.y) % 32 === 0) {
            return (p2);
        }
    }
    return (p2);
}
function drawRay(display, player) {
    const rayLength = 100;
    const dir = player.angle * Math.PI / 180;
    let p = new Vector2(player.x + Math.cos(dir), player.y + Math.sin(dir));
    for (let i = 0; i < 10000; ++i) {
        let x = 1;
        let y = 1;
        if (player.angle > 90 && player.angle < 180) {
            x = -1;
        }
        else if (player.angle > 180 && player.angle < 270) {
            x = -1;
            y = -1;
        }
        else if (player.angle > 270 && player.angle < 360) {
            y = -1;
        }
        p = calculatePoints(new Vector2(p.x + x, p.y + y), dir);
        drawCircle(display, p, 2, "#ff0000");
        if (x > 0 && y < 0) {
            if (map[Math.floor(p.y / 32)][Math.floor(p.x / 32) + 1]) {
                break;
            }
        }
        else if (x < 0 && y < 0) {
            if (map[Math.floor(p.y / 32) + 1][Math.floor(p.x / 32)]) {
                break;
            }
        }
        if (map[Math.floor(p.y / 32)][Math.floor(p.x / 32)]) {
            break;
        }
    }
    //drawLine(display, player.getPos(), new Vector2(player.x + Math.cos(dir) * rayLength, player.y + Math.sin(dir) * rayLength), "#00ff00");
}
function movePlayer(player) {
    let speed = 1;
    if (player.move[4 /* Key.LSHIFT */])
        speed *= 2;
    if (player.move[0 /* Key.UP */])
        player.y -= speed;
    if (player.move[1 /* Key.DOWN */])
        player.y += speed;
    if (player.move[2 /* Key.LEFT */])
        player.x -= speed;
    if (player.move[3 /* Key.RIGHT */])
        player.x += speed;
    if (player.move[5 /* Key.ARROW_LEFT */])
        player.angle = properMod(player.angle - 1, 360);
    if (player.move[6 /* Key.ARROW_RIGHT */])
        player.angle = properMod(player.angle + 1, 360);
}
function properMod(a, b) {
    return ((a % b + b) % b);
}
(() => {
    const game = new Game();
    const player = new Player();
    function gameLoop() {
        movePlayer(player);
        clearBackground(game.display);
        drawMap(game.display);
        drawGrid(game.display);
        drawPlayer(game.display, player);
        drawRay(game.display, player);
        swapBuffers(game.display);
        requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
    document.addEventListener("touchstart", (event) => {
        event.preventDefault();
        const bound = game.display.ctx.canvas.getBoundingClientRect();
        const x = event.changedTouches[0].clientX - bound.left;
        const y = event.changedTouches[0].clientY - bound.top;
        const dx = x - player.x;
        const dy = y - player.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            player.move[dx > 0 ? 3 /* Key.RIGHT */ : 2 /* Key.LEFT */] = true;
        }
        else {
            player.move[dy > 0 ? 1 /* Key.DOWN */ : 0 /* Key.UP */] = true;
        }
    });
    document.addEventListener("touchend", (event) => {
        player.move[0 /* Key.UP */] = false;
        player.move[1 /* Key.DOWN */] = false;
        player.move[2 /* Key.LEFT */] = false;
        player.move[3 /* Key.RIGHT */] = false;
    });
    document.addEventListener("keydown", (event) => {
        if (event.code === "KeyW")
            player.move[0 /* Key.UP */] = true;
        if (event.code === "KeyS")
            player.move[1 /* Key.DOWN */] = true;
        if (event.code === "KeyA")
            player.move[2 /* Key.LEFT */] = true;
        if (event.code === "KeyD")
            player.move[3 /* Key.RIGHT */] = true;
        if (event.code === "ShiftLeft")
            player.move[4 /* Key.LSHIFT */] = true;
        if (event.code === "ArrowLeft")
            player.move[5 /* Key.ARROW_LEFT */] = true;
        if (event.code === "ArrowRight")
            player.move[6 /* Key.ARROW_RIGHT */] = true;
    });
    document.addEventListener("keyup", (event) => {
        if (event.code === "KeyW")
            player.move[0 /* Key.UP */] = false;
        if (event.code === "KeyS")
            player.move[1 /* Key.DOWN */] = false;
        if (event.code === "KeyA")
            player.move[2 /* Key.LEFT */] = false;
        if (event.code === "KeyD")
            player.move[3 /* Key.RIGHT */] = false;
        if (event.code === "ShiftLeft")
            player.move[4 /* Key.LSHIFT */] = false;
        if (event.code === "ArrowLeft")
            player.move[5 /* Key.ARROW_LEFT */] = false;
        if (event.code === "ArrowRight")
            player.move[6 /* Key.ARROW_RIGHT */] = false;
    });
})();

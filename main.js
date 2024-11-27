"use strict";
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
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.color = "#ffbbff";
        this.move = [false, false, false, false];
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
function drawCircle(backCtx, p, radius, color) {
    if (backCtx === null)
        return;
    backCtx.beginPath();
    backCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    backCtx.fillStyle = color;
    backCtx.fill();
    backCtx.closePath();
}
function drawPlayer(display, player) {
    drawCircle(display.backCtx, player.getPos(), 5, player.color);
}
function drawLine(backCtx, p1, p2, color) {
    if (backCtx === null)
        return;
    backCtx.beginPath();
    backCtx.moveTo(p1.x, p1.y);
    backCtx.lineTo(p2.x, p2.y);
    backCtx.strokeStyle = color;
    backCtx.stroke();
    backCtx.closePath();
}
function drawGrid(display) {
    const size = 32;
    for (let i = 0; i < display.width; i += size) {
        drawLine(display.backCtx, new Vector2(i, 0), new Vector2(i, display.height), "#101010");
    }
    for (let i = 0; i < display.height; i += size) {
        drawLine(display.backCtx, new Vector2(0, i), new Vector2(display.width, i), "#101010");
    }
}
function movePlayer(player) {
    const speed = 5;
    if (player.move[0])
        player.y -= 5;
    if (player.move[1])
        player.y += 5;
    if (player.move[2])
        player.x -= 5;
    if (player.move[3])
        player.x += 5;
}
function main() {
    const game = new Game();
    const player = new Player();
    function gameLoop() {
        movePlayer(player);
        clearBackground(game.display);
        drawPlayer(game.display, player);
        drawGrid(game.display);
        swapBuffers(game.display);
        requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
    document.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();
        if (key === "w")
            player.move[0] = true;
        if (key === "s")
            player.move[1] = true;
        if (key === "a")
            player.move[2] = true;
        if (key === "d")
            player.move[3] = true;
    });
    document.addEventListener("keyup", (e) => {
        const key = e.key.toLowerCase();
        if (key === "w")
            player.move[0] = false;
        if (key === "s")
            player.move[1] = false;
        if (key === "a")
            player.move[2] = false;
        if (key === "d")
            player.move[3] = false;
    });
}
main();

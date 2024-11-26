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
    width;
    height;
    canvas;
    ctx;
    backCanvas;
    backCtx;
    constructor() {
        this.width = 800;
        this.height = 600;
        this.canvas = document.getElementById("canvas");
        if (this.canvas === null)
            throw new Error("Couldn't load canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
        if (this.ctx === null)
            throw new Error("Couldn't get context from canvas");
        this.backCanvas = new OffscreenCanvas(this.width, this.height);
        if (this.backCanvas === null)
            throw new Error("Couldn't create backCanvas");
        this.backCtx = this.backCanvas.getContext("2d");
        if (this.backCtx === null)
            throw new Error("Couldn't get context from backCanvas");
    }
}
function clearBackground(game, color = "#606060") {
    if (game.backCtx === null)
        return;
    game.backCtx.clearRect(0, 0, game.width, game.height);
    game.backCtx.fillStyle = color;
    game.backCtx.fillRect(0, 0, game.width, game.height);
}
function swapBuffers(ctx, backCanvas) {
    if (ctx === null)
        return;
    ctx.drawImage(backCanvas, 0, 0);
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
function drawPlayer(backCtx, player) {
    if (backCtx === null)
        return;
    drawCircle(backCtx, player.getPos(), 5, player.color);
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
function drawGrid(game) {
    if (game.backCtx === null)
        return;
    const size = 32;
    for (let i = 0; i < game.width; i += size) {
        drawLine(game.backCtx, new Vector2(i, 0), new Vector2(i, game.height), "#101010");
    }
    for (let i = 0; i < game.height; i += size) {
        drawLine(game.backCtx, new Vector2(0, i), new Vector2(game.width, i), "#101010");
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
        clearBackground(game);
        drawPlayer(game.backCtx, player);
        drawGrid(game);
        swapBuffers(game.ctx, game.backCanvas);
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

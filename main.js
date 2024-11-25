const FPS = 60;

class Vector2 {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	add(that) {
		return new Vector2(this.x + that.x, this.y + that.y);
	}
}

class Player {
	constructor(position = new Vector2(), velocity = new Vector2()) {
		this.position = position;
		this.velocity = velocity;
	}
}

const canvas = document.getElementById("canvas");
if (canvas === null) throw new Error("Couldn't load canvas");
canvas.width = 800;
canvas.height = 600;
const backCanvas = document.createElement("canvas");
if (backCanvas === null) throw new Error("Couln't create backCanvas");
backCanvas.width = 800;
backCanvas.height = 600;
const ctx = canvas.getContext("2d");
const backCtx = backCanvas.getContext("2d");
const player = new Player();
const move = {up: false, down:false, left:false, right: false, shift: false};

document.addEventListener('keydown', (e) => {
	key = e.key.toLowerCase();
	if (key === 'w') move.up = true;
	if (key === 's') move.down = true;
	if (key === 'a') move.left = true;
	if (key === 'd') move.right = true;
	if (key === 'shift') move.shift = true;
});

document.addEventListener('keyup', (e) => {
	key = e.key.toLowerCase();
	if (key === 'w') move.up = false;
	if (key === 's') move.down = false;
	if (key === 'a') move.left = false;
	if (key === 'd') move.right = false;
	if (key === 'shift') move.shift = false;
});

function movePlayer() {
	speed = 1;
	if (move.shift) speed *= 5;
	if (move.up) player.position.y -= speed;
	if (move.down) player.position.y += speed;
	if (move.left) player.position.x -= speed;
	if (move.right) player.position.x += speed;
}

function clearBackground(color = "#303030") {
	backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
	backCtx.fillStyle = color;
	backCtx.fillRect(0, 0, backCanvas.width, backCanvas.height);
}

function drawPlayer() {
	backCtx.fillStyle = "#ff0000";
	backCtx.fillRect(player.position.x, player.position.y, 30, 30);
}

function swapBuffers() {
	ctx.drawImage(backCanvas, 0, 0);
}

function game() {
	movePlayer();
	clearBackground();
	drawPlayer();
	swapBuffers();
}

function gameLoop() {
	game();
	requestAnimationFrame(gameLoop);
}

gameLoop();

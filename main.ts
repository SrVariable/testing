interface Display {
	width: number;
	height: number;
	ctx: CanvasRenderingContext2D;
	backCtx: OffscreenCanvasRenderingContext2D;
}

const enum Key {
	UP,
	DOWN,
	LEFT,
	RIGHT,
	LSHIFT,
};

class Vector2 {
	x: number;
	y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}
}

class Player {
	x: number;
	y: number;
	color: string;
	move: Array<boolean>;

	constructor (x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
		this.color = "#ffbbff";
		this.move = [false, false, false, false, false];
	}

	getPos(): Vector2 {
		return new Vector2(this.x, this.y);
	}
}

class Game {
	display: Display;

	constructor() {
		this.display = createDisplay(800, 600);
	}
}

function createDisplay(width: number, height: number): Display {
	const canvas = document.getElementById("canvas") as (HTMLCanvasElement | null);
	if (canvas === null) throw new Error("Couldn't load canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (ctx === null) throw new Error("Couldn't get context from canvas");
	const backCanvas = new OffscreenCanvas(width, height);
	if (backCanvas === null) throw new Error("Couldn't create backCanvas");
	const backCtx = backCanvas.getContext("2d");
	if (backCtx === null) throw new Error("Couldn't get context from backCanvas");
	return ({width, height, ctx, backCtx});
}

function clearBackground(display: Display, color: string = "#606060") {
	display.backCtx.clearRect(0, 0, display.width, display.height);
	display.backCtx.fillStyle = color;
	display.backCtx.fillRect(0, 0, display.width, display.height);
}

function swapBuffers(display: Display) {
	display.ctx.drawImage(display.backCtx.canvas, 0, 0);
}

function drawCircle(display: Display, p: Vector2, radius: number, color: string) {
	display.backCtx.beginPath();
	display.backCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
	display.backCtx.fillStyle = color;
	display.backCtx.fill();
	display.backCtx.closePath();
}

function drawPlayer(display: Display, player: Player) {
	drawCircle(display, player.getPos(), 5, player.color);
}

function drawLine(display: Display, p1: Vector2, p2: Vector2, color: string) {
	display.backCtx.beginPath();
	display.backCtx.moveTo(p1.x, p1.y);
	display.backCtx.lineTo(p2.x, p2.y);
	display.backCtx.strokeStyle = color;
	display.backCtx.stroke();
	display.backCtx.closePath();
}

function drawGrid(display: Display) {
	const size: number = 32;
	for (let i = 0; i < display.width; i += size) {
		drawLine(display, new Vector2(i, 0), new Vector2(i, display.height), "#101010")
	}
	for (let i = 0; i < display.height; i += size) {
		drawLine(display, new Vector2(0, i), new Vector2(display.width, i), "#101010")
	}
}

function movePlayer(player: Player) {
	let speed = 5;
	if (player.move[Key.LSHIFT]) speed *= 2;
	if (player.move[Key.UP]) player.y -= speed;
	if (player.move[Key.DOWN]) player.y += speed;
	if (player.move[Key.LEFT]) player.x -= speed;
	if (player.move[Key.RIGHT]) player.x += speed;
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

	document.addEventListener("touchstart", (event) => {
		event.preventDefault();
		const bound = game.display.ctx.canvas.getBoundingClientRect();
		const x = event.changedTouches[0].clientX - bound.left;
		const y = event.changedTouches[0].clientY - bound.top;
		if (y < player.y) player.move[Key.UP] = true;
		if (y > player.y) player.move[Key.DOWN] = true;
		if (x < player.x) player.move[Key.LEFT] = true;
		if (x > player.x) player.move[Key.RIGHT] = true;
	});

	document.addEventListener("touchend", (event) => {
		player.move[Key.UP] = false;
		player.move[Key.DOWN] = false;
		player.move[Key.LEFT] = false;
		player.move[Key.RIGHT] = false;
	});

	document.addEventListener("keydown", (event) => {
		if (event.code === "KeyW") player.move[Key.UP] = true;
		if (event.code === "KeyS") player.move[Key.DOWN] = true;
		if (event.code === "KeyA") player.move[Key.LEFT] = true;
		if (event.code === "KeyD") player.move[Key.RIGHT] = true;
		if (event.code === "ShiftLeft") player.move[Key.LSHIFT] = true;
	});

	document.addEventListener("keyup", (event) => {
		if (event.code === "KeyW") player.move[Key.UP] = false;
		if (event.code === "KeyS") player.move[Key.DOWN] = false;
		if (event.code === "KeyA") player.move[Key.LEFT] = false;
		if (event.code === "KeyD") player.move[Key.RIGHT] = false;
		if (event.code === "ShiftLeft") player.move[Key.LSHIFT] = false;
	});
}

main();

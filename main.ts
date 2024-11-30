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
]

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
	ARROW_LEFT,
	ARROW_RIGHT,
};

class Vector2 {
	x: number;
	y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	equals(that: Vector2) {
		return (this.x === that.x && this.y === that.y);
	}
}

class Player {
	x: number;
	y: number;
	color: string;
	move: Array<boolean>;
	angle: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
		this.color = "#ffbbff";
		this.move = [false, false, false, false, false];
		this.angle = 0;
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
	return ({ width, height, ctx, backCtx });
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
	drawCircle(display, player.getPos(), 2, player.color);
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
	const size = 32;
	for (let i = 0; i < display.width; i += size) {
		drawLine(display, new Vector2(i, 0), new Vector2(i, display.height), "#101010")
	}
	for (let i = 0; i < display.height; i += size) {
		drawLine(display, new Vector2(0, i), new Vector2(display.width, i), "#101010")
	}
}

function drawMap(display: Display) {
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

// The try catch must be modified because I can't have that in C
function calculatePoints(p: Vector2, dir: number) {
	let p2 = new Vector2();
	for (let i = 0; i < 10000; ++i) {
		p2 = new Vector2(p.x + Math.cos(dir) * i, p.y + Math.sin(dir) * i);
		const newX = Math.floor(p.x / 32);
		const newY = Math.floor(p.y / 32);
		try {
			if ((Math.floor(p2.x) % 32 === 0 || Math.floor(p2.y) % 32 === 0) && !p2.equals(p)
				&& map[newY][newX] != 1) {
				return (p2);
			}
		}
		catch {
			return (p2);
		}
	}
	return (p2);
}

function drawRay(display: Display, player: Player, dir: number) {
	const rayLength = 1000;
	let p = new Vector2(player.x + Math.cos(dir), player.y + Math.sin(dir));
	for (let i = 0; i < 20; ++i) {
		let x = 1;
		let y = 1;
		if (player.angle >= 90 && player.angle < 180) {
			x = -1;
		}
		else if (player.angle >= 180 && player.angle < 270) {
			x = -1;
			y = -1;
		}
		else if (player.angle >= 270 && player.angle < 360) {
			y = -1;
		}
		p = calculatePoints(new Vector2(p.x + x, p.y + y), dir);
		drawCircle(display, p, 2, "#ff0000");
		const newX = Math.floor(p.x / 32);
		const newY = Math.floor(p.y / 32);
		try {
			if (map[newY][newX] === 1) {
				break;
			}
		}
		catch {
			break;
		}
	}
	drawLine(display, player.getPos(), new Vector2(player.x + Math.cos(dir) * rayLength, player.y + Math.sin(dir) * rayLength), "#00ff00");
}

function movePlayer(player: Player) {
	let speed = 1;
	if (player.move[Key.LSHIFT]) speed *= 2;
	if (player.move[Key.UP]) player.y -= speed;
	if (player.move[Key.DOWN]) player.y += speed;
	if (player.move[Key.LEFT]) player.x -= speed;
	if (player.move[Key.RIGHT]) player.x += speed;
	if (player.move[Key.ARROW_LEFT]) player.angle = properMod(player.angle - 1, 360);
	if (player.move[Key.ARROW_RIGHT]) player.angle = properMod(player.angle + 1, 360);
}

function properMod(a: number, b: number) {
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
		for (let i = 0; i < 15; ++i) {
			drawRay(game.display, player, (player.angle + i) % 360 * Math.PI / 180);
		}
		for (let i = 1; i < 16; ++i) {
			drawRay(game.display, player, properMod(player.angle - i, 360) * Math.PI / 180);
		}
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
			player.move[dx > 0 ? Key.RIGHT : Key.LEFT] = true;
		}
		else {
			player.move[dy > 0 ? Key.DOWN : Key.UP] = true;
		}
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
		if (event.code === "ArrowLeft") player.move[Key.ARROW_LEFT] = true;
		if (event.code === "ArrowRight") player.move[Key.ARROW_RIGHT] = true;
	});

	document.addEventListener("keyup", (event) => {
		if (event.code === "KeyW") player.move[Key.UP] = false;
		if (event.code === "KeyS") player.move[Key.DOWN] = false;
		if (event.code === "KeyA") player.move[Key.LEFT] = false;
		if (event.code === "KeyD") player.move[Key.RIGHT] = false;
		if (event.code === "ShiftLeft") player.move[Key.LSHIFT] = false;
		if (event.code === "ArrowLeft") player.move[Key.ARROW_LEFT] = false;
		if (event.code === "ArrowRight") player.move[Key.ARROW_RIGHT] = false;
	});
})();

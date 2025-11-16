const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Resize canvas automatically
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Player
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  color: "#00ffcc",
  speed: 4,
  paint: true
};

const keys = { w: false, a: false, s: false, d: false };
let paintTrail = [];

// Input
document.addEventListener("keydown", (e) => {
  if (keys[e.key.toLowerCase()] !== undefined) {
    keys[e.key.toLowerCase()] = true;
  }
});
document.addEventListener("keyup", (e) => {
  if (keys[e.key.toLowerCase()] !== undefined) {
    keys[e.key.toLowerCase()] = false;
  }
});

// Toggle paint
document.getElementById("togglePaint").onclick = () => {
  player.paint = !player.paint;
};

// Main loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function update() {
  if (keys.w) player.y -= player.speed;
  if (keys.s) player.y += player.speed;
  if (keys.a) player.x -= player.speed;
  if (keys.d) player.x += player.speed;

  if (player.paint) {
    paintTrail.push({ x: player.x, y: player.y, color: player.color });
  }
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw paint
  for (const dot of paintTrail) {
    ctx.fillStyle = dot.color;
    ctx.fillRect(dot.x, dot.y, player.size, player.size);
  }

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

loop();

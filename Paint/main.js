const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player settings
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  color: "#00ffcc",
  speed: 4,
  painting: true
};

// Movement tracking
const keys = {
  w: false,
  a: false,
  s: false,
  d: false
};

// Store paint data
let paintTrail = [];

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) keys[key] = true;
});

document.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (keys.hasOwnProperty(key)) keys[key] = false;
});

document.getElementById("togglePaint").onclick = () => {
  player.painting = !player.painting;
};

// Main game loop
function loop() {
  movePlayer();
  draw();
  requestAnimationFrame(loop);
}

function movePlayer() {
  if (keys.w) player.y -= player.speed;
  if (keys.s) player.y += player.speed;
  if (keys.a) player.x -= player.speed;
  if (keys.d) player.x += player.speed;

  // Paint
  if (player.painting) {
    paintTrail.push({
      x: player.x,
      y: player.y,
      color: player.color
    });
  }
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Paint trail
  for (let dot of paintTrail) {
    ctx.fillStyle = dot.color;
    ctx.fillRect(dot.x, dot.y, player.size, player.size);
  }

  // Player square
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

loop();

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  let painting = false;
  let brushSize = parseInt(document.getElementById("brushSize").value);
  let brushColor = document.getElementById("colorPicker").value;

  // Event listeners
  canvas.addEventListener("mousedown", () => painting = true);
  canvas.addEventListener("mouseup", () => painting = false);
  canvas.addEventListener("mouseout", () => painting = false);
  canvas.addEventListener("mousemove", draw);

  document.getElementById("brushSize").addEventListener("input", e => brushSize = parseInt(e.target.value));
  document.getElementById("colorPicker").addEventListener("input", e => brushColor = e.target.value);
  document.getElementById("clearBtn").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  function draw(e) {
    if (!painting) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = brushColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  }
});

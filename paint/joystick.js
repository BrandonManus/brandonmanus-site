let joy = {
  active: false,
  x: 0,
  y: 0,
  dx: 0,
  dy: 0
};

const joyCon = document.getElementById("joystick-container");
const joyStick = document.getElementById("joystick");

if (/Mobi|Android|iPhone/.test(navigator.userAgent)) {
    joyCon.style.display = "block";
}

function handleStart(e) {
  joy.active = true;
}

function handleEnd(e) {
  joy.active = false;
  joy.dx = 0;
  joy.dy = 0;
  joyStick.style.left = "45px";
  joyStick.style.top = "45px";
}

function handleMove(e) {
  if (!joy.active) return;

  const rect = joyCon.getBoundingClientRect();
  let x = e.touches[0].clientX - rect.left - 70;
  let y = e.touches[0].clientY - rect.top - 70;

  const dist = Math.sqrt(x*x + y*y);
  const max = 50;

  if (dist > max) {
    x = (x / dist) * max;
    y = (y / dist) * max;
  }

  joy.dx = x / max;
  joy.dy = y / max;

  joyStick.style.left = `${45 + x}px`;
  joyStick.style.top = `${45 + y}px`;
}

joyCon.addEventListener("touchstart", handleStart);
joyCon.addEventListener("touchend", handleEnd);
joyCon.addEventListener("touchmove", handleMove);

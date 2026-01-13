const screens = document.querySelectorAll(".screen");
const playArea = document.getElementById("play-area");
const player = document.getElementById("player");
const timeEl = document.getElementById("time");
const msg = document.getElementById("msg");

let enemies = [];
let time = 60;
let timer;
let gameLoop;
let baseSpeed = 2.5;
let spawnDelay = 800;
let died = false; 

function startGame() {
  switchScreen(1);
  time = 60;
  baseSpeed = 2.5;
  spawnDelay = 800;
  died = false;
  timeEl.textContent = time;

  enemies.forEach(e => e.el.remove());
  enemies = [];

  timer = setInterval(() => {
    time--;
    timeEl.textContent = time;
    baseSpeed += 0.2;
    if (time < 30) spawnDelay = 650;
    if (time < 15) spawnDelay = 500;
    if (time <= 0) win();
  }, 1000);

  gameLoop = setInterval(update, 20);
  spawnEnemy();
}

function spawnEnemy() {
  if (time <= 0) return;

  const isCat = Math.random() < 0.15; 
  const enemy = document.createElement("div");
  enemy.className = isCat ? "cat" : "enemy";
  playArea.appendChild(enemy);

  const obj = {
    el: enemy,
    x: Math.random() * (playArea.clientWidth - 30),
    y: -30,
    speed: baseSpeed,
    isCat: isCat,
    angle: Math.random() * Math.PI
  };

  enemy.style.left = obj.x + "px";
  enemies.push(obj);

  setTimeout(spawnEnemy, spawnDelay);
}

function update() {
  enemies.forEach(obj => {
    obj.y += obj.speed;
    obj.el.style.top = obj.y + "px";

    if (isCollide(player, obj.el)) {
      if (obj.isCat) {
        showText("แซลมี่มาให้กําลังจัย 🐱");
        obj.el.remove();
        enemies = enemies.filter(e => e !== obj);
      } else {
        lose();
      }
    }
  });
}

function showText(text) {
  const t = document.createElement("div");
  t.style.position = "absolute";
  t.style.top = "45%";
  t.style.width = "100%";
  t.style.textAlign = "center";
  t.style.fontSize = "20px";
  t.innerText = text;
  playArea.appendChild(t);
  setTimeout(() => t.remove(), 1200);
}

document.addEventListener("mousemove", e => movePlayer(e.clientX));
document.addEventListener("touchmove", e => movePlayer(e.touches[0].clientX));

function movePlayer(x) {
  const rect = playArea.getBoundingClientRect();
  if (x > rect.left && x < rect.right) {
    player.style.left = x - rect.left - 16 + "px";
  }
}

function isCollide(a, b) {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();
  return !(r1.right < r2.left ||
           r1.left > r2.right ||
           r1.bottom < r2.top ||
           r1.top > r2.bottom);
}

function win() {
  clearInterval(timer);
  clearInterval(gameLoop);
  switchScreen(2);
  msg.innerHTML = `
    เก่งมาก!! 💗<br>
    สุขสันต์วันเกิดนะ 🎂
    ${!died ? "<br><br>ขอให้แกมีความสุขมาก ๆ ในทุก ๆ วันนะไม่ใช่แค่วันนี้วันเดียว แต่เป็นทุกวันที่ตื่นขึ้นมาแล้วรู้สึกโอเคกับชีวิต <br><br>ขอให้ปีนี้เป็นปีที่ใจอ่อนโยนกับแกมากขึ้นมีรอยยิ้มเยอะขึ้นและมีเรื่องดี ๆ <br><br>เข้ามาแทนเรื่องที่เคยทำให้เจ็บไม่รู้อนาคตจะเป็นยังไงแต่ขอให้วันนี้เป็นวันที่แกยิ้มได้แค่นั้นก็พอแล้ว  🤍" : ""}
  `;
}

function lose() {
  died = true;
  clearInterval(timer);
  clearInterval(gameLoop);
  alert("กากจัด");
  startGame();
}

function switchScreen(i) {
  screens.forEach(s => s.classList.remove("active"));
  screens[i].classList.add("active");
}

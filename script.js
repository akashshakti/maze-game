const grid = document.getElementById("grid");
const livesDisplay = document.getElementById("lives");
const levelText = document.getElementById("levelText");

// sounds
const clickSound = new Audio("click.mp3");
const wrongSound = new Audio("wrong.mp3");
const winSound = new Audio("win.mp3");

let lives = 3;
let level = parseInt(localStorage.getItem("level")) || 1;
let currentStep = 0;

let correctPath = [];
let arrows = [];

// generate random maze
function generateLevel() {
  correctPath = [];
  arrows = [];

  let pos = 0;
  correctPath.push(pos);

  for (let i = 0; i < 7; i++) {
    let next = pos + [1,5,-1,-5][Math.floor(Math.random()*4)];

    if (next >= 0 && next < 25) {
      correctPath.push(next);
      pos = next;
    }
  }

  for (let i = 0; i < 25; i++) {
    let dirs = ["→","←","↑","↓"];
    arrows.push(dirs[Math.floor(Math.random()*4)]);
  }
}

// create grid
function createGrid() {
  grid.innerHTML = "";
  arrows.forEach((arrow, index) => {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.innerText = arrow;

    cell.onclick = () => handleClick(index, cell);

    grid.appendChild(cell);
  });
}

// click logic
function handleClick(index, cell) {
  if (index === correctPath[currentStep]) {
    clickSound.play();
    cell.classList.add("active");
    currentStep++;

    if (currentStep === correctPath.length) {
      winSound.play();
      level++;
      localStorage.setItem("level", level);

      setTimeout(() => {
        alert("🎉 Level Complete!");
        startGame();
      }, 300);
    }

  } else {
    wrongSound.play();
    lives--;
    updateLives();

    if (lives === 0) {
      alert("💀 Game Over!");
      level = 1;
      localStorage.setItem("level", level);
      startGame();
    } else {
      resetPath();
    }
  }
}

// reset path
function resetPath() {
  currentStep = 0;
  document.querySelectorAll(".cell").forEach(c => c.classList.remove("active"));
}

// reset level
function resetLevel() {
  lives = 3;
  updateLives();
  resetPath();
}

// update lives
function updateLives() {
  livesDisplay.innerText = "❤️".repeat(lives);
}

// swipe control
let startX = 0;
document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
  let endX = e.changedTouches[0].clientX;
  if (endX > startX) autoMove();
});

// simple auto move
function autoMove() {
  let next = correctPath[currentStep];
  let cell = document.querySelectorAll(".cell")[next];
  handleClick(next, cell);
}

// start game
function startGame() {
  lives = 3;
  currentStep = 0;

  generateLevel();
  createGrid();
  updateLives();
  levelText.innerText = "Level " + level;
}

// init
startGame();

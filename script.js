const moveSound = new Audio(
  "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"
);
const winSound = new Audio(
  "https://assets.mixkit.co/active_storage/sfx/1434/1434-preview.mp3"
);
const drawSound = new Audio(
  "https://assets.mixkit.co/active_storage/sfx/1433/1433-preview.mp3"
);

let currentPlayer = "X";
let gameActive = true;
let gameMode = "pvp";
let gameState = ["", "", "", "", "", "", "", "", ""];

const board = document.getElementById("board");
const cells = document.querySelectorAll("[data-cell]");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const pvpModeBtn = document.getElementById("pvp-mode");
const pvcModeBtn = document.getElementById("pvc-mode");

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleCellClick(cell, index));
});

restartBtn.addEventListener("click", restartGame);
pvpModeBtn.addEventListener("click", () => setGameMode("pvp"));
pvcModeBtn.addEventListener("click", () => setGameMode("pvc"));

function handleCellClick(cell, index) {
  if (gameState[index] !== "" || !gameActive) return;

  updateCell(cell, index);
  moveSound.play();

  if (checkWin()) {
    status.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    winSound.play();
    return;
  }

  if (checkDraw()) {
    status.textContent = "Game ended in a draw!";
    gameActive = false;
    drawSound.play();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  status.textContent = `Player ${currentPlayer}'s turn`;

  if (gameMode === "pvc" && currentPlayer === "O" && gameActive) {
    setTimeout(computerMove, 500);
  }
}

function updateCell(cell, index) {
  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
}

function checkWin() {
  return winningCombinations.some((combination) => {
    return combination.every((index) => {
      return gameState[index] === currentPlayer;
    });
  });
}

function checkDraw() {
  return gameState.every((cell) => cell !== "");
}

function computerMove() {
  if (!gameActive) return;

  let bestMove = findBestMove();
  const cell = cells[bestMove];

  updateCell(cell, bestMove);
  moveSound.play();

  if (checkWin()) {
    status.textContent = "Computer wins!";
    gameActive = false;
    winSound.play();
    return;
  }

  if (checkDraw()) {
    status.textContent = "Game ended in a draw!";
    gameActive = false;
    drawSound.play();
    return;
  }

  currentPlayer = "X";
  status.textContent = "Player X's turn";
}

function findBestMove() {
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      gameState[i] = "O";
      if (checkWin()) {
        gameState[i] = "";
        return i;
      }
      gameState[i] = "";
    }
  }

  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      gameState[i] = "X";
      if (checkWin()) {
        gameState[i] = "";
        return i;
      }
      gameState[i] = "";
    }
  }

  if (gameState[4] === "") return 4;

  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((i) => gameState[i] === "");
  if (availableCorners.length > 0) {
    return availableCorners[
      Math.floor(Math.random() * availableCorners.length)
    ];
  }

  const availableSpaces = gameState
    .map((cell, index) => (cell === "" ? index : null))
    .filter((cell) => cell !== null);
  return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
}

function restartGame() {
  currentPlayer = "X";
  gameActive = true;
  gameState = ["", "", "", "", "", "", "", "", ""];
  status.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("x", "o");
  });
}

function setGameMode(mode) {
  gameMode = mode;
  pvpModeBtn.classList.toggle("active", mode === "pvp");
  pvcModeBtn.classList.toggle("active", mode === "pvc");
  restartGame();
}

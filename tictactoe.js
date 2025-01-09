const grid = document.getElementById("grid");
const message = document.getElementById("message");
const resetButton = document.getElementById("reset");
const Player2Button = document.getElementById("multiPlayer");
const Player1Button = document.getElementById("vsBot");
let currentPlayer = "X";
let gameActive = true;
let gridState = Array(9).fill(null);
let botActive = true;

function createGrid() {
  grid.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);

    let isTouching = false;
    cell.addEventListener("touchstart", function (event) {
      if (isTouching) return;
      isTouching = true;
      event.preventDefault();
      handleCellClick(event);
    });
    cell.addEventListener("touchend", function () {
      isTouching = false;
    });

    grid.appendChild(cell);
  }
}

function botMove() {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < 9; i++) {
    if (gridState[i] === null) {
      gridState[i] = "O";
      let score = minimax(gridState, 0, false);
      gridState[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  if (bestMove !== null) {
    gridState[bestMove] = "O";
    const cell = document.querySelector(`[data-index='${bestMove}']`);
    cell.textContent = "O";
    cell.classList.add("o-mark");

    if (checkWin(gridState, "O")) {
      message.textContent = "Bot wins!";
      gameActive = false;
    } else if (gridState.every((cell) => cell !== null)) {
      message.textContent = "It's a draw!";
      gameActive = false;
    } else {
      currentPlayer = "X";
      message.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

function minimax(state, depth, isMaximizing) {
  if (checkWin(state, "O")) return 1;
  if (checkWin(state, "X")) return -1;
  if (state.every((cell) => cell !== null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === null) {
        state[i] = "O";
        let score = minimax(state, depth + 1, false);
        state[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === null) {
        state[i] = "X";
        let score = minimax(state, depth + 1, true);
        state[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function PlayTurn(event) {
  const index = event.target.dataset.index;

  if (gameActive && !gridState[index]) {
    gridState[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    event.target.classList.add(currentPlayer === "X" ? "x-mark" : "o-mark");

    if (checkWin(gridState, currentPlayer)) {
      message.textContent = `Player ${currentPlayer} wins!`;
      gameActive = false;
    } else if (gridState.every((cell) => cell !== null)) {
      message.textContent = "It's a draw!";
      gameActive = false;
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      message.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

function handleCellClick(event) {
  if (botActive) {
    if (currentPlayer === "X") {
      PlayTurn(event);

      if (currentPlayer === "O") {
        setTimeout(() => {
          botMove();
        }, 100);
      }
    }
  } else {
    PlayTurn(event);
  }
}

function toggleButtons(activeButton, inactiveButton) {
  activeButton.classList.add("active");

  inactiveButton.classList.remove("active");
}

function checkWin(state, player) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winPatterns.some((pattern) =>
    pattern.every((index) => state[index] === player)
  );
}

function resetBoard() {
  currentPlayer = "X";
  gameActive = true;
  gridState.fill(null);
  message.textContent = "Player X's turn";
  createGrid();
}

resetButton.addEventListener("click", resetBoard);

Player1Button.addEventListener("click", () => {
  toggleButtons(Player1Button, Player2Button);
  resetBoard();
  botActive = true;
});

Player2Button.addEventListener("click", () => {
  toggleButtons(Player2Button, Player1Button);
  resetBoard();
  botActive = false;
});

createGrid();
toggleButtons(Player1Button, Player2Button);

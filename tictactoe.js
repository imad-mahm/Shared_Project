// script.js
const grid = document.getElementById('grid');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
let currentPlayer = 'X';
let gameActive = true;
let gridState = Array(9).fill(null);

// Initialize the game grid
function creategrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    grid.appendChild(cell);
  }
}

// Handle a player's move
function handleCellClick(event) {
  const index = event.target.dataset.index;

  if (gameActive && !gridState[index]) {
    gridState[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWin()) {
      message.textContent = `Player ${currentPlayer} wins!`;
      gameActive = false;
    } else if (gridState.every(cell => cell)) {
      message.textContent = "It's a draw!";
      gameActive = false;
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      message.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

// Check for a win
function checkWin() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6],            // Diagonals
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => gridState[index] === currentPlayer)
  );
}

// Reset the game
resetButton.addEventListener('click', () => {
  currentPlayer = 'X';
  gameActive = true;
  gridState.fill(null);
  message.textContent = "Player X's turn";
  creategrid();
});

// Start the game
creategrid();

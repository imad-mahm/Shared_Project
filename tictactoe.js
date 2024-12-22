// script.js
const grid = document.getElementById('grid');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
const Player2Button = document.getElementById('multiPlayer');
const Player1Button = document.getElementById('vsBot');
let currentPlayer = 'X'; // Player X starts
let gameActive = true;
let gridState = Array(9).fill(null);
let botActive = true;

// Initialize the game grid
function createGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    let isTouching = false;

    cell.addEventListener('touchstart', function(event) {
        if (isTouching) return; // Prevent multiple calls
        isTouching = true;
        event.preventDefault();
        handleCellClick(event);
    });
    
    cell.addEventListener('touchend', function() {
        isTouching = false; // Reset after touch ends
    });
    grid.appendChild(cell);
  }
}

// Bot's move using the minimax algorithm
function botMove() {
    let bestScore = -Infinity;
    let bestMove = null;
    // Loop through each cell and calculate the best move for the bot
    for (let i = 0; i < 9; i++) {
      if (gridState[i] === null) {
        gridState[i] = 'O'; // Simulate bot's move
        let score = minimax(gridState, 0, false); // Get the score using minimax
        gridState[i] = null; // Undo the move
        if (score > bestScore) {
          bestScore = score;
          bestMove = i; // Save the best move
        }
      }
    }
    
    // Make the best move for the bot and update the grid
    if (bestMove !== null) {
      gridState[bestMove] = 'O';
      document.querySelector(`[data-index='${bestMove}']`).textContent = 'O'; // Update UI
  
      // Check if the bot won after making the move
      if (checkWin(gridState, 'O')) {
        message.textContent = "Bot wins!";
        gameActive = false;
      } else if (gridState.every(cell => cell !== null)) {
        message.textContent = "It's a draw!";
        gameActive = false;
      } else {
        // Switch turn to player X
        currentPlayer = 'X';
        message.textContent = `Player ${currentPlayer}'s turn`;
      }
    }
  }

// Minimax algorithm to evaluate the best possible move
function minimax(state, depth, isMaximizing) {
  if (checkWin(state, 'O')) return 1; // Bot wins
  if (checkWin(state, 'X')) return -1; // Player X wins
  if (state.every(cell => cell !== null)) return 0; // Draw

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === null) {
        state[i] = 'O'; // Bot's move
        let score = minimax(state, depth + 1, false); // Minimize player's score
        state[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === null) {
        state[i] = 'X'; // Player's move
        let score = minimax(state, depth + 1, true); // Maximize bot's score
        state[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function PlayTurn(event){
    const index = event.target.dataset.index;
    
    // If the game is active and the clicked cell is empty, process the move
    if (gameActive && !gridState[index]) {
    gridState[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    // Check for win or draw after player move
    if (checkWin(gridState, currentPlayer)) {
        message.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
    } else if (gridState.every(cell => cell !== null)) {
        message.textContent = "It's a draw!";
        gameActive = false;
    } else {
        // Switch turn to the other player (bot or human)
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `Player ${currentPlayer}'s turn`; 
        }
    }
}

// Handle player's click on a cell
function handleCellClick(event) {
    if(botActive){
        if(currentPlayer === 'X'){
            PlayTurn(event);
            // If it's the bot's turn, make the bot move
            if (currentPlayer === 'O') {
            setTimeout(() => { // Add delay to simulate bot thinking
                botMove();
            }, 100); // Delay for 100ms for better user experience
            }
        }
    }
    const index = event.target.dataset.index;
    
        // If the game is active and the clicked cell is empty, process the move
        if (gameActive && !gridState[index]) {
        gridState[index] = currentPlayer;
        event.target.textContent = currentPlayer;
    
        // Check for win or draw after player move
        if (checkWin(gridState, currentPlayer)) {
            message.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
        } else if (gridState.every(cell => cell !== null)) {
            message.textContent = "It's a draw!";
            gameActive = false;
        } else {
            // Switch turn to the other player (bot or human)
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            message.textContent = `Player ${currentPlayer}'s turn`;
        }
    }
}   


// Check for a winning condition
function checkWin(state, player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6],            // Diagonals
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => state[index] === player)
  );
}

function resetBoard(){
    currentPlayer = 'X';
    gameActive = true;
    gridState.fill(null);
    message.textContent = "Player X's turn";
    createGrid(); // Reinitialize the grid
}
// Reset the game when the reset button is clicked
resetButton.addEventListener('click', resetBoard);

Player1Button.addEventListener('click', () => {
    resetBoard();
    botActive = true;
});

Player2Button.addEventListener('click', () => {
    resetBoard();
    botActive = false;
})

// Start the game
createGrid();

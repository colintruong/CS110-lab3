// Empty board when loaded, will map values to the table when users click to play the game
const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

// Store win patterns to check against the current board
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows, columns, and diagonals...
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
];

// X always starts, even against the AI. The game's status will be set to false if the status function detects a tie
let currentUser = "X";
let gameStatus = true;

// Possible mappings of user input
const cellMap = {
  one: [0, 0],
  two: [0, 1],
  three: [0, 2],
  four: [1, 0],
  five: [1, 1],
  six: [1, 2],
  seven: [2, 0],
  eight: [2, 1],
  nine: [2, 2]
};

// For each cell, if it is clicked, execute the userMove function ()
document.querySelectorAll(".game_board div div").forEach(cell => {
  cell.addEventListener("click", userMove);
});

updateTurn();

// Clicking either reset, or new_game simply resets all the cells and text. 
document.querySelector(".reset").addEventListener("click", resetGame);
document.querySelector(".new_game").addEventListener("click", resetGame);

// Required functions to make the tic tac toe work. This implementation is strictly for PVP, will implement AI later. 

function userMove(e) {
    // Basic game logic, allow a user to select a cell, then check if there is a winner. Then check if there is a tie. Then alternate the player.
    if (!gameStatus) {
        return;
    }

    const cell = e.currentTarget;
    const cellClass = cell.classList[0]; // "one", "two", etc.
    const [row, col] = cellMap[cellClass];

    // prevent same cell from being clicked
    if (board[row][col] !== "") {
        return;
    }

    board[row][col] = currentUser;

    cell.querySelector(".xo").textContent = currentUser;

    // Check if there is a win or tie
    if (winChecker()) {
        document.querySelector(".display_player").textContent = `${currentUser} wins!`;
        gameStatus = false;
        return;
    }

    if (tieChecker()) {
        document.querySelector(".display_player").textContent = `The game is a tie!`;
        gameStatus = false;
        return;
    }

    // Switch the player
    currentUser = currentUser === "X" ? "O" : "X";
    updateTurn();
}

function updateTurn() {
    document.querySelector(".display_player").textContent = currentUser;
}

function tieChecker() {
  return board.flat().every(cell => cell !== "") && !winChecker();
}

function winChecker() {
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern; // This gets all possible win patters and tests them against the current board

    // Since the winPatterns array is 1D, we need to convert our 2D array to the indices we're given.

    // Example: 

    // 0 | 1 | 2
    // ---------
    // 3 | 4 | 5
    // ---------
    // 6 | 7 | 8

    // To get 5, we do 5 / 3 = 1, and 5 % 3 = 2, leaving [1, 2]. This matches the grid we have!

    const [r1, c1] = [Math.floor(a / 3), a % 3];
    const [r2, c2] = [Math.floor(b / 3), b % 3];
    const [r3, c3] = [Math.floor(c / 3), c % 3];

    // Checks if all the symbols in a row/column/diagonal are the same symbol and non-empty (X or O)
    return board[r1][c1] && board[r1][c1] === board[r2][c2] && board[r2][c2] === board[r3][c3];
  });
}

function resetGame() {
  // reset board
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      board[r][c] = "";
    }
  }

  // clear UI
  document.querySelectorAll(".xo").forEach(cell => {
    cell.textContent = "";
  });

  currentUser = "X";
  gameStatus = true;
  updateTurn();
}





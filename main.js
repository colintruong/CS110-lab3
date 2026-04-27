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

let x_wins = 0;
let o_wins = 0;

let gameMode = null; // "pvp" or "ai"

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

document.getElementById("btn-pvp").addEventListener("click", () => {
  gameMode = "pvp";
  document.getElementById("mode-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  updateTurn();
});

document.getElementById("btn-ai").addEventListener("click", () => {
  gameMode = "ai";
  document.getElementById("mode-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  updateTurn();
});

// For each cell, if it is clicked, execute the userMove function ()
document.querySelectorAll(".game_board div div").forEach(cell => {
  cell.addEventListener("click", userMove);
});

// Clicking either reset, or new_game simply resets all the cells and text. 
document.querySelector(".reset").addEventListener("click", resetGame);
document.querySelector(".new_game").addEventListener("click", newGame);

// Required functions to make the tic tac toe work.

function userMove(e) {
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
        if (currentUser === "X") {
            x_wins++;
            document.querySelector(".x_wins").textContent = x_wins;
        } else {
            o_wins++;
            document.querySelector(".o_wins").textContent = o_wins;
        }
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

    if (gameMode === "ai" && currentUser === "O" && gameStatus) {
        aiMove();
    }
}

function updateTurn() {
    document.querySelector(".display_player").textContent = currentUser;
}

function tieChecker() {
  return board.flat().every(cell => cell !== "") && !winChecker();
}

function winChecker() {
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;

    const [r1, c1] = [Math.floor(a / 3), a % 3];
    const [r2, c2] = [Math.floor(b / 3), b % 3];
    const [r3, c3] = [Math.floor(c / 3), c % 3];

    return board[r1][c1] && board[r1][c1] === board[r2][c2] && board[r2][c2] === board[r3][c3];
  });
}

function newGame() {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      board[r][c] = "";
    }
  }

  document.querySelectorAll(".xo").forEach(cell => {
    cell.textContent = "";
  });

  currentUser = "X";
  gameStatus = true;
  updateTurn();
}

function resetGame() {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      board[r][c] = "";
    }
  }

  document.querySelectorAll(".xo").forEach(cell => {
    cell.textContent = "";
  });

  currentUser = "X";
  gameStatus = true;
  x_wins = 0;
  o_wins = 0;
  document.querySelector(".x_wins").textContent = x_wins;
  document.querySelector(".o_wins").textContent = o_wins;
  updateTurn();
}

const ai = "O";
const human = "X";

function isMovesLeft(board) {
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (board[i][j] === "")
                return true;
    return false;
}

function evaluate(b) {
    // Check rows
    for (let row = 0; row < 3; row++) {
        if (b[row][0] === b[row][1] && b[row][1] === b[row][2]) {
            if (b[row][0] === ai)
              return +10;
            if (b[row][0] === human)
              return -10;
        }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
        if (b[0][col] === b[1][col] && b[1][col] === b[2][col]) {
            if (b[0][col] === ai)
              return +10;
            if (b[0][col] === human)
              return -10;
        }
    }

    // Check diagonals
    if (b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
        if (b[0][0] === ai)
          return +10;
        if (b[0][0] === human)
          return -10;
    }
    if (b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
        if (b[0][2] === ai)
          return +10;
        if (b[0][2] === human)
          return -10;
    }

    return 0;
}

function minimax(board, depth, isMax) {
    let score = evaluate(board);

    if (score === 10)
      return score;
    if (score === -10)
      return score;
    if (!isMovesLeft(board)) return 0;

    if (isMax) {
        let best = -1000;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {           // adapted: "" instead of '_'
                    board[i][j] = ai;               // adapted: ai instead of player
                    best = Math.max(best, minimax(board, depth + 1, !isMax));
                    board[i][j] = "";               // adapted: "" instead of '_'
                }
            }
        }
        return best;
    } else {
        let best = 1000;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {           // adapted: "" instead of '_'
                    board[i][j] = human;            // adapted: human instead of opponent
                    best = Math.min(best, minimax(board, depth + 1, !isMax));
                    board[i][j] = "";               // adapted: "" instead of '_'
                }
            }
        }
        return best;
    }
}

function findBestMove(board) {
    let bestVal = -1000;
    let bestMove = { row: -1, col: -1 };

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === "") {               // adapted: "" instead of '_'
                board[i][j] = ai;                   // adapted: ai instead of player
                let moveVal = minimax(board, 0, false);
                board[i][j] = "";                   // adapted: "" instead of '_'
                if (moveVal > bestVal) {
                    bestVal = moveVal;
                    bestMove.row = i;
                    bestMove.col = j;
                }
            }
        }
    }
    return bestMove;
}

function aiMove() {
    const bestMove = findBestMove(board);

    const cellName = Object.keys(cellMap).find(key => {
        const [r, c] = cellMap[key];
        return r === bestMove.row && c === bestMove.col;
    });
    const cellEl = document.querySelector(`.${cellName}`);

    board[bestMove.row][bestMove.col] = "O";
    cellEl.querySelector(".xo").textContent = "O";

    if (winChecker()) {
        document.querySelector(".display_player").textContent = `O wins!`;
        gameStatus = false;
        o_wins++;
        document.querySelector(".o_wins").textContent = o_wins;
        return;
    }

    if (tieChecker()) {
        document.querySelector(".display_player").textContent = `The game is a tie!`;
        gameStatus = false;
        return;
    }

    currentUser = "X";
    updateTurn();
}
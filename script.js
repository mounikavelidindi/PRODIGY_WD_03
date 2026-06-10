let gameBoard = ["", "", "", "", "", "", "", "", ""]; // 9 boxes
let gameActive = true;
const humanPlayer = "X";
const aiPlayer = "O";

const statusDisplay = document.querySelector(".status");
const cells = document.querySelectorAll(".cell");

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener("click", cellClicked);
});

function cellClicked(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute("data-index"));

    if (gameBoard[index]!== "" ||!gameActive || statusDisplay.textContent === "AI Thinking...") {
        return;
    }

    makeMove(index, humanPlayer);

    if (checkWinner(humanPlayer)) {
        statusDisplay.textContent = "You Win! 🎉";
        gameActive = false;
        return;
    }

    if (isBoardFull()) {
        statusDisplay.textContent = "Draw! 🤝";
        gameActive = false;
        return;
    }

    statusDisplay.textContent = "AI Thinking...";
    setTimeout(() => {
        let bestMove = minimax(gameBoard, aiPlayer).index;
        makeMove(bestMove, aiPlayer);

        if (checkWinner(aiPlayer)) {
            statusDisplay.textContent = "AI Wins! 🤖";
            gameActive = false;
            return;
        }

        if (isBoardFull()) {
            statusDisplay.textContent = "Draw! 🤝";
            gameActive = false;
            return;
        }

        statusDisplay.textContent = "Your Turn";
    }, 500);
}

function makeMove(index, player) {
    gameBoard[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add(player.toLowerCase());
}

function checkWinner(player) {
    for (let condition of winConditions) {
        let [a, b, c] = condition;
        if (gameBoard[a] === player && gameBoard[b] === player && gameBoard[c] === player) {
            return true;
        }
    }
    return false;
}

function isBoardFull() {
    return!gameBoard.includes("");
}

// Minimax Algorithm - AI Brain
function minimax(board, player) {
    let emptySpots = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            emptySpots.push(i);
        }
    }

    // Base cases
    if (checkWinnerAI(board, humanPlayer)) {
        return { score: -10 };
    } else if (checkWinnerAI(board, aiPlayer)) {
        return { score: 10 };
    } else if (emptySpots.length === 0) {
        return { score: 0 };
    }

    let moves = [];

    for (let i = 0; i < emptySpots.length; i++) {
        let move = {};
        move.index = emptySpots[i];

        board[emptySpots[i]] = player;

        if (player === aiPlayer) {
            let result = minimax(board, humanPlayer);
            move.score = result.score;
        } else {
            let result = minimax(board, aiPlayer);
            move.score = result.score;
        }

        board[emptySpots[i]] = ""; // undo move
        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWinnerAI(board, player) {
    for (let condition of winConditions) {
        let [a, b, c] = condition;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    statusDisplay.textContent = "Your Turn";

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o");
    });
}
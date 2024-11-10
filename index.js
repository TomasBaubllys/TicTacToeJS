const Player = (name, marker) => {
    return {name, marker}
}

const Gameboard = () => {
    let board = Array(9).fill(null);

    // resets the gameboard back to empty
    const reset = () => {
        board = Array(9).fill(null);
    }

    // marks the board with the specifiend marker and index
    const mark = (index, marker) => {
        if(board[index] == null) {
            board[index] = marker;
        };
    }

    // return a shallow copy of the board
    const getBoard = () => {
        return [...board];
    }

    const get = (index) => {
        if(index < board.length) {
            return board[index];
        }

        return null
    }

    return {get, reset, mark, getBoard};
}

const GameController = () => {
    const player1 = Player("Player1", "O");
    const player2 = Player("Player2", "X");
    const board = Gameboard();

    let currentPlayer = player1

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1? player2 : player1;
        document.getElementById("Msg").textContent = `${currentPlayer.name} ${currentPlayer === player1? ' tics' : ' tacs'}` ; 
    }

    const mark = (index) => {
        board.mark(index, currentPlayer.marker);
    }

    const checkForWin = () => {
        const wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
            [0, 4, 8], [2, 4, 6]              // Diagonals
        ];

        for(let win of wins) {
            let [a, b, c] = win
            if(board.get(a) != null && board.get(a) === board.get(b) && board.get(a) === board.get(c)) {
                return currentPlayer;
            }
        }

        for(let i = 0; i < 9; ++i) {
            if(board.get(i) == null) {
                return null;
            }
        }

        const draw = Player("Draw", "how did we get here????");

        return draw;
    }

    const getCurrentMarker = () => {
        return currentPlayer.marker
    }

    const reset = () => {
        board.reset();
        currentPlayer = player1;
        
        resetPointerEvents();
    
        document.getElementById("Msg").textContent = `${player1.name} tics`; 
        
    }

    const resetPointerEvents = () => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = ''; // Clear the cell content
            cell.style.pointerEvents = 'all'; // Re-enable clicking if necessary
        });
    }

    return {switchPlayer, mark, checkForWin, getCurrentMarker, reset, resetPointerEvents};
}


function initHtmlGrid() {
    const grid = document.getElementById('Game');
    for(let i = 0; i < 9; ++i) {
        const square = document.createElement('div');
        square.classList.add('cell');
        square.dataset.index = i; // Store the index of the cell
        grid.appendChild(square);
    }
}

function updateCell(index, marker) {
    const cell = document.querySelector(`[data-index='${index}']`);
    if (cell) {
        cell.textContent = marker;
        cell.style.pointerEvents = 'none'; // Disable clicking on already marked cells
    }
}

function startGame() {
    let gameOver = false;

    const gameController = GameController();
    const grid = document.getElementById('Game');
    
    grid.addEventListener('click', (event) => {
        if (!event.target.classList.contains('cell')) return; // Ensure only cells are clickable
        
        if(gameOver) {
            gameController.reset();
            gameOver = false;
            return;
        }

        const index = event.target.dataset.index;
        
        if (!event.target.textContent) {
            gameController.mark(index);
            updateCell(index, gameController.getCurrentMarker());
            
            const winner = gameController.checkForWin();
            // Check for a winner after each move
            console.log(winner);
            if (winner != null) {
                document.getElementById("Msg").innerHTML = `${winner.name} TOESSSS! <br> Press any cell to play again!`;
                
                const cells = document.querySelectorAll('.cell');
                cells.forEach(cell => {
                    cell.style.pointerEvents = 'auto'; // Re-enable clicking and hovering
                });


                gameOver = true;
                return;
            }
            
            gameController.switchPlayer();
        }
    });
}

initHtmlGrid();
startGame();
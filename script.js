class SnakesAndLadders {
    constructor() {
        this.currentPlayer = 1;
        this.player1Position = 1;
        this.player2Position = 1;
        this.gameOver = false;
        this.boardSize = 100;
        
        // Define snakes and ladders with steps (positive for up, negative for down)
        this.snakes = {
            16: -10,    // Go down 10 steps
            43: -25,    // Go down 25 steps
            36: -21,    // Go down 21 steps
            75: -21,    // Go down 21 steps
            53: -20,    // Go down 20 steps
            89: -17,    // Go down 17 steps
            98: -21     // Go down 21 steps
        };
        
        this.ladders = {
            4: 20,     // Go up 20 steps
            13: 15,    // Go up 15 steps
            35: 11,    // Go up 11 steps
            51: 19,    // Go up 19 steps
            64: 21,    // Go up 21 steps
            73: 15,    // Go up 15 steps
            81: 19     // Go up 19 steps
        };

        this.initializeGame();
    }

    initializeGame() {
        this.createBoard();
        this.setupEventListeners();
        this.updatePlayerPositions();
        this.updateMessage("Player 1's turn");
    }

    createBoard() {
        const board = document.getElementById('board');
        let cellNumber = this.boardSize;
        
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.id = `cell-${cellNumber}`;
                cell.innerHTML = `<span>${cellNumber}</span>`;
                
                // Add snake image if this cell is a snake head
                if (this.snakes[cellNumber]) {
                    cell.classList.add('snake-cell');
                    const snakeImage = document.createElement('div');
                    snakeImage.className = 'snake-image';
                    cell.appendChild(snakeImage);
                }
                
                // Add ladder image if this cell is a ladder bottom
                if (this.ladders[cellNumber]) {
                    cell.classList.add('ladder-cell');
                    const ladderImage = document.createElement('div');
                    ladderImage.className = 'ladder-image';
                    cell.appendChild(ladderImage);
                }
                
                board.appendChild(cell);
                cellNumber--;
            }
        }
    }

    setupEventListeners() {
        const rollButton = document.getElementById('rollDice');
        rollButton.addEventListener('click', () => this.rollDice());
    }

    rollDice() {
        if (this.gameOver) return;
        
        const diceElement = document.querySelector('.dice');
        const rollButton = document.getElementById('rollDice');
        
        rollButton.disabled = true;
        diceElement.classList.add('rolling');
        
        setTimeout(() => {
            const roll = Math.floor(Math.random() * 6) + 1;
            diceElement.textContent = roll;
            diceElement.classList.remove('rolling');
            
            this.movePlayer(roll);
            rollButton.disabled = false;
        }, 600);
    }

    movePlayer(diceRoll) {
        if (this.gameOver) return;
        
        const currentPosition = this.currentPlayer === 1 ? this.player1Position : this.player2Position;
        let newPosition = currentPosition + diceRoll;
        
        if (newPosition > this.boardSize) {
            this.updateMessage("Too high! Next player's turn");
            this.switchPlayer();
            return;
        }

        // Animate the initial dice roll movement
        this.animateMovement(currentPosition, newPosition, () => {
            // Check for snakes
            if (this.snakes[newPosition]) {
                const steps = this.snakes[newPosition];
                const finalPosition = newPosition + steps;
                
                this.updateMessage(`Oops! Snake at ${newPosition}! Going down ${Math.abs(steps)} steps...`);
                
                // Animate snake movement after a short delay
                setTimeout(() => {
                    this.animateStepByStep(newPosition, finalPosition, -1, () => {
                        this.updateFinalPosition(finalPosition);
                    });
                }, 500);
            }
            // Check for ladders
            else if (this.ladders[newPosition]) {
                const steps = this.ladders[newPosition];
                const finalPosition = newPosition + steps;
                
                this.updateMessage(`Yay! Ladder at ${newPosition}! Going up ${steps} steps...`);
                
                // Animate ladder movement after a short delay
                setTimeout(() => {
                    this.animateStepByStep(newPosition, finalPosition, 1, () => {
                        this.updateFinalPosition(finalPosition);
                    });
                }, 500);
            }
            else {
                this.updateFinalPosition(newPosition);
            }
        });
    }

    animateStepByStep(start, end, direction, callback) {
        let current = start;
        const interval = setInterval(() => {
            current += direction;
            
            // Update the player position for animation
            if (this.currentPlayer === 1) {
                this.player1Position = current;
            } else {
                this.player2Position = current;
            }
            this.updatePlayerPositions();

            // Check if we've reached the destination
            if ((direction > 0 && current >= end) || (direction < 0 && current <= end)) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 100); // Adjust speed of animation here (100ms per step)
    }

    animateMovement(start, end, callback) {
        this.animateStepByStep(start, end, 1, callback);
    }

    updateFinalPosition(position) {
        if (this.currentPlayer === 1) {
            this.player1Position = position;
        } else {
            this.player2Position = position;
        }
        
        this.updatePlayerPositions();

        // Check for winner
        if (position === this.boardSize) {
            this.gameOver = true;
            this.updateMessage(`Player ${this.currentPlayer} wins!`);
            return;
        }

        this.switchPlayer();
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        setTimeout(() => {
            this.updateMessage(`Player ${this.currentPlayer}'s turn`);
        }, 1000);
    }

    updatePlayerPositions() {
        document.querySelector('.player1 .player-position').textContent = `Position: ${this.player1Position}`;
        document.querySelector('.player2 .player-position').textContent = `Position: ${this.player2Position}`;
        
        this.updatePlayerPiece(1, this.player1Position);
        this.updatePlayerPiece(2, this.player2Position);
    }

    updatePlayerPiece(playerNum, position) {
        const existingPiece = document.querySelector(`.player${playerNum}-piece`);
        if (existingPiece) {
            existingPiece.remove();
        }
        
        const cell = document.getElementById(`cell-${position}`);
        if (cell) {
            const piece = document.createElement('div');
            piece.className = `player-piece player${playerNum}-piece`;
            cell.appendChild(piece);
        }
    }

    updateMessage(message) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = message;
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new SnakesAndLadders();
});

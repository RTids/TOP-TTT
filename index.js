const Gameboard = (() => {
	//Creates an empty array of 9 spaces for our board
	let gameboard = Array(9).fill('');
	let selectColours = Array(9).fill('');

	//Here we will render the board and player names
	const render = () => {
		let boardHTML = '';
		gameboard.forEach((square, index) => {
			boardHTML += `<div class='square' id='square-${index}' style="color: ${selectColours[index]}">${square}</div>`;
		});
		document.querySelector('#board').innerHTML = boardHTML;
		//We attach the event listeners to each square on the baord
		const squares = document.querySelectorAll('.square');
		squares.forEach((square) => {
			square.addEventListener('click', Game.handleClick);
		});
	};

	const updateBoard = (index, playSymbol, colour) => {
		gameboard[index] = playSymbol;
		selectColours[index] = colour;
		render();
	};

	const getGameboard = () => gameboard;

	return {
		render,
		updateBoard,
		getGameboard,
	};
})();

//Create Player factory
const createPlayer = (name, symbol) => {
	return { name, symbol };
};

const Game = (() => {
	let players = [];
	let currentPlayerIndex;
	let gameOver;
	const playerOneNameInput = document.getElementById('playerOneNameInput');
	const playerTwoNameInput = document.getElementById('playerTwoNameInput');

	const start = () => {
		players = [
			createPlayer(playerOneNameInput.value || 'Player 1', 'X'),
			createPlayer(playerTwoNameInput.value || 'Player 2', 'O'),
		];
		currentPlayerIndex = 0;
		gameOver = false;
		Gameboard.render();
		//We are displaying the names of the players above the board, if there is not a name inputted, we defualt
		//to Player 1 or 2.
		document.querySelector('#playersSelected').textContent = `${
			playerOneNameInput.value ? players[0].name : 'Player 1'
		} vs ${playerTwoNameInput.value ? players[1].name : 'Player 2'}`;
		playerOneNameInput.value = '';
		playerTwoNameInput.value = '';
		document.querySelector('#start').style.display = 'none';
		document.querySelector('#restart').style.display = 'block';
	};

	//Here is the logic to restart the game
	const restart = () => {
		gameOver = false;
		for (i = 0; i < 9; i++) {
			Gameboard.updateBoard([i], '');
		}
		Gameboard.render();
	};

	const checkForWin = (gameboard) => {
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
		for (let i = 0; i < winningCombinations.length; i++) {
			const [a, b, c] = winningCombinations[i];
			if (
				gameboard[a] &&
				gameboard[a] === gameboard[b] &&
				gameboard[a] === gameboard[c]
			) {
				return true;
			}
		}
		return false;
	};

	const checkForDraw = (gameboard) => !gameboard.includes('');

	//Here we handle the click of each square, swapping the player index/turn on each click,
	//and then sending the correct play symbol to our gameboard array via the updateBoard function
	const handleClick = async (e) => {
		const index = parseInt(e.target.id.split('-')[1]);
		if (Gameboard.getGameboard()[index] !== '' || gameOver) {
			return;
		}

		let colour = currentPlayerIndex === 0 ? '#cc00cc' : '#2222ee';

		//Here we have created a promise that must resolve first, before we check for win/draw conditions
		//This is due to the board not visually updating before showing us the winner.
		await new Promise((resolve) => {
			Gameboard.updateBoard(index, players[currentPlayerIndex].symbol, colour);
			setTimeout(resolve, 0);
		});

		//Check for win
		if (checkForWin(Gameboard.getGameboard())) {
			gameOver = true;
			alert(`${players[currentPlayerIndex].name} has won!`);
			return;
		}

		//Check for a draw
		if (!gameOver && checkForDraw(Gameboard.getGameboard())) {
			gameOver = true;
			alert('Draw!');
			return;
		}

		//Change the player turn
		currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
	};

	return {
		start,
		handleClick,
		restart,
	};
})();

const startButton = document
	.querySelector('#start')
	.addEventListener('click', () => {
		Game.start();
	});

const restartButton = document
	.querySelector('#restart')
	.addEventListener('click', () => {
		Game.restart();
	});

const Gameboard = (() => {
	//Creates an empty array of 9 spaces for our board
	let gameboard = ['', '', '', '', '', '', '', '', ''];

	//Here we will render the board and player names
	const render = () => {
		let boardHTML = '';
		gameboard.forEach((square, index) => {
			boardHTML += `<div class='square' id=square-${index}>${square}</div>`;
		});
		document.querySelector('#board').innerHTML = boardHTML;
	};
	return {
		render,
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
			createPlayer(playerOneNameInput.value, 'X'),
			createPlayer(playerTwoNameInput.value, 'O'),
		];
		currentPlayerIndex = 0;
		gameOver = false;
		Gameboard.render();
		document.querySelector('#playersSelected').textContent = `${playerOneNameInput.value ? players[0].name : 'Player 1'} vs ${playerTwoNameInput.value ? players[1].name : 'Player 2'}`;
		playerOneNameInput.value = '';
		playerTwoNameInput.value = '';
		document.querySelector('#startButton').textContent = 'Restart';
	};
	return {
		start,
	};
})();

const startButton = document
	.querySelector('#startButton')
	.addEventListener('click', () => {
		Game.start();
	});

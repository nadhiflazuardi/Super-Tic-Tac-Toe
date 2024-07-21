import { useState } from "react";

// Function component representing each square on the board
// Props:
// - value: displayed as the button's value
// - onSquareClick: handler for button click events
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Function component representing the tic-tac-toe board
// Props:
// - xIsNext: boolean indicating if the next player is X
// - squares: array of values ("X", "O", or null) representing the board
// - onPlay: handler for when a player makes a move
function Board({ xIsNext, squares, onPlay, turn }) {
  // Handle square click event
  // Parameter: index of the clicked square
  function handleClick(i) {
    // Return early if the square is already filled
    if (squares[i]) {
      return;
    }
    // Create a copy of the squares array
    const nextSquares = squares.slice();
    // Set the value of the clicked square based on xIsNext
    nextSquares[i] = xIsNext ? "X" : "O";
    // Call the onPlay handler with the updated squares array
    onPlay(nextSquares);
  }

  // Determine the game status
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className='turn'>You are at move #{turn}</div>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// Main function component representing the tic-tac-toe game
// Manages the state and logic for the game
export default function Game() {
  // State to store the history of all moves (arrays of squares)
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // State to store the current move index
  const [currentMove, setCurrentMove] = useState(0);
  // Boolean indicating if X is the next player (X plays on even moves)
  const xIsNext = currentMove % 2 === 0;
  // Get the current squares from the history based on the current move
  const currentSquares = history[currentMove];

  // Handle play event
  // Parameter: array of squares representing the board after a move
  function handlePlay(nextSquares) {
    // Add the new board state to the history (up to current move + 1)
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    // Update the current move to the latest move in the history
    setCurrentMove(nextHistory.length - 1);
  }

  // Handle time travel event
  // Parameter: move index to jump to
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Create the list of past moves for the time travel feature
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    if (move !== currentMove && move > 0 || move === 0) {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} turn={currentMove} />
      </div>
      <div className="game-info">
        <ul>{moves}</ul>
      </div>
    </div>
  );
}

// Helper function to determine the winner of the game
// Parameter: array of squares representing the board
// Returns: "X", "O", or null based on the winning condition
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

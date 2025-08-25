import { useState, useEffect } from 'react';

export default function App() {
  const [gameMode, setGameMode] = useState(null);

  const renderGameMode = () => {
    switch (gameMode) {
      case 'pvp':
        return <TwoPlayerGame onBackToMenu={() => setGameMode(null)} />;
      case 'pvc':
        return <SinglePlayerGame onBackToMenu={() => setGameMode(null)} />;
      default:
        return <GameMenu onSelectMode={setGameMode} />;
    }
  };

  return (
     <div className='h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-slate-950 font-sans p-4'>
        {renderGameMode()}
     </div>
  );
}

function GameMenu({ onSelectMode }) {
  return (
    <>
      <h1 className='text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-12 text-center'>
        TIC TAC TOE
      </h1>
      <div className="flex flex-col space-y-4">
        <button 
          onClick={() => onSelectMode('pvc')}
          className="h-16 w-64 rounded-xl text-slate-200 bg-blue-600 text-2xl font-semibold transition-transform duration-200 hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/30"
        >
          Player vs. Computer
        </button>
        <button 
          onClick={() => onSelectMode('pvp')}
          className="h-16 w-64 rounded-xl text-slate-200 bg-teal-600 text-2xl font-semibold transition-transform duration-200 hover:bg-teal-500 hover:scale-105 active:scale-95 shadow-lg shadow-teal-600/30"
        >
          Player vs. Player
        </button>
      </div>
    </>
  );
}


function Square({ value, onSquareClick }) {
  return (
    <button
      className="h-24 w-24 border text-zinc-300 border-white text-4xl font-bold m-1 rounded-2xl flex items-center justify-center transition-transform duration-200 hover:shadow-xl hover:shadow-blue-400/30 hover:scale-105"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}


function SinglePlayerGame({ onBackToMenu }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // Player 'X' is human

  useEffect(() => {
    if (!isXNext && !calculateWinner(squares) && !isBoardFull(squares)) {
      const timer = setTimeout(() => {
        const bestMove = findBestMove(squares);
        if (bestMove !== null) {
          handleComputerMove(bestMove);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isXNext, squares]);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares) || !isXNext) return;
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
    setIsXNext(false);
  }

  function handleComputerMove(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'O';
    setSquares(nextSquares);
    setIsXNext(true);
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  }

  function findBestMove(currentSquares) {
    let bestScore = -Infinity;
    let move = null;
    for (let i = 0; i < currentSquares.length; i++) {
      if (currentSquares[i] === null) {
        currentSquares[i] = 'O';
        let score = minimax(currentSquares, 0, false);
        currentSquares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function minimax(currentSquares, depth, isMaximizing) {
    const winner = calculateWinner(currentSquares);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (isBoardFull(currentSquares)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < currentSquares.length; i++) {
        if (currentSquares[i] === null) {
          currentSquares[i] = 'O';
          let score = minimax(currentSquares, depth + 1, false);
          currentSquares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < currentSquares.length; i++) {
        if (currentSquares[i] === null) {
          currentSquares[i] = 'X';
          let score = minimax(currentSquares, depth + 1, true);
          currentSquares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isBoardFull(squares)) {
    status = "It's a Tie!";
  } else if (isXNext) {
    status = `Turn: Player (X)`;
  } else {
    status = `Computer Playing...`;
  }
  
  return <BoardUI squares={squares} onSquareClick={handleClick} status={status} onReset={resetGame} onBackToMenu={onBackToMenu} />;
}

// --- Player vs. Player Game Component ---
function TwoPlayerGame({ onBackToMenu }) {
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);

    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = isXNext ? 'X' : 'O';
        setSquares(nextSquares);
        setIsXNext(!isXNext);
    }

    function resetGame() {
        setSquares(Array(9).fill(null));
        setIsXNext(true);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = `Winner: ${winner}`;
    } else if (isBoardFull(squares)) {
        status = "It's a Tie!";
    } else {
        status = `Next Player: ${isXNext ? 'X' : 'O'}`;
    }

    return <BoardUI squares={squares} onSquareClick={handleClick} status={status} onReset={resetGame} onBackToMenu={onBackToMenu} />;
}


function BoardUI({ squares, onSquareClick, status, onReset, onBackToMenu }) {
  return (
    <>
      <h1 className='text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-12 text-center'>
        TIC TAC TOE
      </h1>
      <div className="text-3xl font-bold mb-4 text-zinc-200 animate-bounce">{status}</div>
      <div className=" p-4 rounded-2xl shadow-lg">
        <div className="flex">
          <Square value={squares[0]} onSquareClick={() => onSquareClick(0)} />
          <Square value={squares[1]} onSquareClick={() => onSquareClick(1)} />
          <Square value={squares[2]} onSquareClick={() => onSquareClick(2)} />
        </div>
        <div className="flex">
          <Square value={squares[3]} onSquareClick={() => onSquareClick(3)} />
          <Square value={squares[4]} onSquareClick={() => onSquareClick(4)} />
          <Square value={squares[5]} onSquareClick={() => onSquareClick(5)} />
        </div>
        <div className="flex">
          <Square value={squares[6]} onSquareClick={() => onSquareClick(6)} />
          <Square value={squares[7]} onSquareClick={() => onSquareClick(7)} />
          <Square value={squares[8]} onSquareClick={() => onSquareClick(8)} />
        </div>
      </div>
      <div className="flex space-x-4 mt-8">
        <button
          onClick={onReset}
          className='h-12 w-32 rounded-xl text-slate-200 bg-blue-600 text-2xl font-semibold transition-transform duration-200 hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/30'
        >
          Reset
        </button>
        <button
          onClick={onBackToMenu}
          className='h-12 w-32 rounded-xl text-slate-200 bg-gray-600 text-2xl font-semibold transition-transform duration-200 hover:bg-gray-500 hover:scale-105 active:scale-95 shadow-lg shadow-gray-600/30'
        >
          Menu
        </button>
      </div>
    </>
  );
}



function isBoardFull(squares) {
  return squares.every(square => square !== null);
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

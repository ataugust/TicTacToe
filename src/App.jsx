import { useState } from 'react'

export default function Board() {
  
  function Square({value, onSquareClick})
  {
    return (<button className="h-24 w-24 border text-zinc-300 border-white text-4xl font-bold m-1 rounded-2xl hover:shadow-xl hover:shadow-blue-300 hover:scale-103" onClick={onSquareClick}>{value}</button>)
  }

  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  let result;
  function handleClick(i)
  {
    if(squares[i] || calculateWinner(squares)) return;
    const nextSquare = squares.slice()
    nextSquare[i] = xIsNext ? 'X' : 'O'
    setSquares(nextSquare);
    setXIsNext(!xIsNext)
  }
  function reset()
  {
    let newSquares = Array(9).fill(null);
    setSquares(newSquares);
    setXIsNext(true);
  }

  const winner =  calculateWinner(squares);
  if(winner)
  {
    result = "Winner is : "+winner;
  }
  else if(checkTie(squares))
  {
    result = "Its a Tie";
  }
  else{
    result = "Next player : "+(xIsNext ? "X": "O")
  }
function checkTie(squares)
{
  for(let i=0;i<squares.length;i++)
  {
    if(squares[i]===null) return null;
  }
  return true;
}

  return(
    <div className='h-dvh w-dvw flex flex-col justify-center items-center bg-gradient-to-bl from-gray-800 to-slate-950
'>  <h1 className='text-5xl font-extrabold text-blue-400 mb-24'>TIC TAC TOE</h1>
    <div className="text-3xl font-bold mb-3 animate-bounce text-zinc-300">{result}</div>
    <div className="flex">
      <Square value={squares[0]} onSquareClick={()=> handleClick(0)}/>
      <Square value={squares[1]} onSquareClick={()=> handleClick(1)}/>
      <Square value={squares[2]} onSquareClick={()=> handleClick(2)}/>
    </div>
    <div className="flex">
      <Square value={squares[3]} onSquareClick={()=> handleClick(3)}/>
      <Square value={squares[4]} onSquareClick={()=> handleClick(4)}/>
      <Square value={squares[5]} onSquareClick={()=> handleClick(5)}/>
    </div>
    <div className="flex">
      <Square value={squares[6]} onSquareClick={()=> handleClick(6)}/>
      <Square value={squares[7]} onSquareClick={()=> handleClick(7)}/>
      <Square value={squares[8]} onSquareClick={()=> handleClick(8)}/>
    </div>
    <button onClick={reset} className='h-12 w-24 rounded-xl text-slate-300 bg-slate-800 text-2xl font-semibold mt-7 hover:bg-slate-700 hover:scale-105'>Reset</button>
    </div>
  )

  function calculateWinner(squares)
  {
    const lines = [[0,4,8], [3,4,5], [0,1,2], [6,7,8], [6,4,2], [0,3,6], [1,4,7], [2,5,8]];
    for(let i=0;i<lines.length;i++)
    {
      let [a,b,c] = lines[i];
      if(squares[a]===squares[b] && squares[a]===squares[c] )
      {
        return squares[a];
      }
    }
    return null;
  }
}

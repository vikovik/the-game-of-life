import React, {useCallback, useState, useRef} from 'react';
import produce from 'immer';
import './App.css';

const numRows = 130;
const numCols = 140;
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
]

const generateEmptyGrid = () =>{
  const rows = [];
    for (let i = 0; i < numRows; i++){
      rows.push(Array.from(Array(numCols), () => 0));
    }
  return rows;
}

function App() {
   const [grid, setGrid] = useState(() =>{
      return generateEmptyGrid();
   });

   const [running, setRunning] = useState(false);

   const runningRef = useRef();
   runningRef.current = running;

   const runSimulation = useCallback(()=>{
    if(!runningRef.current){
      return;
    }

    //* SIMULATION STARTS

    setGrid((gridLocal) => {
      return produce(gridLocal, gridCopy => {
        for(let i = 0; i < numRows; i++){
          for(let k = 0; k < numCols; k++){
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if(newI >= 0 && newI < numRows && newK >= 0 && newK < numCols){
                neighbors += gridLocal[newI][newK];
              }
            })

            if(neighbors < 2 || neighbors > 3){
              gridCopy[i][k] = 0;
            }
            else if(gridLocal[i][k] === 0 && neighbors === 3){
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    })
    setTimeout(runSimulation, 95);
   }, []);

  return (
    <>
      {
        //TODO: Transfer to own component BELOW
      }
      <div
        className="header">
        <h1>The Game of Life</h1>
      </div>
      <div className="btn">
        <button 
          className="btn-start"
          onClick={() =>{
            setRunning(!running);
            if(!running){
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? 'stop' : 'start'}
        </button>
        <button
          className="btn-clear"
          onClick={() =>{
            setGrid(generateEmptyGrid());
          }}
        >
          clear
        </button>
        <button
        className="btn-random"
          onClick={() =>{
            const rows = [];
            for (let i = 0; i < numRows; i++){
              rows.push(
                Array.from(
                  Array(numCols), () => Math.random() > .65 ? 1 : 0
                )
              );
            }
            setGrid(rows);
          }}
        >
          set random
        </button>

      </div>
      {
        //TODO: Transfer to own component ABOVE
      }
      <div 
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 6px)`
      }}>
        {grid.map((rows, i) => 
          rows.map((col, k) => (
            <div 
              key={`${i}-${k}`} 
              onClick={() =>{
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                })
                setGrid(newGrid);
              }}
              style={{
                width: 5, 
                height: 5, 
                backgroundColor: grid[i][k] ? `#${Math.floor(Math.random()*16777215).toString(16)}` : undefined,
                border: "1px solid black",
                borderRadius: "50%"
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;

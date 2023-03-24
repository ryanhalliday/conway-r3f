import {useCallback, useEffect, useRef, useState} from 'react'
import {Box, Grid, Plane} from "@react-three/drei";
import Cell from "./Cell";
import produce from "immer";
import {button, useControls} from "leva";

const gridSize = 10;

export default function Game({ ...props }) {
  // TODO GameBoard should be it's own component
  //        that we pass the cells to.

  const runningRef = useRef(null);
  const gameTickRef = useRef(1200);

  const {gameTick} = useControls({
    // gridSize: 10,
    gameTick: {
      value: 1200,
      min: 100,
      max: 2000,
      step: 100,
      label: 'Game Tick',
      onChange: (value) => {
        gameTickRef.current = value;
      }
    }
  });

  const offset = gridSize / 2 - 0.5;

  const mesh = useRef(null)
  let [cells, setCells] = useState(Array(gridSize).fill(0).map(() => Array(gridSize).fill(0)));

  const updateBoard = useCallback(() => {
    if (!runningRef.current){ return; }

    setCells(c => {
      return produce(c, draft => {
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            let neighbors = 0;
            for (let x = -1; x < 2; x++) {
              for (let y = -1; y < 2; y++) {
                if (x === 0 && y === 0) {
                  continue;
                }
                if (i + x < 0 || i + x >= gridSize || j + y < 0 || j + y >= gridSize) {
                  continue;
                }
                neighbors += c[i + x][j + y];
              }
            }
            if (c[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
              draft[i][j] = 0;
            } else if (c[i][j] === 0 && neighbors === 3) {
              draft[i][j] = 1;
            }
          }
        }
      })
    });

    setTimeout(updateBoard, gameTickRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  useControls({
    "Start/Stop": button(() => {
      runningRef.current = !runningRef.current;
      runningRef.current && updateBoard();
    })
  });

  const boxClick = (e) => {
    e.stopPropagation();
    const [x, y, z] = e.object.position.toArray().map((v) => Math.round(v + offset));
    setCells(c => {
      return produce(c, draft => {
        draft[x][z] = 0;
      })
    });
  }

  const boxes = cells.map((row, i) => {
    return row.reduce((rowCells, cell, j) => {
      if (!cell){ return rowCells; }
      const newCell = <Cell position={[i - offset, 0.5, j - offset]} key={`${i}-${j}`} onClick={boxClick} />
      rowCells.push(newCell);
      return rowCells; // I still hate spreading pointlessly.
    }, []);
  });

  const gridClick = (e) => {
    e.stopPropagation();
    const [x, y, z] = e.point.toArray().map((v) => Math.round(v + offset));
    setCells(c => {
      return produce(c, draft => {
        // We don't toggle here as we can handle toggle off in block click
        draft[x][z] = 1;
      })
    });
  }

  return (
    <group ref={mesh} {...props}>
      <Grid cellColor="white" cellSize={1} args={[gridSize, gridSize]} />
      <Plane visible={false} args={[gridSize, gridSize]} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={gridClick} />
      {boxes}
    </group>
  )
}

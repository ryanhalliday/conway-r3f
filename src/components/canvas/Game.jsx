import {useCallback, useRef, useState} from 'react'
import {Plane} from "@react-three/drei";
import produce from "immer";
import {button, useControls} from "leva";
import Board from "./Board";

const gridSize = 10;

export default function Game({ ...props }) {
  const runningRef = useRef(null);
  const gameTickRef = useRef(1200);

  const offset = gridSize / 2 - 0.5;

  const initialGrid = () => {
    return Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
  }

  const mesh = useRef(null)
  let [cells, setCells] = useState(initialGrid());

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
    gameTick: {
      value: 1200,
      min: 100,
      max: 2000,
      step: 100,
      label: 'Game Tick',
      onChange: (value) => {
        gameTickRef.current = value;
      }
    },
    "Clear": button(() => {
      setCells(initialGrid());
    }),
    "Start/Stop": button(() => {
      runningRef.current = !runningRef.current;
      runningRef.current && updateBoard();
    })
  });

  const splitVec3 = (pos) => {
    return pos.toArray().map((v) => Math.round(v + offset));
  }

  const boxClick = (e) => {
    e.stopPropagation();
    const [x, y, z] = splitVec3(e.object.position);
    setCells(c => {
      return produce(c, draft => {
        draft[x][z] = 0;
      })
    });
  }

  const gridClick = (e) => {
    e.stopPropagation();
    const [x, y, z] = splitVec3(e.point);
    setCells(c => {
      return produce(c, draft => {
        // We don't toggle here as we can handle toggle off in block click
        draft[x][z] = 1;
      })
    });
  }

  return (
    <group ref={mesh} {...props}>
      <Board gridSize={gridSize} cells={cells} cellClick={boxClick} cellOffset={offset} />
      <Plane visible={false} args={[gridSize, gridSize]} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={gridClick} />
    </group>
  )
}

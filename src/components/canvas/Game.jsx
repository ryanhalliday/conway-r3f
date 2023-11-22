import {useCallback, useRef, useState} from 'react'
import {Plane} from "@react-three/drei";
import produce from "immer";
import {button, useControls} from "leva";
import Board from "./Board";

let gridSize = 10;

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
                  continue; // current tile
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
    gridSize: {
      value: 10,
      min: 5,
      step: 1,
      label: "Grid Size",
      onChange: (value) => {
        // TODO Don't clear existing grid.
        gridSize = value;
        setCells(initialGrid());
      }
    },
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

  const click = (e, position) => {
    e.stopPropagation();
    const [x, _, z] = position.toArray().map((v) => Math.round(v + offset));
    toggleCell(x, z);
  }

  const toggleCell = (x, z) => {
    setCells(c => {
      return produce(c, draft => {
        draft[x][z] = draft[x][z] === 0 ? 1 : 0;
      })
    });
  }

  return (
    <group ref={mesh} {...props}>
      <Board gridSize={gridSize} cells={cells} cellClick={(e) => click(e, e.object.position)} cellOffset={offset} />
      <Plane visible={false} args={[gridSize, gridSize]} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={(e) => click(e, e.point)} />
    </group>
  )
}

import {Grid} from "@react-three/drei";
import Cell from "./Cell";

export default function Board({gridSize, cellClick, cells, cellOffset, ...props}){

  const boxes = cells.map((row, i) => {
    return row.reduce((rowCells, cell, j) => {
      if (!cell){ return rowCells; }
      const newCell = <Cell position={[i - cellOffset, 0.5, j - cellOffset]} key={`${i}-${j}`} onClick={cellClick} />
      rowCells.push(newCell);
      return rowCells; // I still hate spreading pointlessly.
    }, []);
  });

  return (
    <>
      <Grid cellColor="white" cellSize={1} args={[gridSize, gridSize]} />
      {boxes}
    </>
  )
}

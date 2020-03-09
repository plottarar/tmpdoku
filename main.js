import add from './add.js';
import { backtrackSolver } from './backtracking.js';
import { dlxMatrix, colValidator } from './dancingLinks/dlxMatrix.js';
import { search, printOut } from './dancingLinks/dancingLinks.js';
import {
  sudokuSolver,
  sudokuSolutionTransformer
} from './dancingLinks/sudokuSolver.js';


console.log(sudokuSolutionTransformer(...search(
  dlxMatrix({
    // http://elmo.sbs.arizona.edu/sandiway/sudoku/examples.html
    binaryMatrix: sudokuSolver([
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0],
    ]),
    names: Array(9*9*4).fill(0).map((x,i) => 'c'+i),
    cellTransform: (cell, row, col) => Object.assign({}, cell, {row}),
  })
)));

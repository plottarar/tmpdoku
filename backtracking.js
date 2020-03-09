import {
  isGroupValid,
  isRowValid,
  isColValid,
  isBoxValid,
  isSudokuSolved,
} from './validators.js';

export const backtrackSolver = puzzle => {
  let emptyCells = [];

  // Find empty cells
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[i][j] === 0) emptyCells.push({ row: i, col: j, n: 0 });
    }
  }

  // Solve empty cells
  for (let i = 0; i < emptyCells.length; i++) {
    let { row, col } = emptyCells[i];
    let shouldBacktrack = true;

    while (emptyCells[i].n < 9) {
      puzzle[row][col] = ++emptyCells[i].n;

      // Go to next empty cell if this number worked
      if (
        isRowValid(row, puzzle) &&
        isColValid(col, puzzle) &&
        isBoxValid([row, col], puzzle)
      ) {
        shouldBacktrack = false;
        break;
      }
    }

    if (shouldBacktrack) {
      // No number 1-9 worked. Reset cell and backtrack
      emptyCells[i].n = 0;
      puzzle[row][col] = 0;
      // Decrement by two to go to previous i before i++ in next loop.
      i -= 2;
    }
  }
  return puzzle;
};

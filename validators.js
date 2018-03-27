export const isRowValid = (row, puzzle) => {
  return isGroupValid(puzzle[row]);
};

export const isColValid = (col, puzzle) => {
  let column = [];
  for (let i = 0; i < 9; i++) {
    column[i] = puzzle[i][col];
  }
  return isGroupValid(column);
};

export const isBoxValid = ([row, col], puzzle) => {
  const [relRow, relCol] = [row % 3, col % 3];
  const [startRow, startCol] = [row - relRow, col - relCol];
  
  // [...firstRow, ...secondRow, ...thirdRow] in box of given coords.
  let box = [
    puzzle[startRow][startCol],
    puzzle[startRow][startCol + 1],
    puzzle[startRow][startCol + 2],
    puzzle[startRow + 1][startCol],
    puzzle[startRow + 1][startCol + 1],
    puzzle[startRow + 1][startCol + 2],
    puzzle[startRow + 2][startCol],
    puzzle[startRow + 2][startCol + 1],
    puzzle[startRow + 2][startCol + 2],
  ];
  return isGroupValid(box);
};

export const isGroupValid = group => {
  const found = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const n of group) {
    found[n]++;
    // Exit early if we find two of the same number.
    if (n > 0 && found[n] > 1) return false;
  }
  return true;
};

export const isSudokuSolved = puzzle => {
  // Make sure every cell is filled out
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[i][j] === 0) return false;
    }
  }

  // Make sure every row, column and box are valid
  for (let i = 0, j = 0; i < 9; i++, j += 3) {
    if (
      !isRowValid(i, puzzle) ||
      !isColValid(i, puzzle) ||
      !isBoxValid([i, j % 9], puzzle)
    )
      return false;
  }
  return true;
};

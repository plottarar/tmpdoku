export const sudokuListToGrid = sudokuList =>
  sudokuList.reduce(
    (grid, num, index) =>
      (index % 9 === 0 ? grid.push([num]) : grid[grid.length - 1].push(num)) &&
      grid,
    []
  );

export const sudokuGridToList = sudokuGrid =>
  sudokuGrid.reduce((list, gridRow) => list.concat(gridRow), []);

/* To see patterns for each constraint execute:
  console.log(
    sudokuSolver([
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0],
    ])
    // .map(c => c.slice(0, 81)) // cell
    // .map(c => c.slice(81, 81*2)) // row
    // .map(c => c.slice(81*2, 81*3)) // col
    // .map(c => c.slice(81*3, c.length)) // box
  );
 */

/**
 * Add cell constraints.
 * 81 cells so we need 81 columns for cell constrains, use first 81.
 * each cell can have 9 numbers so each cell needs 9 rows.
 * 1
 * 1
 * 1
 * 1
 * 1
 * 1
 * 1
 * 1
 * 1
 * 0 1
 * 0 1
 * 0 1
 * etc.
 */
// first 9 rows means pick x as the number in G[0][0]
// second 9 rows means pick x as the number in G[0][1]
const addCellConstrains = binaryMatrix => {
  let col = 0;
  for (let row = 0; row < binaryMatrix.length; row++) {
    if (row !== 0 && row % 9 === 0) col++;
    let cellConstrainsNum = 9 * 9;
    binaryMatrix[row][col] = 1;
  }
};

/**
 * For 9 cells to comply with a row constraint, we need to place the
 * 1s for one row in G over 9 rows in M.
 *
 * Each row in G needs 9 rows in M, where M is col 81-162 (row constraints)
 * ---------------
 * M[0][81] = 1
 * M[1][82] = 1
 * M[2][83] = 1
 * ...
 * M[8][89] = 1
 *
 * M[9][81] = 1
 * M[10][82] = 1
 * M[11][83] = 1
 * :
 * M[80][89] = 1
 * ---------------
 * ^ do block 9 times is same columns.
 * until row 81. Then we shift set of columns used to 81 + 9 = 90
 * ---------------
 * M[81][90] = 1
 * M[82][91] = 1
 * M[83][92] = 1
 * ...
 * M[89][98] = 1
 *
 * M[90][90] = 1
 * M[91][91] = 1
 * M[92][92] = 1
 * :
 * M[161][98] = 1
 * ---------------
 * Repeate pattern 9 times. Until col 81+81-1 = 161 and row 9*9*9-1=728
 * Last pattern starts at row 9*9*8=648 and col 81+9*8=153
 * ---------------
 * M[648][153] = 1
 * M[649][154] = 1
 * M[650][155] = 1
 * ...
 * M[656][161] = 1
 * :
 * M[728][161] = 1
 */
const addRowConstraints = binaryMatrix => {
  let col = 81;
  let colCnt = 0;
  for (let row = 0; row < binaryMatrix.length; row++) {
    const colOffset = colCnt % 9;
    if (row !== 0 && row % 81 === 0) col += 9;

    binaryMatrix[row][col + colOffset] = 1;
    colCnt++;
  }
};

/**
 * Column constraints. Different pattern than rows.
 * identity matrix all the way down 81 rows, then start from first col again.
 */
const addColumnConstraints = binaryMatrix => {
  let col = 162; // 81*2
  let colCnt = 0;
  for (let row = 0; row < binaryMatrix.length; row++) {
    const colOffset = colCnt % 81;
    binaryMatrix[row][col + colOffset] = 1;
    colCnt++;
  }
};

/**
 * This will create the constraint for three complete boxes.
 * Their columns are equal in M if they are in the same box in G.
 * For one cell in G the columns are placed just
 */
const addBoxConstraints = binaryMatrix => {
  let col = 243; // 81*3
  let colCnt = 0;
  let colTripletOffset = 0;
  let boxTripletOffset = 0;
  for (let row = 0; row < binaryMatrix.length; row++) {
    if (row !== 0 && row % (9 * 3) === 0) colTripletOffset += 9;
    if (row !== 0 && row % (9 * 9) === 0) colTripletOffset = 0;
    if (row !== 0 && row % (9 * 9 * 3) === 0) boxTripletOffset += 9 * 3;
    const colOffset = colCnt % 9;
    binaryMatrix[row][
      col + boxTripletOffset + colTripletOffset + colOffset
    ] = 1;
    colCnt++;
  }
};

const addClues = (binaryMatrix, sudokuGrid) => {
  let sudokuList = sudokuGridToList(sudokuGrid);

  let cellCnt = 0;
  for (let row = 0; row < binaryMatrix.length; row++) {
    if (row !== 0 && row % 9 === 0) cellCnt++;
    if (sudokuList[cellCnt] === 0) continue;
    const clueDigit = sudokuList[cellCnt];
    // Working in zero-base now so subtract one from clue to compare as index.
    // Remove all permutations of picking a number in the cell where the clue
    // resides. Only allow picking the clue itself.
    if (row % 9 !== clueDigit - 1) binaryMatrix[row].fill(0);
  }
};

/**
 * 324x729 matrix
 *
 * What makes this reduction possible is having each row in M describing all four
 * constraint for each cell in G. When a row is chosen from M as part of the solution,
 * what is actually chosen is an integer which complies with all four constraint for the
 * cell in G that the row describes
 */
export const sudokuSolver = sudokuGrid => {
  const numOfCols = 9 * 9 * 4; // constraints
  const numOfRows = 9 * 9 * 9; // ways of placing a number
  const binaryMatrix = [];

  // Fill with zeros.
  for (let i = 0; i < numOfRows; i++) {
    binaryMatrix[i] = Array(numOfCols).fill(0);
  }

  addCellConstrains(binaryMatrix);
  addRowConstraints(binaryMatrix);
  addColumnConstraints(binaryMatrix);
  addBoxConstraints(binaryMatrix);
  addClues(binaryMatrix, sudokuGrid);

  return binaryMatrix;
};

/**
 * Transforms solved dlx exact coverage problems back to a sudoku grid
 */
export const sudokuSolutionTransformer = dataObjects =>
  sudokuListToGrid(
    dataObjects
      // asc order
      .sort((a, b) => (a.row > b.row ? 1 : -1))
      // 0-based -> 1-based row numbers
      .map(d => Object.assign({}, d, { row: d.row + 1 }))
      // turn into actual 1-9 numbers
      .map(d => d.row % 9 || 9)
  );

/**
 * This function turna a binary matrix
 * into a matrix of circular doubly linked lists in cardinal directions,
 * containing nodes representing the 1s in the given binary matrix.
 * 
 * Additionally header nodes are present for each column in the data structure.
 * `h` is the root node that is returned, representing the starting point.
 * 
 * Turns
 * 
 *   [[1, 1]
 *   [1, 0]]
 * 
 * into
 * 
 *            ↑       ↑
 * -> h <-> ColA <-> ColB <-
 *            ↕       ↕
 *       -> C00  <-> C10 <-
 *            ↓       ↕
 *               ->  C11 <-
 *                    ↓
 * 
 * This data structure is described in the paper:
 * https://arxiv.org/abs/cs/0011047
 */

export const dlxMatrix = ({ binaryMatrix, names, debug }) => {
  const numOfRows = binaryMatrix.length;
  const numOfCols = binaryMatrix[0].length;

  // Traverse the matrix an replace 1s with objects containing empty properties.
  // This is necessary to achive referential integrity when building the dlx matrix.
  for (let col = 0; col < numOfCols; col++) {
    for (let row = 0; row < numOfRows; row++) {
      if (binaryMatrix[row][col] !== 0) {
        binaryMatrix[row][col] = {
          u: null,
          d: null,
          l: null,
          r: null,
          c: null,
        };
        if (debug) {
          binaryMatrix[row][col].debug = { i:row, j:col };
        }
      }
    }
  }

  const h = { r: null, l: null, name: 'root' };
  let prevColHeader = h;

  for (let col = 0; col < numOfCols; col++) {
    let currColHeader = {
      r: null,
      l: null,
      u: null,
      d: null,
      name: names[col],
      count: 0,
    };
    prevColHeader.r = currColHeader;
    currColHeader.l = prevColHeader;

    let currCell;

    for (let row = 0; row < numOfRows; row++) {
      const cell = binaryMatrix[row][col];
      if (cell === 0) continue;

      let u = row;
      let d = row;
      let l = col;
      let r = col;

      // Increment and decrement directions, with bound checks.
      // On hitting a bound, circle around and start from the other side.
      do { u--; if (u < 0) u = numOfRows - 1; } while (binaryMatrix[u][col] === 0);
      do { d++; if (d >= numOfRows) d = 0; } while (binaryMatrix[d][col] === 0);
      do { l--; if (l < 0) l = numOfCols - 1; } while (binaryMatrix[row][l] === 0);
      do { r++; if (r >= numOfCols) r = 0; } while (binaryMatrix[row][r] === 0);

      currColHeader.count++;

      cell.u = binaryMatrix[u][col];
      cell.d = binaryMatrix[d][col];
      cell.l = binaryMatrix[row][l];
      cell.r = binaryMatrix[row][r];
      cell.c = currColHeader;

      currCell = cell;
    }

    // Inject the column-header between the first and last cells in this column.
    let lastCell = currCell;
    let firstCell = currCell.d;
    currColHeader.d = firstCell
    firstCell.u = currColHeader
    currColHeader.u = lastCell;
    lastCell.d = currColHeader;

    prevColHeader = currColHeader;
  }

  h.l = prevColHeader;
  prevColHeader.r = h;

  return h;
};

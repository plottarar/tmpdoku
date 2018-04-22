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
  const size = binaryMatrix.length; // assumed quadratic

  // Traverse the matrix an replace 1s with objects containing empty properties.
  // This is necessary to achive referential integrity when building the dlx matrix.
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (binaryMatrix[i][j] !== 0) {
        binaryMatrix[i][j] = {
          u: null,
          d: null,
          l: null,
          r: null,
          c: null,
        };
        if (debug) {
          binaryMatrix[i][j].debug = { i, j };
        }
      }
    }
  }

  const h = { r: null, l: null, name: 'root' };
  let prevColHeader = h;

  for (let i = 0; i < size; i++) {
    let currColHeader = {
      r: null,
      l: null,
      u: null,
      d: null,
      name: names[i],
      count: 0,
    };
    prevColHeader.r = currColHeader;
    currColHeader.l = prevColHeader;

    let currCell;

    for (let j = 0; j < size; j++) {
      const cell = binaryMatrix[i][j];
      if (cell === 0) continue;

      let u = j;
      let d = j;
      let l = i;
      let r = i;

      // Increment and decrement directions, with bound checks.
      // On hitting a bound, circle around and start from the other side.
      do { u--; if (u < 0) u = size - 1; } while (binaryMatrix[i][u] === 0);
      do { d++; if (d >= size) d = 0; } while (binaryMatrix[i][d] === 0);
      do { l--; if (l < 0) l = size - 1; } while (binaryMatrix[l][j] === 0);
      do { r++; if (r >= size) r = 0; } while (binaryMatrix[r][j] === 0);

      currColHeader.count++;

      cell.u = binaryMatrix[i][u];
      cell.d = binaryMatrix[i][d];
      cell.l = binaryMatrix[l][j];
      cell.r = binaryMatrix[r][j];
      cell.c = currColHeader;

      currCell = cell;
    }
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

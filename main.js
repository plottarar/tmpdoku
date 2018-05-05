import add from './add.js';
import { backtrackSolver } from './backtracking.js';
import { dlxMatrix } from './dancingLinks/dlxMatrix.js';
import { search, printOut } from './dancingLinks/dancingLinks.js';

// console.log(add(1, 1));

window.a = search(
  dlxMatrix({
    binaryMatrix: [
      [0, 0, 1, 0, 1, 1, 0],
      [1, 0, 0, 1, 0, 0, 1],
      [0, 1, 1, 0, 0, 1, 0],
      [1, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 1],
      [0, 0, 0, 1, 1, 0, 1],
    ],
    names: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  })
);
a.forEach(s => console.log(printOut(s)));

window.d = search(
  dlxMatrix({
    binaryMatrix: [
      [0, 0, 1],
      [1, 0, 0],
      [0, 1, 1],
    ],
    names: ['A', 'B', 'C'],
  })
);
d.forEach(s => console.log(printOut(s)));


window.b = search(
  dlxMatrix({
    binaryMatrix: [
      [1, 1, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 1, 1, 0, 1, 0, 0, 0],
      [1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 1],
      [0, 1, 0, 0, 0, 0, 1, 1, 0],
    ],
    names: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
  })
);
b.forEach(s => console.log(printOut(s)));


// console.log(backtrackSolver([
//   [0, 0, 0, 2, 6, 0, 7, 0, 1],
//   [6, 8, 0, 0, 7, 0, 0, 9, 0],
//   [1, 9, 0, 0, 0, 4, 5, 0, 0],
//   [8, 2, 0, 1, 0, 0, 0, 4, 0],
//   [0, 0, 4, 6, 0, 2, 9, 0, 0],
//   [0, 5, 0, 0, 0, 3, 0, 2, 8],
//   [0, 0, 9, 3, 0, 0, 0, 7, 4],
//   [0, 4, 0, 0, 5, 0, 0, 3, 6],
//   [7, 0, 3, 0, 1, 8, 0, 0, 0],
// ]))

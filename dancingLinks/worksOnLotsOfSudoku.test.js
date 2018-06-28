import {
  stringPuzzlesToArray,
  top50EasyStringNotationPuzzles,
  hardestStringNotationPuzzles,
  top95StringNotationPuzzles,
} from '../sudokuPuzzles';
import { search } from './dancingLinks';
import { dlxMatrix } from './dlxMatrix';
import { sudokuSolver, sudokuSolutionTransformer } from './sudokuSolver.js';
import { isSudokuSolved } from '../validators.js';

test('works on lots of sudoku', () => {
  [
    hardestStringNotationPuzzles,
    top50EasyStringNotationPuzzles,
    top95StringNotationPuzzles,
  ].forEach(stringPuzzle =>
    stringPuzzlesToArray(stringPuzzle).forEach(puzzle => {
      expect(
        isSudokuSolved(
          sudokuSolutionTransformer(
            ...search(
              dlxMatrix({
                binaryMatrix: sudokuSolver(puzzle),
                names: Array(9 * 9 * 4)
                  .fill(0)
                  .map((x, i) => 'c' + i),
                cellTransform: (cell, row, col) =>
                  Object.assign({}, cell, { row }),
              }),
              { minimizeBranching: true }
            )
          )
        )
      ).toBe(true);
    })
  );
});

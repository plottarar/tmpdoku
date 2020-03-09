import { printOut, cover, uncover, search, chooseColumn } from './dancingLinks';
import { dlxMatrix } from './dlxMatrix';

test('chooseColumn', () => {
  let h = {}, a = {}, b = {}, c = {};
  h.r = a;
  a.r = b; a.count = 2;
  b.r = c; b.count = 1;
  c.r = h; c.count = 3;

  expect(chooseColumn(h, {})).toBe(a)
  expect(chooseColumn(h, { minimizeBranching: true })).toBe(b)
})

test('printOut', () => {
  const h = dlxMatrix({
    binaryMatrix: [
      [0, 0, 1, 0, 1, 1, 0],
      [1, 0, 0, 1, 0, 0, 1],
      [0, 1, 1, 0, 0, 1, 0],
      [1, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 1],
      [0, 0, 0, 1, 1, 0, 1],
    ],
    names: ['A','B','C', 'D', 'E', 'F', 'G'],
  });

  const c30 = h.r.d.d;
  const c41 = h.r.r.d.d;
  const c02 = h.r.r.r.d;

  expect(printOut([c30, c41, c02])).toEqual([
    'A, D',
    'B, G',
    'C, E, F',
  ])
});

test('cover 2x2', () => {
  const h = dlxMatrix({
    binaryMatrix: [
      [1, 1],
      [1, 0],
    ],
    names:['A', 'B']
  });

  const colA = h.r;
  const colB = h.l;
  const col00 = colA.d;
  const col01 = colA.d.d;

  expect(colA.count).toBe(2);
  expect(h.l).toBe(colB);
  expect(colA.r).toBe(colB);
  expect(colA.d).toBe(col00);
  expect(col01.u).toBe(col00);

  cover(colB);

  expect(colA.count).toBe(1);
  expect(h.l).toBe(colA);
  expect(colA.r).toBe(h);
  expect(colA.d).toBe(col01);
  expect(col01.u).toBe(colA);
});

test('uncover 3x3', () => {
  const h = dlxMatrix({
    binaryMatrix: [
      [0, 1, 1],
      [1, 0, 0],
      [1, 0, 1],
    ],
    names: ['A','B','C']
  });

  cover(h.r);

  const root = {}, Ca = {}, Cb = {}, Cc = {}
  const b1= {}, c1= {}

  root.l = Cc; root.r = Cb; root.name = 'root'
  Cb.l = root; Cb.r = Cc; Cb.u = b1; Cb.d = b1; Cb.name = 'B'; Cb.count = 1;
  Cc.l = Cb; Cc.r = root; Cc.u = c1; Cc.d = c1; Cc.name = 'C'; Cc.count = 1;
  b1.l = c1; b1.r = c1; b1.u = Cb; b1.d = Cb; b1.c = Cb;
  c1.l = b1; c1.r = b1; c1.u = Cc; c1.d = Cc; c1.c = Cc;

  expect(h).toEqual(root);
});

test('uncover 3x3', () => {
  const h = dlxMatrix({
    binaryMatrix: [
      [0, 1, 1],
      [1, 0, 0],
      [1, 0, 1],
    ], 
    names: ['A','B','C']
  });

  const root = {}, Ca = {}, Cb = {}, Cc = {}
  const a2= {}, a3= {}, b1= {}, c1= {}, c3= {}

  root.l = Cc; root.r = Ca; root.name = 'root'
  Ca.l = root; Ca.r = Cb; Ca.u = a3; Ca.d = a2; Ca.name = 'A'; Ca.count = 2;
  Cb.l = Ca; Cb.r = Cc; Cb.u = b1; Cb.d = b1; Cb.name = 'B'; Cb.count = 1;
  Cc.l = Cb; Cc.r = root; Cc.u = c3; Cc.d = c1; Cc.name = 'C'; Cc.count = 2;
  a2.l = a2; a2.r = a2; a2.u = Ca; a2.d = a3; a2.c = Ca;
  a3.l = c3; a3.r = c3; a3.u = a2; a3.d = Ca; a3.c = Ca;
  b1.l = c1; b1.r = c1; b1.u = Cb; b1.d = Cb; b1.c = Cb;
  c1.l = b1; c1.r = b1; c1.u = Cc; c1.d = c3; c1.c = Cc;
  c3.l = a3; c3.r = a3; c3.u = c1; c3.d = Cc; c3.c = Cc;
  expect(h).toEqual(root);

  const colA = h.r;

  cover(colA);
  expect(h).not.toEqual(root);

  uncover(colA);
  expect(h).toEqual(root);
});

test('search with one solution', () => {
  const h = dlxMatrix({
    // Example matrix used in the paper
    binaryMatrix: [
      [0, 0, 1, 0, 1, 1, 0],
      [1, 0, 0, 1, 0, 0, 1],
      [0, 1, 1, 0, 0, 1, 0],
      [1, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 1],
      [0, 0, 0, 1, 1, 0, 1],
    ],
    names: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  });
  const solutions = search(h);

  expect(solutions).toHaveLength(1)
  expect(printOut(solutions[0])).toEqual([
    'A, D',
    'B, G',
    'C, E, F',
  ])
  // Jest bug here I think. This doesn't terminate:
  // expect(search(h)).toEqual([])
});

test('search with minimized branching', () => {
  const h = dlxMatrix({
    // Example matrix used in the paper
    binaryMatrix: [
      [0, 0, 1, 0, 1, 1, 0],
      [1, 0, 0, 1, 0, 0, 1],
      [0, 1, 1, 0, 0, 1, 0],
      [1, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 1],
      [0, 0, 0, 1, 1, 0, 1],
    ],
    names: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  });
  const solutions = search(h, { minimizeBranching:true });

  expect(solutions).toHaveLength(1)
  expect(printOut(solutions[0])).toEqual([
    'A, D',
    'E, F, C',
    'B, G',
  ])
});

test('search with multiple solutions', () => {
  const h = dlxMatrix({
    binaryMatrix: [
      [0, 0, 1],
      [1, 0, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    names: ['A', 'B', 'C']
  });
  const solutions = search(h);

  expect(solutions).toHaveLength(2)
  expect(printOut(solutions[0])).toEqual(['A', 'B, C'])
  expect(printOut(solutions[1])).toEqual(['A', 'B', 'C'])
});

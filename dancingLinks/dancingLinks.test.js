import { cover } from './dancingLinks';
import { dlxMatrix } from './dlxMatrix';

test.only('cover 2x2', () => {
  const h = dlxMatrix({
    binaryMatrix: [
      [1, 1],
      [1, 0],
    ],
    names:['A', 'B'],
  });

  colA = h.r;
  colB = h.l;

  expect(colB.count).toBe(1);
  expect(h.l).toBe(colB)

  cover(colB);

  expect(colB.count).toBe(0);
  expect(h.l).toBe(colA)
});

test('dlxMatrix 3x3', () => {
  const h = dlxMatrix({
    binaryMatrix: [
      [0, 1, 1],
      [1, 0, 0],
      [1, 0, 1],
    ], 
    names: ['A','B','C']
  })

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
});

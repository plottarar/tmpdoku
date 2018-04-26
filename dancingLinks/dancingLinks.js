export const cover = col => {
  col.l = col.r;
  col.r = col.l;

  let j = col.d;
  while (j !== col) {
    let i = j.r;
    while (i !== j) {
      i.u = i.d;
      i.d = i.u;
      i.c.count--;
      i = i.r;
    }
    j = j.d;
  }
};

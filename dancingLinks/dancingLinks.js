export const print = dataObjects => {
  return dataObjects.map(dataObject => {
    let rowString = dataObject.c.name;
    let curr = dataObject.r;
    while (curr !== dataObject) {
      rowString = `${rowString}, ${curr.c.name}`;
      curr = curr.r;
    }
    return rowString;
  });
};

export const cover = col => {
  // Cover col from left<->right links of neighbours
  col.l.r = col.r;
  col.r.l = col.l;

  let j = col.d;
  while (j !== col) {
    let i = j.r;
    while (i !== j) {
      // Cover nodes that that touched nodes in col horizontally
      i.u.d = i.d;
      i.d.u = i.u;
      i.c.count--;
      i = i.r;
    }
    j = j.d;
  }
};

export const uncover = col => {
  let j = col.u;
  while (j !== col) {
    let i = j.l;
    while (i !== j) {
      // uncover node vertically that touched col horizontally
      i.u.d = i;
      i.d.u = i;
      i.c.count++;
      i = i.l;
    }
    j = j.u;
  }
  // uncover col from left<->right links of neighbours
  col.l.r = col;
  col.r.l = col;
};

export const search = h => {
  if (h === h.r) return h.name;

  let solutution = [];
  const loop = k => {
    let col = h.r;
    cover(col);

    let j = col.d;
    while (j !== col) {
      solutution[k] = j;

      // Cover
      let i = j.r;
      while (i !== j) {
        cover(j.c);
        i = i.r;
      }

      // reduce
      loop(k + 1);
      j = solutution[k];
      col = j.c;

      // uncover
      let p = j.l;
      while (p !== j) {
        uncover(j.c);
        p = p.l;
      }

      j = j.d;
    }
    cover(col);
    return solutution;
  };
  const res = loop(0);
  debugger;
  return res;
};

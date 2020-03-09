export const chooseColumn = (h, opts) => {
  if (opts.minimizeBranching) {
    // Choose the column with the least number of 1s
    let c = h.r;
    let j = h.r;
    while(j !== h) {
      if (j.count < c.count) {
        c = j;
      }
      j = j.r;
    }
    return c;
  } else {
    return h.r;
  }
}

export const printOut = dataObjects => {
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
  // Horizontally remove column
  col.l.r = col.r;
  col.r.l = col.l;

  let j = col.d;
  while (j !== col) {
    let i = j.r;
    // Vertically remove rows that intersected the column
    while (i !== j) {
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
      // Vertically add rows that intersected the column
    while (i !== j) {
      i.u.d = i;
      i.d.u = i;
      i.c.count++;

      i = i.l;
    }
    j = j.u;
  }

  // Horizontally add column
  col.l.r = col;
  col.r.l = col;
};

export const search = (h, opts = {}) => {
  let foundSolutions = [];
  const loop = (k, solution) => {
    // If this branch is taken then a solution has been found.
    if (h === h.r) {
      // Clone the solution to get a fresh reference to the solution array
      // at this point and add it to the found solutions.
      foundSolutions.push([...solution])
      return;
    }

    let col = chooseColumn(h, opts);
    cover(col);

    let j = col.d;
    while (j !== col) {
      // Add row to the partial solution
      solution[k] = j;

      // Cover
      let i = j.r;
      while (i !== j) {
        cover(i.c);
        i = i.r;
      }

      // Reduce problem
      loop(k + 1, solution);

      // Pop data object
      j = solution[k];
      col = j.c;

      // Uncover
      i = j.l;
      while (i !== j) {
        uncover(i.c);
        i = i.l;
      }

      j = j.d;
    }
    uncover(col);
    return;
  };
  loop(0, []);
  return foundSolutions;
};

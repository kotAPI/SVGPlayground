

let spawnNodeMessage = (idx, val) => ({
  msg: 'SPAWN_NODE',
  params: { idx, val }
});

let selectNodeMessage = (idx) => ({
  msg: 'SELECT_NODE',
  params: { idx }
});

let highlightNodeMessage = (idx) => ({
  msg: 'HIGHLIGHT_NODE',
  params: { idx }
});

let spawnEdgeMessage = (from, to) => ({
  msg: 'SPAWN_EDGE',
  params: { from, to }
});

let selectEdgeMessage = (from, to) => ({
  msg: 'SELECT_EDGE',
  params: { from, to }
});

let highlightEdgeMessage = (from, to) => ({
  msg: 'HIGHLIGHT_EDGE',
  params: { from, to }
});

// tree operations
let insert = (tree, v, messages) => {
  head = 0;
  while (tree[head] !== undefined && tree[head] !== v) {
    messages.push([ selectNodeMessage(head), highlightNodeMessage(head) ]);
    newhead = tree[head] > v ? head * 2 + 1 : head * 2 + 2;

    messages.push([ selectEdgeMessage(head, newhead), highlightEdgeMessage(head, newhead) ]);
    head = newhead;
  }
  const parenthead = Math.max(Math.floor((head - 1)/2), 0)
  messages.push([ spawnEdgeMessage(parenthead, head), highlightEdgeMessage(parenthead, head) ]);  
  messages.push([ spawnNodeMessage(head, v) ]);
  tree[head] = v;
  return tree;
};

let search = (tree, v, messages) => {
  head = 0;
  while (tree[head] !== undefined && tree[head] !== v) {
    messages.push([ selectNodeMessage(head), highlightNodeMessage(head) ]);
    newhead = tree[head] > v ? head * 2 + 1 : head * 2 + 2;

    messages.push([ selectEdgeMessage(head, newhead), highlightEdgeMessage(head, newhead) ]);
    head = newhead;
  }
  messages.push([ spawnNodeMessage(head), highlightNodeMessage(head) ]);
  return tree[head] === v;
};

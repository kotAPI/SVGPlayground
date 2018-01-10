// messages
let spawnNodeMessage = (idx, val) => ({
  msg: 'SPAWN_NODE',
  params: { idx, val }
})

let selectNodeMessage = idx => ({
  msg: 'SELECT_NODE',
  params: { idx }
})

let highlightNodeMessage = idx => ({
  msg: 'HIGHLIGHT_NODE',
  params: { idx }
})

let removeNodeMessage = idx => ({
  msg: 'REMOVE_NODE',
  params: { idx }
})

let moveNodeMessage = (idx, newIdx) => ({
  msg: 'MOVE_NODE',
  params: { idx, newIdx }
})

let nodeNotFoundMessage = val => ({
  msg: 'NODE_NOT_FOUND',
  params: { val }
})

let spawnEdgeMessage = (from, to) => ({
  msg: 'SPAWN_EDGE',
  params: { from, to }
})

let selectEdgeMessage = (from, to) => ({
  msg: 'SELECT_EDGE',
  params: { from, to }
})

let highlightEdgeMessage = (from, to) => ({
  msg: 'HIGHLIGHT_EDGE',
  params: { from, to }
})

let removeEdgeMessage = (from, to) => ({
  msg: 'REMOVE_EDGE',
  params: { from, to }
})

let moveEdgeMessage = (from, to, newFrom, newTo) => ({
  msg: 'MOVE_EDGE',
  params: { from, to, newFrom, newTo }
})

let printNodeMessage = val => ({
  msg: 'PRINT_NODE',
  params: { val }
})

// tree operations
let insert = (tree, v, messages) => {
  let head = 0
  while (tree[head] !== undefined && tree[head] !== v) {
    messages.push([highlightNodeMessage(head), selectNodeMessage(head)])
    let newhead = tree[head] > v ? head * 2 + 1 : head * 2 + 2

    if (tree[newhead] !== undefined) {
      messages.push([
        highlightEdgeMessage(head, newhead),
        selectEdgeMessage(head, newhead)
      ])
    }
    head = newhead
  }
  const parenthead = Math.max(Math.floor((head - 1) / 2), 0)
  messages.push([
    spawnEdgeMessage(parenthead, head),
    highlightEdgeMessage(parenthead, head)
  ])
  messages.push([spawnNodeMessage(head, v)])
  tree[head] = v
  return tree
}

let search = (tree, v, messages) => {
  let head = 0
  while (tree[head] !== undefined && tree[head] !== v) {
    messages.push([highlightNodeMessage(head), selectNodeMessage(head)])
    let newhead = tree[head] > v ? head * 2 + 1 : head * 2 + 2

    if (tree[newhead] !== undefined) {
      messages.push([
        highlightEdgeMessage(head, newhead),
        selectEdgeMessage(head, newhead)
      ])
    }
    head = newhead
  }
  if (tree[head] === v) {
    messages.push([highlightNodeMessage(head)])
  } else {
    messages.push([nodeNotFoundMessage(v)])
  }
  return tree[head] === v
}

let inorderTraversal = (tree, head, messages) => {
  if (tree[head * 2 + 1] !== undefined) {
    messages.push([
      highlightEdgeMessage(head, head * 2 + 1),
      selectEdgeMessage(head, head * 2 + 1)
    ])
    inorderTraversal(tree, head * 2 + 1, messages)
  }
  if (tree[head] !== undefined) {
    messages.push([
      highlightNodeMessage(head),
      selectNodeMessage(head),
      printNodeMessage(tree[head])
    ])
  }
  if (tree[head * 2 + 2] !== undefined) {
    messages.push([
      highlightEdgeMessage(head, head * 2 + 2),
      selectEdgeMessage(head, head * 2 + 2)
    ])
    inorderTraversal(tree, head * 2 + 2, messages)
  }
}

let preorderTraversal = (tree, head, messages) => {
  if (tree[head] !== undefined) {
    messages.push([
      highlightNodeMessage(head),
      selectNodeMessage(head),
      printNodeMessage(tree[head])
    ])
  }
  if (tree[head * 2 + 1] !== undefined) {
    messages.push([
      highlightEdgeMessage(head, head * 2 + 1),
      selectEdgeMessage(head, head * 2 + 1)
    ])
    preorderTraversal(tree, head * 2 + 1, messages)
  }
  if (tree[head * 2 + 2] !== undefined) {
    messages.push([
      highlightEdgeMessage(head, head * 2 + 2),
      selectEdgeMessage(head, head * 2 + 2)
    ])
    preorderTraversal(tree, head * 2 + 2, messages)
  }
}

let postorderTraversal = (tree, head, messages) => {
  if (tree[head * 2 + 1] !== undefined) {
    messages.push([
      highlightEdgeMessage(head, head * 2 + 1),
      selectEdgeMessage(head, head * 2 + 1)
    ])
    postorderTraversal(tree, head * 2 + 1, messages)
  }
  if (tree[head * 2 + 2] !== undefined) {
    messages.push([
      highlightEdgeMessage(head, head * 2 + 2),
      selectEdgeMessage(head, head * 2 + 2)
    ])
    postorderTraversal(tree, head * 2 + 2, messages)
  }
  if (tree[head] !== undefined) {
    messages.push([
      highlightNodeMessage(head),
      selectNodeMessage(head),
      printNodeMessage(tree[head])
    ])
  }
}

let remove = (tree, v, messages) => {
  let head = 0
  while (tree[head] !== undefined && tree[head] !== v) {
    head = tree[head] > v ? head * 2 + 2 : head * 2 + 1
  }

  if (isLeaf(tree, head)) {
    removeLeafNode(tree, head, messages)
  } else if (hasOneChild(tree, head)) {
    return
  } else if (hasTwoChildren(tree, head)) {
    return
  }
}

let isLeaf = (tree, node) =>
  tree[node * 2 + 1] === undefined && tree[node * 2 + 2] === undefined

let hasOneChild = (tree, node) =>
  (tree[node * 2 + 1] === undefined) !== (tree[node * 2 + 2] === undefined)

let hasTwoChildren = (tree, node) =>
  tree[node * 2 + 1] !== undefined && tree[node * 2 + 2] !== undefined

let removeLeafNode = (tree, node, messages) => {
  tree[node] = undefined
  messages.push([
    removeNodeMessage(node),
    removeEdgeMessage(getParentIdx(node), node)
  ])
}

let bypassNode = (tree, node, messages) => {
  tree[node] = undefined
  messages.push([
    removeNodeMessage(node),
    removeEdgeMessage(getParentIdx(node), node)
  ])
  moveSubtreeMessages = []
  // if (tree[leftChildIdx(node)])
  // moveSubtreeUp(tree,)
}

let getParentIdx = node => (node > 0 ? ~~((node - 1) / 2) : 0)

let leftChildIdx = node => node * 2 + 1

let rightChildIdx = node => node * 2 + 1

let moveSubtreeUp = (tree, idx, messages) => {
  if (tree[idx] === undefined || tree[~~(idx / 2)] !== undefined) return

  tree[newIdx] = tree[idx]
  messages.push([moveNodeMessage(oldIdx, newIdx), moveEdgeMessage()])
  moveSubtree(tree, idx * 2 + 1, messages)
  moveSubtree(tree, idx * 2 + 2, messages)
}

let spaceOut = (items, maxitems, itemmaxwidth) => {
  let line = Array(maxitems).fill('.'.repeat(itemmaxwidth))
  let totalEmptySpace = maxitems - items.length
  let paddingbetween = totalEmptySpace / items.length
  let paddingaround = paddingbetween / 2

  for (
    let pos = paddingaround + 1, idx = 0;
    pos < maxitems && idx < items.length;
    pos += paddingbetween, idx++
  ) {
    line[Math.floor(pos)] = (items[idx] || '  ')
      .toString()
      .padStart(itemmaxwidth, '.')
  }

  return line.join('')
}

let printTree = tree => {
  let level = 1
  while (level <= tree.length) {
    console.log(spaceOut(tree.slice(level - 1, level * 2 - 1), 78, 2))
    level *= 2
  }
}

/// Helper Function
const findXYPos = (nodeIdx, config) => {
  let level = 0
  for (; Math.pow(2, level) < nodeIdx + 2; level++);
  return {
    y: (level - 0.5) * config.row.height,
    x:
      ((nodeIdx + 2 - Math.pow(2, level - 1)) / Math.pow(2, level - 1) -
        Math.pow(0.5, level)) *
      config.canvas.width
  }
}

var CONFIG = {
  canvas: {
    width: 800,
    height: 400
  },
  row: {
    height: 60
  }
}

////////////////
// TEST SUITE //
////////////////

// let tree = Array(10000)

// let insert_messages = []
// let inorder_messages = [];
// let preorder_messages = [];
// let postorder_messages = [];

// insert(tree, 49, insert_messages)
// insert(tree, 23, insert_messages)
// insert(tree, 17, insert_messages)
// insert(tree, 28, insert_messages)
// insert(tree, 59, insert_messages)
// insert(tree, 19, insert_messages)
// insert(tree, 43, insert_messages)
// insert(tree, 45, insert_messages)
// insert(tree, 41, insert_messages)

// printTree(tree)

// inorderTraversal(tree, 0, inorder_messages);
// preorderTraversal(tree, 0, preorder_messages);
// postorderTraversal(tree, 0, postorder_messages);

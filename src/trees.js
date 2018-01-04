// messages
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

let nodeNotFoundMessage = (val) => ({
	msg: 'NODE_NOT_FOUND',
	params: { val }	
})

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

let printNodeMessage = (val) => ({
	msg: 'PRINT_NODE',
	params: { val }
});

// tree operations
let insert = (tree, v, messages) => {
	head = 0;
	while (tree[head] !== undefined && tree[head] !== v) {

		messages.push([ highlightNodeMessage(head), selectNodeMessage(head) ]);
		newhead = tree[head] > v ? head * 2 + 1 : head * 2 + 2;

		if (tree[newhead] !== undefined) {
			messages.push([ highlightEdgeMessage(head, newhead), selectEdgeMessage(head, newhead) ]);
		}
		head = newhead;
	}
	const parenthead = Math.max(Math.floor((head - 1) / 2), 0);
	messages.push([ spawnEdgeMessage(parenthead, head), highlightEdgeMessage(parenthead, head) ]);
	messages.push([ spawnNodeMessage(head, v) ]);
	tree[head] = v;
	return tree;
};

let search = (tree, v, messages) => {
	head = 0;
	while (tree[head] !== undefined && tree[head] !== v) {

		messages.push([ highlightNodeMessage(head), selectNodeMessage(head) ]);
		newhead = tree[head] > v ? head * 2 + 1 : head * 2 + 2;

		if (tree[newhead] !== undefined) {
			messages.push([ highlightEdgeMessage(head, newhead), selectEdgeMessage(head, newhead) ]);
		}
		head = newhead;
	}
	if (tree[head] === v) {
		messages.push([ highlightNodeMessage(head) ]);
	} else {
		messages.push([ nodeNotFoundMessage(v) ]);		
	}
	return tree[head] === v;

};

let inorderTraversal = (tree, head, messages) => {
	if (tree[head * 2 + 1] !== undefined) {
		messages.push([ highlightEdgeMessage(head, head * 2 + 1), selectEdgeMessage(head, head * 2 + 1) ]);
		inorderTraversal(tree, head * 2 + 1, messages);
	}
	if (tree[head] !== undefined) {
		console.log(tree[head]);
		messages.push([ highlightNodeMessage(head), selectNodeMessage(head), printNodeMessage(tree[head]) ]);
	}
	if (tree[head * 2 + 2] !== undefined) {
		messages.push([ highlightEdgeMessage(head, head * 2 + 2), selectEdgeMessage(head, head * 2 + 2) ]);
		inorderTraversal(tree, head * 2 + 2, messages);
	}
};

let preorderTraversal = (tree, head, messages) => {
	if (tree[head] !== undefined) {
		console.log(tree[head]);
		messages.push([ highlightNodeMessage(head), selectNodeMessage(head), printNodeMessage(tree[head]) ]);
	}
	if (tree[head * 2 + 1] !== undefined) {
		messages.push([ highlightEdgeMessage(head, head * 2 + 1), selectEdgeMessage(head, head * 2 + 1) ]);
		preorderTraversal(tree, head * 2 + 1, messages);
	}
	if (tree[head * 2 + 2] !== undefined) {
		messages.push([ highlightEdgeMessage(head, head * 2 + 2), selectEdgeMessage(head, head * 2 + 2) ]);
		preorderTraversal(tree, head * 2 + 2, messages);
	}
};

let postorderTraversal = (tree, head, messages) => {
	if (tree[head * 2 + 1] !== undefined) {
		messages.push([ highlightEdgeMessage(head, head * 2 + 1), selectEdgeMessage(head, head * 2 + 1) ]);
		postorderTraversal(tree, head * 2 + 1, messages);
	}
	if (tree[head * 2 + 2] !== undefined) {
		messages.push([ highlightEdgeMessage(head, head * 2 + 2), selectEdgeMessage(head, head * 2 + 2) ]);
		postorderTraversal(tree, head * 2 + 2, messages);
	}
	if (tree[head] !== undefined) {
		console.log(tree[head]);
		messages.push([ highlightNodeMessage(head), selectNodeMessage(head), printNodeMessage(tree[head]) ]);
	}
};

let remove = (tree, v) => {
	head = 0;
	while (tree[head] !== undefined && tree[head] !== v) {
		head = tree[head] > v ? head * 2 + 2 : head * 2 + 1;
	}

	if (tree[head * 2 + 1] === undefined && tree[head * 2 + 2] === undefined) {
		tree[head] = undefined;
	}
	// else if (tree[]) {

	// }
};

let moveSubtreeUp = (tree, idx) => {
  if (tree[idx] === undefined || tree[~~(idx/2)] !== undefined) return
	tree[newIdx] = tree[oldIdx];
	moveSubtree(tree, oldIdx * 2 + 1, newIdx * 2 + 1);
	moveSubtree(tree, oldIdx * 2 + 2, newIdx * 2 + 2);
};


////////////////
// TEST SUITE //
////////////////


// let tree = [];


// let insert_messages = [];
// let inorder_messages = [];
// let preorder_messages = [];
// let postorder_messages = [];

// insert(tree, 49, insert_messages);
// insert(tree, 23, insert_messages);
// insert(tree, 17, insert_messages);
// insert(tree, 28, insert_messages);
// insert(tree, 59, insert_messages);
// insert(tree, 19, insert_messages);
// insert(tree, 43, insert_messages);

// inorderTraversal(tree, 0, inorder_messages);
// preorderTraversal(tree, 0, preorder_messages);
// postorderTraversal(tree, 0, postorder_messages);


/// Helper Function
const findXYPos = (nodeIdx, config) => {
  let level = 0;
  for (; Math.pow(2, level) < nodeIdx + 2; level++);
  return {
    y: (level - 0.5) * config.row.height,
    x:
      ((nodeIdx + 2 - Math.pow(2, level - 1)) / Math.pow(2, level - 1) - Math.pow(0.5, level)) *
      config.canvas.width
  };
};

let CONFIG = {
  canvas: {
    width: 800
  },
  row: {
    height: 60
  }
};
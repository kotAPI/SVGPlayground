var CONFIGSVG = { width: 1200, height: 500, gameSpeed: 0.3 };
var svgContainer = d3
	.select('#svg-container')
	.append('svg')
	.attr('width', CONFIGSVG.width)
	.attr('height', CONFIGSVG.height);

var createNode = (id, x, y, textcontent, duration) =>
	new Promise((resolve, reject) => {
		// Get the reference to main SVG container and add a group
		var g = svgContainer.append('g').attr('id', 'group' + id).attr('class', 'node');

		// Append circle to group
		g
			.append('circle')
			.attr('cx', x)
			.attr('cy', y)
			.attr('r', 0)
			.style('fill', 'green')
			.transition()
			.attr('r', 20)
			.duration(CONFIGSVG.gameSpeed * 1000)
			.on('end', () => {
				// Append text to group, this resebles the node's value
				g
					.append('text')
					.attr('id', 'text' + id)
					.attr('x', x)
					.attr('y', y)
					.text(textcontent + '')
					.attr('text-anchor', 'middle')
					.attr('dominant-baseline', 'central');
				resetNodes();
				resetEdges();
				resolve();
			});
	});

var highlightNode = (id) =>
	new Promise((resolve, reject) => {
		var targetElement = d3.select('#' + 'group' + id);
		// targetElement.select("circle").transition().delay(1000).style("fill","green").attr("stroke-width","0").attr("stroke","#000000b5").duration(400).attr("stroke-width","2").transition().delay(200).style("fill","#ff4d4d").attr("stroke-width","0").on("end",resolve)
		targetElement
			.select('circle')
			.transition()
			.delay(CONFIGSVG.gameSpeed * 1000)
			.style('fill', 'green')
			.attr('stroke-width', '0')
			.attr('stroke', '#000000b5')
			.duration(CONFIGSVG.gameSpeed * 400)
			.on('end', resolve);
	});

var moveNode = (id, x, y, delay, duration) =>
	new Promise((resolve, reject) => {
		var targetElement = d3.select('#' + 'group' + id);
		targetElement
			.select('circle')
			.transition()
			.delay(CONFIGSVG.gameSpeed * 500)
			.attr('cx', x)
			.attr('cy', y)
			.duration(CONFIGSVG.gameSpeed * 1000)
			.on('end', resolve);

		var text = d3
			.select('#' + 'text' + id)
			.transition()
			.delay(delay)
			.attr('x', x)
			.attr('y', y)
			.duration(CONFIGSVG.gameSpeed * 1000);
	});

var drawEdge = (fromid, toid, x1, y1, x2, y2, duration, delay) =>
	new Promise((resolve, reject) => {
		d3
			.select('#edge-group')
			.append('g')
			.attr('id', 'edge' + fromid + '-' + toid)
			.attr('class', 'edge')
			.append('line')
			.attr('x1', x1)
			.attr('y1', y1)
			.attr('x2', x1)
			.attr('y2', y1)
			.attr('stroke-width', 2)
			.attr('stroke', 'black')
			.transition()
			.delay(delay)
			.duration(CONFIGSVG.gameSpeed * 1000)
			.attr('x2', x2)
			.attr('y2', y2)
			.on('end', resolve);
	});

var selectNode = (id) =>
	new Promise((resolve, reject) => {
		var targetElement = d3.select('#' + 'group' + id);
		targetElement
			.select('circle')
			.transition()
			.style('fill', 'green')
			.attr('stroke-width', '0')
			.attr('stroke', '#000000b5')
			.on('end', resolve);
	});

var resetNodes = () =>
	new Promise(() => {
		d3.selectAll('circle').style('fill', 'red');
	});
var resetEdges = () =>
	new Promise((resolve, reject) => {
		d3.selectAll('line').attr('stroke-width', 2).style('stroke', 'black');
	});
var highlightEdge = (fromid, toid) =>
	new Promise((resolve, reject) => {
		var edge = d3
			.select('g')
			.selectAll('#edge' + fromid + '-' + toid)
			.select('line')
			.attr('stroke-width', 4)
			.style('stroke', 'green');
	});

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
	canvas: { width: 1200 },
	row: { height: 60 }
};

function parseStep(obj) {
	if (obj.msg === 'SPAWN_NODE') {
		var node = findXYPos(obj.params.idx, CONFIG);
		createNode(obj.params.idx + '', node.x, node.y, obj.params.val, 1000);
	} else if (obj.msg === 'HIGHLIGHT_NODE') {
		highlightNode(obj.params.idx);
	} else if (obj.msg === 'SPAWN_EDGE') {
		var node1 = findXYPos(obj.params.from, CONFIG);
		var node2 = findXYPos(obj.params.to, CONFIG);
		drawEdge(obj.params.from, obj.params.to, node1.x, node1.y, node2.x, node2.y, 500, 100);
	} else if (obj.msg === 'SELECT_NODE') {
		selectNode(obj.params.idx);
	} else if (obj.msg === 'SELECT_EDGE') {
	} else if (obj.msg === 'HIGHLIGHT_EDGE') {
		highlightEdge(obj.params.from, obj.params.to);
	}
}

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
	const parenthead = Math.max(Math.floor((head - 1) / 2), 0);
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

// let remove = (tree, v) => {
//  head = 0;
//  while (tree[head] !== undefined && tree[head] !== v) {
//    head = tree[head] > v ? head * 2 + 2 : head * 2 + 1;
//  }

//  if (tree[head * 2 + 1] === undefined && tree[head * 2 + 2] === undefined) {
//    tree[head] = undefined;
//  }
//  // else if (tree[]) {

//  // }
// };

// let moveSubtreeUp = (tree, idx) => {
//   if (tree[idx] === undefined || tree[~~(idx/2)] !== undefined) return
//  tree[newIdx] = tree[oldIdx];
//  moveSubtree(tree, oldIdx * 2 + 1, newIdx * 2 + 1);
//  moveSubtree(tree, oldIdx * 2 + 2, newIdx * 2 + 2);
// };

let tree = [];
let messages = [];

insert(tree, 50, messages);
insert(tree, 23, messages);
insert(tree, 17, messages);
insert(tree, 28, messages);
insert(tree, 59, messages);
insert(tree, 19, messages);
insert(tree, 43, messages);
insert(tree, 56, messages);
insert(tree, 73, messages);
insert(tree, 68, messages);

//console.log(messages);

//parseStep(messages[0][0])

// for(var i=0;i<messages.length;i++){
//   var message = messages[i];
//   for(var j=0;j<message.length;j++){

//       var eventMsg = message[j];

//   }

// }

var i = 0;
var j = 0;

function myLoop() {
	setTimeout(function() {
		var message = messages[i];
		for (var k = 0; k < message.length; k++) {
			//console.log(message[])
			parseStep(message[k]);
		}

		i++;

		if (i < messages.length) {
			myLoop();
		}
	}, CONFIGSVG.gameSpeed * 1500);
}
myLoop();
//setTimeout(parseStep(messages[0][1]),4001)
//

///////// DOM BINDINGS
function insertIntoTree() {
	val = document.getElementById('insertVal').value;
	console.log(val);
	insert(tree, parseInt(val), messages);
	//console.log()

	myLoop();
}

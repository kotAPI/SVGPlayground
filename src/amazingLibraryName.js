var CONFIGSVG = {
  width: 1200,
  height: 500,
  gameSpeed: 0.7
};
var svgContainer = d3
  .select('#svg-container')
  .append('svg')
  .attr('width', CONFIGSVG.width)
  .attr('height', CONFIGSVG.height);

var createNode = (id, x, y, textcontent, duration) =>
  new Promise((resolve, reject) => {
    var g = svgContainer.append('g').attr('id', 'group' + id).attr('class', 'node');
    g
      .append('circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', 0)
      .style('fill', 'black')
      .transition()
      .attr('r', 20)
      .duration(CONFIGSVG.gameSpeed * 1000)
      .transition()
      .style('fill', 'red')
      .duration(CONFIGSVG.gameSpeed * 1000)
      .on('end', () => {
        resetNodes();
        resetEdges();
        resolve();
      });
    g
      .append('text')
      .attr('id', 'text' + id)
      .attr('x', x)
      .attr('y', y)
      .text(textcontent + '')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central');
  });

var highlightNode = (id) =>
  new Promise((resolve, reject) => {
    var targetElement = d3.select('#' + 'group' + id);
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
      .delay(CONFIGSVG.gameSpeed * 1000)
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
      .style('fill', 'cyan')
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
    resolve();
  });
var selectEdge = (fromid, toid) =>
  new Promise((resolve, reject) => {
    var edge = d3
      .select('g')
      .selectAll('#edge' + fromid + '-' + toid)
      .select('line')
      .attr('stroke-width', 10)
      .style('stroke', 'red');
    resolve();
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
  canvas: {
    width: 1200
  },
  row: {
    height: 60
  }
};

function parseStep(obj) {
  console.log(obj.msg, obj.params);
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
  } else if (obj.msg === 'HIGHLIGHT_EDGE') {
    highlightEdge(obj.params.from, obj.params.to);
  } else if (obj.msg === 'SELECT_EDGE') {
    selectEdge(obj.params.from, obj.params.to);
  }
}

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

var FinalMessages = [];
for (var i = 0; i < messages.length; i++) {
  var message = messages[i];

  for (var j = 0; j < message.length; j++) {
    var msgObj = message[j];
    FinalMessages.push(msgObj);
  }
}

var i = 0;
window.setInterval(function () {
  parseStep(FinalMessages[i]);
  i++;
}, CONFIGSVG.gameSpeed * 2000);

// DOM BINDINGS
function insertIntoTree() {
  val = document.getElementById('insertVal').value;
  console.log(val);
  insert(tree, parseInt(val), messages);
}
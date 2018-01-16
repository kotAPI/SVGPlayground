var Lib = function() {
  var api = {}

  /* API config */
  api.colorPalette = {
    red: 'rgba(255,0,0,1)',
    transparent: 'rgba(0,0,0,0)',
    white: 'rgb(255,255,255)'
  }

  api.timingConfig = {
    gameSpeed: 1,
    redrawFrequency: 15
  }

  /* API animation methods */
  api.createNode = (id, val, x, y, radius, duration) =>
    new Promise((resolve, reject) => {
      let svg = document.getElementById('svg-container')
      let nodeLayer = document.getElementById('svg-node-layer')

      if (nodeLayer === null) {
        nodeLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        nodeLayer.setAttribute('id', 'svg-node-layer')
        svg.append(nodeLayer)
        nodeLayer = document.getElementById('svg-node-layer')
      }

      let circle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      )

      circle.setAttribute('id', 'node' + id)
      circle.setAttribute('cx', x)
      circle.setAttribute('cy', y)
      circle.setAttribute('r', 0)
      circle.setAttribute('stroke', 'black')
      circle.setAttribute('stroke-width', 4)
      circle.setAttribute('fill', api.colorPalette.white)

      let text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('alignment-baseline', 'middle')
      text.setAttribute('x', x)
      text.setAttribute('y', y)

      // NODE GROUP = CIRCLE + TEXT
      let nodeGroup = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g'
      )
      nodeGroup.setAttribute('id', 'node-group-' + id)
      nodeGroup.append(circle)
      nodeGroup.append(text)

      nodeLayer.append(nodeGroup)

      let numFrames = duration / api.timingConfig.redrawFrequency

      for (let step = 0; step <= numFrames; step++) {
        setTimeout(() => {
          circle.setAttribute('r', radius / numFrames * step)
        }, api.timingConfig.redrawFrequency * step)
      }

      setTimeout(() => {
        text.textContent = val
        resolve(nodeGroup)
      }, api.timingConfig.redrawFrequency * numFrames)
    })
  api.moveNode = (id, new_x, new_y, duration) =>
    new Promise((resolve, reject) => {
      var nodeGroup = document.getElementById('node-group-' + id)
      let node = nodeGroup.childNodes[0]
      let text = nodeGroup.childNodes[1]

      let x = parseFloat(node.getAttribute('cx'))
      let y = parseFloat(node.getAttribute('cy'))

      let numFrames = duration / api.timingConfig.redrawFrequency

      let dx = (new_x - x) / numFrames
      let dy = (new_y - y) / numFrames

      for (let step = 0; step < numFrames; step++) {
        setTimeout(() => {
          node.setAttribute('cx', x + dx * step)
          node.setAttribute('cy', y + dy * step)
          text.setAttribute('x', x + dx * step)
          text.setAttribute('y', y + dy * step)
        }, api.timingConfig.redrawFrequency * step)
      }
      setTimeout(() => {
        resolve(node)
      }, api.timingConfig.redrawFrequency * numFrames)
    })
  api.selectNode = (nodeID, duration) => {
    new Promise(() => {
      let nodeGroup = document.getElementById('node-group-' + nodeID)
      let node = nodeGroup.childNodes[0]
      let text = nodeGroup.childNodes[1]
      node.setAttribute('fill', api.colorPalette.red)
    })
  }
  api.moveEdge = (fromNode, toNode, new_x1, new_y1, new_x2, new_y2, duration) =>
    new Promise((resolve, reject) => {
      var edge = document.getElementById('edge' + fromNode + '-' + toNode)

      let x1 = parseFloat(edge.getAttribute('x1'))
      let y1 = parseFloat(edge.getAttribute('y1'))
      let x2 = parseFloat(edge.getAttribute('x2'))
      let y2 = parseFloat(edge.getAttribute('y2'))
      let numFrames = duration / api.timingConfig.redrawFrequency

      let dx1 = (new_x1 - x1) / numFrames
      let dx2 = (new_x2 - x2) / numFrames
      let dy1 = (new_y1 - y1) / numFrames
      let dy2 = (new_y2 - y2) / numFrames

      for (let step = 0; step < numFrames; step++) {
        setTimeout(() => {
          edge.setAttribute('x1', x1 + dx1 * step)
          edge.setAttribute('y1', y1 + dy1 * step)
          edge.setAttribute('x2', x2 + dx2 * step)
          edge.setAttribute('y2', y2 + dy2 * step)
        }, api.timingConfig.redrawFrequency * step)
      }
      setTimeout(() => {
        resolve(edge)
      }, api.timingConfig.redrawFrequency * numFrames)
    })

  api.createEdge = (fromNode, toNode, x1, y1, x2, y2, duration) =>
    new Promise((resolve, reject) => {
      let svg = document.getElementById('svg-container')
      let edgeLayer = document.getElementById('svg-edge-layer')

      if (edgeLayer === null) {
        edgeLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        edgeLayer.setAttribute('id', 'svg-edge-layer')
        svg.prepend(edgeLayer)
        edgeLayer = document.getElementById('svg-edge-layer')
      }

      let numFrames = duration / api.timingConfig.redrawFrequency

      let edge = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      edgeLayer.append(edge)

      edge.setAttribute('id', 'edge' + fromNode + '-' + toNode)
      edge.setAttribute('stroke-width', 2)
      edge.setAttribute('stroke', 'red')

      edge.setAttribute('x1', x1)
      edge.setAttribute('y1', y1)
      edge.setAttribute('x2', x1)
      edge.setAttribute('y2', y1)

      let dx2 = (x2 - x1) / numFrames
      let dy2 = (y2 - y1) / numFrames

      for (let step = 0; step < numFrames; step++) {
        setTimeout(() => {
          edge.setAttribute('x2', x1 + dx2 * step)
          edge.setAttribute('y2', y1 + dy2 * step)
        }, api.timingConfig.redrawFrequency * step)
      }
      setTimeout(() => {
        edge.setAttribute('x2', x2)
        edge.setAttribute('y2', y2)
        resolve(edge)
      }, api.timingConfig.redrawFrequency * numFrames)
    })

  api.changeNodeID = function(oldID, newID) {
    var nodeGroup = document.getElementById('node-group-' + oldID)
    nodeGroup.setAttribute('id', 'node-group-' + newID)
    nodeGroup.childNodes[0].setAttribute('id', 'node' + newID)
  }
  api.changeEdgeID = function(oldID, newID) {
    var edge = document.getElementById(oldID)
    edge.setAttribute('id', newID)
  }
  return api
}

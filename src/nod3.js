var Lib = function() {
  var api = {}
  api.color = {
    orange: [255, 122, 128],
    purple: [199, 0, 57],
    yellow: [255, 195, 0]
  }

  // Game speed - Preferably from 1-10
  api.gameSpeed = 2
  api.executing = false
  api.messages = []
  api.animationMode = 0
  // FUNCTIONS
  ///
  api.init = function() {
    var svgCanvas = document.getElementById('svg-container')
    console.log(CONFIG.canvas)
    svgCanvas.setAttribute('width', CONFIG.canvas.width)
    svgCanvas.setAttribute('height', CONFIG.canvas.height)
  }

  api.beginAnimation = function() {
    api.executing = true
    var buttons = document.getElementsByClassName('actionbutton')

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].style.display = 'none'
    }
  }

  api.endAnimation = function() {
    api.executing = false
    var buttons = document.getElementsByClassName('actionbutton')

    for (let i = 0; i < buttons.length; i++) {
      buttons[i].style.display = 'inline'
    }
  }

  api.nodeExists = function(id) {
    var node = document.getElementById('node' + id)
    if (node !== null) {
      return true
    } else {
      return false
    }
  }

  api.q_createNode = function(id, x, y, val) {
    var svg = document.getElementById('svg-container')
    var nodeLayer = document.getElementById('svg-node-layer')

    if (nodeLayer === null) {
      nodeLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      nodeLayer.setAttribute('id', 'svg-node-layer')
      svg.append(nodeLayer)
      nodeLayer = document.getElementById('svg-node-layer')
    }

    var circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    )
    var createNodeColor =
      'rgb(' +
      api.color.orange[0] +
      ',' +
      api.color.orange[1] +
      ',' +
      api.color.orange[2] +
      ')'
    circle.setAttribute('id', 'node' + id)
    circle.setAttribute('cx', x)
    circle.setAttribute('cy', y)
    circle.setAttribute('r', 20)
    circle.setAttribute('stroke', 'white')
    circle.setAttribute('stroke-width', 2)
    circle.setAttribute('fill', createNodeColor)

    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('alignment-baseline', 'middle')
    text.setAttribute('x', x)
    text.setAttribute('y', y)
    text.textContent = val

    var nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    nodeGroup.setAttribute('id', 'node-group-' + id)
    nodeGroup.append(circle)
    nodeGroup.append(text)

    /// APPEND GROUP TO NODELAYER
    nodeLayer.append(nodeGroup)
    api.resetEdgesAndNodes()
  }

  api.createNode = function(id, x, y, val) {
    var svg = document.getElementById('svg-container')
    var nodeLayer = document.getElementById('svg-node-layer')

    if (nodeLayer === null) {
      nodeLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      nodeLayer.setAttribute('id', 'svg-node-layer')
      svg.append(nodeLayer)
      nodeLayer = document.getElementById('svg-node-layer')
    }

    //// CREATE A CIRCLE
    var circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    )
    var createNodeColor =
      'rgb(' +
      api.color.orange[0] +
      ',' +
      api.color.orange[1] +
      ',' +
      api.color.orange[2] +
      ')'
    circle.setAttribute('id', 'node' + id)
    circle.setAttribute('cx', x)
    circle.setAttribute('cy', y)
    circle.setAttribute('r', 0)
    circle.setAttribute('stroke', 'white')
    circle.setAttribute('stroke-width', 0)
    circle.setAttribute('fill', createNodeColor)
    //

    ///// CIRCLE TEXT
    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('alignment-baseline', 'middle')
    text.setAttribute('x', x)
    text.setAttribute('y', y)
    text.textContent = val

    //// NODE GROUP = CIRCLE + TEXT
    var nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    nodeGroup.setAttribute('id', 'node-group-' + id)
    nodeGroup.append(circle)
    nodeGroup.append(text)

    /// APPEND GROUP TO NODELAYER
    nodeLayer.append(nodeGroup)

    var radius = 20

    api.h_animateCreateNode(circle, radius)
  }

  api.h_animateCreateNode = function(node, maxRad) {
    var radius = parseFloat(node.getAttribute('r'))
    var strokeWidth = parseFloat(node.getAttribute('stroke-width'))

    api.beginAnimation()

    if (radius !== maxRad) {
      radius += 0.5

      node.setAttribute('r', radius)

      setTimeout(() => {
        api.h_animateCreateNode(node, maxRad)
      }, api.gameSpeed)
    }
    if (strokeWidth !== 3) {
      strokeWidth += 1
      node.setAttribute('stroke-width', strokeWidth)
      setTimeout(() => {
        api.h_animateCreateNode(node, maxRad)
      }, api.gameSpeed)
    } else {
      api.resetEdgesAndNodes()

      api.endAnimation()
    }
  }

  api.q_highlightNode = function(id) {
    var node = document.getElementById('node' + id)

    node.setAttribute(
      'fill',
      'rgb(' +
        api.color.purple[0] +
        ',' +
        api.color.purple[1] +
        ',' +
        api.color.purple[2] +
        ')'
    )
  }
  api.highlightNode = function(id) {
    var node = document.getElementById('node' + id)
    api.beginAnimation()
    var color = node.getAttribute('fill')
    var rgb = color
    rgb = rgb
      .substring(4, rgb.length - 1)
      .replace(/ /g, '')
      .split(',')

    var R = parseInt(rgb[0])
    var G = parseInt(rgb[1])
    var B = parseInt(rgb[2])

    if (
      api.color.purple[0] !== R ||
      api.color.purple[1] !== G ||
      api.color.purple[2] !== B
    ) {
      if (R > api.color.purple[0]) {
        R -= 1
      } else if (R < api.color.purple[0]) {
        R += 1
      }

      if (G > api.color.purple[1]) {
        G -= 1
      } else if (G < api.color.purple[1]) {
        G += 1
      }

      if (B > api.color.purple[2]) {
        B -= 1
      } else if (B < api.color.purple[2]) {
        B += 1
      }

      setTimeout(() => {
        node.setAttribute('fill', 'rgb(' + R + ',' + G + ',' + B + ')')
        api.highlightNode(id)
      }, api.gameSpeed)
    } else {
      api.endAnimation()
    }
  }
  api.q_selectNode = function(id) {
    var node = document.getElementById('node' + id)

    node.setAttribute(
      'fill',
      'rgb(' +
        api.color.yellow[0] +
        ',' +
        api.color.yellow[1] +
        ',' +
        api.color.yellow[2] +
        ')'
    )
  }
  api.selectNode = function(id) {
    var node = document.getElementById('node' + id)
    api.beginAnimation()
    var color = node.getAttribute('fill')
    var rgb = color
      .substring(4, color.length - 1)
      .replace(/ /g, '')
      .split(',')

    var R = parseInt(rgb[0])
    var G = parseInt(rgb[1])
    var B = parseInt(rgb[2])

    if (
      api.color.yellow[0] !== R ||
      api.color.yellow[1] !== G ||
      api.color.yellow[2] !== B
    ) {
      if (R > api.color.yellow[0]) {
        R -= 1
      } else if (R < api.color.yellow[0]) {
        R += 1
      }

      if (G > api.color.yellow[1]) {
        G -= 1
      } else if (G < api.color.yellow[1]) {
        G += 1
      }
      if (B > api.color.yellow[2]) {
        B -= 1
      } else if (B < api.color.yellow[2]) {
        B += 1
      }

      setTimeout(() => {
        node.setAttribute('fill', 'rgb(' + R + ',' + G + ',' + B + ')')
        api.selectNode(id)
      }, api.gameSpeed)
    } else {
      node.setAttribute(
        'stroke',
        'rgb(' +
          api.color.yellow[0] +
          ',' +
          api.color.yellow[1] +
          ',' +
          api.color.yellow[2] +
          ')'
      )
      api.endAnimation()
    }
  }
  api.resetEdgesAndNodes = function() {
    var nodes = document.getElementsByTagName('circle')
    var resetColor =
      'rgb(' +
      api.color.orange[0] +
      ',' +
      api.color.orange[1] +
      ',' +
      api.color.orange[2] +
      ')'
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute('fill', resetColor)
      nodes[i].setAttribute('stroke', 'white')
    }

    var edges = document.getElementsByTagName('line')
    for (let i = 0; i < edges.length; i++) {
      edges[i].setAttribute('stroke', 'black')
      edges[i].setAttribute('stroke-width', 2)
    }
  }
  api.q_createEdge = function(from_edge, to_edge, x1, y1, x2, y2) {
    var svg = document.getElementById('svg-container')
    var edgeLayer = document.getElementById('svg-edge-layer')

    if (edgeLayer === null) {
      edgeLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      edgeLayer.setAttribute('id', 'svg-edge-layer')
      svg.prepend(edgeLayer)
      edgeLayer = document.getElementById('svg-edge-layer')
    }

    var edge = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    edge.setAttribute('id', 'edge' + from_edge + to_edge)
    edge.setAttribute('x1', x1)
    edge.setAttribute('y1', y1)
    edge.setAttribute('x2', x2)
    edge.setAttribute('y2', y2)
    edge.setAttribute('stroke-width', 6)
    edge.setAttribute(
      'stroke',
      'rgb(' +
        api.color.orange[0] +
        ',' +
        api.color.orange[1] +
        ',' +
        api.color.orange[2] +
        ')'
    )

    edgeLayer.append(edge)
  }
  api.createEdge = function(from_edge, to_edge, x1, y1, x2, y2) {
    var svg = document.getElementById('svg-container')
    var edgeLayer = document.getElementById('svg-edge-layer')

    var dx = x2 - x1

    x1 = Math.ceil(x1)
    y1 = Math.ceil(y1)
    x2 = Math.ceil(x2)
    y2 = Math.ceil(y2)

    if (edgeLayer === null) {
      edgeLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      edgeLayer.setAttribute('id', 'svg-edge-layer')
      svg.prepend(edgeLayer)
      edgeLayer = document.getElementById('svg-edge-layer')
    }

    var edge = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    edge.setAttribute('id', 'edge' + from_edge + to_edge)
    edge.setAttribute('x1', x1)
    edge.setAttribute('y1', y1)
    edge.setAttribute('x2', x1)
    edge.setAttribute('y2', y1)
    edge.setAttribute('stroke-width', 6)
    edge.setAttribute(
      'stroke',
      'rgb(' +
        api.color.orange[0] +
        ',' +
        api.color.orange[1] +
        ',' +
        api.color.orange[2] +
        ')'
    )

    edgeLayer.append(edge)
    api.h_animateEdge(from_edge, to_edge, x1, y1, x2, y2)
  }
  api.h_animateEdge = function(from_edge, to_edge, x1, y1, x2, y2) {
    api.beginAnimation()

    var edge = document.getElementById('edge' + from_edge + to_edge)

    var curr_x = parseFloat(edge.getAttribute('x2'))
    var curr_y = parseFloat(edge.getAttribute('y2'))

    var slope = parseFloat(curr_y - y2) / parseFloat(curr_x - x2)

    var velocity = 1

    if (curr_x !== x2) {
      if (curr_x < x2) {
        curr_x += velocity
      }
      if (curr_x > x2) {
        curr_x -= velocity
      }
      curr_y = slope * (curr_x - x2) + y2

      if (Math.ceil(curr_y) === y2) {
        curr_y = Math.ceil(curr_y)
      }

      setTimeout(() => {
        edge.setAttribute('x2', curr_x)
        edge.setAttribute('y2', curr_y)
        api.h_animateEdge(from_edge, to_edge, x1, y1, x2, y2)
      }, api.gameSpeed)
    } else {
      api.endAnimation()
    }
  }
  api.deleteEdge = function(from_edge, to_edge) {
    var edge = document.getElementById('edge' + from_edge + to_edge)
    if (edge == null) {
      alert('Edge doesnt exist \n ID: ' + id)
      return
    }
    var x1 = parseFloat(edge.getAttribute('x1'))
    var y1 = parseFloat(edge.getAttribute('y1'))
    var x2 = parseFloat(edge.getAttribute('x2'))
    var y2 = parseFloat(edge.getAttribute('y2'))

    var velocity = 1 * api.gameSpeed

    api.h_del_animateEdge(edge, velocity)
  }
  api.h_del_animateEdge = function(edge, speed) {
    api.beginAnimation()
    var x1 = parseFloat(edge.getAttribute('x1'))
    var y1 = parseFloat(edge.getAttribute('y1'))
    var x2 = parseFloat(edge.getAttribute('x2'))
    var y2 = parseFloat(edge.getAttribute('y2'))

    var slope = parseFloat(y2 - y1) / parseFloat(x2 - x1)

    if (x1 !== x2 || y1 !== y2) {
      if (slope >= 0) {
        if (x2 < x1) {
          x2 += speed
          y2 = -slope * Math.abs(x1 - x2) + y1
        }
        if (x2 > x1) {
          x2 -= speed
          y2 = slope * Math.abs(x1 - x2) + y1
        }
      } else {
        if (x2 > x1) {
          x2 -= speed
          y2 = slope * Math.abs(x1 - x2) + y1
        }
        if (x2 < x1) {
          x2 += speed
          y2 = -slope * Math.abs(x1 - x2) + y1
        }
      }

      edge.setAttribute('x2', x2)
      edge.setAttribute('y2', y2)
      setTimeout(() => {
        api.h_del_animateEdge(edge, speed)
      }, api.gameSpeed)
    } else {
      api.endAnimation()
      edge.parentNode.removeChild(edge)
    }
  }
  api.q_highlightEdge = function(from_edge, to_edge) {
    var edge = document.getElementById('edge' + from_edge + to_edge)
    edge.setAttribute('stroke-width', 2)
    edge.setAttribute(
      'stroke',
      'rgb(' +
        api.color.purple[0] +
        ',' +
        api.color.purple[1] +
        ',' +
        api.color.purple[2] +
        ')'
    )
  }
  api.highlightEdge = function(from_edge, to_edge) {
    api.beginAnimation()
    var edge = document.getElementById('edge' + from_edge + to_edge)

    var width = parseFloat(edge.getAttribute('stroke-width'))

    if (width > 2) {
      width -= 0.2

      edge.setAttribute('stroke-width', width)

      setTimeout(() => {
        api.highlightEdge(from_edge, to_edge)
      }, api.gameSpeed)
    } else {
      edge.setAttribute(
        'stroke',
        'rgb(' +
          api.color.purple[0] +
          ',' +
          api.color.purple[1] +
          ',' +
          api.color.purple[2] +
          ')'
      )
      api.endAnimation()
    }
  }
  api.q_selectEdge = function(from_edge, to_edge) {
    var edge = document.getElementById('edge' + from_edge + to_edge)
    edge.setAttribute('stroke-width', 4)
    edge.setAttribute(
      'stroke',
      'rgb(' +
        api.color.yellow[0] +
        ',' +
        api.color.yellow[1] +
        ',' +
        api.color.yellow[2] +
        ')'
    )
  }
  api.selectEdge = function(from_edge, to_edge) {
    var edge = document.getElementById('edge' + from_edge + to_edge)
    edge.setAttribute('stroke-width', 4)
    edge.setAttribute(
      'stroke',
      'rgb(' +
        api.color.yellow[0] +
        ',' +
        api.color.yellow[1] +
        ',' +
        api.color.yellow[2] +
        ')'
    )
  }
  api.animate = function(messages) {
    var length = messages.length

    let i = 0
    var a = setInterval(() => {
      if (api.executing) {
        //console.log("animating")
      } else {
        //console.log("blocked")
      }
      if (!api.executing) {
        //console.log(messages[i])
        if (messages[i].msg === 'PRINT_NODE') {
          var node = document.createElement('div')
          node.setAttribute('class', 'node')
          node.innerHTML = messages[i].params.val

          var docbox = document.getElementById('messages')
          docbox.appendChild(node)
        }
        if (messages[i].msg == 'SPAWN_NODE') {
          var node = findXYPos(messages[i].params.idx, CONFIG)
          if (api.animationMode == 0) {
            api.q_createNode(
              messages[i].params.idx,
              node.x,
              node.y,
              messages[i].params.val
            )
          } else if (api.animationMode == 1) {
            api.createNode(
              messages[i].params.idx,
              node.x,
              node.y,
              messages[i].params.val
            )
          }
        }
        if (messages[i].msg == 'SELECT_NODE') {
          if (api.animationMode == 0) {
            api.q_selectNode(messages[i].params.idx)
          } else if (api.animationMode == 1) {
            api.selectNode(messages[i].params.idx)
          }
        }
        if (messages[i].msg == 'HIGHLIGHT_NODE') {
          if (api.animationMode == 0) {
            api.q_highlightNode(messages[i].params.idx)
          } else if (api.animationMode == 1) {
            api.highlightNode(messages[i].params.idx)
          }
        }
        if (messages[i].msg == 'SPAWN_EDGE') {
          var node1 = findXYPos(messages[i].params.from, CONFIG)
          var node2 = findXYPos(messages[i].params.to, CONFIG)

          if (api.animationMode == 0) {
            api.q_createEdge(
              messages[i].params.from,
              messages[i].params.to,
              node1.x,
              node1.y,
              node2.x,
              node2.y
            )
          } else if (api.animationMode == 1) {
            api.createEdge(
              messages[i].params.from,
              messages[i].params.to,
              node1.x,
              node1.y,
              node2.x,
              node2.y
            )
          }
        }
        if (messages[i].msg == 'HIGHLIGHT_EDGE') {
          if (api.animationMode == 0) {
            api.q_highlightEdge(messages[i].params.from, messages[i].params.to)
          } else if (api.animationMode == 1) {
            api.highlightEdge(messages[i].params.from, messages[i].params.to)
          }
        }
        if (messages[i].msg == 'SELECT_EDGE') {
          if (api.animationMode == 0) {
            api.q_selectEdge(messages[i].params.from, messages[i].params.to)
          } else if (api.animationMode == 1) {
            api.selectEdge(messages[i].params.from, messages[i].params.to)
          }
        }
        i++
      }
      if (i >= messages.length) {
        clearInterval(a)
      }
    }, api.gameSpeed)
  }
  /////////////////////////////////
  api.animateLinkedList = function(messages) {
    var length = messages.length

    let i = 0
    var a = setInterval(() => {
      if (api.executing) {
        //console.log("animating")
      } else {
        //console.log("blocked")
      }
      if (!api.executing) {
        //console.log(messages[i])

        if (messages[i].msg == 'SPAWN_NODE') {
          if (api.animationMode == 0) {
            api.q_createNode(
              messages[i].params.idx,
              messages[i].params.x,
              messages[i].params.y,
              messages[i].params.val
            )
          } else if (api.animationMode == 1) {
            api.createNode(
              messages[i].params.idx,
              messages[i].params.x,
              messages[i].params.y,
              messages[i].params.val
            )
          }
        }
        if (messages[i].msg == 'SELECT_NODE') {
          if (api.animationMode == 0) {
            api.q_selectNode(messages[i].params.idx)
          } else if (api.animationMode == 1) {
            api.selectNode(messages[i].params.idx)
          }
        }
        if (messages[i].msg == 'HIGHLIGHT_NODE') {
          if (api.animationMode == 0) {
            api.q_highlightNode(messages[i].params.idx)
          } else if (api.animationMode == 1) {
            api.highlightNode(messages[i].params.idx)
          }
        }
        if (messages[i].msg == 'SPAWN_EDGE') {
          let node1 = messages[i].params.node1
          let node2 = messages[i].params.node2
          console.log(node1, node2)
          if (api.animationMode == 0) {
            api.q_createEdge(
              messages[i].params.from,
              messages[i].params.to,
              node1.x,
              node1.y,
              node2.x,
              node2.y
            )
          } else if (api.animationMode == 1) {
            api.createEdge(
              messages[i].params.from,
              messages[i].params.to,
              node1.x,
              node1.y,
              node2.x,
              node2.y
            )
          }
        }
        if (messages[i].msg == 'HIGHLIGHT_EDGE') {
          if (api.animationMode == 0) {
            api.q_highlightEdge(messages[i].params.from, messages[i].params.to)
          } else if (api.animationMode == 1) {
            api.highlightEdge(messages[i].params.from, messages[i].params.to)
          }
        }
        if (messages[i].msg == 'SELECT_EDGE') {
          if (api.animationMode == 0) {
            api.q_selectEdge(messages[i].params.from, messages[i].params.to)
          } else if (api.animationMode == 1) {
            api.selectEdge(messages[i].params.from, messages[i].params.to)
          }
        }
        i++
      }
      if (i >= messages.length) {
        clearInterval(a)
      }
    }, 10)
  }
  api.moveEdge = function(edge, new_x1, new_y1, new_x2, new_y2) {
    var x1 = parseInt(edge.getAttribute('x1'))
    var y1 = parseInt(edge.getAttribute('y1'))
    var x2 = parseInt(edge.getAttribute('x2'))
    var y2 = parseInt(edge.getAttribute('y2'))

    if (x1 !== new_x1 || y1 !== new_y1 || x2 !== new_x2 || y2 !== new_y2) {
      edge.setAttribute('x1', x1 > new_x1 ? x1 - 1 : x1 + 1)
      edge.setAttribute('y1', y1 > new_y1 ? y1 - 1 : y1 + 1)

      edge.setAttribute('x2', x2 > new_x2 ? x2 - 1 : x2 + 1)
      edge.setAttribute('y2', y2 > new_y2 ? y2 - 1 : y2 + 1)

      setTimeout(() => {
        api.moveEdge(edge, new_x1, new_y1, new_x2, new_y2)
      }, 1)
    } else {
      //
    }
  }
  api.moveNode = function(nodeGroup, x, y) {
    api.beginAnimation()

    // var nodeGroup = document.getElementById("node-group-"+id)
    var circle = nodeGroup.childNodes[0]
    var text = nodeGroup.childNodes[1]

    x = Math.floor(x)
    y = Math.floor(y)

    var curr_x = parseFloat(circle.getAttribute('cx'))
    var curr_y = parseFloat(circle.getAttribute('cy'))

    var slope = parseFloat(curr_y - y) / parseFloat(curr_x - x)

    var velocity = 1

    if (curr_x !== x || curr_y !== y) {
      if (curr_x < x) {
        curr_x += velocity
      }
      if (curr_x > x) {
        curr_x -= velocity
      }
      curr_y = slope * (curr_x - x) + y

      circle.setAttribute('cx', curr_x)
      circle.setAttribute('cy', curr_y)
      text.setAttribute('x', curr_x)
      text.setAttribute('y', curr_y)

      setTimeout(() => {
        api.moveNode(nodeGroup, x, y)
      }, api.gameSpeed)
    } else {
      api.endAnimation()
    }
  }
  api.moveLinkedListGroup = function(fromId, toId) {
    var nodes = []
    var edges = []
    for (let i = fromId; i <= toId; i++) {
      let group = document.getElementById('node-group-' + i)
      nodes.push(group)
    }
    for (let i = fromId; i < toId; i++) {
      let group = document.getElementById('edge' + i + (i + 1))
      edges.push(group)
    }
    //console.log(nodes,edges)

    for (let i = nodes.length - 1; i >= 0; i--) {
      var x = parseInt(nodes[i].childNodes[0].getAttribute('cx'))
      var y = parseInt(nodes[i].childNodes[0].getAttribute('cy'))
      var edge = document.getElementById('edge' + (i - 1) + i)
      api.moveNode(nodes[i], x + 80, y, edge)
    }

    for (let i = edges.length - 1; i >= 0; i--) {
      var x1 = parseInt(edges[i].getAttribute('x1'))
      var y1 = parseInt(edges[i].getAttribute('y1'))
      var x2 = parseInt(edges[i].getAttribute('x2'))
      var y2 = parseInt(edges[i].getAttribute('y2'))
      // console.log(edges[i].getAttribute("x1"))
      // console.log(x1,y1,x2,y2)

      api.moveEdge(edges[i], x1 + 80, y1, x2 + 80, y2)
    }
  }

  /////////////////////////////////
  api.clearCanvas = function() {
    document.getElementById('svg-edge-layer').innerHTML = ''
    document.getElementById('svg-node-layer').innerHTML = ''
  }

  api.flattenMessages = function(messages) {
    // let tempArr = []

    // for (let i = 0; i <= messages.length; i++) {
    //   tempArr.concat([...messages[i]])
    // }
    return [].concat(...messages)
  }

  return api
}

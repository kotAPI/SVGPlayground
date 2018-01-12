/*eslint no-debugger: 0*/
var LinkedList = function () {
  var api = {}

  api.head = null
  api.messages = []
  api.horizontalOffset = 80
  api.getListLength = function () {
    var currentNode = api.head
    var i = 0

    while (currentNode !== null) {
      i++
      currentNode = currentNode.next
    }
    return i
  }
  api.createNewNode = function (val) {
    var node = {
      val: val,
      next: null
    }
    return node
  }
  api.insertAt = function (val, index) {
    var node = api.createNewNode(val)
    var currentNode = api.head
    var messages = []
    var message
    var i = 0
    var maxLen = api.getListLength()
    if (index === 0) {
      if (api.head == null) {
        api.head = node
        message = {
          msg: 'SPAWN_NODE',
          params: {
            idx: index,
            val: node.val,
            x: api.horizontalOffset * (index + 1),
            y: 100
          }
        }
        messages.push(message)
        api.messages.push(message)

        return messages
      }
      var chain = api.head
      api.head = node
      api.head.next = chain

      message = {
        msg: 'SPAWN_NODE',
        params: {
          idx: index,
          val: node.val,
          x: api.horizontalOffset * (index + 1) + 20,
          y: 200
        }
      }

      messages.push(message)
      api.messages.push(message)
      ///

      // move group
      message = {
        msg: 'MOVE_GROUP',
        params: {
          idx: index,
          from: index,
          to: maxLen - 1,
          direction: 1
        }
      }
      messages.push(message)
      api.messages.push(message)
      //

      message = {
        msg: 'SPAWN_EDGE',

        params: {
          from: index,
          to: index + 1,
          node1: {
            x: api.horizontalOffset * (index + 1) + 1,
            y: 200
          },
          node2: {
            x: api.horizontalOffset * (index + 2),
            y: 120
          }
        }
      }
      messages.push(message)
      api.messages.push(message)

      message = {
        msg: 'MOVE_NODE_WITH_RIGHT_EDGE',
        params: {
          idx: index,
          x: api.horizontalOffset * (index + 1) + 1,
          y: 100
        }
      }
      messages.push(message)
      api.messages.push(message)
      //

      return messages
    }
    while (currentNode.next !== null) {
      if (i === index - 1) {
        /// Spawn node
        message = {
          msg: 'DELETE_EDGE',
          params: {
            from: index - 1,
            to: index
          }
        }
        messages.push(message)
        api.messages.push(message)
        ///

        // move group
        message = {
          msg: 'MOVE_GROUP',
          params: {
            idx: index,
            from: index,
            to: maxLen - 1,
            direction: 1
          }
        }
        messages.push(message)
        api.messages.push(message)
        //
        /// Spawn node
        message = {
          msg: 'SPAWN_NODE',
          params: {
            idx: index,
            val: node.val,
            x: api.horizontalOffset * (index + 1),
            y: 200
          }
        }

        messages.push(message)
        api.messages.push(message)
        ///

        message = {
          msg: 'SPAWN_EDGE',

          params: {
            from: index,
            to: index + 1,
            node1: {
              x: api.horizontalOffset * (index + 1),
              y: 200
            },
            node2: {
              x: api.horizontalOffset * (index + 2),
              y: 100
            }
          }
        }
        messages.push(message)
        api.messages.push(message)
        ////
        message = {
          msg: 'HIGHLIGHT_EDGE',

          params: {
            from: index,
            to: index + 1
          }
        }

        //
        messages.push(message)
        api.messages.push(message)
        ////
        message = {
          msg: 'SPAWN_EDGE',

          params: {
            from: index - 1,
            to: index,
            node1: {
              x: api.horizontalOffset * index,
              y: 100
            },
            node2: {
              x: api.horizontalOffset * (index + 1),
              y: 200
            }
          }
        }
        messages.push(message)
        api.messages.push(message)
        //

        ////
        message = {
          msg: 'HIGHLIGHT_EDGE',

          params: {
            from: index - 1,
            to: index
          }
        }
        messages.push(message)
        api.messages.push(message)
        //

        // move node
        message = {
          msg: 'MOVE_NODE_WITH_CONNECTED_EDGES',
          params: {
            idx: index,
            x: api.horizontalOffset * (index + 1),
            y: 100
          }
        }
        messages.push(message)
        api.messages.push(message)
        //

        // select node
        message = {
          msg: 'HIGHLIGHT_NODE',
          params: {
            idx: index
          }
        }
        messages.push(message)
        api.messages.push(message)
        //

        // spawn edge

        var tempNode = currentNode.next
        currentNode.next = node
        node.next = tempNode

        return messages
      }
      currentNode = currentNode.next
      i++
    }

    return messages
  }
  api.insertToList = function (val) {
    var node = api.createNewNode(val)
    var index = 1
    var messages = []
    var message
    if (api.head === null) {
      api.head = node

      message = {
        msg: 'SPAWN_NODE',
        params: {
          idx: 0,
          val: node.val,
          x: api.horizontalOffset,
          y: 100
        }
      }
      messages.push(message)
      api.messages.push(message)
    } else {
      var currentNode = api.head

      message = {
        msg: 'SELECT_NODE',
        params: {
          idx: 0
        }
      }
      messages.push(message)
      api.messages.push(message)

      message = {
        msg: 'HIGHLIGHT_NODE',
        params: {
          idx: 0
        }
      }
      messages.push(message)
      api.messages.push(message)

      while (currentNode.next !== null) {
        currentNode = currentNode.next

        index++

        message = {
          msg: 'HIGHLIGHT_EDGE',
          params: {
            from: index - 2,
            to: index - 1
          }
        }
        messages.push(message)
        api.messages.push(message)

        message = {
          msg: 'SELECT_NODE',
          params: {
            idx: index - 1
          }
        }
        messages.push(message)
        api.messages.push(message)

        message = {
          msg: 'HIGHLIGHT_NODE',
          params: {
            idx: index - 1
          }
        }
        messages.push(message)
        api.messages.push(message)
      }
      currentNode.next = node

      //// APPENDING NODE TO THE END OF THE LIST
      //// SPAWNING NODE FIRST AND THEN SPAWNING THE EDGE LATER
      //// WHY? ANEEQ WANTED IT IN THIS ORDER :D
      message = {
        msg: 'SPAWN_NODE',
        params: {
          idx: index,
          val: node.val,
          x: (index + 1) * api.horizontalOffset,
          y: 100
        }
      }
      messages.push(message)
      api.messages.push(message)

      message = {
        msg: 'SPAWN_EDGE',
        params: {
          from: index - 1,
          to: index,
          node1: {
            x: index * api.horizontalOffset,
            y: 100
          },
          node2: {
            x: (index + 1) * api.horizontalOffset,
            y: 100
          }
        }
      }
      messages.push(message)
      api.messages.push(message)
      //// END OF APPENDING NODE AND SPAWNING EDGE IN THAT SPECIFIC ORDER
    }
    return messages
  }

  api.searchNode = function (val) {
    var index = 1
    var messages = []
    var message

    var currentNode = api.head

    if (api.head.val === val) {
      message = {
        msg: 'HIGHLIGHT_NODE2',
        params: {
          idx: 0
        }
      }
      messages.push(message)
      api.messages.push(message)
      return messages
    } else {
      message = {
        msg: 'SELECT_NODE',
        params: {
          idx: 0
        }
      }
      messages.push(message)
      api.messages.push(message)

      message = {
        msg: 'HIGHLIGHT_NODE',
        params: {
          idx: 0
        }
      }
      messages.push(message)
      api.messages.push(message)
    }
    while (currentNode.next !== null) {
      if (currentNode.next.val === val) {
        message = {
          msg: 'HIGHLIGHT_NODE2',
          params: {
            idx: index
          }
        }
        messages.push(message)
        api.messages.push(message)

        index++
        return messages
      }

      currentNode = currentNode.next
      message = {
        msg: 'HIGHLIGHT_EDGE',
        params: {
          from: index - 1,
          to: index
        }
      }
      messages.push(message)
      api.messages.push(message)

      index++
      if (currentNode.next == null) {
        message = {
          msg: 'PRINT_MESSAGE',
          params: {
            message: 'NODE NOT FOUND YO!',
            val: val
          }
        }
        messages.push(message)
        api.messages.push(message)
      }
      message = {
        msg: 'SELECT_NODE',
        params: {
          idx: index - 1
        }
      }
      messages.push(message)
      api.messages.push(message)

      message = {
        msg: 'HIGHLIGHT_NODE',
        params: {
          idx: index - 1
        }
      }
      messages.push(message)
      api.messages.push(message)
    }

    console.log(api.printNodes())

    return messages
  }
  api.removeNode = function (val) {
    var currentNode = api.head
    if (api.head.next == null) {
      return false
    }

    while (currentNode.next !== null) {
      if (currentNode.next.val === val) {
        if (currentNode.next.next !== null) {
          currentNode.next = currentNode.next.next
        } else {
          currentNode.next = null
        }
      }
      currentNode = currentNode.next
    }

    return false
  }
  api.printNodes = function () {
    var head = api.head
    var currentNode = api.head

    while (currentNode !== null) {
      currentNode = currentNode.next
    }
    console.log('\n')
  }

  return api
}
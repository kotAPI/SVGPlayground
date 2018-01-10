var LinkedList = function() {
  var api = {}

  api.head = null
  api.messages = []
  api.horizontalOffset = 80
  api.createNewNode = function(val) {
    var node = {
      val: val,
      next: null
    }
    return node
  }
  api.insertToList = function(val) {
    var node = api.createNewNode(val)
    var index = 1
    var messages = []
    if (api.head === null) {
      api.head = node

      message = {
        msg: 'SPAWN_NODE',
        params: { idx: 0, val: node.val, x: api.horizontalOffset, y: 100 }
      }
      messages.push(message)
      api.messages.push(message)

      message = { msg: 'HIGHLIGHT_NODE', params: { idx: 0 } }
      messages.push(message)
      api.messages.push(message)

      message = { msg: 'SELECT_NODE', params: { idx: 0 } }
      messages.push(message)
      api.messages.push(message)
    } else {
      var currentNode = api.head

      message = { msg: 'HIGHLIGHT_NODE', params: { idx: 0 } }
      messages.push(message)
      api.messages.push(message)

      message = { msg: 'SELECT_NODE', params: { idx: 0 } }
      messages.push(message)
      api.messages.push(message)

      while (currentNode.next !== null) {
        if (currentNode.next.val === val) {
          index++
          message = { msg: 'HIGHLIGHT_NODE', params: { idx: index - 1 } }
          messages.push(message)
          api.messages.push(message)

          return messages
        }

        message = {
          msg: 'SPAWN_EDGE',
          params: {
            from: index - 1,
            to: index,
            node1: { x: index * api.horizontalOffset, y: 100 },
            node2: { x: (index + 1) * api.horizontalOffset, y: 100 }
          }
        }
        messages.push(message)
        api.messages.push(message)

        index++
        currentNode = currentNode.next

        message = { msg: 'HIGHLIGHT_NODE', params: { idx: index - 1 } }
        messages.push(message)
        api.messages.push(message)

        message = { msg: 'SELECT_NODE', params: { idx: index - 1 } }
        messages.push(message)
        api.messages.push(message)
      }
      currentNode.next = node

      message = {
        msg: 'SPAWN_EDGE',
        params: {
          from: index - 1,
          to: index,
          node1: { x: index * api.horizontalOffset, y: 100 },
          node2: { x: (index + 1) * api.horizontalOffset, y: 100 }
        }
      }
      messages.push(message)
      api.messages.push(message)

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

      message = { msg: 'HIGHLIGHT_NODE', params: { idx: index } }
      messages.push(message)
      api.messages.push(message)
    }
    return messages
  }
  api.searchNode = function(val) {
    var index = 1
    var messages = []
    if (api.head === null) {
      api.head = node

      return messages
    } else {
      var currentNode = api.head

      while (currentNode.next !== null) {
        if (currentNode.next.val === val) {
          index++
          message = { msg: 'HIGHLIGHT_NODE', params: { idx: index - 1 } }
          messages.push(message)
          api.messages.push(message)

          return messages
        }

        index++
        currentNode = currentNode.next

        // message = {msg:"HIGHLIGHT_NODE",params:{idx:index-1}}
        // messages.push(message)
        // api.messages.push(message)

        // message = {msg:"SELECT_NODE",params:{idx:index-1}}
        // messages.push(message)
        // api.messages.push(message)
      }
      currentNode.next = node

      message = { msg: 'HIGHLIGHT_NODE', params: { idx: index } }
      messages.push(message)
      api.messages.push(message)

      message = { msg: 'SELECT_NODE', params: { idx: index } }
      messages.push(message)
      api.messages.push(message)
    }
    return messages
  }
  api.removeNode = function(val) {
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
  api.printNodes = function() {
    var head = api.head
    var currentNode = api.head

    while (currentNode !== null) {
      console.log(currentNode.val)
      currentNode = currentNode.next
    }
    console.log('\n')
  }

  return api
}

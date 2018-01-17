var lib = Lib()

const LEFTOFFSET = 80
const CANVASOFFSET = 40

var LinkedList = function() {
  let api = {}

  api.head = null

  api.createNode = function(value) {
    return {
      value: value,
      next: null
    }
  }

  api.addToList = function(value) {
    let currentNode = api.head
    let newNode = api.createNode(value)

    var index = 0

    if (api.head === null) {
      api.head = newNode
      // create node

      lib.createNode(
        index,
        api.head.value,
        LEFTOFFSET * index + CANVASOFFSET,
        200,
        20,
        200
      )

      return
    }
    while (currentNode.next !== null) {
      currentNode = currentNode.next
      index++
    }

    currentNode.next = newNode

    // draw edge
    // create node
    api.traverseListByIndex(index, 200).then(() => {
      lib
        .createNode(
          index + 1,
          newNode.value,
          LEFTOFFSET * (index + 1) + CANVASOFFSET,
          200,
          20,
          200
        )
        .then(() => {
          lib.createEdge(
            index,
            index + 1,
            LEFTOFFSET * index + CANVASOFFSET,
            200,
            LEFTOFFSET * (index + 1) + CANVASOFFSET,
            200,
            300
          )
        })
    })
  }

  api.searchListByValue = val =>
    new Promise((resolve, reject) => {
      let currentNode = api.head
      let index = 0

      while (currentNode !== null) {
        if (currentNode.value === val) {
          api.traverseListByIndex(index, 200).then(() =>
            api.displayMessage(`
          value <b>${val}</b> found at index ${index} `)
          )
          return
        }
        currentNode = currentNode.next
        index++
      }

      api.traverseListByIndex(index, 200).then(() =>
        api.displayMessage(`
      value <b>${val}</b> not found! `)
      )
    })

  api.traverseListByIndex = (index, duration) =>
    new Promise((resolve, reject) => {
      let currentNode = api.head
      let currIndex = 0
      let indexesToTraverse = []

      while (currentNode !== null && currIndex <= index) {
        indexesToTraverse.push(currIndex)
        currentNode = currentNode.next
        currIndex++
      }

      let P = Promise.resolve() // initial Promise always resolves
      indexesToTraverse.forEach(function(index) {
        P = P.then(function() {
          return new Promise(resolve => {
            lib.highlightNode(index, duration).then(() => resolve(index))
          })
        }).then(function() {
          return new Promise(resolve => {
            lib.selectNode(index, duration).then(() => resolve(index))
          })
        })
      })
      P.then(() => resolve())
    })

  api.addNodeAt = function(index, value) {
    let currentNode = api.head
    let newNode = api.createNode(value)
    if (index < 0) {
      api.displayMessage('Invalid Index')
      return
    } else if (api.head === null && index !== 0) {
      api.displayMessage('Head is null (Linked List is empty)')
      return
    } else if (index === 0 && api.head === null) {
      lib.createNode(
        index,
        newNode.value,
        LEFTOFFSET * index + CANVASOFFSET,
        200,
        20,
        200
      )
      api.head = newNode
      return
    } else if (index === 0) {
      lib
        .createNode(
          index,
          newNode.value,
          LEFTOFFSET * index + CANVASOFFSET,
          300,
          20,
          200
        )
        .then(() => {
          lib
            .createEdge(
              index,
              index + 1,
              LEFTOFFSET * index + CANVASOFFSET,
              300,
              LEFTOFFSET * index + CANVASOFFSET,
              200,
              300
            )
            .then(() => {
              var length = api.listLength()
              for (let i = length - 2; i >= index; i--) {
                lib.changeNodeID(i, i + 1)
              }
              // change edge ids

              for (let i = length - 2; i > index; i--) {
                lib.changeEdgeID(
                  'edge' + (i - 1) + '-' + i,
                  'edge' + i + '-' + (i + 1)
                )
                //lib.moveEdge(i-1,i,LEFTOFFSET*(i) +CANVASOFFSET,200,LEFTOFFSET*(i+1) +CANVASOFFSET,200,200)
              }
              for (let i = length - 2; i > index; i--) {
                lib.moveEdge(
                  i,
                  i + 1,
                  LEFTOFFSET * i + CANVASOFFSET,
                  200,
                  LEFTOFFSET * (i + 1) + CANVASOFFSET,
                  200,
                  200
                )
              }

              for (let i = index + 1; i < length; i++) {
                //lib.changeNodeID(i,i+1)
                lib.moveNode(i, LEFTOFFSET * i + CANVASOFFSET, 200, 200)
              }

              lib.moveEdge(
                index,
                index + 1,
                LEFTOFFSET * index + CANVASOFFSET,
                200,
                LEFTOFFSET * (index + 1) + CANVASOFFSET,
                200,
                200
              )
              lib.moveNode(index, LEFTOFFSET * index + CANVASOFFSET, 200, 200)
            })
        })

      newNode.next = api.head
      api.head = newNode
    }
    if (index === api.listLength()) {
      api.addToList(value)
      return
    }
    if (index > api.listLength()) {
      api.displayMessage(`<b>${index}</b> invalid! `)
      return
    }

    let i = 1
    while (currentNode !== null) {
      if (index === i) {
        api.traverseListByIndex(index - 1, 200).then(function() {
          newNode.next = currentNode.next
          currentNode.next = newNode

          lib
            .createNode(
              index,
              newNode.value,
              LEFTOFFSET * index + CANVASOFFSET,
              300,
              20,
              300
            )
            .then(() => {
              lib
                .createEdge(
                  index,
                  index + 1,
                  LEFTOFFSET * index + CANVASOFFSET,
                  300,
                  LEFTOFFSET * index + CANVASOFFSET,
                  200,
                  300
                )
                .then(() => {
                  lib
                    .moveEdge(
                      index - 1,
                      index,
                      LEFTOFFSET * (index - 1) + CANVASOFFSET,
                      200,
                      LEFTOFFSET * index + CANVASOFFSET,
                      300,
                      200
                    )
                    .then(() => {
                      var length = api.listLength()

                      // change node ids
                      for (let i = length - 2; i >= index; i--) {
                        lib.changeNodeID(i, i + 1)
                      }
                      // change edge ids

                      for (let i = length - 2; i > index; i--) {
                        lib.changeEdgeID(
                          'edge' + (i - 1) + '-' + i,
                          'edge' + i + '-' + (i + 1)
                        )
                        //lib.moveEdge(i-1,i,LEFTOFFSET*(i) +CANVASOFFSET,200,LEFTOFFSET*(i+1) +CANVASOFFSET,200,200)
                      }
                      for (let i = length - 2; i > index; i--) {
                        lib.moveEdge(
                          i,
                          i + 1,
                          LEFTOFFSET * i + CANVASOFFSET,
                          200,
                          LEFTOFFSET * (i + 1) + CANVASOFFSET,
                          200,
                          200
                        )
                      }

                      for (let i = index + 1; i < length; i++) {
                        //lib.changeNodeID(i,i+1)
                        lib.moveNode(i, LEFTOFFSET * i + CANVASOFFSET, 200, 200)
                      }
                      lib.moveNode(
                        index,
                        LEFTOFFSET * i + CANVASOFFSET,
                        200,
                        200
                      )
                      lib.moveEdge(
                        index - 1,
                        index,
                        LEFTOFFSET * (i - 1) + CANVASOFFSET,
                        200,
                        LEFTOFFSET * i + CANVASOFFSET,
                        200,
                        200
                      )
                      lib.moveEdge(
                        index,
                        index + 1,
                        LEFTOFFSET * i + CANVASOFFSET,
                        200,
                        LEFTOFFSET * (i + 1) + CANVASOFFSET,
                        200,
                        200
                      )
                    })
                })
            })
        })

        return
      }
      i++
      currentNode = currentNode.next
    }
  }
  api.displayMessage = function(message) {
    var messageBox = document.getElementById('messages')
    messageBox.innerHTML = message
  }
  api.resetMessage = function() {
    var messageBox = document.getElementById('messages')
    messageBox.innerHTML = ''
  }
  api.listLength = function() {
    let currentNode = api.head
    let length = 0
    if (api.head.next === null) {
      return 1
    }
    while (currentNode !== null) {
      currentNode = currentNode.next
      length++
    }
    return length
  }
  api.printList = function() {
    var currentNode = api.head
    while (currentNode !== null) {
      console.log(currentNode.value)
      currentNode = currentNode.next
    }
    console.log('******************')
  }

  api.removeNode = function(val) {
    let currentNode = api.head
    let index = 0

    if (api.head === null) {
      console.log('list empty')
      return
    } else if (api.head.value === val) {
      if (api.head.next === null) {
        // delete head
        api.head = null
        return
      } else if (api.head.next !== null) {
        // delete head
        api.head = api.head.next
        // move every edge and node to left
        return
      }
    } else {
      /// Check if node is at the end of list
      // remove node
      while (currentNode.next !== null) {
        if (currentNode.next.value === val) {
          if (currentNode.next.next === null) {
            currentNode.next = null
            return
          }
          // remove currentNode
          // move everything to the left;
          api.traverseListByIndex(index + 1, 200).then(function() {
            console.log(index)
            lib.moveNode(
              index - 1,
              LEFTOFFSET * (index - 2) + CANVASOFFSET,
              300,
              200
            )

            //api.moveEdgesAndNodesToLeft(index + 2, api.listLength())
            lib.createEdge(
              index,
              index + 1,
              LEFTOFFSET * index + CANVASOFFSET,
              200,
              LEFTOFFSET * (index + 1) + CANVASOFFSET,
              200,
              300
            )

            lib.deleteNode(index - 1, 200)
            console.log(index)
            lib.deleteEdge('edge' + index + '-' + (index + 1))
          })
          currentNode.next = currentNode.next.next
        }
        currentNode = currentNode.next
        index++
      }
    }
  }

  /**
   * Helper animation functions
   */
  api.moveEdgesAndNodesToLeft = (a, b) => {
    new Promise((resolve, reject) => {
      for (let i = a; i <= b; i++) {
        lib.moveNode(i, LEFTOFFSET * (i - 1) + CANVASOFFSET, 200, 200)
        lib.changeNodeID(i, i - 1)
      }
      for (let i = a; i < b; i++) {
        console.log(i, a, b)
        lib.moveEdge(
          i,
          i + 1,
          LEFTOFFSET * (i - 1) + CANVASOFFSET,
          200,
          LEFTOFFSET * i + CANVASOFFSET,
          200,
          200
        )
        lib.changeEdgeID('edge' + i + '-' + (i + 1), 'edge' + (i - 1) + '-' + i)
      }
      resolve()
    })
  }

  return api
}

var LL = LinkedList()
LL.addToList(1)
LL.addToList(2)
LL.addToList(3)

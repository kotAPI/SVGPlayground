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
  }
  api.traverseList = index => {
    new Promise((resolve, reject) => {
      let currentNode = api.head
      index = 0

      while (currentNode !== null) {
        lib.selectNode(index)
        currentNode = currentNode.next
        index++
      }
      resolve()
    })
  }
  api.addNodeAt = function(index, value) {
    let currentNode = api.head
    let newNode = api.createNode(value)

    if (index === 0) {
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
      throw Error('invalid index')
    }

    let i = 1
    while (currentNode !== null) {
      if (index === i) {
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
                    lib.moveNode(index, LEFTOFFSET * i + CANVASOFFSET, 200, 200)
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

        return
      }
      i++
      currentNode = currentNode.next
    }
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
      currentNode = currentNode.next
    }
  }
  api.removeNode = function(val) {
    let currentNode = api.head

    while (currentNode !== null) {
      if (currentNode.value === val) {
        //
      }
      currentNode = currentNode.next
    }
  }
  return api
}

var LL = LinkedList()

LL.addToList(1)

/*

let edge1, edge2, edge3, edge4, edge5
Promise.all([
  lib.createEdge(0, 1, 0, 0, 100, 100, 1000).then(edge => (edge1 = edge)),
  lib.createEdge(1, 3, 50, 0, 500, 150, 1000).then(edge => (edge2 = edge)),
  lib.createEdge(2, 3, 0, 50, 400, 200, 1000).then(edge => (edge3 = edge)),
  lib.createEdge(3, 4, 100, 50, 40, 200, 1000).then(edge => (edge4 = edge)),
  lib.createEdge(4, 5, 80, 500, 400, 20, 1000).then(edge => (edge5 = edge))
]).then(() => {
  console.log('done creating nodes')
  Promise.all([
    lib.moveEdge(edge1, 60, 10, 500, 500, 1000).then(edge => (edge1 = edge)),
    lib.moveEdge(edge2, 10, 90, 100, 750, 1000).then(edge => (edge2 = edge)),
    lib.moveEdge(edge3, 0, 150, 400, 100, 1000).then(edge => (edge3 = edge)),
    lib.moveEdge(edge4, 10, 50, 400, 200, 1000).then(edge => (edge4 = edge)),
    lib.moveEdge(edge5, 800, 500, 4, 20, 3000).then(edge => (edge5 = edge))
  ]).then(() => {
    console.log('done animating edges')
  })
})

lib
  .createNode(1, 10, 100, 100, 20, 2000)
  .then(node => lib.moveNode(1, 50, 100, 500))

lib
  .createEdge(0, 1, 0, 0, 100, 100, 1000)
  .then(() => lib.moveEdge(0, 1, 60, 10, 500, 500, 1000))

// move node node1
// move node
// create edge
// move node
lib.createNode(1, 10, 100, 100, 20, 200).then(() => {
  lib.createEdge(0, 1, 0, 0, 300, 200, 1000)
})

*/

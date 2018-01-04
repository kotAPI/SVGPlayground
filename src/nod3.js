var Lib = function(){
	var api = {}
	api.color = {
		green:"#33e033"
	}
	api.gameSpeed = 1


	// FUNCTIONS
	///
	api.createNode = function(id,x,y){
		
		var svg = document.getElementById("svg-container");
		var nodeLayer = document.getElementById("svg-node-layer")
		
		if(nodeLayer===null){
			nodeLayer = document.createElementNS("http://www.w3.org/2000/svg","g")
			nodeLayer.setAttribute("id","svg-node-layer")
			svg.append(nodeLayer)
			nodeLayer = document.getElementById("svg-node-layer")
		}


		//// CREATE A CIRCLE 
		var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

		circle.setAttribute("id",id)
		circle.setAttribute("cx",x)
		circle.setAttribute("cy",y)
		circle.setAttribute("r",20)
		circle.innerHTML = 20
		circle.setAttribute("fill",api.color.green)
		//
		
		///// CIRCLE TEXT
		var text = document.createElementNS("http://www.w3.org/2000/svg", "text")
		text.setAttribute("text-anchor","middle")
		text.setAttribute("alignment-baseline","middle")
		text.setAttribute("x",x)
		text.setAttribute("y",y)
		text.textContent = id

		//// NODE GROUP = CIRCLE + TEXT
		var nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
		nodeGroup.setAttribute("id","node-group-"+id)
		nodeGroup.append(circle)
		nodeGroup.append(text)


		/// APPEND GROUP TO NODELAYER
		nodeLayer.append(nodeGroup)	
	}
	api.moveNode = function(id,x,y){
		var nodeGroup = document.getElementById("node-group-"+id)
		var circle = nodeGroup.childNodes[0]
		var text   = nodeGroup.childNodes[1]

		var x = Math.floor(x)
		var y = Math.floor(y)

		
		var curr_x = parseFloat(circle.getAttribute("cx"))
		var curr_y = parseFloat(circle.getAttribute("cy"))
		
		var slope = parseFloat(curr_y - y) /  parseFloat(curr_x-x)



		var velocity = 1 * api.gameSpeed
		

		
		if(curr_x!==x && curr_y!==y){
			if(curr_x<x){
				curr_x += velocity
			}
			if(curr_x>x){
				curr_x -= velocity
			}
			curr_y = slope*(curr_x-x) + y

			circle.setAttribute("cx",curr_x)
			circle.setAttribute("cy",curr_y)
			text.setAttribute("x",curr_x)
			text.setAttribute("y",curr_y)


			setTimeout(()=>{
				api.moveNode(id,x,y)
			},1)
			
			
		}

		
	}
	

	api.createEdge = function(id,x1,y1,x2,y2){
			var svg = document.getElementById("svg-container");
			var edgeLayer = document.getElementById("svg-edge-layer")
			
			var dx = x2-x1;



			if(edgeLayer===null){
				edgeLayer = document.createElementNS("http://www.w3.org/2000/svg","g")
				edgeLayer.setAttribute("id","svg-edge-layer")
				svg.prepend(edgeLayer)
				edgeLayer = document.getElementById("svg-edge-layer")
			}

			var edge = document.createElementNS("http://www.w3.org/2000/svg","line")
			edge.setAttribute("id","edge"+id)
			edge.setAttribute("x1",x1)
			edge.setAttribute("y1",y1)
			edge.setAttribute("x2",x1)
			edge.setAttribute("y2",y1)
			edge.setAttribute("stroke-width",2)
			edge.setAttribute("stroke","black")

			edgeLayer.append(edge)
			api.h_animateEdge(id,x1,y1,x2,y2)

	}
	api.h_animateEdge = function(id,x1,y1,x2,y2){
		var edge = document.getElementById("edge"+id)

		var curr_x = parseFloat(edge.getAttribute("x2"))
		var curr_y = parseFloat(edge.getAttribute("y2"))

		var slope = parseFloat(curr_y - y2) /  parseFloat(curr_x-x2)

		var velocity = parseFloat(x2-x1)/100

		if(curr_x!==x2 || curr_y!==y2){

			if(curr_x<x2){
				curr_x += 1
			}
			if(curr_x>x2){
				curr_x -= 1;
			}
			curr_y = slope*(curr_x-x2) + y2

			
			edge.setAttribute("x2",curr_x)
			edge.setAttribute("y2",curr_y)
			setTimeout(()=>{
				api.h_animateEdge(id,x1,y1,x2,y2)
			},1)
		}
		
	}
	api.deleteEdge = function(id){
		var edge = document.getElementById("edge"+id)
		console.log(edge)
		api.h_del_animateEdge(edge)

	}
	// api.h_del_animateEdge = function(edge){
	// 	var x1 = parseFloat(edge.getAttribute("x1"))
	// 	var y1 = parseFloat(edge.getAttribute("y1"))
	// 	var x2 = parseFloat(edge.getAttribute("x2"))
	// 	var y2 = parseFloat(edge.getAttribute("y2"))

	// 	var slope = parseFloat(y2 - y1) /  parseFloat(x2-x1)

		

	// 	if(x1!==x2 || y1!==y2){
	// 		if(slope>=0){
	// 			if(x2<x1){
	// 				x2 += 1 
	// 			}
	// 			if(x2>x1){
	// 				x2 -= 1
	// 			}
	// 			y2 = slope*Math.abs(x1-x2) + y1
	// 		}
	// 		else{
	// 			if(x2>x1){
	// 				x2 -= 1 
	// 			}
	// 			if(x2<x1){
	// 				x2 += 1
	// 			}
	// 			y2 = slope*Math.abs(x1-x2) + y1
	// 		}

	
	// 		edge.setAttribute("x2",x2)
	// 		edge.setAttribute("y2",y2)
	// 		setTimeout(()=>{
	// 			api.h_del_animateEdge(edge)
	// 		},1)
	// 	}
	// 	else{
	// 		edge.parentNode.removeChild(edge);
	// 	}


	// }
	


	return api;
}


var lib = Lib()
lib.createNode(1,200,500)
lib.createEdge(1,500,500,0,0)
lib.moveNode(1,0,0)
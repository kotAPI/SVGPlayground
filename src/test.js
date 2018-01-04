var vizsettings = {
	speed : 0.4,
	NodeColor:"rgb(67, 218, 15)"

}

var globalDelay = 0;



var Visualization = function(){
	api = {}

	api.delayCounter =0
	api.gameSpeed = 1.0
	api.messages = []
	api.animating = false;
	api.top = 0;
	api.traversalArr = []

	////////////////////////////
	/// Slider functions
	/// Just give your slider an id of "viz-slider"
	////////////////////////////
	api.initSlider = function(){
		var slider = document.getElementById("viz-slider")
		
		if(slider){
			slider.addEventListener("input",this.changeGameSpeed)
			if(localStorage.sliderValue){
				slider.value = localStorage.sliderValue
				api.gameSpeed = 2 - slider.value/50
			}
			else{
				slider.value = 50
				api.gameSpeed = 2 - slider.value/50
			}
		}
		else{
			console.error("Make sure your slider is present with an id of 'viz-slider'")
		}
		
	}
	api.changeGameSpeed = function(){
		var slider = document.getElementById("viz-slider")

		api.gameSpeed = 2 - slider.value/50
		
		localStorage.sliderValue = slider.value
	}
	////////////////////////////
	//  END OF SLIDER FUNCTIONS
	////////////////////////////
	api.parseMessage = function(obj){
		console.log(obj)
		
		if(obj.msg!==undefined){
			
			if(obj.msg ==="PRINT_NODE"){
				
				setTimeout(()=>{
					api.traversalArr.push(obj.params.val)
					api.messageBox(api.traversalArr.map((a,i)=>"<div class='node'>"+api.traversalArr[i]+" </div>")

					)
				},api.delayCounter)
				
			}

			if(obj.msg === "NODE_NOT_FOUND"){
			setTimeout(()=>{

				api.messageBox("<b>"+obj.params.val +"</b>" +" Not found!")
			},api.delayCounter)
			
			}
			if(obj.msg === 'SPAWN_NODE'){
				
				var node = findXYPos(obj.params.idx, CONFIG);
				api.createNode(node.x,node.y,obj.params.val,api.delayCounter,obj.params.idx)


			}
			else if (obj.msg === 'SPAWN_EDGE') {

			    var node1 = findXYPos(obj.params.from, CONFIG);
			    var node2 = findXYPos(obj.params.to, CONFIG);
			    api.createEdge(obj.params.from, obj.params.to, node1.x, node1.y, node2.x, node2.y,api.delayCounter);
			}
			else if (obj.msg === 'SELECT_NODE') {

		    	api.selectNode(obj.params.idx,api.delayCounter);
		  	}
		  	else if (obj.msg === 'HIGHLIGHT_NODE') {
			    api.selectNode(obj.params.idx,api.delayCounter);
			  }
			else if (obj.msg === 'HIGHLIGHT_EDGE') {
			    api.highlightEdge(obj.params.from, obj.params.to,api.delayCounter);
			  }
			 else if (obj.msg === 'SELECT_EDGE') {
			    api.selectEdge(obj.params.from, obj.params.to,api.delayCounter);
			  }
		}
		
	}
	api.animate = function(){
		//document.getElementById("layer-1").innerHTML = ""
		//document.getElementById("layer-2").innerHTML = ""
		var counter = 0;
		api.animating = true
		api.toggleButtons()
		for(var i=0;i<api.messages.length;i++){
			for(var j=0;j<api.messages[i].length;j++){
					counter ++;
					if(counter>api.top){
						api.delayCounter += 1000*api.gameSpeed

						api.parseMessage(api.messages[i][j])
									
					}
					else{
						api.delayCounter = 0;
					}			
					
			}
			
		}
		setTimeout(()=>{
			api.animating = false
			api.toggleButtons()
		},api.delayCounter)

		api.top = counter
	
	}
	api.toggleButtons = function(){
		if(api.animating){
			document.getElementById("insertbutton").disabled = true
			document.getElementById("searchbutton").disabled = true

		}
		else{
			document.getElementById("insertbutton").disabled = false
			document.getElementById("searchbutton").disabled = false
		}
	}
	api.messageBox = function(message){
		var messagebox = document.getElementById("messages")
		messagebox.innerHTML = message
	}
	api.resetEdges = function(){
		api.traversalArr = []
		d3.selectAll("circle").style("fill",vizsettings.NodeColor)
		d3.selectAll("line").attr("stroke","orange").attr("stroke-width",2)
	}
	api.createNode = function(x,y,text,delay,id){
		var g = d3.select("#layer-2").append("g").attr("id","group"+text)
				  .append("circle")
				  .attr("id","circle"+id)
				  .attr("cx",x)
				  .attr("cy",y)
				  .attr("r",0)
				  .attr("fill","red")
				  .transition()
				  .delay(delay)
				  .attr("r",20)
				  .duration(1000* api.gameSpeed)
				  .style("fill",vizsettings.NodeColor)
				  .on("end",()=>{
				  	api.resetEdges()
				  })

				d3.select("#layer-2").select("#group"+text).append('text')
			      .attr('id', 'text' + text)
			      .attr('x', x)
			      .attr('y', y)
			      .style("fill","transparent")
			      .text(text + '')
			      .attr('text-anchor', 'middle')
			      .attr('dominant-baseline', 'central')
			      .transition()
						  .delay(delay)
						  .duration(1000 * api.gameSpeed)
						  .style("fill","black")

				
	}
	api.createEdge = function(fromid, toid, x1, y1, x2, y2, delay){
		 d3
	      .select('#layer-1')
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
	      .duration(1000 * api.gameSpeed)
	      .attr('x2', x2)
	      .attr('y2', y2)
	}
	api.highlightEdge = function(fromid, toid,delay){
		var edge = d3
      .select('#layer-1')
      .selectAll('#edge' + fromid + '-' + toid)
      .select('line')
      .attr('stroke-width', 2)
      .style('stroke', 'black')
      .transition()
      .duration(1000*api.gameSpeed)
      .delay(delay)
      .attr("stroke-width",6)
      .attr("stroke",vizsettings.NodeColor)

	}
	api.checkIfNodeExists = function(value){
		for(var i=0;i<api.messages.length;i++){
			for(var j=0;j<api.messages[i].length;j++){
				if(messages[i][j].msg === "SPAWN_NODE"){
					if(messages[i][j].params.val == value){
						return true
					}
				}
			}
		}
	}
	api.selectEdge = function(fromid,toid,delay){
		 d3
      .select('#layer-1')
      .append('g')
      .attr('id', 'edge' + fromid + '-' + toid)
      .attr('class', 'edge')
      .append('line')
  	  .attr("stroke-width",4)
      
      .attr('stroke', 'orange')
      .transition()
      .attr('stroke-width', 10)
      .duration(1000*api.gameSpeed)
      .delay(delay)
	}
	api.selectNode = function(value,delay){

		 d3.select("#circle"+value).style("fill",vizsettings.NodeColor)
		 .transition()
		 .style("fill","red")
		 .duration(1000*api.gameSpeed)
		 .delay(delay)
	      

	}
	api.deleteNode = function(value){
		//case 1

		// d3.select("#group"+value)
		//  .style("fill",vizsettings.NodeColor)
		//  .transition()
		//  .style("fill","black")
		//  .duration(1000)
		//  .remove()

		// d3.select("#circle"+"6").style("fill",vizsettings.NodeColor)
		//  .transition()
		//  .style("fill","black")
		//  .duration(1000)
		//  .remove()

		// d3.select("#edge2-6")
		//  .select("line")
		//  .transition()
		//  .style("stroke-width",1)
		//  .attr("x2",600).attr("y2",90)
		//  .duration(2000)
		



		//case 2

		// d3.select("#group"+value)
		//  .style("fill",vizsettings.NodeColor)
		//  .transition()
		//  .style("fill","black")
		//  .duration(1000)
		//  .remove()

		// d3.select("#circle"+"6").style("fill",vizsettings.NodeColor)
		//  .transition()
		//  .style("fill","black")
		//  .duration(1000)
		//  .remove()

		//  d3.select("#group"+"85").style("fill",vizsettings.NodeColor)
		//  .select("circle")
		//  .transition()
		//  .attr("cx",700).attr("cy",150)
		//  .duration(2000)

		//   d3.select("#group"+"85").style("fill",vizsettings.NodeColor)
		//  .select("text")
		//  .transition()
		//  .attr("x",700).attr("y",150)
		//  .duration(2000)
		 

		// d3.select("#edge14-29")
		//  .select("line")
		//  .transition()
		//  .style("stroke-width",2)
		//  .attr("x2",750).attr("y2",210)
		//  .duration(1000)

		//  d3.select("#edge2-6")
		//  .select("line")
		//  .transition()
		//  .style("stroke-width",2)
		//  .attr("x2",600).attr("y2",90)
		//  .duration(1000)
		//  .transition()
		//  .attr("x1",700).attr("y1",150)
		//  .duration(1000)


		//   d3.select("#edge6-13")
		//  .select("line")
		//  .transition()
		//  .style("stroke-width",2)
		//  .attr("x1",650).attr("y1",210)
		//  .duration(1000)
		//  .transition()
		//  .attr("x1",700).attr("y1",150)
		//  .duration(1000)

		//   d3.select("#edge6-14")
		//  .select("line")
		//  .transition()
		//  .style("stroke-width",2)
		//  .attr("x1",750).attr("y1",210)
		//  .duration(1000)
		//  .transition()
		//  .attr("x1",700).attr("y1",150)
		//  .duration(1000)


		// case 3
		d3.select("#edge0-2").select("line").transition().attr("x2",400).attr("y2",30).duration(500)
		.transition().attr("x2",1000).attr("y2",10000)



		d3.select("#edge2-6").select("line").transition().attr("x2",600).attr("y2",90).duration(500)
		d3.select("#edge6-14").select("line").transition().attr("x2",700).attr("y2",150).duration(500)
		d3.select("#edge0-2").select("line").transition().attr("x2",400).attr("y2",30).duration(500)




		d3.select("#group"+"60")
		 .style("fill",vizsettings.NodeColor)
		 .transition()
		 .style("fill","black")
		 .duration(500)
		 .remove()

		d3.select("#circle"+"3").style("fill",vizsettings.NodeColor)
		 .transition()
		 .style("fill","black")
		 .duration(1000)
		 .remove()

		
		

		 d3.select("#group80")
		   .select("circle")
		   .transition()
		   .attr("cx",600)
		   .attr("cy",90)
		   .duration(1000)

		 d3.select("#group80")
		   .select("text")
		   .transition()
		   .attr("x",600)
		   .attr("y",90)
		   .duration(1000)
		   ////////////////////////////////
		d3.select("#group90")
		   .select("circle")
		   .transition()
		   .attr("cx",700)
		   .attr("cy",150)
		   .duration(1000)

		 d3.select("#group90")
		   .select("text")
		   .transition()
		   .attr("x",700)
		   .attr("y",150)
		   .duration(1000)
		 ///////////////////////////////////
		   ////////////////////////////////
		d3.select("#group100")
		   .select("circle")
		   .transition()
		   .attr("cx",750)
		   .attr("cy",210)
		   .duration(1000)

		 d3.select("#group100")
		   .select("text")
		   .transition()
		   .attr("x",750)
		   .attr("y",210)
		   .duration(1000)

		d3.select("#edge14-30").select("line")
		.remove()



		

		//d3.select("#edge0-2").select("line").transition()
		//.attr("x2",600).attr("y2",90).duration(1000)
		

		
	}
	api.init = function(){
		this.initSlider();
		
	}







	return api;
}

var viz = Visualization()
viz.init();


let tree = [];
let messages = [];



viz.messages = messages

var isANumber = function(number){
	if(!isNaN(number)){
		return true;
	}
	else{
		return false;
	}
}

var insertIntoTree = function(){
	
	viz.resetEdges()
	var a  = document.getElementById("insertVal").value
	a = parseInt(a)

	if(isANumber(a)){
		if(viz.checkIfNodeExists(a)){
			viz.messageBox("<b>"+a+"</b>" +" Already Exists! ")
		}
		else{
			insert(tree,a,messages)	
			viz.messages = messages
			viz.animate()
		}
		
	}
	else{
		console.error("Please enter a valid number")
	}
	
}

var searchTree = function(){
	viz.resetEdges()
	var val = document.getElementById("searchVal").value
	val = parseInt(val)
	if(isANumber(val)){
		

			search(tree,parseInt(val),messages)
			viz.messages = messages
			viz.animate();

		
	}
	else{
		console.error("Please enter a valid number")
	}
	
}

insert(tree,50,messages)
insert(tree,60,messages)
insert(tree,80,messages)
insert(tree,90,messages)
insert(tree,100,messages)

viz.animate()

var inorderTree = function(){
	viz.resetEdges()
	inorderTraversal(tree,0,messages)
	viz.messages = messages
	viz.animate()
	
}

var preorderTree = function(){
	viz.resetEdges()
	preorderTraversal(tree,0,messages)
	viz.messages = messages
	viz.animate()
}

var postorderTree = function(){
	viz.resetEdges()
	postorderTraversal(tree,0,messages)
	viz.messages = messages
	viz.animate()
}

var deleteNode = function(){
	viz.resetEdges();
	var val = document.getElementById("removeVal").value
	viz.deleteNode(val)
}


//deleteNode()
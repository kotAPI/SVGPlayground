var vizsettings = {
	speed : 0.4,

}

var globalDelay = 0;

function createCircle(x,y,text,duration){
	var duration = duration/vizsettings.speed
	globalDelay += duration

	g = d3.select("g").attr("id",text).append("circle").attr("cx",x).attr("cy",y).attr("r",0).style("fill","red")
	.transition().delay(globalDelay).duration(duration).attr("r",20).on("end",()=>{

	})

	g = d3.select("#"+text).append("text").attr('id', 'text' + text)
	  .style("fill","white")
      .attr('x', x)
      .attr('y', y)
      .text(text + '')
      .transition()
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .delay(globalDelay).duration(duration)
      .style("fill","black")

     return g
}



var animations = [
					createCircle(20,20,"yo",0),
				  	createCircle(80,40,"yolo",10),
				  	createCircle(80,80,"fake",100),
				  	createCircle(80,120,"doesntwork",100),
				  	createCircle(80,160,"works",200)
				 ]



function animate(index){

        if(index < animations.length - 1){
            index = index + 1
            return animations[index]().each("end", animate(index))
        } 
        else {
        	
            return true
        }

}

animate()

var Visualization = function(){
	api = {}
	api.gameSpeed = 1.0

	api.initSlider = function(){
		var slider = document.getElementById("viz-slider")
		slider.addEventListener("input",this.changeGameSpeed)
		slider.value=0;
	}
	api.changeGameSpeed = function(){
		var slider = document.getElementById("viz-slider")
		this.gameSpeed = slider.value/50
	}
	api.init = function(){
		this.initSlider();
	}
	return api;
}

var viz = Visualization()
viz.init();
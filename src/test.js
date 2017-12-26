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




var Visualization = function(){
	api = {}
	api.gameSpeed = 1.0

	////////////////////////////
	/// Slider functions
	/// Just give your slider an id of "viz-slider"
	////////////////////////////
	api.initSlider = function(){
		var slider = document.getElementById("viz-slider")
		if(slider){
			slider.addEventListener("input",this.changeGameSpeed)
			slider.value=0;
		}
		else{
			console.error("Make sure your slider is present with an id of 'viz-slider'")
		}
		
	}
	api.changeGameSpeed = function(){
		var slider = document.getElementById("viz-slider")
		this.gameSpeed = slider.value/50
		console.log(this.gameSpeed)
	}
	////////////////////////////
	//  END OF SLIDER FUNCTIONS
	////////////////////////////
	api.init = function(){
		this.initSlider();
	}
	return api;
}

var viz = Visualization()
viz.init();
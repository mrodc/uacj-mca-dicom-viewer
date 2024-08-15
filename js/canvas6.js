var zoomIntensity = 0.1; 
  
var canvas ;//= document.getElementById("canvas"); 
var context;// = canvas.getContext("2d"); 
var width = 600; 
var height = 200; 

var scale = 1; 
var orgnx = 0; 
var orgny = 0; 
var visibleWidth = width; 
var visibleHeight = height; 

function initCanvas6(){
    canvas = document.getElementById("canvasDC"); 
    context = canvas.getContext("2d"); 
    setInterval(draw, 800 / 60);

}
function draw() { 
    context.fillStyle = "white"; 
    context.fillRect(orgnx, orgny, 800 / scale, 800 / scale); 
    context.fillStyle = "green"; 
    context.fillRect(250,50,100,100);  
} 
 
  
// Scroll effect function 
canvas.onwheel = function(event) { 
    event.preventDefault(); 
    var x = event.clientX - canvas.offsetLeft; 
    var y = event.clientY - canvas.offsetTop; 
    var scroll = event.deltaY < 0 ? 1 : -2; 

    var zoom = Math.exp(scroll * zoomIntensity); 

    context.translate(orgnx, orgny); 

    orgnx -= x / (scale * zoom) - x / scale; 
    orgny -= y / (scale * zoom) - y / scale; 

    context.scale(zoom, zoom); 
    context.translate(-orgnx, -orgny); 

    // Updating scale and visisble width and height 
    scale *= zoom; 
    visibleWidth = width / scale; 
    visibleHeight = height / scale; 
} 
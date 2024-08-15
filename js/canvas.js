//var //canvas ;//= document.getElementById('canvas');
var context ;//= canvas.getContext('2d');

var mousePos;// = document.getElementById('mouse-pos');
var transformedMousePos ;//= document.getElementById('transformed-mouse-pos');

var canvasImage = new Image();

var isDragging = false;
var dragStartPosition = { x: 0, y: 0 };
var currentTransformedCursor;

function initCanvas(){
    canvas = document.getElementById('canvasDC');
    context = canvas.getContext('2d');
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel);
    //mousePos = document.getElementById('mouse-pos');
    //transformedMousePos = document.getElementById('transformed-mouse-pos');
    
}
function drawImageToCanvas() {
    context.save();
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0,0,canvas.width,canvas.height);
    //context.transformedPoint(canvas.width,canvas.height);
    context.restore();

    context.drawImage(canvasImage, 0, 0, 200, 200);
}

function getTransformedPoint(x, y) {
  const originalPoint = new DOMPoint(x, y);
  return context.getTransform().invertSelf().transformPoint(originalPoint);
}

function onMouseDown(event) {
    isDragging = true;
    dragStartPosition = getTransformedPoint(event.offsetX, event.offsetY);
}

function onMouseMove(event) {
    currentTransformedCursor = getTransformedPoint(event.offsetX, event.offsetY);
    //mousePos.innerText = `Original X: ${event.offsetX}, Y: ${event.offsetY}`;
    //transformedMousePos.innerText = `Transformed X: ${currentTransformedCursor.x}, Y: ${currentTransformedCursor.y}`;
    
    if (isDragging) {
        context.translate(currentTransformedCursor.x - dragStartPosition.x, currentTransformedCursor.y - dragStartPosition.y);
        drawImageToCanvas();
    }
}

function onMouseUp() {
    isDragging = false;
}

function onWheel(event) {
    const zoom = event.deltaY < 0 ? 1.1 : 0.9;

    context.translate(currentTransformedCursor.x, currentTransformedCursor.y);
    context.scale(zoom, zoom);
    context.translate(-currentTransformedCursor.x, -currentTransformedCursor.y);
        
    drawImageToCanvas();
    event.preventDefault();
}
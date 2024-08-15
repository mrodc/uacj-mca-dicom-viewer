
var canvas;// = document.getElementsByTagName('canvas')[0];
var ctx;
var wImage = new Image;
var lastX;//=canvas.width/2, 
var lastY;//=canvas.height/2;

var dragStart, dragged;
var scaleFactor = 1.1;

function initCanvas2() {
    canvas = document.getElementById('canvasDC');
    canvas.width = 800;
    canvas.height = 600;

    visibleWidth = canvas.width;
    visibleHeight = canvas.height;


    ctx = canvas.getContext('2d');
    trackTransforms(ctx);
    lastX = originx =  canvas.width / 2;
    lastY = originy =  canvas.height / 2;

    canvas.addEventListener('mousedown', function (evt) {
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = ctx.transformedPoint(lastX, lastY);
        dragged = false;
    }, false);

    canvas.addEventListener('mousemove', function (evt) {
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragged = true;
        if (dragStart) {
            var pt = ctx.transformedPoint(lastX, lastY);
            ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
            redraw2();

        }
    }, false);

    canvas.addEventListener('mouseup', function (evt) {
        dragStart = null;
        if (!dragged) zoom(evt.shiftKey ? -1 : 1);
    }, false);

    //canvas.addEventListener('DOMMouseScroll', handleScroll, false);
    canvas.addEventListener('mousewheel', handleScroll, false);

}

var filterContent = [];

function setFilter(filter){
    //alert('The FILTER: ' + filter);
    ctx.filter = filter;
    redraw2();
}
function redraw() {

    
    // Clear the entire canvas
    var p1 = ctx.transformedPoint(0, 0);
    var p2 = ctx.transformedPoint(canvas.width, canvas.height);
    ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.drawImage(wImage, 0, 0);

}

function redraw2() {
    //alert("redraw2");
    var p1 = ctx.transformedPoint(0, 0);
    var p2 = ctx.transformedPoint(canvas.width, canvas.height);
    ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    var keys = Object.keys(wImage);
    //alert("Keys: " + keys);

    //var canvas = ctx.canvas ;
    var hRatio = canvas.width / wImage.width;
    var vRatio = canvas.height / wImage.height;
    var ratio = Math.min(hRatio, vRatio);

    // var centerShift_x = ( canvas.width - wImage.width*ratio ) / 2;
    // var centerShift_y = ( canvas.height - wImage.height*ratio ) / 2;  
    var centerShift_x = (canvas.width - wImage.width *ratio) / 2;
    var centerShift_y = (canvas.height - wImage.height*ratio ) / 2;
    //alert("X: " + centerShift_x + " Y: " + centerShift_y+ " R: "+ ratio);

    //ctx.clearRect(0,0,canvas.width, canvas.height);

    //ctx.drawImage(wImage, 0, 0, wImage.width * hRatio, wImage.height * vRatio);//,
    // centerShift_x,centerShift_y,wImage.width*ratio, wImage.height*ratio);  
    //alert("Redraw2");
    //ctx.drawImage(wImage, 0,0, wImage.width, wImage.height);
    ctx.drawImage(wImage,centerShift_x, centerShift_y);

    // ctx.drawImage(wImage, 0,0, wImage.width, wImage.height,
    //                    centerShift_x,centerShift_y,wImage.width*ratio, wImage.height*ratio);  
    window.requestAnimationFrame(redraw2);
}

var zoom = function (clicks) {
    //alert("(x,y) " + lastX + "," + lastY + " -- clicks " + clicks);
    var pt = ctx.transformedPoint(lastX, lastY);
    ctx.translate(pt.x, pt.y);
    var factor = Math.pow(scaleFactor, clicks);
    ctx.scale(factor, factor);
    ctx.translate(-pt.x, -pt.y);
    redraw2();

}

var handleScroll = function (evt) {
    var delta = evt.wheelDelta ? evt.wheelDelta / 100 : evt.detail ? -evt.detail : 0;
    if (delta) zoom(delta);
    return evt.preventDefault() && false;
};
var zoomIntensity = 0.05;
var scale = 1;
var originx = 0;
var originy = 0;
var visibleWidth;// = width;
var visibleHeight;// = height;

function handleScroll_ (event) {
    event.preventDefault();
    
    // Get mouse offset.
    const mousex = event.clientX - canvas.offsetLeft;
    const mousey = event.clientY - canvas.offsetTop;
    // Normalize mouse wheel movement to +1 or -1 to avoid unusual jumps.
    const wheel = event.deltaY < 0 ? 1 : -1;

    // Compute zoom factor.
    var zoomT = Math.exp(wheel * zoomIntensity);
    
    // Translate so the visible origin is at the context's origin.
    ctx.translate(lastX, lastY);
    //alert("gggg");
    // Compute the new visible origin. Originally the mouse is at a
    // distance mouse/scale from the corner, we want the point under
    // the mouse to remain in the same place after the zoom, but this
    // is at mouse/new_scale away from the corner. Therefore we need to
    // shift the origin (coordinates of the corner) to account for this.
    lastX -= mousex / (scale * zoomT) - mousex / scale;
    lastY -= mousey / (scale * zoomT) - mousey / scale;
    //alert("bbbbb");
    // Scale it (centered around the origin due to the translate above).
    try{
    ctx.scale(zoomT, zoomT);
    }
    catch(ex){
        alert("Ex: " + ex.what + "   ZoomT: " + zoomT);
    }
    //alert("mmmmm");
    // Offset the visible origin to it's proper position.
    ctx.translate(-lastX, -lastY);
    
    // Update scale and others.
    scale *= zoomT;
    visibleWidth = canvas.width / scale;
    visibleHeight = canvas.height / scale;
    //alert("WHEEL");
    //redraw2();
}


//wImage.src = 'https://via.placeholder.com/350';

// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms(ctx) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function () { return xform; };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function () {
        savedTransforms.push(xform.translate(0, 0));
        return save.call(ctx);
    };

    var restore = ctx.restore;
    ctx.restore = function () {
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function (sx, sy) {
        xform = xform.scaleNonUniform(sx, sy);
        return scale.call(ctx, sx, sy);
    };

    var rotate = ctx.rotate;
    ctx.rotate = function (radians) {
        xform = xform.rotate(radians * 180 / Math.PI);
        return rotate.call(ctx, radians);
    };

    var translate = ctx.translate;
    ctx.translate = function (dx, dy) {
        xform = xform.translate(dx, dy);
        return translate.call(ctx, dx, dy);
    };

    var transform = ctx.transform;
    ctx.transform = function (a, b, c, d, e, f) {
        var m2 = svg.createSVGMatrix();
        m2.a = a; m2.b = b; m2.c = c; m2.d = d; m2.e = e; m2.f = f;
        xform = xform.multiply(m2);
        return transform.call(ctx, a, b, c, d, e, f);
    };

    var setTransform = ctx.setTransform;
    ctx.setTransform = function (a, b, c, d, e, f) {
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx, a, b, c, d, e, f);
    };

    var pt = svg.createSVGPoint();
    ctx.transformedPoint = function (x, y) {
        pt.x = x; pt.y = y;
        return pt.matrixTransform(xform.inverse());
    }
}
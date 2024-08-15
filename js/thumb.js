function nextPrevImage(event) {
    var img = targetElement(event);
    alert("KEY: " + img.title);
}
function setImagefunction(event) {
    //alert('Thumb: ' );

    // var ths = dojo.query(".thumb");tdImg
    var ths = dojo.query(".tdImg");
    dojo.forEach(ths, function (item, i) {
        dojo.removeClass(item, "imageBorder");
    });

    var fn = dojo.byId('filename');
    var img = targetElement(event);

    //alert('Thumb2: ' );

    fn.innerHTML = 'Image: ' + img.title;
    var tdP = dojo.query(img).parent('.tdImg');

    if (tdP.length > 0) {
        dojo.addClass(tdP[0], 'imageBorder');
    }
    var dmfile = dojo.attr(img, 'data-dicomfile');
    var dmfldr = dojo.attr(img, 'data-folder');
   
    var pth = { dir: 'ML_Data', folder: dmfldr, name: dmfile };

    //alert('Thumb3: ' + JSON.stringify(pth));
   // alert('Thumb3: ' );
    wImage = new Image();
    
    wImage = img;
    wImage.onload = redraw2;
    if (dmfile != undefined) {
        invokeTask(pth);
    }

}

function buildThumbs(data) {

    var tbody = dojo.byId('thumbbody');


    // var host = dojo.byId('thumbDiv');
    // dojo.empty(host);
    // //alert("TABLE " + host.id);
    // var table = dojo.create('table', {}, host);
    // dojo.create('caption',{innerHTML:'Test'}, table);
    // // dojo.place('<caption id="canvasCaption" style="text-align:left; color: blue">Test</caption>',table);

    var tr = dojo.create('tr', {}, tbody);

    dojo.forEach(data, function (item, index) {
        var td = dojo.create('td', { class: 'tdImg' }, tr);
        var img = '<img class="thumb " src="/img/Book_openHS.png"  title="' + index + '" alt="1"><br>Frame_' + index;
        //alert("IMG " + img);
        dojo.place(img, td);

    });

}
function targetElement(e) {


    var elem;
    var evt = e;//? e : event;
    if (evt.srcElement) {
        elem = evt.srcElement;
    }
    else {
        if (evt.target)
            elem = evt.target;
        else
            elem = e;

    }
    //alert("TARGET" + elem);
    return elem;
    //btnAction = dojo.attr(elem, "alt"); // get

}
var imgHandlerEvents = [];

function removeImgEvents() {
    dojo.forEach(imgHandlerEvents, dojo.disconnect);
}
function setImgEvents() {

    var imgF;
    var ths = dojo.query(".thumb");
    dojo.forEach(ths, function (item, i) {
        //imgHandlerEvents.push(item.on('click', setImagefunction));
        // if (i == 0)
        //     imgF = item;

        dojo.connect(item, "onclick", setImagefunction);
        //imgHandlerEvents.push(dojo.connect(item, "onclick", setImagefunction));
        //imgHandlerEvents.push(dojo.connect(item, "onkeyup", setImagefunction));//nextPrevImage));
    });

    //alert("FIRST " + imgF);
    //setImagefunction(imgF)
    setImagefunction(ths[0]);

}

function keyDownEvent() {
    var focused_element = null;
    if (
        document.hasFocus() &&
        document.activeElement !== document.body &&
        document.activeElement !== document.documentElement
    ) {
        focused_element = document.activeElement;

        alert("FOCUS: " + focused_element);
        if (dojo.hasClass(focused_element, 'thumb')) {

            alert("FOCUS: " + focused_element.title);
        }
    }

}
// window.addEventListener('keydown', keyDownEvent, false);
var imgDta = ['/img/Book_openHS.png',
    '/img/Book_openHS.png',
    '/img/Book_openHS.png',
    '/img/Book_openHS.png',
    '/img/Book_openHS.png',
    '/img/Book_openHS.png',
    '/img/Book_openHS.png']
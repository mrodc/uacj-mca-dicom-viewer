var wSocket;
var wRawData;
var wsTimeOut = 50;
var wsTotal = 0;
var wsLength = 24000;
var wSize = 0;
var wByteData;
var wChunk;

var imgCheck = '/img/imagesAll/16/icon33Check.png';
var imgunCheck = '/img/imagesAll/16/icon33unCheck.png';
var imgTreeCheck = '/img/imagesAll/16/icon33Threestate.png';

function setupTxMessage(action, message) {
    var json;
    if (message != undefined) {
        json = JSON.stringify(
            {
                Action: action,
                Message: message

            });
    }
    else {
        json = JSON.stringify(action);
    }
    //alert("Sending: " + json);
    wSocket.send(json);


}
function setupTxFile(file, dataArray, action, datasetName) {

    var filetype = file.type;
    var filename = file.name;
    wSize = file.size;

    wsTotal = 0;
    wChunk = Math.ceil(wSize / wsLength);
    //wChunk = (wSize / wsLength);
    //alert("CHINK: " + wChunk);
    wByteData = new Uint8Array(dataArray);

    var cmd = {
        Action: action,
        FileName: filename,
        FileType: filetype,
        Chunk: wChunk,
        Models: chkModels.sort(),
        UseDataset: datasetName != undefined ? datasetName : 'none'
    };

    if (filetype != 'application/dicom') {
        cmd.Width = wImage.width;
        cmd.Height = wImage.height;
    }
    var json = JSON.stringify(cmd);
    //alert("SEND: " + wSize + " -- " + json);

    wSocket.send(json);

    //alert("start sending file");

    ////setTimeout(sendFile, wsTimeOut);
}
function sendFile() {

    var sendFlag = false;
    var txData;//= [];            

    //var byteData = new Uint8Array(wRawData);
    var len = (wSize - wsTotal);
    if (len > wsLength) {

        txData = wByteData.slice(wsTotal, wsTotal + wsLength);
        sendFlag = true;
    }
    else {
        txData = wByteData.slice(wsTotal, wsTotal + len);
    }
    wsTotal += txData.byteLength;
    //alert("Sending from settimeout");

    wSocket.send(txData);

    // if (sendFlag)
    //     setTimeout(sendFile, wsTimeOut);
}

function webSocketOpen(ipAddress) {
    //alert("IN weSocketOpen: " + ipAddress);
    if ("WebSocket" in window) {
        //alert("FromWS");
        wSocket = new WebSocket(ipAddress);//"ws://192.168.1.66:9000");

        //alert("WS: " + ipAddress);
        wSocket.onopen = function () {
            var wsOK = dijit.byId('bar_WebSocket');
            wsOK.set('iconClass', 'dijitIconConnector'); // enabled

            setupTxMessage('GetModels', 'Connecting');
            //wSocket.send("Message to send**");
        };

        wSocket.onmessage = function (evt) {
            var received_msg = evt.data;

            parseServerMessage(received_msg);
            //alert("Rx " + received_msg);
        };

        wSocket.onclose = function () {

            var wsOK = dijit.byId('bar_WebSocket');
            wsOK.set('iconClass', 'wsError'); // enabled
            alert("WS CLOSED");

        };
        wSocket.onerror = function () {

            var wsOK = dijit.byId('bar_WebSocket');
            wsOK.set('iconClass', 'wsError'); // enabled
            alert("WS ERROR");

        };
    }
}

function DoClose() {
    wSocket.close();
}
//var byteData;
/*********************************************************************/
/******************** Server Response Functions **********************/
/*********************************************************************/
var functions = [mlPredicted, setModels, nextChunk, sImage, publicPath, setMetrics];

function setMetrics(data) {
    //alert('Metrics');
    showCharts(data);
}

function publicPath(args) {
    
    var path = args.path;

    var dta = args.data;
    //alert("Using linqjs");
    var f = dta.select(function (t, index) {
        //alert('Looking for: DCMs');

        var dcmf = t.files.where(function (w) { return w.endsWith('.dcm') }).first();
        var imgf = t.files.where(function (w) { return !w.endsWith('.dcm') }).first();

        var showName = dcmf == null ? imgf : dcmf;

        //alert("last: " + ex);
        var dc = { id: index, name: showName, folder: t.folder, dcmfile: dcmf, imgfile: imgf };
        //alert('Content: ' + JSON.stringify(dc));
        return dc;
    }).orderBy(function (o) {
        //alert('Ordering: ' +o);
        var ex = o.name.split('.').last();
        return ex;
    }).thenBy(function (t) { return t.name });;
    //alert("Folders: " + JSON.stringify(f));

    var dStore = new dojo.store.Memory(
        { data: f });

        
    var select = dijit.byId('dirPathSelect');
    select.dirPath = path;
    select.set('store', dStore);
}
function selectDataSet(args) {

    //alert('Select: ' + args);
    //var path = args.path;
    //alert("PATH: " + path);

    //var dataS = [];//args.data;

    // dojo.forEach(args.data, function (item, index) {
    //     dataS.push({ id: index, name: item });
    // });
    args.splice(0, 1);
    var dStore = new dojo.store.Memory(
        { data: args });

    //alert('dStore: ' + dStore);
    var select = dijit.byId('dsPathSelect');
    select.set('store', dStore);
}
function sImage(data) {
    //alert("Data: " + data );
    //initCanvas2();
    var tbody = dojo.byId('thumbbody');


    var imgPath = '/ML_Data/';

    //var fPath = data.filePath;
    var imgName = data.buffer;
    var dcmName = data.dicombuffer;

    var len = imgName.length;
    var lenD = dcmName.length;
    if (len <= 0 && lenD <= 0)
        return;

    dojo.empty(tbody);
    var tr = dojo.create('tr', {}, tbody);


    dojo.forEach(imgName, function (item, index) {
        var srcI = imgPath + item.folder + '/' + item.file;
        //alert('srcI: ' + srcI);
        //alert("SRC:" + srcI);
        var td = dojo.create('td', { class: 'tdImg' }, tr);
        var img = dojo.create('img', {
            class: 'thumb'
            , src: srcI
            , title: item.file
            , alt: '<br>Image_' + (index + 1) + '</br>'
            , 'data-folder': item.folder
            , 'data-file': item.file
        }, td);


        dojo.place(img, td);
        dojo.create('span', { innerHTML: '<br>Image: ' + (index + 1) }, td);


    });

    dojo.forEach(dcmName, function (item, index) {
        var fr = item.folder;
        var dicomf = item.dicomfile;
        var imgsF = item.images;
        var path = item.path;

        //alert('DCM: ' + dicomf);
        var srcI = imgPath + fr + '/';//+ item.file;
        //alert("SRC:" + srcI);
        dojo.forEach(imgsF, function (item, index) {
            var td = dojo.create('td', { class: 'tdImg' }, tr);
            var img = dojo.create('img', {
                class: 'thumb'
                , src: srcI + item
                , title: item
                , alt: '<br>Image_' + (index + 1) + '</br>'
                , 'data-folder': fr
                , 'data-file': item
                , 'data-dicomfile': dicomf
            }, td);


            dojo.place(img, td);
            dojo.create('span', { innerHTML: '<br>Image: ' + (index + 1) }, td);
        });

    });



    setImgEvents();

}
function parseServerMessage(received_msg) {

    //alert("RXXXXX: " ready+ received_msg);

    if (received_msg == 'NoData')
        return;
        //alert('parseServerMessage');
    var cmd = JSON.parse(received_msg);
    var fncName = cmd.Action;
    var fncArg = cmd.Message;
    var fncIndex = functions.map((f) => f.name).indexOf(fncName);
    if (fncIndex >= 0)
        functions[fncIndex](fncArg);
}
var chkModels = [];

function setPredictToolBar(models){
    var tBar = dijit.byId('predictBar');
    var mdls = dojo.create('span',{innerHTML: 'Model:', class: 'modelTitle'}, tBar.domNode);
    //alert('Models: ' + models);
    models.select(function(s){
        var span = dojo.create('span',{innerHTML: s, class: 'prdSpan'}, tBar.domNode);
        var button = new dijit.form.CheckBox({
                    label: s,
                    id: 'predict_' + s,
                    //showLabel: true,
                    onChange: predictCheck
                   
                });
                //alert("Add Button");
                tBar.addChild(button);
                //return span;
    });

    var prdBtns = ['Clear', 'Save'];
    var iconclass=['prdClearIcon', 'prdSaveIcon']
    
    prdBtns.select(function(s, index){
        var button = new dijit.form.Button({
            label: s,
            id: 'predict_' + s,
            showLabel: false,
            onClick: saveClearPrediction,
            iconClass: iconclass[index],
            style: 'float: right; margin-right: 6px'
           
        });
        //alert("Add Button");
        tBar.addChild(button);
    })
}


function saveClearPrediction(){
    var str = this.get('label');
    //alert('SAVE/CLEAR: ' + str);
    switch(str){
        case 'Clear':
            var pre = dojo.byId('predictionDiv');
            dojo.empty(pre);
        break;

        case 'Save':
            var prdTables = dojo.query('.predictClass');

            //alert('Predict Tables Cnt: ' + prdTables.length);
            var jsonD = [];
            dojo.forEach(prdTables, function (tbl) {
                var dta = dojo.attr(tbl, 'data-json');
                var jn = JSON.parse(dta);
                jsonD.push(jn);
            });
            var dmfile = dojo.attr(wImage, 'data-dicomfile');
            var fldr = dojo.attr(wImage, 'data-folder');
            var fle = dojo.attr(wImage, 'data-file');
            var dcfile = dmfile == undefined ? 'None' : dmfile;
        
            var updata = { Action: 'savePrediction', dicomfile: dcfile, file: fle, folder: fldr, data: jsonD };
            //alert('SAVE/CLEAR: ' + str);
            setupTxMessage(updata);
        
        break;
    }

}
function predictCheck(e){
    var str = this.get('label');

    var lbl = '/' + str + '.zip';
    //alert('Model: ' + lbl);
    var index = chkModels.indexOf(lbl);
    var removed;
    if (index < 0) {
        chkModels.push(lbl);

    }
    else {
        removed = chkModels.splice(index, 1);
        
    }
    var wsPre = dijit.byId('bar_Predict');
    if (chkModels.length > 0) {
        wsPre.setDisabled(false); // disable

    }
    else
        wsPre.setDisabled(true); // disable
}

function setModels(info) {

    var fs = dijit.byId('dirPathSelect');
    fs.dcms = info.dcmData;
    var titlePan = '';
    var models = info.models;
    setPredictToolBar(models);
    var dset = info.datasetTree;
    var lml = dijit.byId('leftModel');
    var tree = buildTree(info.modelTree);
    lml.addChild(tree);
    var ds = buildDataSet(dset);
    lml.addChild(ds);
    setupTxMessage('publicPath', 'Connecting');

}

function nextChunk() {
    sendFile();
}
function mlPredicted(results) {
    var divPane = dojo.byId('predictionDiv');

    var prdTables = dojo.query('.predictClass', divPane);
    //alert("Tables: " + prdTables.length);
    var table = resultTable(results);
    dojo.place(table, divPane, 'last');


}
function updateModel(e) {
    //

    e.preventDefault();
    e.stopPropagation();

    var chk = targetElement(e);


    var status = dojo.attr(chk, "data-checked"); // getchk.checked;//('checked');
    //alert("STATUS: " + status);
    if (status == 'false') {
        dojo.attr(chk, "data-checked", 'true');
        chk.src = imgCheck;
    }
    else {
        dojo.attr(chk, "data-checked", 'false');
        chk.src = imgunCheck;

    }

    //alert("SRC: " + chk.src);
    //var lbl = chk.value;

    var lbl = '/' + dojo.attr(chk, "data-value") + '.zip';

    var index = chkModels.indexOf(lbl);
    var removed;
    if (index < 0) {
        chkModels.push(lbl);

    }
    else {
        removed = chkModels.splice(index, 1);
        //chk.src = imgunCheck;
    }
    var wsPre = dijit.byId('bar_Predict');
    if (chkModels.length > 0) {
        wsPre.setDisabled(false); // disable

    }
    else
        wsPre.setDisabled(true); // disable

    //return false;
    //alert("chkModels: Count " + chkModels.length + "  Removed:  " + removed);
}


function resultTable(data, child) {

    var vals = data.Result;
    var vNames = Object.keys(vals);
    dojo.forEach(vNames, function (name, index) {
        if (name != 'Class') {
            var number = data.Result[name];
            data.Result[name] = (number * 100).toFixed(2);

        }
    });

    var tbl = dojo.create('table', {
        class: 'predictClass'
        , 'data-json': JSON.stringify(data)
        , style: { 'width': '250px', 'border-spacing': '0', 'margin': '0 auto' }
       
    });
    var styy = { 'border': 'none', 'border-bottom': '2px solid blue', 'margin-top': '10px' };
    if( child == 0)
        styy = { 'border': 'none', 'border-bottom': '2px solid blue'};
    dojo.create('caption', {
        style: styy, //{ 'border': 'none', 'border-bottom': '2px solid blue', 'margin-top': '10px' },
        innerHTML: "<strong>Model <font color='blue'>" + data.Model + "</font>  Prediction</strong>"
    }, tbl);

    var nms = Object.keys(data);
    //alert('Names: ' + nms);
    dojo.forEach(nms, function (name, index) {
        if (!(name == 'Result' || name == 'Model')) {
            //alert(name + ':' + data[name]);
            var trr = dojo.create('tr', {}, tbl);
            dojo.create('td', { class: 'predictCell', style: { 'text-align': 'right', 'border': 'none', 'border-bottom': '1px solid #ddd' }, innerHTML: name }, trr);
            dojo.create('td', { class: 'predictCell', style: { 'text-align': 'left', 'border': 'none', 'border-bottom': '1px solid #ddd' }, innerHTML: data[name] }, trr);

        }

    });

    var tr = dojo.create('tr', {}, tbl);
    dojo.create('th', { style: { 'margin-top': '10px', 'border': 'none', 'border-bottom': '1px solid #ddd', 'text-align': 'right', 'padding': '8px' }, innerHTML: 'Class' }, tr);
    dojo.create('th', { style: { 'margin-top': '10px', 'border': 'none', 'border-bottom': '1px solid #ddd', 'text-align': 'center', 'padding': '8px' }, innerHTML: 'Prediction(%)' }, tr);


    var itNms = Object.keys(data.Result);
    dojo.forEach(itNms, function (name, index) {
        //alert(name + ':' + data.Result[name]);
        if (name != 'Class') {
            var val = data.Result[name];


            tr = dojo.create('tr', {}, tbl);

            var styC = { 'text-align': 'right', 'border-spacing': '0' };
            var styP = { 'text-align': 'center', 'border-spacing': '0' };

            dojo.create('td', { class: 'predictCell', innerHTML: name, style: styC }, tr);
            dojo.create('td', { class: 'predictCell', innerHTML: val, style: styP }, tr);

        }

    });


    return tbl;

}

function loadDCMStudy(fs) {

    //var fs = this.id;//dirPathSelect
    if (fs.item == undefined)
        return;

    var dcmF = fs.item.dcmfile;

    if (dcmF != null) {

        //var pth = { dir: fs.dirPath, folder: fs.item.folder, name: fs.item.name };
        var pth = { dir: 'ML_Data', folder: fs.item.folder, name: fs.item.name };
        //alert('Study: ' + JSON.stringify(pth));
        invokeTask(pth);
    }

    var data = { "buffer": [{ "folder": fs.item.folder, "file": fs.item.imgfile }], "dicombuffer": [] }
    //alert('Image: ' + JSON.stringify(data));
    sImage(data);

    //invokePics(fs.item.name);

}

function invokePics() {
    var fs = dijit.byId('dirPathSelect');
    if (fs.item == undefined)
        return;
    var tfile = fs.item.name;
    setupTxMessage('getPics', tfile);
}


function loadXMLDoc() {
    alert("Before");
    var xhttp = new XMLHttpRequest();
    xhttp.responseType = 'blob';
    alert(xhttp);
    xhttp.onload = function () { //xhttp.onreadystatechange

        var recoveredBlob = this.response;// responseText;
        readBinaryFile(recoveredBlob);

    }

    xhttp.open("GET", "ML_Data/case1_050.dcm", true);//public/ML_Data/ML_Data_85be/frame_5.jpg
    xhttp.send();
}

function parseDICOM(file) {
    //alert('Before');
    //const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    //alert('After ' + imageId);
    var byteArray = file;//new Uint8Array(arrayBuffer);

    var kb = byteArray.length / 1024;
    var mb = kb / 1024;
    var byteStr = mb > 1 ? mb.toFixed(3) + " MB" : kb.toFixed(0) + " KB";

    //alert("Bytes read: " + byteStr);

    var dataSet;
    var start = new Date().getTime();
    dataSet = dicomParser.parseDicom(byteArray);

    //alert("DataSet read: " + dataSet);
    viewerData = [];
    viewerTag = undefined;
    var output = [];
    dumpDataSet(dataSet, output);
    //alert("Output read: " + viewerData);
    document.getElementById('dumpdicom').innerHTML = '<ul>' + output.join('') + '</ul>';

    var nArray = viewerData.select(function (s) {
        var sp = s.split('=');
        //
        var tg = sp[0];
        var str = sp[1].split('').where(function (w) { return w != '{' && w != '}' }).join('').split(':');
       // alert('STR: ' + str);
        var key = str.splice(0,1)[0].trim();
        //alert('key: '+ key);
        var value = str.join(':').trim();//str[1].trim();

        var number = Number(value);
        if (!isNaN(number))
            value = number;

        var cmd = {
            tag: tg
        };

        cmd[key] = value;

        return cmd;
        //alert('Element: ' + JSON.stringify(cmd));
    });

    //alert('Parsed: ' + JSON.stringify(nArray));
    //document.getElementById('std').innerHTML = 'Done';

    buildPredictionTable(nArray);
    // var std = dijit.byId('stdPrediction');
    // alert("STD: " + std);
    // std.set('content','Hello DICOM');
}
function buildPredictionTable(data) {
    //alert('Parsed: ' + JSON.stringify(data));
    //var header = data.splice(0,1);
    //alert('HEADER: ' + JSON.stringify(header));

    var tbl = dojo.create('table', {
        class: 'predictClass'
        , 'data-prediction': JSON.stringify(data)
        , style: { 'width': '300px', 'border-spacing': '0',  'margin':'0 auto' }
    });
    // dojo.create('caption', {
    //     style: { 'border': 'none', 'border-bottom': '2px solid blue' },
    //     innerHTML: "<strong>DICOM <font color='blue'> uacj-Viewer </font>  Data</strong>"
    // }, tbl);

    var trr = dojo.create('tr', { class: 'setborder' }, tbl);

    dojo.create('td', { innerHTML: 'Private Tag', class: 'setborder' }, trr);
    dojo.create('td', { innerHTML: 'Description', class: 'setborder' }, trr);
    dojo.create('td', { innerHTML: 'Data', class: 'setborder' }, trr);
    var tby = dojo.create('tbody', {}, tbl);

    data.select(function (s) {
        var names = Object.keys(s);
        var tr = dojo.create('tr', {}, tbl);
        var mdl = false;

        names.select(function (n) {
            var spClass = 'spanClass';
            var cls = 'setRight';
            var vls = s[n];
            var temS = n;
            if (n != 'tag') {
                if (n == 'Class') {
                    n = '<b>' + n + '</b>';
                    vls = '<b>' + vls + '</b>';

                }

                var inner = { class: cls };
                if (n == 'Model') {
                    cls = 'setLeft modelborder';

                    var str = dojo.create('tr', {}, tr, 'before');
                    dojo.create('td', { class: 'setPadding' }, str);
                    spClass += ' spModel';
                    inner = { class: cls, colspan: 2 };
                    n += '&nbsp;&nbsp;&nbsp;' + vls;

                }

                //var td = dojo.create('td', { class: cls }, tr);
                var td = dojo.create('td', inner, tr);
                dojo.create('span', { innerHTML: n, class: spClass }, td);
                n = temS;
            }
            // if (n == 'Model')
            //     cls = 'setLeft modelborder';
            // else
            if (n != 'Model') {
                cls = 'setLeft';


                var tdC = dojo.create('td', { class: cls }, tr);
                dojo.create('span', { innerHTML: vls, class: spClass }, tdC);
            }

            return tr;
        })
        return tr;
    });
    var std = dijit.byId('stdPrediction');
    //alert("STD: " + std);
    std.set('content', tbl);

}
function readBinaryFile(data) {
    //alert("blob: " + data);
    const reader = new FileReader();
    // This fires after the blob has been read/loaded.
    reader.addEventListener('loadend', (e) => {
        //alert("Reading: " + e);
        var blobFile = new Uint8Array(e.target.result);

        //alert("CONVERTED: " + blobFile);
        parseDICOM(blobFile);

        /////////////////////////////////invokePics();
        // calling the save method
    });
    // Start reading the blob as text.
    //alert("BINARY" );
    reader.readAsArrayBuffer(data);
    //reader.readAsDataURL(data);
    //readAsDataURL
}

function dataURLtoBlob(dataurl) {
    //alert("BLOB")
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    //alert("MIME: " + mime);
    return new Blob([u8arr], { type: mime });
}
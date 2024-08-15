

dojo.require("dojo.parser");
dojo.require("dijit.dijit");
dojo.require("dojo/dom-geometry");
dojo.require("dojox.layout.ScrollPane");
dojo.require("dojo/json");
dojo.require("dojo/query");
dojo.require("dijit.layout.AccordionContainer");
dojo.require("dijit.layout.BorderContainer");

dojo.require("dojox.layout.GridContainer");

dojo.require("dojox.image.ThumbnailPicker");

dojo.require("dojox.layout.ToggleSplitter");
dojo.require("dojox.layout.ExpandoPane");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.form.ComboBox");
dojo.require("dijit.Tree");
dojo.require("dijit.layout.TabContainer");
dojo.require("dojo/_base/lang");
dojo.require("dojo/aspect");
dojo.require("dojox.layout.FloatingPane");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojox.rpc.Service");
dojo.require("dojo.io.script");
dojo.require("dojo.dnd.Source");
dojo.require("dojo/dom-attr");
dojo.require("dojo/html");
dojo.require("dojo.data.ObjectStore");
dojo.require("dojo/aspect");
//for dialog
dojo.require("dojox.widget.DialogSimple");
dojo.require("dojox.widget.Dialog");
dojo.require("dijit.form.DropDownButton");
dojo.require("dojox.json.query");
//dojo.require("dojox/image/Magnifier");
dojo.require("dijit.TooltipDialog");

dojo.require("dijit.form.Button");
dojo.require("dijit/form/FilteringSelect");
//touch function
dojo.require("dojo.touch");
dojo.require("dojo.number");

//radiobutton
dojo.require("dijit.form.RadioButton");
dojo.require("dojox.widget.FisheyeLite");
dojo.require("dojox.widget.FisheyeList");
dojo.require("dojox.widget.FisheyeListItem");

//Dojo boxes
dojo.require("dijit.form.NumberTextBox");
dojo.require("dijit.form.CurrencyTextBox");
dojo.require("dijit.form.TimeTextBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.NumberSpinner");
dojo.require("dijit.TitlePane");
//dojo table container
dojo.require("dojox.layout.TableContainer");

//color picker

dojo.require("dojox.widget.AutoRotator");
dojo.require("dojox.widget.rotator.Wipe");
dojo.require("dojox.widget.rotator.Controller");
dojo.require("dojox.widget.rotator.Slide");
dojo.require("dojox.widget.Rotator");

//toolbar
dojo.require("dijit.Toolbar");
dojo.require("dijit.ToolbarSeparator");
dojo.require("dijit.registry");

dojo.require("dojo.dom-style");
dojo.require("dojo.dom-class");
dojo.require("dojo.dom");

//dojo colors
dojo.require("dojo._base.Color");
dojo.require("dijit/_Widget");
dojo.require("dijit/_TemplatedMixin");
dojo.require("dojo/on");

//dnd
dojo.require("dojo.dnd.move");

//dojo graphics
//dojo.require("dojox.gfx");

//dojo grid
dojo.require("dojox.grid.LazyTreeGrid");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dijit.tree.ForestStoreModel");
//dojo.require("dojox.grid.LazyTreeGridStoreModel");

dojo.require("dojo/store/Memory");


//dojo.require("dijit._WidgetsInTemplateMixin");


dojo.require("dojox.grid.cells.dijit");


dojo.require("dojo.dom-construct");


////dojo.require("gridx-1.3.9/modules/VirtualVScroller");
////dojo.require("gridx-1.3.9/modules/Dod");

////dojo.require("gridx-1.3.9/Grid");
////dojo.require("gridx-1.3.9/core/model/cache/Sync");
////dojo.require("gridx-1.3.9/allModules");
////dojo.require("gridx-1.3.9/modules/Dod");
////dojo.require("gridx-1.3.9.modules.RowHeader");

dojo.require("dojox/widget/Standby");


dojo.require("dijit/tree/ObjectStoreModel");
//////dojo.require("cbtree/Tree");
//////dojo.require("cbtree/model/TreeStoreModel");
//////dojo.require("cbtree/store/Hierarchy");

dojo.require("dijit/form/Textarea");
dojo.require("dijit/form/SimpleTextarea");

dojo.require('dojo/date/locale');
dojo.require("dojo.NodeList-traverse");
dojo.require("dojo/domReady!");

dojo.require("dijit/popup");

dojo.require('dijit/Menu');
dojo.require('dijit/MenuBar');
dojo.require('dijit/MenuBarItem');
dojo.require('dijit/PopupMenuBarItem');

dojo.require("dijit/MenuItem");
dojo.require("dijit/PopupMenuItem");
dojo.require("dijit/CheckedMenuItem");
dojo.require("dijit/RadioMenuItem");
dojo.require("dijit/MenuSeparator");
dojo.require("dojo/_base/event");

dojo.require("dojox.widget.Portlet");

dojo.require("dojo/request");

dojo.require("dojo/_base/array");

dojo.require("dojo/Deferred");
dojo.require("dojo/promise/all");

dojo.require("dijit/form/VerticalSlider");
dojo.require("dijit/form/VerticalRuleLabels");
dojo.require("dijit/form/VerticalRule");
///////Global vars
var ws; //websocket 
var viewerTag;
var viewerData = [];
var viewerName = 'UACJ_';

var clearImage = "<img src='img/imagesAll/16/icon133.png' title='Clear' align='middle' style='margin-left:5px; float: right; '  alt='Clear' width='16' height='16' onclick=\"clearData(event)\"  />";
var saveImage = "<img src='img/imagesAll/icon/page_save.png' title='Save' align='middle' style='margin-right:5px; float: right; '  alt='Save' width='16' height='16' onclick=\"saveData(event)\"  />";




window.addEventListener('resize', resizeBorder, false);
//var cornerstone = window.cornerstone;

//const promise1 = new Deferred(function() {});

//var wsIp = "ws://192.168.1.66:9000";
var wsIp = "ws://10.223.50.33:9000";
//var wsIp = "ws://0.0.0.0:9000";

var fileLoaded = false;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

var gradient;
var usingDataset;

//var  loaded = false;
dojo.ready(function () {

    //var s= 5;
    //var t = Math.tanh(s);
        //alert('Tanh: (' + s, +',' + t + ')');
    
    gradient = chroma.scale(['azure', 'lime', '#2ECC71', '#F1C40F', 'yellow', 'orange', '#E74C3C']);
    buildPanels();

    initCanvas2();
    getHostIPAddress();
    webSocketOpen(wsIp);
    setTimeout(resizeBorder, 10);

    setupEvents();

    showCanvas();
    //setUpRender();

    createPredictToolBar();
    //dataValues(3,3);

    // var cnt = dojo.byId('predictionDiv');
    // var tbl = dojo.create('table',{},cnt);
    // dojo.create('tr',{id:'activationFnc'}, tbl);
    // sigmoidPlot();
    // tangHPlot();
    // reLuPlot();

});

function setupEvents() {
    document.getElementById('selectFile').addEventListener('change', function (e) {

        //alert('selectFile');
        const file = e.target.files;
        if (file.length <= 0)
            return;
        sendFile(file);

        //getBase64(file);
        
    });

    document.getElementById('reloadFile').addEventListener('change', function (e) {


        fileArray = e.target.files;
        uploadIndex = 0;
        downloadDFile();
        //storeFileTask(fileName, data);

    });
}
function openWebSocket() {

    if ("WebSocket" in window) {
        //alert("WebSocket is supported by your Browser!");

        // Let us open a web socket
        ws = new WebSocket("ws://192.168.1.66:9000");

        ws.onopen = function () {
            var wsOK = dijit.byId('bar_WebSocket');
            wsOK.setDisabled(false); // enabled

            // Web Socket is connected, send data using send()
            ws.send("Message to send");
            //alert("BinaryType is: " + ws.binaryType );
        };

        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            //alert("Message is received...");
        };

        ws.onclose = function () {
            var wsOK = dijit.byId('bar_WebSocket');
            wsOK.setDisabled(true); // disable

            // websocket is closed.
            //alert("Connection is closed..."); 
        };
    } else {

        // The browser doesn't support WebSocket
        alert("WebSocket NOT supported by your Browser!");
    }
}
function resizeBorder() {
    //alert("TimeOut");

    var mainR = document.getElementById("mainDiv");

    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight * 1;
    //newHeight = newHeight - 20;
    dojo.style(mainR, "height", newHeight + "px");
    //dojo.style(container, "height", newHeight + "px");
    var bc = dijit.byId("bcContent");
    var s = dijit.byId("subBorder");
    var n = dijit.byId("netBorder");


    if (bc != undefined) {



        bc.resize();
        s.resize();
        n.resize();

    }

    // setUpRender();

}
function buildPanels() {

    //main border constainer
    var bc = new dijit.layout.BorderContainer({
        id: 'bcContent',
        style: "height:100%; width: 100%;",
        gutters: true//,
        //design: 'headline'

    });

    bc._splitterClass = "dojox.layout.ToggleSplitter";


    var subBorder = new dijit.layout.BorderContainer({
        id: 'subBorder',
        style: "height:100%; width: 100%;",
        gutters: true,
        design: 'headline'

    });

    var netBorder = new dijit.layout.BorderContainer({
        id: 'netBorder'
        , tyle: "height:100%; width: 100%;"
        // ,gutters: true
        // ,design: 'headline'

    });


    var divHost = dojo.create('div', { id: 'divHost' });

    var mainC = dojo.create('div', { id: 'mainc' });

    var meDiv = dojo.create('div', { id: 'divMenu' });

    //create tool bar and add to center container
    var bar = createToolBar(meDiv);
    dojo.place(bar.domNode, mainC, 'last');


    //iHost contains CANVAS element and DICOM image visualizer
    var iHost = loadImageContainer(divHost);
    dojo.place(iHost, mainC, 'last');

    //thumb div
    //var thumb = dojo.create('div', { id: 'thumbDiv', width:'100px', height: '200px', 'border-style':'solid';border-color:blue;},divHost);
    var thumb = dojo.place('<div id="thumbDiv" style="width:100%"></div>', divHost, 'last');
    var tableH = dojo.create('table', { id: 'thumbTable' }, thumb);
    //dojo.create('caption',{innerHTML:'Test', id: 'canvasCaption', style:{'white-space': 'pre','text-align':'left', 'color': 'blue'}}, tableH);
    dojo.create('tbody', { id: 'thumbbody' }, tableH);

    //var thumb = dojo.place('<div id="thumbDiv"></div>', divHost, 'last');

    // var thumb = dojo.create('div', {
    //     id: 'thumbDiv',

    //     style: "width:600px;height:150px; background-color:black;"
    // });

    var imgContent = new dijit.layout.ContentPane({
        //id: "docSchedule",
        //title: "Visualizador",
        //region: "center",
        //splitter: true,
        content: thumb,//"TestCenter",//menu.domNode,
        style: { overflow: 'hidden !important', width: '606px', height: '150px' }
        //style: {  overflow: 'hidden !important' },
    });
    imgContent.startup();
    dojo.place(imgContent.domNode, divHost);

    var centerT = new dijit.layout.ContentPane({
        id: "docSchedule",
        //title: "Visualizador",
        region: "center",
        splitter: true,
        content: mainC//"TestCenter",//menu.domNode,
        //style: {  overflow: 'hidden !important' },
    });

    // var accDiv = dojo.create('div', { id: 'accuracyChart', innerHTML: "accuracyChart" });
    // var lossDiv = dojo.create('div', { id: 'lossChart', innerHTML: "lossChart" });
    // var metsDiv = dojo.create('div', { id: 'metsDiv' });

    // dojo.place(accDiv, metsDiv);
    // dojo.place(lossDiv, metsDiv);


    var desDiv = dojo.create('div', {});

    var tb = dojo.create('table', { style: { 'margin-bottom': '20px' } }, desDiv);
    var trb = dojo.create('tr', null, tb);
    var tdMl = dojo.create('td', { style: { 'vertical-align': 'top', 'text-align': 'center' } }, trb);
    var tdHy = dojo.create('td', { style: { 'vertical-align': 'top', 'text-align': 'center' } }, trb);

    var mlDatset = dojo.create('div', { id: 'mlDataSet', innerHTML: 'DATA_SET' }, tdMl);
    var hyperPars = dojo.create('div', { id: 'mlHyper', innerHTML: 'HYPER_PARS' }, tdHy);


    dojo.create('div', { id: 'cfMatrix', innerHTML: 'CF_MATRIX' }, desDiv);
    dojo.create('div', { id: 'classificationReport', innerHTML: 'classificationReport' }, desDiv);

    var netcenterT = new dijit.layout.ContentPane({
        //id: "docSchedule",
        //title: "Visualizador",
        region: "center",
        splitter: true,
        content: desDiv //metsDiv //'NET_CENTER'//"TestCenter",//menu.domNode,
        //style: {  overflow: 'hidden !important' },
    });

    var mainPane = new dojox.layout.ContentPane({
        //id: "docSchedule",
        title: "Visualizador",
        //region: "center",
        //content: mainC//"TestCenter",//menu.domNode,
        //style: { overflow: 'auto' },
    });

    var mlNet = new dijit.layout.ContentPane({
        //id: "docSchedule",
        title: "ML.NET Model",
        //region: "center",
        //splitter: true,
        //content: 'ML.NET'//"TestCenter",//menu.domNode,
        //style: {  overflow: 'hidden !important' },
    });



    var topC = new dijit.layout.ContentPane({
        id: "topC",
        title: "Validation Sites",
        region: "top",
        splitter: true,
        gutters: true,
        style: "width: 100%;  height:60px;", // background-color:#FFDEAD"
        content: headerTable()
    });







    var bottomC = new dijit.layout.ContentPane({
        id: "bottomC",

        //href: 'validation.aspx'
        region: "bottom",
        splitter: "true",
        content: "Test"
        //style: { overflow: 'hidden !important' },
    });



    var stdDiv = dojo.create('div', { id: 'stdData' });
    stdDiv = standardLabel(stdDiv);

    var leftT = new dijit.layout.ContentPane({
        id: "leftT",
        region: "left",
        splitter: "true",
        //content: stdDiv,
        style: { width: '20%', height: '100%' }
    });



    var netleftT = new dijit.layout.ContentPane({
        id: "leftModel",
        region: "left",
        splitter: "true",
        //content: 'NET_LEFT',
        style: { width: '25%', height: '100%' }
    });

    var netBar = createToolBar_();
    netleftT.addChild(netBar);

    // var tree = buildTree();
    // netleftT.addChild(tree);

    // var ds = buildDataSet();
    // netleftT.addChild(ds);


    var titlePane = new dijit.TitlePane({
        // note: should always specify a label, for accessibility reasons.
        // Just set showLabel=false if you don't want it to be displayed normally
        id:'stdPrediction',
        title: 'DICOM Standard Data',
        content: stdDiv

    });

    //alert("Add Button");
    leftT.addChild(titlePane);




    var right = new dijit.layout.ContentPane({
        id: "right_Prediction",
        title: "Welcome",
        //href: 'validation.aspx'
        region: "right",
        splitter: "true",
        //content: "TEST CONTENT",
        doLayout: false,
        style: { width: '28%', height: '100%' }
    });
    //right.addChild(predictPane);

    var metsDiv = dojo.create('div', { id: 'metsDiv' });

    var ttableK = dojo.create('table',{}, metsDiv);
    dojo.create('caption', {
        id: 'kFCaption',
        style:{ 'border': 'none', 'border-bottom': '2px solid blue',color:'blue', 'font-weight': 'bold', 'margin-bottom': '20px'},
        innerHTML: 'Title'
    }, ttableK);
    var ttK = dojo.create('tr',{}, ttableK);
    var taK = dojo.create('td',{}, ttK);
    var tcK = dojo.create('td',{}, ttK);

    dojo.create('div', { id: 'kFoldsTable', innerHTML: "kFoldsTable" },taK);
    dojo.create('div', { id: 'kFoldAccuracyTable' },tcK);



    var ttable = dojo.create('table',{}, metsDiv);
    dojo.create('caption', {
        id: 'metsCaption',
        style:{ 'border': 'none', 'border-bottom': '2px solid blue',color:'blue', 'font-weight': 'bold', 'margin-bottom': '20px'},
        innerHTML: 'Title'
    }, ttable);
    var ttr = dojo.create('tr',{}, ttable);
    var ta = dojo.create('td',{}, ttr);
    var tc = dojo.create('td',{}, ttr);

    dojo.create('div', { id: 'accuracyChart', innerHTML: "accuracyChart" },ta);
    dojo.create('div', { id: 'lossChart', innerHTML: "lossChart" },tc);

    //dojo.place(accDiv, metsDiv);
    //dojo.place(lossDiv, metsDiv);
    // font-size: '14px';
    // font-weight: bold;
  


    var netright = new dijit.layout.ContentPane({
        //id: "right",
        title: "Welcome",
        //href: 'validation.aspx'
        region: "right",
        splitter: "true",
        content: metsDiv, //desDiv,
        style: { width: '35%', height: '100%' }
    });


    var dmp = dojo.create('div', { id: 'dumpdicom', innerHTML: 'No Data', style:'font-size:12px;'} );

    var titlePane2 = new dijit.TitlePane({
        title: 'DICOM Tags Data',
        content: dmp

    });

    //alert("Add Button");
    leftT.addChild(titlePane2);


    // create the TabContainer
    var contentTabs = new dijit.layout.TabContainer({
        region: "center",
        id: "contentTabs",
        tabPosition: "top",
        "class": "centerPanel"
    });

    subBorder.addChild(leftT);
    subBorder.addChild(centerT);
    subBorder.addChild(right);
    subBorder.addChild(bottomC);

    netBorder.addChild(netleftT);
    netBorder.addChild(netcenterT);
    netBorder.addChild(netright);

    mainPane.addChild(subBorder);
    mlNet.addChild(netBorder);

    contentTabs.addChild(mainPane);
    contentTabs.addChild(mlNet);
    contentTabs.selectChild(mainPane);
    bc.addChild(contentTabs);

    bc.addChild(topC);

    var mainR = document.getElementById("mainDiv");
    mainR.appendChild(bc.domNode);

    subBorder._splitterClass = "dojox.layout.ToggleSplitter";
    netBorder._splitterClass = "dojox.layout.ToggleSplitter";
    subBorder.startup();
    netBorder.startup();
    bc.startup();

    buildCanvasFilter();

}
var fileArray = [];
var uploadIndex = 0;

function downloadDFile() {


    if (uploadIndex >= fileArray.length) {
        fileArray = [];
        return;
    }



    var file = fileArray[uploadIndex];
    var fileName = file.name;


    alert('Loading: ' + fileName);
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = function () {
        var dataArray = reader.result;//.split(';')[0];

        alert("READFILE: " + dataArray);
        storeFileTask(fileName, dataArray);

        uploadIndex++;
        downloadDFile();
    };


}
function buildCanvasFilter() {

    var filters = dojo.query(".filterC");

    dojo.forEach(filters, function (filter) {
        var fltr = filter.id;
        var unit = dojo.attr(filter, "data-unit");
        var min = dojo.attr(filter, "data-min");
        var val = dojo.attr(filter, "data-val");
        var max = dojo.attr(filter, "data-max");

        createCanvasFilters(fltr, unit, min, val, max)
    });



}
function createCanvasFilters(fltr, unit, min, val, max) {

    //var fltr = 'contrast';

    var lbls = [];
    var step = max / 4;

    for (var i = 0; i <= 4; i++) {
        var s = i * step;
        lbls.push(s + '%');
    }


    var rulesNode = dojo.create("div", {}, dojo.byId(fltr), "first");
    var sliderRules = new dijit.form.VerticalRule({
        container: "leftDecoration",
        count: 11,
        style: "width: 5px; margin-left:10px"
    }, rulesNode);

    //Create the labels
    var labelsNode = dojo.create("div", {}, dojo.byId(fltr), "first");
    var sliderLabels = new dijit.form.VerticalRuleLabels({
        container: "rightDecoration",
        labelStyle: "font-style: italic; font-size: 0.75em;",
        style: "margin-right:20px;",
        labels: lbls
    }, labelsNode);



    var vertSlider = new dijit.form.VerticalSlider({
        minimum: min,
        maximum: max,
        pageIncrement: 10,
        value: val,
        intermediateChanges: true,
        style: "height: 250px;",
        onChange: function () {
            var idBox = this.box;
            dojo.byId(idBox).innerHTML = this.value.toFixed(2);
            var filter = '';

            dojo.forEach(filterContent, function (item) {
                filter += item.filterName + '(' + item.value + item.filterUnit + ') ';
            });

            setFilter(filter);
        }
    }, fltr);
    vertSlider.box = fltr + 'Value';
    vertSlider.filterName = fltr;
    vertSlider.filterUnit = unit;
    filterContent.push(vertSlider);
    // Start up the widget
    vertSlider.startup();
    sliderRules.startup();
    sliderLabels.startup();
    //lert(val//)
    dojo.byId(vertSlider.box).innerHTML = val;
}
function buttonClicked(e) {
    var lbl = this.get('label');
    var iconC = this.get('iconClass');
    //alert('Clicked: ' + lbl);
    switch (lbl) {
        case "Reload":
            //loadXMLDoc();
            // invokeTask("/home/mrod/Pictures/dcm/rews/case1_050.dcm");
            //setupTxMessage('publicPath', 'Connecting');
            //buildThumbs(imgDta);

            //alert("DONE" );
            //imgHandlerEvents();
            //setImgEvents();

            //invokeReloadFile();



            alert('IMGS: ' + dojo.attr(wImage, 'data-folder') + ' -- ' + dojo.attr(wImage, 'data-file'));
            break;

        case 'LoadFile':
            invokeFileOpen();
            break;
        case 'Predict':
            //alert('Predict');
            if (usingDataset == undefined) {
                alert('Select dataset training based\n\nand try again...');
                return;
            }
            //setupTxFile(fileObject, fileContainer, "Predict", usingDataset);
            var fd = dojo.attr(wImage, 'data-folder');
            var fl = dojo.attr(wImage, 'data-file');
            if (fd == undefined || fl == undefined) {
                alert('Load an image file and try again...');
                return;
            }

            var prdMessage =
            {
                Action: 'Predict',
                folder: fd,
                file: fl,
                Models: chkModels.sort(),
                UseDataset: usingDataset

            };
            setupTxMessage(prdMessage);



            break;
        case 'Entrenar':
            if (trainPath == undefined || modelPath == undefined) {
                alert("Select Model/Dataset to be trained");
                return;
            }
            //ws.send("Train:" + trainPath);

            var trnMessage = JSON.stringify(
                {
                    Data: trainPath,
                    Model: modelPath

                });
            setupTxMessage("Train", trnMessage);
            break;
        case 'Predecir':


            break;
        case 'WebSocket':
            if (iconC == 'wsError')
                webSocketOpen(wsIp);

            break;
        case 'LoadDICOMIMAGE':
            //alert('Clicked: ' + lbl);
            getImg();
            break;
        case 'Metricos':
            //showCharts();
            if (trainPath == undefined || modelPath == undefined) {
                alert("Select Model/Dataset to get metrics");
                return;
            }

            //ws.send("Train:" + trainPath);

            var trnMessage = JSON.stringify(
                {
                    Data: trainPath,
                    Model: modelPath

                });

            //alert('Metrics: ' + trnMessage);
            setupTxMessage("Metrics", trnMessage);
            break;

    }
}
function createTitlePanes(contentPane) {
    var labels = ["Etiquetas Estandard", "File Name"];
    //var iconclass = ["dijitIconConfigure", "dijitIconEditProperty", "dijitIconFunction", "dijitIconConnector"];
    var iconclass = ["dijitIconConfigure", "dijitIconEditProperty", "dijitIconFunction", "dijitIconConnector"];
    dojo.forEach(labels, function (label, index) {
        //alert("Create Button");
        var titlePane = new dijit.TitlePane({
            // note: should always specify a label, for accessibility reasons.
            // Just set showLabel=false if you don't want it to be displayed normally
            title: label.split(' ').join(''),
            id: 'title_' + label,
            showLabel: false


        });
        //alert("Add Button");
        contentPane.addChild(titlePane);
    });
}
function createPredictToolBar() {
    var divP = dojo.create('div');
    var divS = dojo.create('div');
    var toolbarPrd = new dijit.Toolbar({ id: 'predictBar' }, divP);
    var toolbarDst = new dijit.Toolbar({ id: 'datasetBar' }, divS);

    var mdls = dojo.create('span',{innerHTML: 'Dataset:', class: 'modelTitle'}, toolbarDst.domNode);
    var ds = new dijit.form.FilteringSelect({
        id: "dsPathSelect",

        autoComplete: true,
        intermediateChanges: true,
        placeHolder: 'Use Based Dataset...',
        searchAttr: "name",
        readonly: true,
        style: {
            'width': '300px',
            'margin-left': '10px',
            'border-left-style': 'none',
            'border-top-style': 'none',
            'border-right-style': 'none',
            'border-bottom-style': 'none',
            'font-size': '12px'
        }
    });
    ds.on('change', function () {
        if (this.item == null)
            return;
        usingDataset = this.item.name;


    });

    toolbarDst.addChild(ds);
    dojo.create('span',{innerHTML: 'Predict', style: ' margin-left:10px; font-style: italic; font-size:12px '}, toolbarDst.domNode);
    var buttonP = new dijit.form.Button({
        // note: should always specify a label, for accessibility reasons.
        // Just set showLabel=false if you don't want it to be displayed normally
        label: 'Predict',
        id: 'bar_Predict',// + label,
        showLabel: false,
        disabled:true,
        onClick: buttonClicked,
        iconClass: 'doPredictionIcon',
        style: ' margin-left:4px;'
    });
    buttonP.startup();
    
    toolbarDst.addChild(buttonP);

        // var wsPre = dijit.byId('bar_Predict');
    // wsPre.setDisabled(true); // disable
    
    toolbarPrd.startup();
    toolbarDst.startup();
    var prd = dijit.byId('right_Prediction');
    prd.addChild(toolbarPrd);
    prd.addChild(toolbarDst);
    dojo.create('div', { id: 'predictionDiv', innerHTML: '' , class: 'setttPadding'}, prd.domNode);//,
    

}
function createToolBar(div) {
    var toolbar = new dijit.Toolbar({ id: 'tskBar' }, div);
    dojo.create('span',{innerHTML: 'Load File', style:'margin-left:10px; font-size:12px; font-style:italic'}, toolbar.domNode);

   // var labels = ["LoadFile", "Reload", 'Predict', "WebSocket"];
    var labels = ["LoadFile",   "WebSocket"];
    //var iconclass = ["loadFile", "resendFile", "dijitIconEditProperty", "wsError"];//
    //var iconclass = ["dijitIconConfigure", "dijitIconEditProperty", 'doPredictionIcon', "wsError"];
    var iconclass = ["dijitIconConfigure",  "wsError"];
    dojo.forEach(labels, function (label, index) {
        //alert("Create Button");
        var button = new dijit.form.Button({
            // note: should always specify a label, for accessibility reasons.
            // Just set showLabel=false if you don't want it to be displayed normally
            label: label,
            id: 'bar_' + label,
            showLabel: false,
            onClick: buttonClicked,
            iconClass: iconclass[index],
            style:'margin-left:4px; font-style:italic'
        });
        //alert("Add Button");
        toolbar.addChild(button);
    });
    var wsOK = dijit.byId('bar_WebSocket');
    //wsOK.setDisabled(true); // disable
    wsOK.set('style', 'float:right;');
    wsOK.set('showLabel', false);


    // var wsPre = dijit.byId('bar_Predict');
    // wsPre.setDisabled(true); // disable

    var fs = new dijit.form.FilteringSelect({
        id: "dirPathSelect",

        autoComplete: true,
        intermediateChanges: true,
        placeHolder: 'Select study...',
        searchAttr: "name",
        style: {
            'width': '160px',
            'margin-left': '12px',
            'border': 'none',
            'font-size': '12px'
        }
    });
    fs.dcms = '';
    fs.on('change', function () {
        //alert("FS.ITEM: " +this.item);
        if (this.item == null)
            return;
        showCanvas();
        loadDCMStudy(this);
    });

    dojo.create('span',{innerHTML: 'Select Study:', style:'margin-left:16px; font-size:12px; font-style:italic'}, toolbar.domNode);
    toolbar.addChild(fs);


    return toolbar;
}

var directoryChar;

function getHostIPAddress() {
    var dat = { ip: 'IPAddress' };
    //alert("InsideCalcualte");
    try {
        $.ajax({
            type: "POST",
            url: "/calculate",
            data: dat,
            async: false,
            responseType: 'text',
            //dataType: 'json'fileName, designation: "2pm",
            success: function (data) {
                var rec = JSON.parse(data);
                var add = rec.address;
                directoryChar = rec.separator;

                wsIp = "ws://" + add + ':9000';
                //alert("POST RX: " + wsIp);

            },
            failure: function (response) {
                alert("FAILURE: " + response);
            }

        }
        );

    }
    catch (e) {
        alert('Hello From Catch ' + e);
    }
    //alert('Hello From task');

}
//Example to call ajax action. DO NOT DELETE
function invokeTask(dat) {
    //alert('FileName: ' + fileName);
    //var myValue = 5;
    //var dat = { file: fileName, designation: "2pm" };

    try {
        $.ajax({
            type: "POST",
            url: "/request",
            data: dat,
            async: true,
            responseType: 'blob',
            //dataType: 'json',
            success: function (data) {
                //alert("POST RX: " + data);
                //readBinaryFile(data);
                var blb = dataURLtoBlob(data);
                readBinaryFile(blb);
                //parseDicomInfoE(data);
                //var dt = JSON.parse(data);
                //alert('Hello From POST: ' + dt.pName + ' -- ' + dt.pData);
                //alert("POST: " + data.pName + ' -- ' + data.pData);
                //alert("POST: " + data.pName);
            },
            failure: function (response) {
                alert("FAILURE: " + response);
            }

        }
        );

    }
    catch (e) {
        alert('Hello From Catch ' + e);
    }
    //alert('Hello From task');

}


function trainModel() {
    ws.send('Date');;

}
function invokeReloadFile() {
    var btn = dojo.byId('reloadFile');

    btn.click();

}
function invokeFileOpen() {
    var btn = dojo.byId('selectFile');

    //alert(btn);

    btn.click();
    // var event = new Event('change', { bubbles: true });
    // btn.dispatchEvent(event);

}
function loadImageContainer(divHost) {

    var imgC =
        `<div class="image-upload">
                <input type="file" id="selectFile"  multiple>
        </div>
        

        <div class="image-upload">
                <input type="file" id="reloadFile" multiple>
        </div>

    <table style="border:none;">
    <tr>
    <td rowspan="2">
    
    <div class="row1 topM midFont">
        <div class="col-md-6A">
            <div style="width:600px;height:600px;position:relative;color: white;display:inline-block;border-style:solid;border-color:blue; background-color:black;"
                 oncontextmenu="return false"
                 class='disable-selection noIbar'
                 unselectable='on'
                 onselectstart='return false;'
                 onmousedown='return false;'>
                 <canvas id="canvasDC" class="hide99Class" width="600" height="600"
                    style="width:600px;height:600px;top:0px;left:0px;position:absolute; "></canvas>
                <div id="dicomImage" class="hide888Class"
                     style="width:600px;height:600px;top:0px;left:0px; position:absolute; " >
                </div>

                <div id="filename" class="overlay" style="position:absolute;top:0px;left:0px"> 
                Image: 
               </div> 
       
                <div id="topleft" class="overlay" style="position:absolute;top:20px;left:0px"> 
                Patient's Name 
               </div> 
               <div id="topright" class="overlay" style="position:absolute;top:0px;right:0px"> 
                   Render Time: 
               </div> 
               <div id="bottomright" class="overlay" style="position:absolute;bottom:0px;right:0px"> 
                   Zoom: 
               </div> 
               <div id="bottomleft" class="overlay" style="position:absolute;bottom:0px;left:0px"> 
                   WW/WC: 
               </div> 
       

            </div>
            <div id="fName" class="topM image-upload">Ready</div>
        </div>
        
    </div>

    </td>


    <td class="tdFltr" ><label>Contrast</label><div class="filterC" id="contrast" data-unit= "%" data-min="0" data-val="100" data-max="100"></div><label id="contrastValue">-</label></td>
    <td class="tdFltr" ><label>Bright</label><div class="filterC"  id="brightness" data-unit= "%" data-min="0" data-val="100" data-max="200"></div><label id="brightnessValue">-</label></td>
    <td class="tdFltr" ><label>Gray</label><div class="filterC"  id="grayscale" data-unit= "%" data-min="0" data-val="0" data-max="100"></div><label id="grayscaleValue">-</label></td>
    </tr>
    <tr>
    <td class="tdFltr" ><label>Inverse</label><div class="filterC"  id="invert" data-unit= "%" data-min="0" data-val="0" data-max="100"></div><label id="invertValue">-</label></td>
    <td class="tdFltr" ><label>Opacity</label><div class="filterC"  id="opacity" data-unit= "%" data-min="0" data-val="100" data-max="100"></div><label id="opacityValue">-</label></td>
    <td class="tdFltr" ><label>Saturate</label><div  class="filterC" id="saturate" data-unit= "%" data-min="0" data-val="100" data-max="100"></div><label id="saturateValue">-</label></td>

    </tr>
    </table>
    `;

    dojo.place(imgC, divHost, 'last');

    //alert("DivHost");
    return divHost;

}

function standardLabel(div) {

    var std =
        `<div class="col-md-6A image-upload7">
    <span>Transfer Syntax: </span><span id="transferSyntax"></span><br>
    <span>***SOP Class: </span><span id="sopClass"></span><br>
    <span>Samples Per Pixel: </span><span id="samplesPerPixel"></span><br>
    <span>Photometric Interpretation: </span><span id="photometricInterpretation"></span><br>
    <span>Number Of Frames: </span><span id="numberOfFrames"></span><br>
    <span>Planar Configuration: </span><span id="planarConfiguration"></span><br>
    <span>Rows: </span><span id="rows"></span><br>
    <span>Columns: </span><span id="columns"></span><br>
    <span>Pixel Spacing: </span><span id="pixelSpacing"></span><br>
    <span>Bits Allocated: </span><span id="bitsAllocated"></span><br>
    <span>Bits Stored: </span><span id="bitsStored"></span><br>
    <span>High Bit: </span><span id="highBit"></span><br>
    <span>Pixel Representation: </span><span id="pixelRepresentation"></span><br>
    <span>WindowCenter: </span><span id="windowCenter"></span><br>
    <span>WindowWidth: </span><span id="windowWidth"></span><br>
    <span>RescaleIntercept: </span><span id="rescaleIntercept"></span><br>
    <span>RescaleSlope: </span><span id="rescaleSlope"></span><br>
    <span>Basic Offset Table Entries: </span><span id="basicOffsetTable"></span><br>
    <span>Fragments: </span><span id="fragments"></span><br>
    <span>Min Stored Pixel Value: </span><span id="minStoredPixelValue"></span><br>
    <span>Max Stored Pixel Value: </span><span id="maxStoredPixelValue"></span><br>
    <span>Total Time: </span><span id="totalTime"></span><br>
    <span>Load Time: </span><span id="loadTime"></span><br>
    <span>Decode Time: </span><span id="decodeTime"></span><br>

    </div>`;

    return dojo.place(std, div, 'last');
}


function headerTable() {

    var tbl =
        `<table style="width:100%; text-align:center;">
    <tr>
      <td style="text-align:right; width:15%;"><img src="img/UACJ.png" width="100" height="50"></td>
      <td style="text-align:center; width:70%;"><img src="img/iitmca.png" width="100" height="20"></td>
      <td style="text-align:left; width:15%;"><img src="img/conahcytIcon.jpg" width="200" height="50"></td>
    </tr>
  </table>
  `;

    var div = dojo.create('div');
    dojo.place(tbl, div, 'last');
    return div;

}


var file_Name;
var fileType;
var fileObject;
var fileContainer;
var imageContainer;

var styleSheetPromises = [];

function showCanvas() {
    //alert('ShowCanvas()');
    var dicomH = dojo.byId('dicomImage');
    var canvasH = dojo.byId('canvasDC');
    dojo.addClass(dicomH, 'hideClass');
    dojo.removeClass(canvasH, 'hideClass');

}

function myDisplayer__() {

    showCanvas();
    //alert("FILESENT");

    //alert("Sending File to DicomParse: " + file_Name);
    setupTxFile(fileObject, fileContainer, "DicomParser");



}
function myDisplayer() {
    // alert("FileType: " + fileType + ", Size: " + fileContainer.byteLength);
    var dicomH = dojo.byId('dicomImage');
    var canvasH = dojo.byId('canvasDC');
    if (fileType == 'application/dicom') {

        alert('DICOM CANVAS');
        renderLsIMageE(fileObject);
        parseDicomInfoE(fileContainer);
        dojo.addClass(canvasH, 'hideClass');
        dojo.removeClass(dicomH, 'hideClass');
    }
    else {
        alert('DICOM canvasDC');
        dojo.addClass(dicomH, 'hideClass');
        dojo.removeClass(canvasH, 'hideClass');

        getImg();
    }

    var fDiv = dojo.byId('filename');
    fDiv.innerHTML = 'File Name: ' + file_Name;

}


function getBase64(file) {
    fileType = undefined;

    fileType = undefined;
    fileObject = undefined;
    fileContainer = undefined;
    fileType = file.type;
    fileObject = file;

    file_Name = file.name;

    imageContainer = [];
    imageContainer = undefined;

    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    // if (file.type != 'application/dicom')
    //     imageContainer = new Uint8Array(rawData); 
    //alert('getBase64()');

    //styleSheetPromises = [];

    styleSheetPromises.push(new Promise((resolve, reject) => {
        reader.onload = function () {
            fileContainer = reader.result;//.split(';')[0];
            //alert("SRC: " + fileContainer);
            resolve();
        };

    }));

    reader.onerror = function (error) {
        alert('EEEERRRRRor: ', error);
    };
    Promise.all(styleSheetPromises).then((filetype) => {
        myDisplayer();
    });
}


function setUpRender() {

    // Setup the dnd listeners.
    const dropZone = document.getElementById('dicomImage');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);


    cornerstoneWADOImageLoader.configure({
        beforeSend: function (xhr) {
            // Add custom headers here (e.g. auth tokens)
            //xhr.setRequestHeader('x-auth-token', 'my auth token');
        },
    });


    cornerstone.events.addEventListener('cornerstoneimageloadprogress', function (event) {
        const eventData = event.detail;
        const loadProgress = document.getElementById('loadProgress');
        loadProgress.textContent = `Image Load Progress: ${eventData.percentComplete}%`;
    });

    const element = document.getElementById('dicomImage');
    cornerstone.enalert("READY buildPanels"); able(element);

    function onImageRendered(e) {

        const eventData = e.detail;

        // set the canvas context to the image coordinate system
        cornerstone.setToPixelCoordinateSystem(eventData.enabledElement, eventData.canvasContext);

        // NOTE: The coordinate system of the canvas is in image pixel space.  Drawing
        // to location 0,0 will be the top left of the image and rows,columns is the bottom
        // right.
        /*
          const context = eventData.canvasContext;
          context.beginPath();
          context.strokeStyle = 'white';
          context.lineWidth = .5;
          context.rect(128, 90, 50, 60);
          context.stroke();
          context.fillStyle = "white";
          context.font = "6px Arial";
          context.fillText("Tumor Here", 128, 85);
      */
        document.getElementById('topright').textContent = "Render Time:" + eventData.renderTimeInMs + " ms";
        document.getElementById('bottomleft').textContent = "WW/WL:" + Math.round(eventData.viewport.voi.windowWidth) + "/" + Math.round(eventData.viewport.voi.windowCenter);
        document.getElementById('bottomright').textContent = "Zoom:" + eventData.viewport.scale.toFixed(2);

    }
    element.addEventListener('cornerstoneimagerendered', onImageRendered);
    function renderLsIMage(file) {
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
        //alert("ImageID: " + imageId);
        loadAndViewImage(imageId);


    }

    function loadPNGImage(file) {

        const imageId = cornerstoneFileImageLoader.fileManager.addBuffer(file);
        loadAndViewImage(imageId);
        return;

        var reader = new FileReader();
        reader.onload = function (e) {
            alert("File reading: " + e);

            //var arrayBuffer = reader.result;
            // Here we have the file data as an ArrayBuffer.  dicomParser requires as input a
            // Uint8Array so we create that here

            var tmp = new Uint8Array(e.target.result);
            alert("Image tmp size0: " + tmp.length);


            var data = [];
            for (var i = 0; i < tmp.length; i++) {
                data.push(tmp[i]);
            }
            alert("Image data size1: " + data.length);
            try {
                const imageId = cornerstoneFileImageLoader.fileManager.addBuffer(data);
            }
            catch (w) {
                alert(w.what);
            }
            alert("Image size2: " + data.length);

            loadAndViewImage(imageId);

        };
        //reader.readAsDataURL(file);
        reader.readAsArrayBuffer(file);
        //alert("Going going to be read");


    }

    function parseDicomInfo(file) {

        var reader = new FileReader();
        reader.onload = function (e) {
            //alert("File reading: " + e);

            var arrayBuffer = reader.result;


            // Here we have the file data as an ArrayBuffer.  dicomParser requires as input a
            // Uint8Array so we create that here
            var byteArray = new Uint8Array(arrayBuffer);

            var kb = byteArray.length / 1024;
            var mb = kb / 1024;
            var byteStr = mb > 1 ? mb.toFixed(3) + " MB" : kb.toFixed(0) + " KB";

            //alert("Bytes read: " + byteStr);

            var dataSet;
            var start = new Date().getTime();
            dataSet = dicomParser.parseDicom(byteArray);

            //alert("DataSet read: " + dataSet);
            var output = [];
            dumpDataSet(dataSet, output);
            //alert("Output read: " + output.length);
            document.getElementById('dumpdicom').innerHTML = '<ul>' + output.join('') + '</ul>';


        };
        //reader.readAsDataURL(file);
        reader.readAsArrayBuffer(file);
        //alert("Going going to be read");


    }



    document.getElementById('toggleCollapseInfo').addEventListener('click', function () {
        if (document.getElementById('collapseInfo').style.display === 'none') {
            document.getElementById('collapseInfo').style.display = 'block';
        } else {
            document.getElementById('collapseInfo').style.display = 'none';
        }
    });

}


let loaded = false;




function loadAndViewImage(imageId) {
    const element = document.getElementById('dicomImage');
    const start = new Date().getTime();
    //imageId = 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-980x653.jpg'
    cornerstone.loadImage(imageId).then(function (image) {
        console.log(image);

        //alert("PixelData: " + image.getPixelData);
        const viewport = cornerstone.getDefaultViewportForImage(element, image);
        // document.getElementById('toggleModalityLUT').checked = (viewport.modalityLUT !== undefined);
        // document.getElementById('toggleVOILUT').checked = (viewport.voiLUT !== undefined);
        cornerstone.displayImage(element, image, viewport);
        if (loaded === false) {
            cornerstoneTools.mouseInput.enable(element);
            cornerstoneTools.mouseWheelInput.enable(element);
            cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
            cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
            cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
            cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel

            //cornerstoneTools.imageStats.enable(element);
            loaded = true;
        }

        function getTransferSyntax() {
            const value = image.data.string('x00020010');
            return value + ' [' + uids[value] + ']';
        }

        function getSopClass() {
            const value = image.data.string('x00080016');
            return value + ' [' + uids[value] + ']';
        }

        function getPixelRepresentation() {
            const value = image.data.uint16('x00280103');
            if (value === undefined) {
                return;
            }
            return value + (value === 0 ? ' (unsigned)' : ' (signed)');
        }

        function getPlanarConfiguration() {
            const value = image.data.uint16('x00280006');
            if (value === undefined) {
                return;
            }
            return value + (value === 0 ? ' (pixel)' : ' (plane)');
        }

        document.getElementById('filename').textContent = document.getElementById('fName').innerText;
        document.getElementById('topleft').textContent = image.data.string('x00100010');

        document.getElementById('transferSyntax').textContent = getTransferSyntax();
        document.getElementById('sopClass').textContent = getSopClass();
        document.getElementById('samplesPerPixel').textContent = image.data.uint16('x00280002');
        document.getElementById('photometricInterpretation').textContent = image.data.string('x00280004');
        document.getElementById('numberOfFrames').textContent = image.data.string('x00280008');
        document.getElementById('planarConfiguration').textContent = getPlanarConfiguration();
        document.getElementById('rows').textContent = image.data.uint16('x00280010');
        document.getElementById('columns').textContent = image.data.uint16('x00280011');
        document.getElementById('pixelSpacing').textContent = image.data.string('x00280030');
        document.getElementById('bitsAllocated').textContent = image.data.uint16('x00280100');
        document.getElementById('bitsStored').textContent = image.data.uint16('x00280101');
        document.getElementById('highBit').textContent = image.data.uint16('x00280102');
        document.getElementById('pixelRepresentation').textContent = getPixelRepresentation();
        document.getElementById('windowCenter').textContent = image.data.string('x00281050');
        document.getElementById('windowWidth').textContent = image.data.string('x00281051');
        document.getElementById('rescaleIntercept').textContent = image.data.string('x00281052');
        document.getElementById('rescaleSlope').textContent = image.data.string('x00281053');
        document.getElementById('basicOffsetTable').textContent = image.data.elements.x7fe00010 && image.data.elements.x7fe00010.basicOffsetTable ? image.data.elements.x7fe00010.basicOffsetTable.length : '';
        document.getElementById('fragments').textContent = image.data.elements.x7fe00010 && image.data.elements.x7fe00010.fragments ? image.data.elements.x7fe00010.fragments.length : '';
        document.getElementById('minStoredPixelValue').textContent = image.minPixelValue;
        document.getElementById('maxStoredPixelValue').textContent = image.maxPixelValue;
        const end = new Date().getTime();
        const time = end - start;
        document.getElementById('totalTime').textContent = time + "ms";
        document.getElementById('loadTime').textContent = image.loadTimeInMS + "ms";
        document.getElementById('decodeTime').textContent = image.decodeTimeInMS + "ms";

    }, function (err) {
        alert("Error" + err);
    });
}

// this function gets called once the user drops the file onto the div
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    alert("file.name");
    // Get the FileList object that contains the list of files that were dropped
    const files = evt.dataTransfer.files;

    // this UI is only built for a single file so just dump the first one
    var file = files[0];
    alert(file.name);
    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    loadAndViewImage(imageId);
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}


function dumpDataSet(dataSet, output) {
    //alert("Into Datadump");
    // the dataSet.elements object contains properties for each element parsed.  The name of the property
    // is based on the elements tag and looks like 'xGGGGEEEE' where GGGG is the group number and EEEE is the
    // element number both with lowercase hexadecimal letters.  For example, the Series Description DICOM element 0008,103E would
    // be named 'x0008103e'.  Here we iterate over each property (element) so we can build a string describing its
    // contents to add to the output array

    try {
        for (var propertyName in dataSet.elements) {
            var element = dataSet.elements[propertyName];
            //alert('DicomElement: ' + element);
            // The output string begins with the element tag, length and VR (if present).  VR is undefined for
            // implicit transfer syntaxes
            var text = element.tag;
            var thetag = element.tag;
            text += " length=" + element.length;

            if (element.hadUndefinedLength) {
                text += " <strong>(-1)</strong>";
            }
            text += "; ";

            if (element.vr) {
                text += " VR=" + element.vr + "; ";
            }

            var color = 'black';

            // Here we check for Sequence items and iterate over them if present.  items will not be set in the
            // element object for elements that don't have SQ VR type.  Note that implicit little endian
            // sequences will are currently not parsed.
            if (element.items) {
                output.push('<li>' + text + '</li>');
                output.push('<ul>');

                // each item contains its own data set so we iterate over the items
                // and recursively call this function
                var itemNumber = 0;
                element.items.forEach(function (item) {
                    output.push('<li>Item #' + itemNumber++ + ' ' + item.tag + '</li>')
                    output.push('<ul>');
                    dumpDataSet(item.dataSet, output);
                    output.push('</ul>');
                });
                output.push('</ul>');
            }
            else if (element.fragments) {
                output.push('<li>' + text + '</li>');
                output.push('<ul>');

                // each item contains its own data set so we iterate over the items
                // and recursively call this function
                var itemNumber = 0;
                element.fragments.forEach(function (fragment) {
                    var basicOffset;
                    if (element.basicOffsetTable) {
                        basicOffset = element.basicOffsetTable[itemNumber];
                    }

                    var str = '<li>Fragment #' + itemNumber++ + ' offset = ' + fragment.offset;
                    str += '(' + basicOffset + ')';
                    str += '; length = ' + fragment.length + '</li>';
                    output.push(str);
                });
                output.push('</ul>');
            }
            else {


                // if the length of the element is less than 128 we try to show it.  We put this check in
                // to avoid displaying large strings which makes it harder to use.
                if (element.length < 128) {
                    // Since the dataset might be encoded using implicit transfer syntax and we aren't using
                    // a data dictionary, we need some simple logic to figure out what data types these
                    // elements might be.  Since the dataset might also be explicit we could be switch on the
                    // VR and do a better job on this, perhaps we can do that in another example

                    // First we check to see if the element's length is appropriate for a UI or US VR.
                    // US is an important type because it is used for the
                    // image Rows and Columns so that is why those are assumed over other VR types.
                    if (element.length === 2) {
                        text += " (" + dataSet.uint16(propertyName) + ")";
                    }
                    else if (element.length === 4) {
                        text += " (" + dataSet.uint32(propertyName) + ")";
                    }

                    // Next we ask the dataset to give us the element's data in string form.  Most elements are
                    // strings but some aren't so we do a quick check to make sure it actually has all ascii
                    // characters so we know it is reasonable to display it.
                    var str = dataSet.string(propertyName);

                    var stringIsAscii = isASCII(str);

                    if (stringIsAscii) {
                        // the string will be undefined if the element is present but has no data
                        // (i.e. attribute is of type 2 or 3 ) so we only display the string if it has
                        // data.  Note that the length of the element will be 0 to indicate "no data"
                        // so we don't put anything here for the value in that case.
                        if (str !== undefined) {
                            text += '"' + str + '"';
                            var private ;
                            if (str.indexOf(viewerName) >= 0) {
                                viewerTag = thetag.split('').take(5).join('');
                                private = 'Private Creator:UACJ_VISOR'
                                //alert('viewerTag: ' + viewerTag);
                            }

                            if (viewerTag != undefined) {
                                if (thetag.startsWith(viewerTag)) {
                                    var te = thetag.split('').skip(5).join('');
                                    var tstr = viewerTag + ',' + te + '=' + (private == undefined ? str : private );//+ str);
                                    private = undefined;
                                    viewerData.push(tstr);
                                }
                            }
                        }
                    }
                    else {
                        if (element.length !== 2 && element.length !== 4) {
                            color = '#C8C8C8';
                            // If it is some other length and we have no string
                            text += "<i>binary data</i>";
                        }
                    }

                    if (element.length === 0) {
                        color = '#C8C8C8';
                    }

                }
                else {
                    color = '#C8C8C8';

                    var vl = dataSet.uint32(propertyName);
                    //alert("Tag:::: " + text + " -- value " + vl);
                    // Add text saying the data is too long to show...
                    text += "<i>data too long to show</i>";
                }
                // finally we add the string to our output array surrounded by li elements so it shows up in the
                // DOM as a list
                output.push('<li style="color:' + color + ';">' + text + '</li>');


            }
        }
        //viewerTag = undefined;
        //alert('Done' + viewrData);

    } catch (err) {
        alert("Crashed");
        var ex = {
            exception: err,
            output: output
        };
        alert('Done' + viewrData);

        throw ex;
    }

}

function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
}


function renderLsIMageE(fileO) {
    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(fileO);
    //alert("ImageID: " + imageId);
    loadAndViewImage(imageId); //cornerstone.enable(element);


}

function parseDicomInfoE(data) {

    alert("PARSER: " + data.length);

    //var fileReader = new FileReader();
    //fileReader.readAsArrayBuffer(file);

    //var tmpFile = new File(data, 'dicom.dcm', {type: 'application/dicom'});//new File([data], 'dicom.dcm');

    alert("SIZE tmpFile: " + tmpFile.size);
    var byteArray = data; //new Uint8Array(data);
    alert("byteArray: " + byteArray);
    var kb = byteArray.length / 1024;
    var mb = kb / 1024;
    var byteStr = mb > 1 ? mb.toFixed(3) + " MB" : kb.toFixed(3) + " KB";
    alert("SIZE: " + byteStr);

    var dataSet;
    var start = new Date().getTime();
    dataSet = dicomParser.parseDicom(byteArray);

    //alert("DataSet read: " + dataSet);
    // 
    viewerData = [];
    viewerTag = undefined;
    var output = [];
    dumpDataSet(dataSet, output);
    alert('Prediction: ' + viewerData);
    //alert("Output read: " + output.length);
    document.getElementById('dumpdicom').innerHTML = '<ul>' + output.join('') + '</ul>';



}

function getImg() {

    //alert('getImg()');
    initCanvas2();
    wImage = new Image();

    var bA = arrayBufferToBase64(fileContainer);


    var image = "data:" + fileType + ";base64," + bA;

    wImage.src = image;

    wImage.onload = redraw2;


}


function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function clearData(e) {
    e.stopPropagation();
    e.preventDefault();
    //alert(e);
    var pre = dojo.byId('predictionDiv');
    dojo.empty(pre);
}
function saveData(e) {
    e.stopPropagation();
    e.preventDefault();
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

    setupTxMessage(updata);
    // jn['Action'] = 'savePrediction';

    //run();
    //removeImgEvents();
}

function run() {
    const canvas = document.getElementById('canvasClass');
    var w = dojo.style(canvas, 'width');
    var h = dojo.style(canvas, 'height');
    const panAndZoom = new PanAndZoom(canvas, draw, w, h);
}


function storeFileTask(fileName, info) {
    //alert('Hello From IN');
    var myValue = 5;
    const blob = new Blob([info], { type: 'application/dicom' });
    var dat = { objectName: fileName, objectData: blob };

    alert("INFOBLOB: " + blob);
    try {
        $.ajax({
            type: "POST",
            url: "/storeFile",
            data: dat,
            async: false,
            //processData: false,
            contentType: 'application/dicom',
            //dataType: 'json',
            success: function (rsp) {
                alert("FB: " + rsp);
            },
            failure: function (response) {
                alert("FAILURE: " + response);
            }

        });

    }
    catch (e) {
        alert('Hello From Catch ' + e);
    }
    //alert('Hello From task');

}
function storeFileTask_(fileName, info) {
    //alert('Hello From IN');
    var myValue = 5;
    var dat = { objectName: fileName, objectData: info };
    var fd = new FormData();
    fd.append("name", fileName);
    fd.append("file", info);
    alert("INFO: " + fd.file);

    fetch("/storeFile", {
        method: "POST",
        body: fd,
    });

}

function sendFile(files) {
    var data = new FormData();

    // $.each($('#upload-input')[0].files, function(i, file) {
    //     data.append('file-'+i, file);
    // });
    dojo.forEach(files, function (file) {
        data.append('uploads', file);
    });


    $.ajax({
        url: '/inputFile',
        data: data,
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        success: function (data) {
            var json = JSON.parse(data);
            setupTxMessage('ProcessFiles', json);
        }
    });
}
dojo.require("dojo.parser");

dojo.require("dijit.dijit");

dojo.require("dijit.layout.AccordionContainer");

dojo.require("dijit.layout.BorderContainer");

dojo.require("dijit.layout.ContentPane");

 

dojo.require("dojox.layout.GridContainer");

 

dojo.require("dojox.layout.ToggleSplitter");

dojo.require("dojox.layout.ExpandoPane");

dojo.require("dojo.data.ItemFileReadStore");

dojo.require("dijit.form.ComboBox");

dojo.require("dijit.Tree");

dojo.require("dijit.layout.TabContainer");

dojo.require("dojo/_base/lang");

 

dojo.require("dojox.layout.FloatingPane");

dojo.require("dojo.fx.easing");

dojo.require("dojox.rpc.Service");

dojo.require("dojo.io.script");

dojo.require("dojo.dnd.Source");

 

dojo.require("dojox.layout.ScrollPane");

 

//for dialog

dojo.require("dojox.widget.DialogSimple");

dojo.require("dojox.widget.Dialog");

dojo.require("dijit.form.DropDownButton");

dojo.require("dojox.json.query");

 

dojo.require("dijit.TooltipDialog");

 

dojo.require("dijit.form.Button");

 

//touch function

dojo.require("dojo.touch");

 

//radiobutton

dojo.require("dijit.form.RadioButton");

//dojo.require("dojox.widget.FisheyeLite");

//dojo.require("dojox.widget.FisheyeList");

//dojo.require("dojox.widget.FisheyeListItem");

 

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

 

 

//toolbar

dojo.require("dijit.Toolbar");

dojo.require("dijit.ToolbarSeparator");

dojo.require("dijit.registry");

 

dojo.require("dojo.dom-class");

dojo.require("dojo.dom");

 

//dojo colors

dojo.require("dojo._base.Color");

dojo.require("dijit/_Widget");

dojo.require("dijit/_TemplatedMixin");

 

 

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

 

 

dojo.require("gridx/modules/VirtualVScroller");

dojo.require("gridx/modules/Dod");

 

dojo.require("gridx/Grid");

dojo.require("gridx/core/model/cache/Sync");

dojo.require("gridx/allModules");

dojo.require("gridx/modules/Dod");

dojo.require("gridx.modules.RowHeader");

 

dojo.require("dojox/widget/Standby");

 

 

dojo.require("dijit/tree/ObjectStoreModel");

dojo.require("cbtree/Tree");

dojo.require("cbtree/model/TreeStoreModel");

dojo.require("cbtree/store/Hierarchy");

 

dojo.require("dijit/form/Textarea");

dojo.require("dijit/form/SimpleTextarea");

 

dojo.require('dojo/date/locale');

dojo.require("dojo.NodeList-traverse");

dojo.require("dojo/domReady!");

 

function openWindow(newSite) {

 

    switch (newSite) {

 

        case "Azteca":

            window.open(http://mexico.delphiauto.net/azteca/);

 

            break;

        case "Apollo":

            window.open(http://p01.na.delphiauto.net/01/Apollo/Pages/default.aspx);

            break;

        case "GlobalView":

            window.open(http://chamber-online/chamberonline/GlobalView.aspx);

 

            break;

        case "PlanView":

            window.open(http://pve.northamerica.delphiauto.net);

 

            break;

        case "SiteView":

 

            window.open(http://chamber-online/chamberonline/WebPanel.aspx);

            break;

        case "Validation":

            window.open(http://valserver-02.northamerica.delphiauto.net/);

 

            break;

        case "VEGOS":

            window.open(http://vm-usinkokval1.northamerica.delphiauto.net/vegos/);

 

            break;

 

        default:

            Alert("Invalid Option");

 

            break;

 

 

    }

 

}

 

 

 

var standbySign;

 

dojo.ready(function () {

    //dojo.addOnLoad(function () {

    var mainR = document.getElementById("mainReport");

    //    var newWidth = window.innerWidth;

    //    var newHeight = window.innerHeight*0.9;

 

    require([

        "dijit/layout/BorderContainer",

        "dijit/layout/ContentPane",

        "dijit/layout/TabContainer",

        "dojox/layout/ExpandoPane",

        "dojo/domReady!"

    ], function (BorderContainer, ContentPane, TabContainer) {

        // create a BorderContainer as the top widget in the hierarchy

        //var bc = new BorderContainer({ id: "bcContent", style: "height: " + newHeight + "px; width: 100%;", gutters: true });

        var bc = new BorderContainer({ id: "bcContent", style: "height:100%; width: 100%;", gutters: true });

 

        bc._splitterClass = "dojox.layout.ToggleSplitter";

        //bc.id = "bcContent";

        var ep = new dojox.layout.ContentPane({

            id: "ep1",

            title: "Validation Sites",

            region: "left",

            splitter: "true",

            style: "width: 15%; height:100%;"// background-color:#FFDEAD"

        });//.placeAt(borderContainer);

        // create a ContentPane as the left pane in the BorderContainer

        createToolBar(ep.domNode);

 

 

        var ep4 = new dojox.layout.ContentPane({

 

            id: 'treeContent',

 

 

            style: "width: 95%; height:95%;"// background-color:#FFDEAD"

        });

 

        ep4.treearray = [];

        ep.addChild(ep4);

        var tabS = makesitesTree(ep4);

        ep4.addChild(tabS);

        ep4.treeSites = tabS;

 

        bc.addChild(ep);

 

        // create a TabContainer as the center pane in the BorderContainer,

        var tc = new TabContainer({ region: "center", tabStrip: true, attachParent: true });

 

 

        // which itself contains two children

        var gridC = createGridContainer();

 

        var cp1 = new ContentPane({

            id: 'centerContent',

            region: "center",

            style: "width: 100%",

            splitter: "true",

            gutters: false,

            content: gridC.domNode

        });

        //cp1.gridcontainer = gridC;

        // which itself contains two children

 

        var cpR = new ContentPane({

 

            region: "right",

            style: "width: 16%",

            splitter: "true"

            //,content:tc.domNode

        });

        //var tab1 = new ContentPane({ title: "tab 1" }),

        //    tab2 = new ContentPane({ title: "tab 2" });

 

        ////createExpando(tab2);

        //createToolBar(tab1.domNode);

        //createToolBar(tab2.domNode);

 

        //tc.addChild(tab1);

        //tc.addChild(tab2);

        bc.addChild(tc);

        bc.addChild(cp1);

        bc.addChild(cpR);

 

        // put the top level widget into the document, and then call startup()

        //document.body.appendChild(bc.domNode);

        mainR.appendChild(bc.domNode);

        bc.startup();

        // bc.addChild(new ContentPane({ region: "right", content: "Added...", style: "width: 200px;" }));

 

        //bc.resize({ w: "600px", h: undefined });

 

        var reportImage = "<img src='css/images/icon2.png' title='Choose Options' align='middle' style='margin:0px 2px'  alt='CPK' width='32' height='28' /><span>Report Options</pan>";

        //var batchImage = "<img src='css/images/icon105_32.png' title='CPK' align='middle' style='margin:0px 2px'  alt='CPK' width='32' height='28' /><span>Batch sequence</pan>";

        var taskImage = "<img src='css/images/icon15.png' title='Define a task' align='middle' style='margin:0px 2px'  alt='CPK' width='32' height='28' /><span>Task Builder</pan>";

        deleteTitlePaneImage = "<img src='css/images/icon133.png' title='Delete this' align='middle' style='margin:0px 2px; float: right; cursor:pointer;'  alt='Delete this' width='16' height='16' onclick=\"deleteTitlePane(event)\"  class=\"***\"/>";

        var linkImage = "<img src='css/images/icon101_32.png' title='Links' align='middle' style='margin:0px 2px'  alt='CPK' width='32' height='32' /><span>Links</span>";

        var rawImage = "<img src='css/images/icon27.png' title='Links' align='middle' style='margin:0px 2px'  alt='CPK' width='32' height='32' /><span>Raw data</span>";

 

 

        var tpW = new dijit.TitlePane({ title: "Status Panel", content: "Hello" });

        cpR.addChild(tpW);

 

        createStandContent(tpW.containerNode);

 

        var rCont = buildReportOptions();

        var tp = new dijit.TitlePane({ title: reportImage, content: rCont });

        //dojo.place("<br>", tp.domNode, "last");

        cpR.addChild(tp);

 

        //var rawD = buildRawData();

        //cpR.addChild(new dijit.TitlePane({ title: rawImage, content: rawD }));

        /*

        var lkC = linkBuilderOptions();

        //var tskOpt = taskBuilderOptions();

        //cpR.addChild(new dijit.TitlePane({ title: taskImage, content:tskOpt }));

        cpR.addChild(new dijit.TitlePane({ title: linkImage, content: lkC }));

        //tp.startup();

        */

       

    });

 

 

    setTimeout(resizeBorder, 10);

 

    fromDateChange();

    toDateChange();

    if (standbyLayR == undefined) {

        standbyLayR = new dojox.widget.Standby({

            target: document.getElementById('workDiv'),

            color: "#CEFFEA"

            /*background-color:aliceblue;*/

        });

        document.body.appendChild(standbyLayR.domNode);

        //standbyLay.show();

    }

    //var f = dijit.byId("exportbtn");//.disabled = true;

    //f.setDisabled(true);// = true;

 

 

});

 

var standbyLayR;

function createStandContent(node) {

    dojo.empty(node);

    dojo.style(node, "height", '5em');

    var divW = dojo.place("<div id='workDiv'></div>", node, "first");

    dojo.place("<span id='workDivSpan'> Ready </span>",divW, "first");

 

   

}

var deleteTitlePaneImage;

function deleteTitlePane(e) {

    var elem, evt = e ? e : event;

    if (evt.srcElement) elem = evt.srcElement;

    else if (evt.target) elem = evt.target;

 

    var pn = elem.className;

 

    var pane = dijit.byId(pn);

    var value = pane.fac;

 

    removeFromArray(treeItems, value);

    pane.destroyRecursive(true);

 

}

function removeFromArray(array, value) {

    var idx = array.indexOf(value);

    if (idx !== -1) {

        array.splice(idx, 1);

    }

    return array;

}

window.addEventListener('resize', resizeBorder, false);

function resizeBorder() {

    var mainR = document.getElementById("mainReport");

        var newWidth = window.innerWidth;

        var newHeight = window.innerHeight * 0.91;

        dojo.style(mainR, "height", newHeight + "px");

 

        var bc = dijit.byId("bcContent");

        bc.resize();

 

}

 

function buildRawData() {

    var div = dojo.create("div");

    var myFromDate = "rawdate";

   

    var date = new Date();

    var nowdate = formatDate(date);      

 

    var c = 'constraints = \"{datePattern :\'' + 'yyyy-MM-dd' + '\'}"';

 

    div = dojo.toDom(//'<label>Time Frame</label><br />' +

                        '<label for="taskDate">Start date:&nbsp</label>' +          // constraints="{min:'08/22/2008',datePattern : 'dd-MMM-yyyy'}"

                       '<input  id="' + myFromDate + '" type="text" ' + c + ' style = "width:100px"   data-dojo-type="dijit/form/DateTextBox" required="true""  value="' + nowdate + '"/>');

 

 

   

    

    return div;

 

}

function linkBuilderOptions() {

    //create datepicker

    var div = dojo.create("div");

    div.id = 'list';

    var u = dojo.create('ul');

    var ul = dojo.place(u, div, "first");

 

    var trStr = dojo.byId("initTree");

    var trInfo = JSON.parse(trStr.value);

    var links = JSON.parse(trInfo.links);


 

    dojo.forEach(links, function (item, index) {

        var url = item.url;

        var name = item.name;

        var icon = item.icon;

 

        var dataImg = '<img src="' + 'css/images/' + icon  +  '"' +

           ' title="' + url + '"' +

        ' align="middle" style="margin:2px 5px "   width="32" height="32"/>';

 

        var l = dojo.create('li');

 

        var li = dojo.place(l, ul, 'last');

        li.innerHTML = '<a href="' + url + '" target="_blank">' + name + '</a>';

        var imgL = dojo.place(dataImg, li, 'first');

        imgL.link = url;

 

    });

 

    var scrollPane = new dojox.layout.ScrollPane({

        orientation: "vertical",

        style: "width:100%; height:100%; border:none; overflow:hidden;"

    }, div);

    scrollPane.startup();

 

 

    return scrollPane.domNode;

}

 

 

 

function taskBuilderOptions() {

    //create datepicker

    var dateNode = dojo.create("div");

 

    var myFromDate = "taskDate";

    var myToDate = "ToDate";

    var date = new Date();

    var nowdate = formatDate(date);         // native .toString() functionality

    var days = date.getDate() - 1;

    date.setDate(date.getDate() - days);

    var fromdate = formatDate(date);

 

    var c = 'constraints = \"{datePattern :\'' + 'yyyy-MM-dd' + '\'}"';

 

    dateNode = dojo.toDom(//'<label>Time Frame</label><br />' +

                        '<label for="taskDate">Start date:&nbsp</label>' +          // constraints="{min:'08/22/2008',datePattern : 'dd-MMM-yyyy'}"

                       '<input  id="' + myFromDate + '" type="text" ' + c + ' style = "width:100px"   data-dojo-type="dijit/form/DateTextBox" required="true" onChange="startDateChange()"  value="' + nowdate + '"/>');

 

                       //'<label for="toDate">&nbsp&nbspTo:&nbsp</label>' +

                       //'<input  id="' + myToDate + '" type="text"   ' + c + '  style = "width:100px"   data-dojo-type="dijit/form/DateTextBox" required="true" onChange="toDateChange()"  value="' + nowdate + '"/>');

 

    //create table

    var rTable =

        '<table style="width:100%">' +

  '<tr>' +

    '<td  class="outcell">*period**timerange**alert*</td>' +

    //'<td  class="outcell">*period*</td>' +

     '</tr>' +

  //   '<tr>' +

  //  '<td class="outcell">*alert*</td>' +

  //'</tr>'+

  '</table>';

 

    //Create Radio button list

    var ulStr = '<ul id="ulperiod"  style="list-style-type: none" aria-label="Period:">';

    var liStr =

                '<li>' +

                                                               '<input id="' + '@@@' + '" type="radio" name="period" value="' + '^^^' + '" checked ' +

                'data-dojo-type="dijit/form/RadioButton">' +

                '<label for="' + '^^^' + '">' + '^^^' + '</label>' +

                '</li>';

    var trStr = dojo.byId("initTree");

    var trInfo = JSON.parse(trStr.value);

    var cyc = JSON.parse(trInfo.cycle);

    var trange = JSON.parse(trInfo.timerange);

    var triggers = JSON.parse(trInfo.triggers);

 

 

    dojo.forEach(cyc, function (item, index) {

        var nls = liStr.split("@@@").join("per" + index);

        var nl = nls.split("^^^").join("&nbsp" + item);

        if (index > 0)

            nl = nl.replace("checked", "");

        ulStr += nl;

    });

    ulStr += '</ul>';

 

    var nrtable = rTable.replace("*period*", ulStr);

 

    var ulOut = '<ul id="ultriggers"  style="list-style-type: none" aria-label="Events trigger:">';

 

    var liOut =

        '<li>' +

        '<input type="checkbox" id="@@@" ' +

        'data-dojo-type="dijit.form.CheckBox" value="^^^"' +

        'data-dojo-props="checked: false">' +

        '<label >^^^</label>' +

        '</li>';

 

    dojo.forEach(triggers, function (item, index) {

        var nls = liOut.split("@@@").join("trg" + index);

        var nl = nls.split("^^^").join("&nbsp" + item);

        ulOut += nl;

    });

    ulOut += '</ul>';

 

 

    var ulEq = '<ul id="ultrange"  style="list-style-type: none" aria-label="Time Range">';

 

    var liEq =

        '<li>' +

        '<input type="radio" id="@@@" ' +

        'data-dojo-type="dijit.form.RadioButton" value="^^^"' +

        'data-dojo-props="checked: true">' +

        '<label >^^^</label>' +

        '</li>';

 

    dojo.forEach(trange, function (item, index) {

        var nls = liEq.split("@@@").join("trange" + index);

        var nl = nls.split("^^^").join("&nbsp" + item);

        if (index > 0)

            nl = nl.replace("true", "false");

        ulEq += nl;

    });

    ulEq += '</ul>';

 

    //ulOut += ulEq;

 

 

    //ulEq += ulOut;

    nrtable = nrtable.replace("*timerange*", ulEq);

    nrtable = nrtable.replace("*alert*", ulOut);

    //nrtable = nrtable.replace("*timerange*", "");

 

    var rbtn = dojo.place(nrtable, dateNode, "last");

 

    var btD = dojo.place('<div style="width:100%" class="outbtnbtn"></div>', dateNode, "last");

    var bBar = new dijit.Toolbar({}, btD);

    //createButton("Refresh", "refreshIcon", bBar, "refreshbtn");

    //createButton("Export it", "printoutIcon", bBar, "exportbtn");

 

 

    return dateNode;

}

 

 

 

 

function buildReportOptions() {

    //create datepicker

    var dateNode = dojo.create("div");

 

    var myFromDate =  "FromDate";

    var myToDate =  "ToDate";

    var date = new Date();

    var nowdate = formatDate(date);         // native .toString() functionality

    var days = date.getDate() - 1;

    date.setDate(date.getDate() - days);

    var fromdate = formatDate(date);

 

    var c = 'constraints = \"{datePattern :\'' + 'yyyy-MM-dd' + '\'}"';

 

    dateNode = dojo.toDom('<label>Time Frame</label><br />' +

                        '<label for="fromDate">From:&nbsp</label>' +          // constraints="{min:'08/22/2008',datePattern : 'dd-MMM-yyyy'}"

                       '<input  id="' + myFromDate + '" type="text" ' + c + ' style = "width:100px"   data-dojo-type="dijit/form/DateTextBox" required="true" onChange="fromDateChange()"  value="' + fromdate +'"/>' +

                       '<label for="toDate">&nbsp&nbspTo:&nbsp</label>' +

                       '<input  id="' + myToDate + '" type="text"   ' + c + '  style = "width:100px"   data-dojo-type="dijit/form/DateTextBox" required="true" onChange="toDateChange()"  value="' + nowdate + '"/>');

 

    //create table

    var rTable =

        '<table style="width:100%">' +

  '<tr>' +

    '<td>*serie**output*</td>' +

     '</tr>' +

  //   '<tr>' +

  //  '<td class="outcell">*output*</td>' +

  //'</tr>'+

  '</table>';

 

    //Create Radio button list

    var ulStr = '<ul id="ulseries"  style="list-style-type: none" aria-label="Series:">';

    var liStr =

                '<li>' +

                                                               '<input id="' + '@@@' + '" type="radio" name="series" value="' + '^^^' + '" checked '+

                'data-dojo-type="dijit/form/RadioButton">' +

                '<label for="' + '^^^' + '">' + '^^^' + '</label>' +

                '</li>';

    var trStr = dojo.byId("initTree");

    var trInfo = JSON.parse(trStr.value);

    var seriesString = JSON.parse(trInfo.series);

    var outFile = JSON.parse(trInfo.output);

    var equipInfo = JSON.parse(trInfo.equipment);

 

 

    dojo.forEach(seriesString, function (item, index) {

        var nls = liStr.split("@@@").join("series" + index);

        var nl = nls.split("^^^").join("&nbsp" + item);

        if (index > 0)

            nl = nl.replace("checked", "");

        ulStr += nl;

    });

    ulStr += '</ul>';

 

    var nrtable = rTable.replace("*serie*", ulStr);

 

    var ulOut = '<ul id="ulOutput"  style="list-style-type: none" aria-label="Export to:">';

 

    var liOut =

        '<li>' +

        '<input type="checkbox" id="@@@" ' +

        'data-dojo-type="dijit.form.CheckBox" value="^^^"' +

        'data-dojo-props="checked: false">' +

        '<label >^^^</label>' +

        '</li>' ;

 

    dojo.forEach(outFile, function (item, index) {

        var nls = liOut.split("@@@").join("out" + index);

        var nl = nls.split("^^^").join("&nbsp" + item);

        ulOut += nl;

    });

    ulOut += '</ul>';

 

 

    var ulEq = '<ul id="ulEquipment"  style="list-style-type: none" aria-label="Equipment to include:">';

 

    var liEq =

        '<li>' +

        '<input type="checkbox" id="@@@" ' +

        'data-dojo-type="dijit.form.CheckBox" value="^^^"' +

        'data-dojo-props="checked: false">' +

        '<label >^^^</label>' +

        '</li>';

 

    dojo.forEach(equipInfo, function (item, index) {

       var nls = liEq.split("@@@").join("equip" + index);

        var nl = nls.split("^^^").join("&nbsp" + item);

        ulEq += nl;

    });

    ulEq += '</ul>';

 

    //ulOut += ulEq;

 

 

    //ulEq += ulOut;

    //nrtable = nrtable.replace("*output*", ulEq);

    nrtable = nrtable.replace("*output*", "");

 

    var rbtn = dojo.place(nrtable, dateNode, "last");

   

    var btD = dojo.place('<div style="width:100%" class="outbtnbtn"></div>', dateNode, "last");

    var bBar = new dijit.Toolbar({}, btD);

    createButton("Refresh", "refreshIcon", bBar, "refreshbtn");

    //createButton("Export it", "printoutIcon", bBar, "exportbtn");

 

 

    return dateNode;

}

 

 

function createButton(label, className, node, idbtn) {

 

  

 

    var buttonR = new dijit.form.Button({

        id: 'refreshbtn',

        name: 'Refresh',

        label: 'Plot',

        showLabel: true,

        //type: "submit",

        onClick: function (evt) {

            plotFlag = true;

            exportFlag = false;

                refreshExport(evt);

 

        },

        iconClass: "refreshIcon"

    }, document.createElement('input'));

 

    buttonR.startup();

  

    node.addChild(buttonR);

 

 

    var buttonK = new dijit.form.Button({

        id: 'exportbtn',

        name: 'Export',

        label: 'PDF',

        showLabel: true,

        //type: "submit",

        onClick: function (evt) {

            plotFlag = false;

            exportFlag = true;

            exportFunction();

 

        },

        iconClass: 'pdfIcon'

    }, document.createElement('input'));

 

    buttonK.startup();

 

    node.addChild(buttonK);

 

    var buttonEx = new dijit.form.Button({

        id: 'exportbtnEx',

        name: 'Export',

        label: 'Excel',

        showLabel: true,

        //type: "submit",

        onClick: function (evt) {

            //plotFlag = false;

            //exportFlag = true;

            exportExcelFunction();

 

        },

        iconClass: 'excelIcon'

    }, document.createElement('input'));

 

    buttonEx.startup();

 

    node.addChild(buttonEx);

    //var rbt = dojo.place(buttonR.domNode, node, "last");

 

 

}

 

function exportExcelFunction() {

 

    //return;

 

    var rBtn = getRadioButtonChecked();

    var getSdate = formatDate(procDate("FromDate"));

    var getEdate = formatDate(procDate("ToDate"));

 

 

    var gridCont = dijit.byId('gridContainer');

    gridChildren = gridCont.getChildren();//window.getComputedStyle(elem).width

 

    if (gridChildren.length <= 0)

        return;

    //enableBtns(true);

 

    var spanT = document.getElementById('workDivSpan');

    spanT.innerHTML = 'Exporting to Excel...';

 

    standbyLayR.show();

 

    var indexCounter = 0;

    var excelItems = [];

    dojo.forEach(gridChildren, function (cp, index) {

 

        var item = cp;

        var pn = item;

        var element = item.fac;

 

        element.series = rBtn;

        element.sdate = getSdate;

        element.edate = getEdate;

 

        excelItems.push(element);

    //getPlotData(element, item, w);

 

 

    });

 

    var mdt = new Date;

    var dte = formatDate(mdt);

    var tmt = formatTime(mdt);

 

    var jsonParams = "{'Parameter':'" + JSON.stringify(excelItems) + "'}";

    var retInfo;

    //goNext = false;

    try {

        $.ajax({

            type: "POST",

            url: "Reports.aspx/excExport",

 

            data: jsonParams,

            contentType: "application/json; charset=utf-8",

            dataType: "json",

            success: function (response) {

                retInfo = response.d;

                window.open("download.aspx?reportId=" + retInfo + "&date=" + dte + ' ' + tmt);

                spanT.innerHTML = 'Ready';

                standbyLayR.hide();

 

               

            },

            error: function (response) {

                alert("Invalid data from server.  makeDynamicsDirectory() function");

            },

            async: true

        });

    }

    catch (e) {

 

        return undefined;

    }

    //return plotInfo.series == undefined ? undefined : plotInfo;

 

 

}

 

var childCounter;

var enableExport = false;

 

function exportFunction() {

 

    var gridCont = dijit.byId('gridContainer');

    gridChildren = gridCont.getChildren();//window.getComputedStyle(elem).width

 

    if (gridChildren.length <= 0)

        return;

    enableBtns(true);

 

    var indexCounter = 0;

    dojo.forEach(gridChildren, function (cp, index) {

        var node = cp.containerNode;

        var chartVector = node.charts;

        if (chartVector) {

 

            indexCounter += 1;

 

        }

 

    });

 

    indexPages = 0;

    //indexRows = 60;

    var a = indexCounter;

    var b = indexPerPage * indexRows;

 

    indexPages = (a / b | 0);

    var c = (a % b > 0) ? 1 : 0;

    indexPages += c;

 

    childCounter = 0;

    intervalTimerR = setInterval(function () { tmrEventReport(); }, 25);

 

    standbyLayR.show();

 

 

}

function generateTable(docPDF, startYc, columns, data, side, colorType) {

    var marg = {};

    var headerColor = [];

    var bdy, headerS;

    switch (side) {

        case 'left':

            marg = { right: docPDF.internal.pageSize.width / 1.8 };

            break;

        case 'right':

            marg = { left: docPDF.internal.pageSize.width / 1.8 };

 

            break;

 

 

    }

 

    switch (colorType) {

        case 'Data':

            headerColor = [90, 90, 181];

            bdy = { rowHeight: 10, fontSize: 6, valign: 'middle', halign: 'center' };

            headerS = { rowHeight: 12, fontSize: 6, valign: 'middle', halign: 'center', fillColor: headerColor };

            break;

        case "Pars":

            headerColor = [51, 52, 63];

            marg = { left: docPDF.internal.pageSize.width / 1.25 };

            bdy =  { rowHeight: 10, fontSize: 6, valign: 'middle', halign: 'left' };

            headerS = { rowHeight: 12, fontSize: 6, valign: 'middle', halign: 'left', fillColor: headerColor };

 

            break;

 

    }

 

    docPDF.autoTable(columns, data,

            {

                startY: startYc,

              

                styles: { cellPadding: 2, overflow: 'linebreak' },

                headerStyles: headerS,

                bodyStyles:bdy,

                margin: marg

                //margin: { right: doc.internal.pageSize.width/1.8 }

            }

 

 

        );

 

 

    //doc.save("table.pdf");

}

function refreshExportII(event) {

 

 

    var rBtn = getRadioButtonChecked();

    var getSdate = formatDate(procDate("FromDate"));

    var getEdate = formatDate(procDate("ToDate"));

 

    //dojo.forEach(gridChildren, function (item, index) {

    var item = gridChildren[childCounter];

    var pn = item;

    //var w = window.getComputedStyle(pn.domNode).clientWidth;

    var w = pn.domNode.clientWidth;

 

    var element = item.fac;

 

    element.series = rBtn;

    element.sdate = getSdate;

    element.edate = getEdate;

 

    var spanT = document.getElementById('workDivSpan');

    spanT.innerHTML = 'Plotting: ' + element.name;

 

    getPlotData(element, item, w);

 

}

var intervalTimerR;

var plotFlag = false;

var exportFlag = false;

function tmrEventReport() {

    //$(".column").sortable('cancel');

 

    clearInterval(intervalTimerR);

    var spanT = document.getElementById('workDivSpan');

 

    if (childCounter >= gridChildren.length) {

        //clearInterval(intervalTimer);

        //standbyLay.hide();

        spanT.innerHTML = " Done ";

        intervalTimerR = setInterval(function () { tmrClearR(); }, 1000);

        return;

    }

    if (goNext) {

        if (plotFlag)

            refreshExportII();

        else

            if (exportFlag)

                exportToPDF();

 

    }

    intervalTimerR = setInterval(function () { tmrEventReport(); }, 100);

 

}

function tmrClearR() {

 

    standbyLayR.hide();

    var spanT = document.getElementById('workDivSpan');

    //$(labelT).hide();

    clearInterval(intervalTimerR);

    enableBtns(false);

 

    //var f = dijit.byId("exportbtn");//.disabled = true;

    //f.setDisabled(false);// = true;

 

    if (exportFlag) {

        makePDFIndex();

        showPDF();

 

    }

 

    spanT.innerHTML = 'Ready';

    plotFlag = false;

    exportFlag = false;


}

var docPDF;

function showPDF() {

   // var string = docPDF.output('dataurlnewwindow');

    docPDF.save('visReport.pdf');

    //var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"

 

    //var x = window.open();

    //x.document.open();

    //x.document.write(iframe);

    //x.document.close();

 

 

}

var pdfPageCounter = 0;

 

function exportToPDF() {

 

    goNext = false;

 

    var cp = gridChildren[childCounter];

 

    if (childCounter == 0) {

 

        pdfIndex = [];

 

        pageNumber = 0;

        pdfPageCounter = 1;

        docPDF = new jsPDF('landscape', 'pt');

        docSetHeaderIndex(docPDF, 'doit');

        while (pdfPageCounter < indexPages) {

            docPDF.addPage();

            docSetHeaderIndex(docPDF, 'doit');

 

            pdfPageCounter++;

 

        }

 

        firstPage = false;

 

    }

    var title = cp.title.split('<');

 

    var spanT = document.getElementById('workDivSpan');

    spanT.innerHTML = 'Exporting: ' + title[0];

 

    var node = cp.containerNode;

    var chartVector = node.charts;

    if (chartVector) {

        //if (pdfIndex[childCounter] == undefined) {

 

            pdfIndex.push({ name: title[0], page: -1 });

 

        //}

 

        var ycoord = 0;

        makePDF(cp, docPDF, ycoord);

      

    }

    childCounter++;

    goNext = true;

 

}

function enableBtns(state) {

 

    //var b = dijit.byId("plotsel");//.disabled = true;

    //b.setDisabled(state);// = true;

 

    var c = dijit.byId("refreshbtn");//.disabled = true;

    c.setDisabled(state);// = true;

 

 

    var d = dijit.byId("newreportbtn");//.disabled = true;

    d.setDisabled(state);// = true;

 

 

    var e = dijit.byId("additemsbtn");//.disabled = true;

    e.setDisabled(state);// = true;

 

    var f = dijit.byId("exportbtn");//.disabled = true;

    f.setDisabled(state);// = true;

 

 

 

}

var gridChildren;

 

function refreshExport(event) {

    var gridCont = dijit.byId('gridContainer');

    gridChildren = gridCont.getChildren();//window.getComputedStyle(elem).width

 

    if (gridChildren.length <= 0)

        return;

    //var elementtoStore = JSON.stringify(gridChildren);

    enableBtns(true);

 

    childCounter = 0;

    intervalTimerR = setInterval(function () { tmrEventReport(); }, 100);

 

    standbyLayR.show();

 

    return;

 

    var from = event.srcElement.name;

 

    var rBtn = getRadioButtonChecked();

    var getSdate = formatDate(procDate("FromDate"));

    var getEdate = formatDate(procDate("ToDate"));

 

    dojo.forEach(gridChildren, function (item, index) {

      

        var pn = item;

        //var w = window.getComputedStyle(pn.domNode).clientWidth;

        var w = pn.domNode.clientWidth;

 

        var element = item.fac;

 

        element.series = rBtn;

        element.sdate = getSdate;

        element.edate = getEdate;

       

        var plotInfo = getPlotData(element);

        if (plotInfo != undefined) {

            var pnlId = dijit.byId(item.id);

 

            dojo.empty(pnlId.containerNode);

            if (plotInfo.categories.categoryName == "Usage")

                makeThePlots(plotInfo, pnlId.containerNode, w, element.name);

            else

                if (plotInfo.categories.categoryName == "Status")

                    makeStatusPlot(plotInfo, pnlId.containerNode, w, element.name);

        }

       //var cont = '<h1>' + element.name + '</h1>';

 

        //var r =  dojo.place(cont, pnlId.containerNode, "first");

 

 

    });

 

}

 

function procDate(theDate) {

 

    var myD = dijit.byId(theDate);

    var val = myD.value;

 

    //var acDate = new Date();

 

    //if (val > acDate)

    //    return acDate;

    return val;

 

}

var goNext = true;

function getPlotData(element, item, w) {

 

    var jsonParams = "{'Parameter':'" + JSON.stringify(element) + "'}";

    var plotInfo;

    goNext = false;

    try{

        $.ajax({

            type: "POST",

            url: "Reports.aspx/getPlotInfo",

 

            data: jsonParams,

            contentType: "application/json; charset=utf-8",

            dataType: "json",

            success: function (response) {

                plotInfo = JSON.parse(response.d);

               

                if (plotInfo != undefined && plotInfo.series != undefined) {

                    var pnlId = dijit.byId(item.id);

 

                    dojo.empty(pnlId.containerNode);

                    if (plotInfo.categories.categoryName == "Usage")

                        makeThePlots(plotInfo, pnlId.containerNode, w, element);

                    else

                        if (plotInfo.categories.categoryName == "Status")

                            makeStatusPlot(plotInfo, pnlId.containerNode, w, element);

                }

                childCounter++;

 

 

 

                goNext = true;

                //return plotInfo.series == undefined ? undefined : plotInfo;

            },

            error: function (response) {

                alert("Invalid data from server.  makeDynamicsDirectory() function");

            },

            async: true

        });

    }

    catch (e) {

 

            return undefined;

    }

    //return plotInfo.series == undefined ? undefined : plotInfo;

 

}

function makeStatusPlot(plotInfo, node, width, item)//(panelJson, plotsJson)

{

    var series = JSON.parse(plotInfo.series);

    var categories = plotInfo.categories;

    var plotSeries = [];

    var totalSeries = [];

    var order = JSON.parse(plotInfo.order);

    var totalInfo = plotInfo.total;

    var cType = plotInfo.categories.categoryName;

 

    dojo.forEach(series, function (serName, index) {

        var itm = {

            name: serName.name,

            data: JSON.parse(serName.data)

        };

 

        plotSeries.push(itm);

 

    });

 

    var percent = 0.50;

    var allW = width * percent;

    var allT = width * 0.25;

 

    var innerSize = allT * 0.10;

 

    height = 400;

 

  

 

    var title = item.site.toUpperCase() + ' ' + item.name + ' ' + item.title;

    if (item.parent == undefined)

        title = item.site.toUpperCase() + ' Site';

 

 

    //order.reverse();

 

    dojo.forEach(order, function (serName, index) {

        var itm = {

            name: serName,

            color: totalInfo[serName]['color'],

            y: totalInfo[serName]['data']

        };

 

        totalSeries.push(itm);

 

    });

 

 

    var clnP = JSON.parse(plotInfo.clientParams);

 

 

 

 

    //var $container = $('<div>').addClass("blockD ");

    var $container = $('<div>').addClass("blockD ");

    var $containerT = $('<div>').addClass("blockD ");

    var $containerC = $('<div>').addClass("blockD blockK ");

 

 

    //panel.appendChild($container[0]);

    dojo.place($container[0], node, "last");

    dojo.place($containerT[0], node, "last");

    dojo.place($containerC[0], node, "last");

 

 

    var clTableVector = makeClntTable(plotInfo, item.series, $containerC[0]);

 

 

    var nodeCharts = [];

 

 

 

    var aChart = createStatusHighChart($container[0], plotSeries, categories, title, "", allW, height);

    aChart.typeC = cType;

    aChart.clHeader = ['Parameter', 'Value'];

    aChart.clVector = clTableVector;

 

    nodeCharts.push(aChart);

    nodeCharts.push(createHighChart($containerT[0], totalSeries, categories, "Total", "", allT, height, innerSize, 'left', true));

    if (node.charts)

        node.charts = undefined;

 

    node.charts = nodeCharts;

 

 

}

 

function createTotalChart(container, dataV, categories, titleV, subTitle, plotWidth, height) {

 

    try{

        var chart1 = new Highcharts.Chart({

            chart: {

                renderTo: container,

                width: plotWidth,

                height: height,

 

                plotBackgroundColor: null,

                plotBorderWidth: null,

                plotShadow: false,

                type: 'pie'

            },

            title: {

                text: titleV

            },

            tooltip: {

                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'

            },

            plotOptions: {

                pie: {

                    allowPointSelect: true,

                    cursor: 'pointer',

                    dataLabels: {

                        enabled: true,

                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',

                        style: {

                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'

                        }

                    }

                }

            },

            series: [{

                name: 'Usage%',

                colorByPoint: true,

                data: dataV

            }]

        });

 

        return chart1;

    }

    catch (er) {

 

        var err = er;

    }

}

function createStatusHighChart(container, dataV, categories, titleV, subTitle, plotWidth, height) {

 

   

    var maxV = -100;

    dojo.forEach(dataV, function (vData, index) {

        var dta = vData.data;

        var tmpV = arrayMax(dta);

        if (tmpV >= maxV)

            maxV = tmpV;

 

    });

 

  

    var chart1 = new Highcharts.Chart({

        credits: {

            enabled: false

        },

        exporting: {

            enabled: false

        },

        chart: {

            type: 'column',

            renderTo: container,

            width: plotWidth,

            marginBottom: 90,

            marginLeft: 90,

            height: height

 

        },

        title: {

            text: titleV

        },

        subtitle: {

            text: subTitle

        },

        xAxis: {

            labels: {

                rotation: -45,

                style: {

                    color: 'black',

                    font: '9px Helvetica'

                },

                minPadding: 0.1,

                maxPadding: 0.1

 

            },

            categories:  JSON.parse(categories.data),

            crosshair: true

        },

        yAxis: {

            min: 0,

            max: maxV,

            title: {

                text: 'Usage %'

            }

        },

        tooltip: {

            headerFormat: '<span style="font-size:12px">{point.key}</span><table  style="font-size:9px">',

            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +

                '<td style="padding:0"><b>{point.y:.2f} %</b></td></tr>',

            footerFormat: '</table>',

            shared: true,

            useHTML: true

        },

        plotOptions: {

            column: {

                pointPadding: 0.0,

                groupPadding: 0.1,

                borderWidth: 0

            }

        },

        legend: {

            enabled: true,

            layout: 'vertical',

            align: 'right',

            verticalAlign: 'middle',

            itemStyle: {

                fontSize: '9px',

                font: '9pt  sans-serif',

                color: 'black'

            }

        },

        series: dataV

    });

   

    return chart1;

}

 

function makeThePlots(plotInfo, node, width, item)//(panelJson, plotsJson)

{

    var series = JSON.parse(plotInfo.series);

    var categories = plotInfo.categories;

    var plotSeries = [];

    var totalSeries = [];

 

    var cType = plotInfo.categories.categoryName;

 

    var totalData = plotInfo.total;

 

    dojo.forEach(series, function (serName, index) {

        var itm = {

            name: serName,

            color: totalData[serName]['color'],

            y: JSON.parse(totalData[serName]['data'])

        };

 

        totalSeries.push(itm);

 

    });

 

 

 

 

    var title = item.site.toUpperCase() + ' ' + item.name + ' ' + item.title;

 

    if (item.parent == undefined)

        title = item.site.toUpperCase() + ' Site';

 

 

 

    series.reverse();

 

    dojo.forEach(series, function (serName, index) {

        var itm = {

            name: serName,

            color: plotInfo[serName]['color'],

            data: JSON.parse(plotInfo[serName]['data'])

        };

 

        plotSeries.push(itm);

 

    });

 

    var percent = 0.50;

    var allW = width * percent;

    var allT = width * 0.25;

 

    var innerSize = allT * 0.10;

    height = 400;

   

    var nodeCharts = [];

    var clnP = JSON.parse(plotInfo.clientParams);

 

 

 

    //var $container = $('<div>').addClass("blockD ");

    var $container = $('<div>').addClass("blockD " );

    var $containerT = $('<div>').addClass("blockD ");

    var $containerC = $('<div>').addClass("blockK ");

 

    //panel.appendChild($container[0]);

    dojo.place($container[0], node, "last");

    dojo.place($containerT[0], node, "last");

    dojo.place($containerC[0], node, "last");

 

 

    var clTableVector = makeClntTable(plotInfo, item.series, $containerC[0]);

 

    var aChart = createHighChart($container[0], plotSeries, categories, title, "", allW, height);

    aChart.typeC = cType;

    aChart.itemInfo = item;

    aChart.clHeader = ['Parameter', 'Value'];

    aChart.clVector = clTableVector;

    nodeCharts.push(aChart);

    nodeCharts.push(createHighChart($containerT[0], totalSeries, categories, "Total", "", allT, height, innerSize, 'left', true));

 

 

    if (node.charts)

        node.charts = undefined;

 

    node.charts = nodeCharts;

 

 

}

function makeClntTable(plotI, serie, node) {

 

    var theV = JSON.parse(plotI.clientParams);

 

    var altC = ['"tg-yw4l"', '"tg-6k2t"'];

    var cl = '<td class="*cls*"> *nme* </td>';

    var tbl =

        '<table class="tg tableC">' +

  '<tr>' +

    '<th class="tg-hgcj">Parameter</th>' +

    '<th class="tg-hgcj">Value</th>' +

    '</tr>' + '***' +

'</table>';

 

    var serA = serie.split('&nbsp');

    serie = serA[serA.length - 1];

 

    var cells = "";

    var valuesVector = [];

    var valuesInd = [];

 

    var valueN = serie;

    valuesInd.push('Selected series');

    valuesInd.push(valueN);

    valuesVector.push(valuesInd);

 

 

    valuesInd = [];

    valueN = theV.mindate;

    valuesInd.push('Start Date');

    valuesInd.push(valueN);

    valuesVector.push(valuesInd);

 

    valuesInd = [];

    valueN = theV.maxdate;

    valuesInd.push('End Date');

    valuesInd.push(valueN);

    valuesVector.push(valuesInd);

 

    valuesInd = [];

    valueN = theV.timespan;

    valuesInd.push('Total Days');

    valuesInd.push(valueN);

    valuesVector.push(valuesInd);

 

    valuesInd = [];

    valueN = theV.facilitynumber;

    valuesInd.push('Total of Facilities');

    valuesInd.push(valueN.toString() + ' inspected');

    valuesVector.push(valuesInd);

 

    //valuesInd = [];

    //valueN = theV.hoursRun;

    //valuesInd.push('RUN hours');

    //valuesInd.push(valueN);

    //valuesVector.push(valuesInd);

 

    //valuesInd = [];

    //valuesInd.push(theV.maxState.toUpperCase() + ' hours');

    //valuesInd.push(theV.maxHours);

    //valuesVector.push(valuesInd);

 

 

    var maintenanceA = plotI.maintenance;

    if (maintenanceA) {

        var maintKeys = Object.keys(maintenanceA);

        dojo.forEach(maintKeys, function (element, index) {

            valuesInd = [];

            var vlt = maintenanceA[element];

            valuesInd.push(element + ' </br>Maintenance');

            valuesInd.push(vlt);

            valuesVector.push(valuesInd);

 

 

        });

 

    }

    var tblR = "";

 

    dojo.forEach(valuesVector, function (itemV, index) {

        var rbId = index % 2;

       

        var classV = altC[rbId];

 

        tblR += '<tr>' + cl.replace('class="*cls*"', '').replace('*nme*', itemV[0]);

        tblR += cl.replace('*cls*', ' CenterC').replace('*nme*', itemV[1]) + '</tr>';

 

        itemV[0] = itemV[0].toString().replace('</br>', '\n');

        itemV[1] = itemV[1].toString().replace('</br>', '\n');

 

    });

    tbl = tbl.replace('***', tblR);

    dojo.place(tbl, node, "last");

 

    return valuesVector;

}

 

function getRadioButtonChecked() {

    var trStr = dojo.byId("initTree");

    var trInfo = JSON.parse(trStr.value);

    var seriesString = JSON.parse(trInfo.series);

 

 

 

    var checkedValues = [];

    dojo.forEach(seriesString, function (item, index) {

        var rbId = "series" + index;

        if (dijit.registry.byId(rbId).get("checked")) {

            checkedValues.push(dijit.registry.byId(rbId).get("value"));

        }

 

 

    });


    var chK =  checkedValues.join(",");

 

    return chK;

}

var mainSequencer;

 

 

function createGridContainer() {

 

    var cat = dojo.toDom('div');

    var gridContainer = new dojox.layout.GridContainer({

        id: 'gridContainer',

        nbZones: 1,

        opacity: .5,

        hasResizableColumns: false,

        allowAutoScroll: false,

        withHandles: true,

       dragHandleClass: 'dijitTitlePaneTitle',

        style: { width: '100%' },

        acceptTypes: ['TitlePane'],

        isOffset: true

    }, cat);

    gridContainer.startup();

    return gridContainer;

 

}

 

function addTitlePane(paneContent, element) {

 

    var title = "no title";

 

    //if (element.type) {

    if (element.siteleaf) {

            title = element.site.toUpperCase() + " Site";

        }

        else

            title = (element.parent).replace('_by_',' '+  element.name + ' ' );

    //}

 

    if (stringEndsWith(title, "Equipment")) {

        var lI = title.lastIndexOf("Equipment");

        title = trim(title.substring(0, lI));

 

    }

    var tpD = dojo.create('div');

    dojo.addClass(tpD, "ttPane");

    var ttp = new dijit.TitlePane({

        style: { width: '99.6%'},

        title: "",

        dndType: 'TitlePane',

        content: ""

    }, tpD);

 

    var paneId = ttp.id;

    ttp.setTitle(title + deleteTitlePaneImage.replace("***", paneId));

    ttp.fac = element;

 

    ttp.startup();

 

   

    var gridCont = dijit.byId('gridContainer');

 

    gridCont.addChild(ttp);

}

function stringEndsWith(string, suffix) {

    return suffix == '' || string.slice(-suffix.length) == suffix;

}

function formatTime(date) {

    var d = new Date(date);

    var tim = d.toTimeString().split(' ');

    var ftime = tim[0];

    return ftime;

 

}

 

function formatDate(date) {

    var d = new Date(date),

        month = '' + (d.getMonth() + 1),

        day = '' + d.getDate(),

        year = d.getFullYear();

 

    if (month.length < 2) month = '0' + month;

    if (day.length < 2) day = '0' + day;

 

    return [year, month, day].join('-');

}

function fromDateChange() {

    var myD = dijit.byId("FromDate");

    var val = myD.value;

    var cal = dijit.byId("ToDate");

 

    cal.constraints.min = val;

}

 

function toDateChange() {

    var myD = dijit.byId("ToDate");

    var val = myD.value;

 

    var cal = dijit.byId("FromDate");

    cal.constraints.max = val;

 

}

function makesitesTree(parentC) {

 

    var trStr = dojo.byId("initTree");

    var trInfo = JSON.parse(trStr.value);

    var treeString = trInfo.treeData;

    var gridE ;

    var cntP;

    require(["dojo/_base/lang",

                     "dojo/store/Memory",

                     "dojo/store/Observable",

                     "dojo/ready",

                     "dijit/tree/dndSource",

                     "dijit/registry",

                     "cbtree/Tree",

                     "cbtree/model/TreeStoreModel",

                     "cbtree/model/ForestStoreModel",

                     "cbtree/store/Hierarchy"

    ], function (lang, Memory, Observable, ready, dndSource, registry, Tree, ObjectStoreModel, ForestStoreModel,

                                                    ObjectStore) {

 

 

        var latestInfo = JSON.parse(treeString);

 

        //var treeKeys = Object.keys(latestInfo);

        //var qu = latestInfo[0].id; rnode

        var qu = "root";

        var item = "Root Node";

        //dojo.forEach(treeKeys, function (item, index) {

           

 

 

 

 

            var store = new ObjectStore({ data: latestInfo});

            var model = new ForestStoreModel({

                store: store,

 

                query: { type: qu },

                rootLabel: item//,

                // checkedRoot: true

            });

 

            gridE = new Tree({

                //id: dbName,

                //model: childMod

 

                showRoot: false,

                model: model

            }, document.createElement('div'));

 

 

 

 

            gridE.startup();

 

            var rNode = gridE.rootNode;

            var children = rNode.getChildren(rNode);

 

            dojo.forEach(children, function (item, index) {

                gridE._expandNode(item);

 

 

            });

 

            gridE.on("click", clickTreeNode);

            //parentC.addChild(gridE);

            //parentC.treearray.push(gridE);

        //});

    });

 

 

 

    return gridE;

 

}

function clickTreeNode(item, node, event) {

    if (event.srcElement.className == 'dijitTreeLabel') {

        if (item.info && item.facility == 'Equipment') {

            var j = 0;

 

            getRawData(item);

        }

    }

 

}

 

function getRawData(item) {

    var d = new Date;

    var qD = formatDate(d) + ' ' + formatTime(d);

    var getSdate = formatDate(procDate("FromDate"));

    var getEdate = formatDate(procDate("ToDate"));

    item.date = getSdate + ' 00:00:00';

    item.enddate = getEdate + ' 23:59:59';

    item.queryDate = qD;

 

    var jsonParams = "{'Parameter':'" + JSON.stringify(item) + "'}";

    var retInfo;

    //goNext = false;

  

        $.ajax({

            type: "POST",

            url: "Reports.aspx/getRawData",

 

            data: jsonParams,

            contentType: "application/json; charset=utf-8",

            dataType: "json",

            success: function (response) {

                retInfo = response.d;

                window.open("download.aspx?reportId=" + retInfo + "&date=" + qD);

 

                //standbyLayR.hide();

 

 

            },

            error: function (response) {

                alert("Invalid data from server.  makeDynamicsDirectory() function");

            },

            async: true

        });

  

 

 

 

}

function createExpando(container) {

 

    var ep = new dojox.layout.ExpandoPane({

        title: "Options",

        region: "left",

        splitter: "true",

        style: "width: 150px; height:95%;"// background-color:#FFDEAD"

    }).placeAt(container);

 

 

}

function createToolBar(parent) {

    var tBar;

  

   

        var spanE = dojo.place("<span></span>", parent, "first");

        tBar = new dijit.Toolbar({ }, spanE);

        //dojo.forEach(["Cut", "Copy", "Paste"], function (label) {

    //var dBtn = dojo.place("<div></div>", tBar.domNode, "first");

 

        var dialog = new dijit.TooltipDialog({

            onShow: function () {

                //grid.selection.clear();

                //geLayoutInfo();

            },

            content: "hello World" //grdView

 

        });

        //var button3 = new dijit.form.DropDownButton({

        //    label: "Plot options",

        //    showLabel: true,

            

        //    disabled: false,

        //    iconClass: "dijitIconEditTask",

        //    dropDown: dialog

        //});

        //button3.startup();

        //    tBar.addChild(button3);

    //  });

 

 

            var buttonR = new dijit.form.Button({

                id:'newreportbtn',

                label: "New Report",

                showLabel: true,

                //type: "submit",

                onClick: removePlotPanes,

                iconClass: "graphIcon"

            }, document.createElement('input'));

            buttonR.startup();

 

            tBar.addChild(buttonR);

 

 

            //var buttonD = new dijit.form.Button({

 

            //    // note: should always specify a label, for accessibility reasons.

            //    // Just set showLabel=false if you don't want it to be displayed normally

            //    //id: "lbl",

            //    label: "Clear",

            //    style: "float: right; ",

            //    showLabel: true,

            //    //type: "submit",

            //    //onClick: saveResources,

            //    iconClass: "dijitEditorIcon  dijitEditorIconCancel"

            //}, document.createElement('input'));

            //buttonD.startup();

 

            //tBar.addChild(buttonD);

 

            var sep = new dijit.ToolbarSeparator();

 

            tBar.addChild(sep);


            var buttonI = new dijit.form.Button({

 

                // note: should always specify a label, for accessibility reasons.

                // Just set showLabel=false if you don't want it to be displayed normally

                id: 'additemsbtn',

                label: "Add Items",

                //style: "float: right; ",

                showLabel: true,

               //type: "submit",

                onClick: addPlotPanes,

                iconClass: "dijitIconDatabase"

            }, document.createElement('input'));

            buttonI.startup();

            tBar.addChild(buttonI);

 

            //var buttonP = new dijit.form.Button({

 

            //    // note: should always specify a label, for accessibility reasons.

            //    // Just set showLabel=false if you don't want it to be displayed normally

            //    id: "plotsel",

            //    label: "Plot selection",

            //    //style: "float: right; ",

            //    showLabel: true,

            //    //type: "submit",

            //    onClick: function (evt) {

            //        plotFlag = true;

            //        exportFlag = false;

            //        refreshExport(evt);

 

            //    },

            //    iconClass: "dijitIconNewTask"

            //}, document.createElement('input'));

            //buttonP.startup();

 

            //tBar.addChild(buttonP);

        tBar.startup();

   

}

function addPlotPanes() {

 

   

    var tC = dijit.byId('treeContent');

    var store = tC.treeSites.model.store;

    var nodes = getLabTreeItems(store);

    if (nodes == undefined || nodes.length <= 0)

        return;

    //var f = dijit.byId("exportbtn");//.disabled = true;

    //f.setDisabled(true);// = true;

 

    var newItems = [];

    var alreadyExistItems = [];

 

    if (treeItems.length <= 0){

        treeItems = nodes;

        newItems = nodes;

 

    }

    else {

 

        dojo.forEach(nodes, function (actItem, index) {

           

 

            var val = Enumerable.From(treeItems).Where('x => x.id =="' + actItem.id +'"').FirstOrDefault();

            if (val == undefined) {

                newItems.push(actItem);

                treeItems.push(actItem);

 

            }

            else

                alreadyExistItems.push(actItem);

 

        });


 

    }

    dojo.forEach(newItems, function (item, index) {

          

        addTitlePane("", item);

 

    });

}

var treeItems = [];

 

function removePlotPanes() {

    //var f = dijit.byId("exportbtn");//.disabled = true;

    //f.setDisabled(true);// = true;

 

    treeItems = [];

    var gC = dijit.byId('gridContainer');

 

    gC.destroyDescendants();

}

 

 

function getLabTreeItems(theStore) {

    var constraint = "";

    //var items = [];

    var mainItems = [];

 

    theStore.validCheck = function (item) {

        if (item.type == "root")

            constraint = "no_checked";

 

        if (item.checked == true)

            if (item.type == "hi") {

                mainItems.push(item);

                constraint = item.name;

            }

            else {

                if( item.leaf == true )

                    if (item.id.indexOf(constraint) != 0) {

                        if (item.name == 'Group All') {

                            var theInfo = [];

                            if (item.info)

                                item.info = undefined;

                            var sib = theStore.query({ parent: item.parent });

                            dojo.forEach(sib, function (sibling, index) {

 

                                if (sibling.info) {

                                    var sibE = {

                                        name: sibling.name,

                                        data: sibling.info

 

                                    };

                                    theInfo.push(sibE);

                                }

                            });

                            item.info = theInfo;

                        }

                        mainItems.push(item);

 

                    }

 

            }

            return item;

    };

    var res = theStore.query("validCheck").forEach(function (item) {

        // called for each match

        var vl = item;

    });

 

 


    var nFiles = mainItems.length;

    if (nFiles > 0)

        return mainItems;

 

    return undefined;

}

 

 

function arrayMin(arr) {

    return arr.reduce(function (p, v) {

        return (p < v ? p : v);

    });

}

 

function arrayMax(arr) {

    return arr.reduce(function (p, v) {

        return (p > v ? p : v);

    });

}

 

function minValue(arr) {

    var minv = 1e100;

    var maxv = -1e100;

 

    for (var i = 0; i < arr.length; i++) {

        var val = arr[i];

        if (val < -1e100 || val > 1e100) {

            arr[i] = null;

            continue;

        }

 

        if (val > maxv)

            maxv = val;

        if (val < minv)

            minv = val;

 

    }

 

    return [minv, maxv, arr];

 

}

 

 

 

function trim(str) {

    return str.replace(/^\s+|\s+$/g, "");

}

 

function createHighChart(container, dataV, categories, titleV, subTitle, plotWidth, height, innerSize, align, threeD) {

    var chart1;

    var cat = JSON.parse(categories.data);

    if (titleV == "Total") {

        chart1 = new Highcharts.Chart({

            credits: {

                enabled: false

            },

            exporting: {

                enabled: false

            },

            chart: {

 

                type: 'pie',

                width: plotWidth,

                height: height,

                renderTo: container,

                events: {

                    click: function (event) {

                        var nmcl = this.name;

                        var vlcl = this.y;

                    }

 

                },

                marginBottom: 100,

                marginLeft: 150,

                //marginTop: 90,

 

                options3d: {

                    enabled: threeD,

                    alpha: 40

 

 

                }

            },

            title: {

                text: '<a>' + titleV + '</a>',

                useHTML: true

            },

            subtitle: {

                text: subTitle,

                style:

                      {

                          fontSize: '10px',

                          fontFamily: 'Verdana, sans-serif'

                      }

            },

 

            plotOptions: {

 

                innerSize: 20,

                depth: 30,

 

 

                series: {

                    cursor: 'pointer'

 

                },

                pie: {

                    allowPointSelect: false,

                    cursor: 'pointer',

                    showInLegend: true,

                    dataLabels: {

                        enabled: false

                    }

                    ,

                    innerSize: innerSize,

                    depth: 25

                }

            },

            legend: {

                enabled: true,

                layout: 'vertical',

                align: align,

                verticalAlign: 'middle',

                labelFormatter: function () {

                    return this.name + ': ' + this.y + '%';

                },

                itemStyle: {

                    fontSize: '8px',

                    font: '8pt  sans-serif',

                    color: 'black'

                }

            },

            series: [{

                name: 'Usage%',

                colorByPoint: true,

                data: dataV

            }]

        }, function (chart) {

            $('.highcharts-title').click(function () {

 

                //alert('aaaa');

 

            });

        }

            );

    }

    else

    {

        chart1 = new Highcharts.Chart({

            credits: {

                enabled: false

            },

            exporting: {

                enabled: false

            },

            chart: {

                zoomType: 'x',

                marginBottom: 90,

                width: plotWidth,

                height: height,

                renderTo: container,

                type: 'column'

            },

            title: {

                text: titleV

            },

            xAxis: {

                categories: cat,

              

                labels: {

                    rotation: -45,

                    style: {

                        color: 'black',

                        font: '8px Helvetica'

                    },

                    minPadding: 0.5,

                    maxPadding: 0.5

 

                }

            },

            yAxis: {

                min: 0,

                max: 100,

                title: {

                    text: 'Usage %'

                },

                stackLabels: {

                    enabled: false,

                    style: {

                        fontWeight: 'bold',

                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'

                    }

                }

            },

            legend: {

                enabled: false,

                align: 'right',

                x: -30,

                verticalAlign: 'top',

                y: 25,

                floating: true,

                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',

                borderColor: '#CCC',

                borderWidth: 1,

                shadow: false

            },

            tooltip: {

                headerFormat: '<b>{point.x}</b><br/>',

                pointFormat: '{series.name}: {point.y}%'

                //pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'

            },

            plotOptions: {

 

                column: {

                    marker: {

                        enabled: false

                    },

                    pointPadding: 0,

                    groupPadding: 0,

                    stacking: 'normal',

                    dataLabels: {

                        enabled: false,

                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'

 

                    }

                }

            },

 

            series: dataV

        });

 

 

 

    }

    return chart1;

}

 

//pdf stuff

function makePDF(cp, docPDF, ycoord) {

 

    var node = cp.containerNode;

    var chartVector = node.charts;

    if (chartVector)

        exportHCharts(chartVector, docPDF, ycoord);

 

 

 

}

 

 

 

var pageNumber = 0;

 

 

function docSetHeader(docPDF) {

 

    pageNumber++;

    var lft = 20;

    var y = 35;

 

 

    docPDF.setTextColor(0);

 

    docPDF.setFontSize(28);

    docPDF.text(lft, y, "Validation Information System");

    docPDF.setFontSize(14);

    docPDF.text(650, y + 0.5, "Equipment utilization report");

   

 

    var setLine = y + 11;

    docPDF.setLineWidth(1.5);

    docPDF.line(lft, setLine, 820, setLine);

 

    var pltChartY = setLine + 20;

    var yFooter = 570;

    //doc.setLineWidth(0.2);

    //doc.line(lft, y, 275, y);

    var ip = 'http://10.152.22.166/chamberonline/Reports.aspx';

    //doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);

 

    var visVersion = 'VIS version: 2015-11';

    var now = new Date();

    var dte = formatDate(now);

 

    var tim = formatTime(now);

 

    var runDate = dte + ' ' + tim;

 

 

    docPDF.setFontSize(9);

    var yOffset = 20;

    //doc.text(lft, doc.internal.pageSize.height - (yOffset+ 10), visVersion);

    docPDF.text(lft, docPDF.internal.pageSize.height - yOffset, ip);

    docPDF.text(380, docPDF.internal.pageSize.height - yOffset, "Page " + pageNumber.toString());

    docPDF.text(700, docPDF.internal.pageSize.height - yOffset, runDate);

    //doc.text(lft, yFooter, ip);

    //doc.text(380, yFooter, "Page " + pageNumber.toString());

    //doc.text(700, yFooter, runDate);

 

 

    return pltChartY;

 

}

var firstPage = true;

EXPORT_WIDTH = 1000;

var pdfRatio = 1.5;

function save_chart(chart) {

    var render_width = chart.chartWidth / pdfRatio;

    var render_height = chart.chartHeight / pdfRatio;

 

    // Get the cart's SVG code

    var svg = chart.getSVG({

        exporting: {

            sourceWidth: chart.chartWidth,

            sourceHeight: chart.chartHeight

        }

    });

 

    // Create a canvas

    var canvas = document.createElement('canvas');

    canvas.height = render_height;

    canvas.width = render_width;

 

    //document.body.appendChild(canvas);

 

    // Create an image and draw the SVG onto the canvas

 

 

    if (canvas.getContext && canvas.getContext('2d')) {

 

        canvg(canvas, svg);

 

        return canvas.toDataURL("image/jpeg");

 

    }

    else {

        alert("Your browser doesn't support this feature, please use a modern browser");

        return false;

    }

 

}

var pdfIndex = [];

function exportHCharts(chartVector, docPDF, yCoord) {

    //alert("exportHCharts");

 

    //var lft = 20;

    //var y = 50;

 

     var docW =  docPDF.internal.pageSize.width;

  

 

    try {

        if (!firstPage) {

            docPDF.addPage();

            yCoord = docSetHeader(docPDF);

        }

        pdfIndex[pdfIndex.length-1].page = pageNumber;

        var xCoord = 25;

        var colNames = ['Series'];

        var rows = [];

        var chartHeight = 0;

        var clCols, clRows;

        dojo.forEach(chartVector, function (theChart, i) {

            var tw = 0.5;

            if (i == 1)

                tw = 0.25;

 

            var imageData = save_chart(theChart);

            //var widthC = theChart.chartWidth / pdfRatio;

            var widthC = docW*tw;

            //chartHeight = theChart.chartHeight / pdfRatio;

            chartHeight = 267;

 

            if (theChart.clHeader) {

                clCols = theChart.clHeader;

                clRows = theChart.clVector;

 

            }

            docPDF.addImage(imageData, 'JPEG', xCoord, yCoord, widthC, chartHeight);

 

            var charttype = theChart.typeC;

            xCoord += widthC + 20;

            if (i == 0) {

                if (charttype == "Status") {

                    var ser = theChart.series;

                    dojo.forEach(ser, function (chrt, index) {

                        var data = chrt.data;

                        if (index == 0) {

                            dojo.forEach(data, function (dataE, j) {

 

                                colNames.push(dataE.category);

                            });

                        }

                        var dataArray = chrt.yData;

                        dataArray.unshift(chrt.name);

                        rows[index] = dataArray;

 

                    });

 

                }

                else { //usage

                    var ser = theChart.series;

                    colNames = [];

                    dojo.forEach(ser, function (chrt, index) {

 

                        colNames.unshift(chrt.name);


                        var data = chrt.data;

                            dojo.forEach(data, function (dataE, j) {

 

                                if (rows[j] == undefined) {

                                    var tArr = [];

                                    tArr.push(dataE.y);

                                    rows[j] = tArr;

                                }

                                else {

                                    rows[j].unshift(dataE.y);

                                    if (index == ser.length -1 )

                                        rows[j].unshift(dataE.category);

 

                                }

 

 

                            });

 

                       

                        //if (index == 0) {

                        //    dojo.forEach(data, function (dataE, j) {

 

                        //        colNames.push(dataE.category);

                        //    });

                        //}

 

                    });

                    colNames.unshift('Series');

                }

            }

 

        });

        if (rows.length > 0) {

            var rawData = chunkArray(rows, 0);

            dojo.forEach(rawData, function (vect, j) {

                if (j <= 1) {

                    if (j == 0) {

                        generateTable(docPDF, yCoord + 268 , colNames, vect, 'left', 'Data');

                        generateTable(docPDF, yCoord + 50, clCols, clRows, 'right', 'Pars');

                    }

                    else

                        generateTable(docPDF, yCoord + 268 , colNames, vect, 'right', 'Data');

 

                }

                else {

                    if (j % 2 == 0) {

                        docPDF.addPage();

                        yCoord = docSetHeader(docPDF);

                        generateTable(docPDF, yCoord, colNames, vect, 'left', 'Data');

 

                    }

                    else {

                        generateTable(docPDF, yCoord, colNames, vect, 'right', 'Data');

 

                    }

 

                }

 

            });

           

        }

        firstPage = false;

    }

    catch (ex) {

 

        alert("Save pdf file error  " + ex)

 

    }

}

function chunkArray(arr, len) {

 

    var chunks = [],

        i = 0,

        n = arr.length;

 

  

    var initSize = 20;

    var c = 0;

    while (i < n) {

        chunks.push(arr.slice(i, i += initSize));

        if (c >= 1)

            initSize = 47;

        c++;

    }

 

    return chunks;

}

 

var STR_PAD_LEFT = 1;

var STR_PAD_RIGHT = 2;

var STR_PAD_BOTH = 3;

 

function pad(str, len, pad, dir) {

 

    if (typeof (len) == "undefined") { var len = 0; }

    if (typeof (pad) == "undefined") { var pad = ' '; }

    if (typeof (dir) == "undefined") { var dir = STR_PAD_RIGHT; }

 

    if (len + 1 >= str.length) {

 

        switch (dir) {

 

            case STR_PAD_LEFT:

                str = Array(len + 1 - str.length).join(pad) + str;

                break;

 

            case STR_PAD_BOTH:

                var right = Math.ceil((padlen = len - str.length) / 2);

                var left = padlen - right;

                str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);

                break;

 

            default:

                str = str + Array(len + 1 - str.length).join(pad);

                break;

 

        } // switch

 

    }

 

    return str;

 

}

 

function makePDFIndex() {

 

    var indexCols = ['Item', 'Page'];

    var indexRows = [];

    //dojo.forEach(pdfIndex, function (inf, j) {

 

    //    //var txt = pad(inf.name, 50, '.', STR_PAD_RIGHT);

    //    var txt = inf.name;

    //    var page = inf.page;

    //    var tind = [];

    //    tind.push(txt);

    //    tind.push(inf.page);

 

    //    indexRows.push(tind);

    //});

 

 

    //docPDF.setPage(1);

    //generateIndexPage(docPDF, 50, indexCols, pdfIndex, 'left');

    generateIndexPage( indexCols, pdfIndex);

}

var indexPages = 0;

var indexRows = 53;

var indexPerPage = 2;

function generateIndexPage( columns, data) {

 

 

    var init = 0;//docSetHeaderIndex(docPDF);

    var initN = 240;

    var initP = 400;

    var marg = {};

    var headerColor = [];

    var xName = initN;

    var xPage = initP;

    var y = init;

 

    //docPDF.setTextColor(0);

 

    var pageIndex = 0;

 

    dojo.forEach(pdfIndex, function (data, j) {

 

        if (j % (indexRows) == 0) {

            if (j % (indexPerPage * (indexRows)) == 0) {

                pageIndex += 1;

                docPDF.setPage(pageIndex);

                docPDF.setTextColor(0);

                init = docSetHeaderIndex(docPDF);

                xName = initN;

                xPage = initP;

                y = init;

            }

            else {

                if (j != 0) {

                    xName = xName + 240;

                    xPage = xName + 160;

                    y = init;

                }

            }

            docPDF.setFontSize(9);

 

            docPDF.text(columns[0], xName, y);

            docPDF.text(columns[1], xPage, y);

 

            y += docPDF.getLineHeight();

 

        }

        docPDF.setFontSize(6);

 

        var pgnumber = data.page + indexPages;

        var width = docPDF.textWithLink(data.name, xName, y, { pageNumber: pgnumber });

        docPDF.textWithLink(data.page.toString(), xPage, y, { pageNumber: pgnumber });

 

        y += docPDF.getLineHeight();

        y += 2;

      

    });

    //docPDF.addPage();

    //docSetHeaderIndex(docPDF);

}

 

function docSetHeaderIndex(docPDF, doit) {

 

    var lft = 20;

    var y = 35;

    var setLine = y + 11;

 

    if (doit) {

        docPDF.setTextColor(0);

 

        docPDF.setFontSize(28);

        docPDF.text(lft, y, "Validation Information System");

        docPDF.setFontSize(14);

        docPDF.text(700, y + 0.5, "Table of Contents");

 

 

        docPDF.setLineWidth(1.5);

        docPDF.line(lft, setLine, 820, setLine);

 

        var yFooter = 570;

        var ip = 'http://10.152.22.166/chamberonline/Reports.aspx';

 

        var visVersion = 'VIS version: 2015-11';

        var now = new Date();

        var dte = formatDate(now);

 

        var tim = formatTime(now);

 

        var runDate = dte + ' ' + tim;

 

 

        docPDF.setFontSize(9);

        var yOffset = 20;

        docPDF.text(lft, docPDF.internal.pageSize.height - yOffset, ip);

        docPDF.text(700, docPDF.internal.pageSize.height - yOffset, runDate);

    }

    return setLine + 20;

   

}
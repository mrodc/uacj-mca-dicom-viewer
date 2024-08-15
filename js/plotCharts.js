


// document.getElementById('button').addEventListener('click', () => {
//     chart.series[0].setData([
//         129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5,
//         106.4, 300
//     ]);
// });

var accuracyChart;
var lossChart;

function buildParametricsTable(data) {
    //alert('buildParametricsTable');
    var tA = data.TrainAccuracy;
    var vA = data.ValidationAccuracy;
    var microA = data.microA;
    var macroA = data.macroA;
    var tstFraction = data.TestFraction;

    var px = 25;
    var w = px + 'px'
    var h = px + 'px'
    var tbH = dojo.create('table', { class: 'mlReport', style: { width: '245px', 'margin-left': '20px' } });
    //var cap = dojo.create('caption', null, tbl);

    dojo.create('caption', {
        style: { 'border': 'none', 'border-bottom': '2px solid blue', 'margin-bottom': '10px' },
        innerHTML: "<strong><font color='blue'>" + data.model + ' Learning Metrics</font></strong>'
    }, tbH);

    var hdrH = dojo.create('tr', null, tbH);
    dojo.create('td', { innerHTML: '<b>Metric</b>', style: { width: '50%', 'text-align': 'right' } }, hdrH);
    dojo.create('td', { innerHTML: '<b>Value</b>', style: { width: '30%', 'text-align': 'center' } }, hdrH);
    dojo.create('td', { innerHTML: '', style: { width: '20%', 'text-align': 'center' } }, hdrH);

    hdrH = dojo.create('tr', null, tbH);
    dojo.create('td', { innerHTML: '<b>Accuracy</b>', style: { 'text-align': 'right' } }, hdrH);
    dojo.create('td', { innerHTML: tA, style: { width: w, height: h, 'text-align': 'center' } }, hdrH);

    hdrH = dojo.create('tr', null, tbH);
    dojo.create('td', { innerHTML: '<b>microAccuracy</b>', style: { 'text-align': 'right' } }, hdrH);
    dojo.create('td', { innerHTML: microA, style: { width: w, height: h, 'text-align': 'center' } }, hdrH);
    hdrH = dojo.create('tr', null, tbH);
    dojo.create('td', { innerHTML: '<b>macroAccuracy</b>', style: { 'text-align': 'right' } }, hdrH);
    dojo.create('td', { innerHTML: macroA, style: { width: w, height: h, 'text-align': 'center' } }, hdrH);

    hdrH = dojo.create('tr', null, tbH);
    dojo.create('td', { innerHTML: '<b>LogLoss</b>', style: { 'text-align': 'right' } }, hdrH);
    dojo.create('td', { innerHTML: data.logLoss, style: { width: w, height: h, 'text-align': 'center' } }, hdrH);

    hdrH = dojo.create('tr', null, tbH);
    dojo.create('td', { innerHTML: '<b>LogLossReduction</b>', style: { 'text-align': 'right' } }, hdrH);
    dojo.create('td', { innerHTML: data.logLossRed, style: { width: w, height: h, 'text-align': 'center' } }, hdrH);

    var dsH = dojo.byId('mlHyper');
    dojo.empty(dsH);

    dojo.place(tbH, dsH);
    /******************************************** */
    var dataSet = data.DataSet;
    var Totals = dataSet.Total;
    var trainDs = dataSet.Train;
    var testDs = dataSet.Test;

    var tbl = dojo.create('table', { class: 'mlReport' });
    //var cap = dojo.create('caption', null, tbl);

    dojo.create('caption', {
        style: { 'border': 'none', 'border-bottom': '2px solid blue', 'margin-bottom': '10px' },
        innerHTML: "<strong><font color='blue'>" + 'Dataset with TestFraction = ' + tstFraction + "</font></strong>"
    }, tbl);

    var header = Object.keys(dataSet);
    //alert("Header: " + header);

    var hdr = dojo.create('tr', null, tbl);
    dojo.create('td', { innerHTML: '', style: { 'text-align': 'center' } }, hdr);
    var hdrdata = header;
    dojo.forEach(hdrdata, function (item) {
        dojo.create('td', { innerHTML: '<b>' + item + '</b>', style: { 'text-align': 'center' } }, hdr);
    });


    var classes = Object.keys(Totals);
    // var cnm = classes.splice(0,1);
    // classes.push(cnm);

    //alert("classes: " + classes);

    dojo.forEach(classes, function (item, pos) {
        var tr = dojo.create('tr', {}, tbl);

        var offset = 0;
        var lbl = item;
        if (item == 'Count' || item == 'Total') {
            lbl = 'Total (Images)';
            offset = 2;
        }
        if (item == 'Size') {
            lbl = 'Size (MB)';

        }
        dojo.create('td', { innerHTML: '<b>' + lbl + '</b>', style: { 'text-align': 'right', 'white-space': 'pre' } }, tr);



        var sty = { width: '50px', height: h, 'text-align': 'center' };
        if (offset > 0)
            sty = { width: '50px', height: h, 'text-align': 'center', 'border-top': '1px solid blue' };



        var ds = trainDs[item];

        if (ds == undefined)
            ds = 0;
        var td = dojo.create('td', { innerHTML: ds, style: sty }, tr);

        ds = testDs[item];

        if (ds == undefined)
            ds = 0;
        var td = dojo.create('td', { innerHTML: ds, style: sty }, tr);

        ds = Totals[item];
        if (ds == undefined)
            ds = 0;
        var td = dojo.create('td', { innerHTML: ds, style: sty }, tr);

    });

    //alert('Table done');
    var ds = dojo.byId('mlDataSet');
    dojo.empty(ds);

    dojo.place(tbl, ds);
}

function buildClassificationReport(data, model) {
    //buildClassificationReport');
    var tbl = dojo.create('table', { class: 'mlReport' });
    //var cap = dojo.create('caption', null, tbl);

    dojo.create('caption', {
        style: { 'border': 'none', 'border-bottom': '2px solid blue', 'margin-bottom': '10px' },
        innerHTML: "<strong><font color='blue'>" + model + ' Classification Report' + "</font></strong>"
    }, tbl);


    dojo.forEach(data, function (item, position) {
        var hdr = dojo.create('tr', null, tbl);
        //alert('CR: ' + item);
        var bold = true;
        dojo.forEach(item, function (element, index) {
            var sty = { height: '20px', width: '70px', 'text-align': 'center', 'white-space': 'pre' };
            if (index == 0)
                sty = { height: '10px', width: '50px', 'text-align': 'right', 'white-space': 'pre' }
            if (bold || position == 0)
                element = '<b>' + element + '</b>';
            dojo.create('td', { innerHTML: element, style: sty }, hdr);
            bold = false;
        });
    });
    var ds = dojo.byId('classificationReport');
    dojo.empty(ds);

    dojo.place(tbl, ds);
}
function buildKfolds(dta) {

    var data = dta['kFolds'];
    //alert('From KFolds' + data);

    var cls = dojo.byId('kFoldsTable');

    dojo.empty(cls);

    var cp = dojo.byId('kFCaption');
    cp.innerHTML = 'Cross-Validation Statistics for KFolds with K = ' + dta['kNumber']  ;

    var cls = Object.keys(data);

    var hdr = dta['kstats'];
    var tbl = dojo.create('table', { class: 'mlReport' }, 'kFoldsTable');


    var inner = '<b>microAccuracy</b> : <b>&#956;</b> = ' + data['microA'][0] + ' and <b>&#963;</b> = ' + data['microA'][1];
    
    var tr = dojo.create('tr', {}, tbl);
    dojo.create('td',{innerHTML:inner, colspan:4}, tr);

    var sty = { height: '10px', width: '70px', 'text-align': 'center', 'white-space': 'pre', 'font-weight': 'bold', 'border-bottom': '1px solid blue' }

    tr = dojo.create('tr', {}, tbl);
    dojo.create('td', {}, tr);
    hdr.forEach(element => {
        dojo.create('td', { colspan: 2, innerHTML: element, style: sty }, tr);
    });

    tr = dojo.create('tr', {}, tbl);
    dojo.create('td', {}, tr);
    sty = { 'text-align': 'center', 'white-space': 'pre', 'font-weight': 'bold' }

    hdr.forEach(element => {
        dojo.create('td', { innerHTML: '&#956;', style: sty }, tr);
        dojo.create('td', { innerHTML: '&#963;', style: sty }, tr);
    });

    cls.forEach(element => {
        var key = element;
        if (key != 'microA') {
            //alert('Key: ' + key);
            var vals = data[key];
            var trd = dojo.create('tr', {}, tbl);
            sty = { height: '20px', width: '70px', 'text-align': 'right', 'white-space': 'pre', 'font-weight': 'bold' }
            dojo.create('td', { innerHTML: key, style: sty }, trd);
            sty = { height: '20px', width: '70px', 'text-align': 'center', 'white-space': 'pre' }
            vals.forEach(element1 => {
                dojo.create('td', { innerHTML: element1, style: sty }, trd);
            });
        }
    });
}
function showCharts(data) {
    //alert('showCharts');

    buildKfolds(data);

    buildClassificationReport(data['Classification Report'], data.model);

    buildParametricsTable(data);

    buildConfusion(data.confusionMatrix, data.model + ' Confusion Matrix and per class LogLoss ', data.perclassLogLoss);

    var caption = data.model;
    var tblCap = dojo.byId('metsCaption');
    tblCap.innerHTML = caption + ' Exactitud y Pérdida'; // Accuracy and Loss';


    if (accuracyChart == undefined) {
        var plt = dojo.byId('accuracyChart');
        accuracyChart = createHighChart(plt,
            data.Epoch, data['Learning Rate'],
            data.model,
            data['Train Accuracy'],
            data['Validation Accuracy'],
            ' Exactitud'
        );
    }
    else {
        //alert(data.model);
        //accuracyChart.setTitle({ text: data.model  });
        accuracyChart.series[0].setData(data['Train Accuracy']);
        accuracyChart.series[1].setData(data['Validation Accuracy']);
        //accuracyChart.series[2].setData(data['Learning Rate']);
    }

    // accuracyChart.series[0].setData(data['Train Accuracy']);
    // accuracyChart.series[1].setData(data['Validation Accuracy']);

    if (lossChart == undefined) {
        var plL = dojo.byId('lossChart');
        lossChart = createHighChart(plL,
            data.Epoch,
            data['Learning Rate'],
            data.model,
            data.TrainCrossEntropy,
            data.ValidationCrossEntropy,
            ' Pérdida'

        );
    }
    else {
        //alert(data.model);

        //lossChart.setTitle({ text: data.model  });
        lossChart.series[0].setData(data.TrainCrossEntropy);
        lossChart.series[1].setData(data.ValidationCrossEntropy);
        //lossChart.series[3].setData(data['Learning Rate']);

    }
    // lossChart.series[0].setData(data['TrainCrossEntropy']);
    // lossChart.series[1].setData(data['ValidationCrossEntropy']);


}

function createHighChart(element, epoch, learning, model, Train, Validation, label) {
    var tempChart = Highcharts.chart(element, {
        chart: {
            zoomType: 'xy',
            width: 200,
            height: 300,
            style: {
                fontSize: '90%'
            }
            //height:250
        },
        exporting: {
            enabled: false
        },

        credits: {
            enabled: false
        },

        title: null,
        // {
        //     text: model, //ACCURACY',//Multiclass Classification Metrics',

        //     align: 'center',
        //     style: {
        //         color: 'blue'
        //     }
        // },
        // subtitle: {
        //     text: 'Multiclass Classification Metrics',
        //     align: 'center'
        // },
        xAxis: [{
            categories: epoch,//['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            crosshair: true,
            title: {
                text: 'Época'
                // align: 'center'
            }
        }],
        yAxis:

        {
            //crossing: 0,
            // Primary yAxis
            // labels: {
            //     format: '{value}',
            //     style: {
            //         //color: Highcharts.getOptions().colors[2]
            //     }
            // },
            max: 1.0,
            title: { text: label },
            // { 
            //     text: 'Test',
            //     style: {
            //         //color: Highcharts.getOptions().colors[2]
            //     }
            // }

        },


        tooltip: {
            shared: true
        },
        // legend: {
        //     layout: 'bottom',
        //     align: 'left',
        //     //x: 100,
        //     verticalAlign: 'top',
        //    // y: 150,
        //     floating: true,
        //     backgroundColor:
        //         Highcharts.defaultOptions.legend.backgroundColor || // theme
        //         'rgba(255,255,255,0.25)'
        // },
        series: [{
            name: 'Entrenamiento',//'Train',// + label,
            type: 'line',
            //yAxis: 0,
            color: '#0000FF', //blue
            data: Train, //data['Train Accuracy']//,//[49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            // tooltip: {
            //     valueSuffix: ' '
            // }

        }, {
            name: 'Prueba',// + label,
            type: 'line',
            //yAxis: 0,
            color: '#008000', //green
            data: Validation,//data['Validation Accuracy']//, //[1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],


        },

        ]//,
        // responsive: {
        //     rules: [{
        //         condition: {
        //             maxWidth: 500
        //         },
        //         chartOptions: {
        //             legend: {
        //                 floating: false,
        //                 layout: 'horizontal',
        //                 align: 'center',
        //                 verticalAlign: 'bottom',
        //                 x: 0,
        //                 y: 0
        //             },
        //             yAxis: [{
        //                 labels: {
        //                     align: 'right',
        //                     x: 0,
        //                     y: -6
        //                 },
        //                 showLastLabel: false
        //             }, {
        //                 labels: {
        //                     align: 'left',
        //                     x: 0,
        //                     y: -6
        //                 },
        //                 showLastLabel: false
        //             }, {
        //                 visible: false
        //             }]
        //         }
        //     }]
        // }
    });

    return tempChart;
}

function buildConfusion(matrix, caption, logloss) {

    var hdrdata = matrix.header;

    var tbl = dojo.create('table', { class: 'mlReport' });
    //var cap = dojo.create('caption', null, tbl);

    dojo.create('caption', {
        style: { 'border': 'none', 'border-bottom': '2px solid blue', 'margin-bottom': '10px' },
        innerHTML: "<strong><font color='blue'>" + caption + "</font></strong>"
    }, tbl);

    //var bkNames = 'salmon';

    var clss = hdrdata.length - 3;
    var hdr = dojo.create('tr', null, tbl);
    dojo.create('td', { innerHTML: '', style: { 'text-align': 'center' } }, hdr);
    dojo.create('td', { innerHTML: '', style: { 'text-align': 'center' } }, hdr);
    dojo.create('td', { innerHTML: '', style: { 'text-align': 'center' } }, hdr);
    dojo.create('td', { innerHTML: 'Predicted', class: 'predictedClass', style: { 'text-align': 'center' }, colspan: clss }, hdr);


    hdr = dojo.create('tr', null, tbl);
    dojo.create('td', { innerHTML: '', style: { 'text-align': 'center' } }, hdr);
    var h1 = '20px';

    dojo.forEach(hdrdata, function (item, pos) {
        if (pos == 0)
            dojo.create('td', { colspan: '2', innerHTML: '<b>' + item + '&nbsp;&nbsp;</b>', style: { height: h1, width: '10px', 'text-align': 'right' } }, hdr);
        else
            dojo.create('td', { innerHTML: '<b>' + item + '</b>', style: { height: h1, 'text-align': 'center' } }, hdr);
    });

    var classes = matrix.classes;
    var recall = matrix.recall;
    var dataV = matrix.data;

    var w = '25px';
    var h = '25px';


    var recIndex = 0;
    dojo.forEach(classes, function (nitem, indx) {
        var tr = dojo.create('tr', {}, tbl);
        var item = nitem.replace(/\s+/g, "").replace('.', '. ').split(' ');
        if (indx == 0)
            dojo.create('td', { rowspan: clss, class: 'verticalWrite', innerHTML: 'Truth&nbsp;', style: { width: '10px', 'text-align': 'center' } }, tr);
        dojo.create('td', { class: 'cfMatrixN', innerHTML: '<b>&nbsp;' + item[0] + '</b>', style: { width: '10px', 'text-align': 'center', 'white-space': 'pre' } }, tr);
        dojo.create('td', { class: 'cfMatrix', innerHTML: '<b>' + item[1] + '&nbsp;&nbsp;</b>', style: { 'text-align': 'right', 'white-space': 'pre' } }, tr);
        var classValues = dataV[recIndex];

        dojo.forEach(classValues, function (dta) {
            var v = dta.split('-');
            var txt = v[0];
            var bk = gradient(v[1]).toString();
            //alert('Gradiente: ' + bk);
            var td = dojo.create('td', { class: 'cfMatrix', innerHTML: txt, style: { width: w, height: h, 'background-color': bk, 'text-align': 'center' } }, tr);
        });
        dojo.create('td', { class: 'cfMatrix', innerHTML: '&nbsp;' + recall[recIndex], style: { width: w, height: h, 'text-align': 'center', 'white-space': 'pre' } }, tr);
        dojo.create('td', { class: 'cfMatrix', innerHTML: '&nbsp;' + logloss[recIndex], style: { width: w, height: h, 'text-align': 'center', 'white-space': 'pre' } }, tr);
        recIndex++;

    });

    var precision = matrix.precision;
    //alert('Precision: ' + precision);
    var ptr = dojo.create('tr', null, tbl);
    dojo.create('td', { class: 'cfMatrixN', style: { width: '20px', height: h, 'text-align': 'center' } }, ptr);

    dojo.forEach(precision, function (item, index) {
        if (index == 0) {
            item = '<b>' + item + '</b>';
            dojo.create('td', { colspan: '2', class: 'cfMatrixN', innerHTML: item + '&nbsp;&nbsp;', style: { width: w, height: h, 'text-align': 'right' } }, ptr);
        }
        else {
            dojo.create('td', { class: 'cfMatrix', innerHTML: item, style: { width: w, height: h, 'text-align': 'center' } }, ptr);

        }
    });

    var cfMat = dojo.byId('cfMatrix');
    dojo.empty(cfMat);

    dojo.place(tbl, cfMat);
}
function Filter(elm) {
    return (elm != null && elm !== false && elm !== "");
}

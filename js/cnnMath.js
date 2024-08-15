


function tangHPlot() {

    var r = dataValues(-10, 20).select(function (s) {
        var t = Math.tanh(s);
        return [s, t];//Math.tanh(t);

    });

    

    var plt = plot2(r, 'tanh', 1);
    var row = dojo.byId('activationFnc');
    dojo.place(plt, row, 'last');

}

function sigmoidPlot() {
    var r = dataValues(-10, 20).select(function (s) {
        var t = 1 / (1 + Math.exp(-s));//Math.tanh(s);
        return [s, t];//Math.tanh(t);

    })


    var plt = plot2(r, 'Sigmoid', 0.5);
    var row = dojo.byId('activationFnc');
    //alert('Active: ' + row.id);
    dojo.place(plt, row, 'last');
}

function reLuPlot() {

    var r = dataValues(-10, 20).select(function (s) {
        var t = s < 0 ? 0 : s
        return [s, t];//Math.tanh(t);

    })


    var plt = plot2(r, 'ReLU',5);
    var row = dojo.byId('activationFnc');
    dojo.place(plt, row, 'last');

}

function dataValues(start, count) {

    var values = [];
    var incA = Array.range(0, 10).select(function (s) { return s / 10; });
    var inc = 0;
    var rng = Array.range(start, count).select(function (s) {

        var tA = incA.select(function (i) {
            var add = s + i;
            values.push(add);
            return add;
        })

        return tA
    });

    return values;
}
function plot2(data, title, yInterval) {

    var mainTd = dojo.create('td', {});


    var minY = data.select(function(s){
        return s[1];
    }).min();

    var maxY = data.select(function(s){
        return s[1];
    }).max();

    var yTickInterval = Math.ceil(maxY);
    var cnt = dojo.create('div', {}, mainTd);
    var tempChart = Highcharts.chart(cnt, {
        exporting: {
            enabled: false
          },
          
        credits: {
            enabled: false
        },
          legend: {
            align: 'left',
            x:50
        },
        chart: {
            height: '200',
            width: '200'
        },

        title: {
            text: title
        },

        xAxis: {
            //categories: data.x,
            min: -11,
            max: 11,
            gridLineWidth: 1,
            crossing: 0,
            lineWidth: 1,
            minorGridLineWidth: 0.1,
            labels: {
                enabled: true
            },
            //minorTickLength: 5,
            tickLength:0
        },

        yAxis: {
            min: minY,
            max: maxY,
            tickInterval: yInterval,
            crossing: 0,
            lineWidth: 1,
            title: {
                text: null
            }
        },

        tooltip: {
            headerFormat: '',
            pointFormat: 'x = {point.x}<br>y = {point.y}'
        },

        series: [{
            color: 'blue',
            lineWidth: 2,
            name: '',
            data: data //data.y
        }]

    });
    return mainTd;
}
function CnnPlots(data) {
    //alert("DX: " + data.x.min() + 'Max: ' + data.x.max());
    var cnt = dojo.byId('predictionDiv');
    //alert('X: ' + data.x);
    //alert('Y: ' + data.y);
    Highcharts.chart(cnt, {
        chart: {
            type: 'line'

        },
        title: {
            text: 'Tanh Function Plot',
            align: 'center'
        },
        // subtitle: {
        //     text: 'According to the Standard Atmosphere Model',
        //     align: 'left'
        // },
        xAxis: {
            // min: data.x.min(),
            // max: data.x.max(),
            crossing: 0,
            categories: data.x,
            reversed: false,
            title: {
                enabled: true
            },
            // labels: {
            //     format: '{value} km'
            // },
            // accessibility: {
            //     rangeDescription: 'Range: 0 to 80 km.'
            // },
            maxPadding: 0.05,
            showLastLabel: true
        },
        yAxis: {
            // min: -1.2,
            // max: 1.2,
            crossing: 0,
            title: {
                text: ''
            },
            // labels: {
            //     format: '{value}°'
            // },
            // accessibility: {
            //     rangeDescription: 'Range: -90°C to 20°C.'
            // },
            lineWidth: 2
        },
        legend: {
            enabled: false
        },
        // tooltip: {
        //     headerFormat: '<b>{series.name}</b><br/>',
        //     pointFormat: '{point.x} km: {point.y}°C'
        // },
        // plotOptions: {
        //     spline: {
        //         marker: {
        //             enable: false
        //         }
        //     }
        // },
        series: [{
            name: '',
            data: data.y
        }]
    });

}

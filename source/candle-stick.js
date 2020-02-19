function setupCandleStickChart(container, dataSource, name)
{
    option = null;
    var upColor         = '#ec0000';
    var upBorderColor   = '#8A0000';
    var downColor       = '#00da3c';
    var downBorderColor = '#008F28';
    
    if (!dataSource)
        return
    
    const myChart = echarts.init(container);
    //var app = {};
    const data0 = splitData(dataSource.data)
    
    function splitData(rawData) {
        var categoryData = [];
        var values = []
        for (var i = 0; i < rawData.length; i++) {
            const dateTime = new Date(rawData[i].splice(0, 1)[0])
            const format = []
            format.push(dateTime.getUTCDate())
            format.push(' ')
            format.push(('0' + dateTime.getUTCHours()).substr(-2,2))
            format.push(':')
            format.push(('0' + dateTime.getUTCMinutes()).substr(-2,2))

            categoryData.push(format.join(''));
            values.push(rawData[i].splice(0,4).map(item => parseFloat(item)))
        }
        return {
            categoryData : categoryData,
            values       : values
        };
    }
    
    function calculateMA(dayCount) {
        var result = [];
        for (var i = 0, len = data0.values.length; i < len; i++) {
            if (i < dayCount) {
                result.push('-');
                continue;
            }
            var sum = 0;
            for (var j = 0; j < dayCount; j++) 
            {
                sum += eval(data0.values[i - j][1])
            }
            result.push(Math.round( (sum / dayCount) * 1000 * 1000 * 1000) / 1000 / 1000 / 1000)
        }
        return result
    }
    
    option = {
        id  : name,
        title: {
            text: dataSource.title,
            left: 0
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['candles', 'MA5', 'MA10', 'MA20', 'MA30']
        },
        backgroundColor: 'rgb(230,230,230)',
        grid: {
            left   : '10%',
            right  : '10%',
            bottom : '15%'
        },
        xAxis: {
            type        : 'category',
            data        : data0.categoryData,
            scale       : true,
            boundaryGap : false,
            axisLine    : {onZero: false},
            splitLine   : {show: true},
            splitNumber : 20,
            min         : 'dataMin',
            max         : 'dataMax'
        },
        yAxis: {
            scale     : true,
            splitArea : {
                show: true
            },
            axisLabel : {
                formatter : (value) => (value.toString() + '000').substr(0,10).replace('.', ',')
            }
        },
        dataZoom: [
            {
                type  : 'inside',
                start : 80,
                end   : 100
            },
            {
                show: true,
                type: 'slider',
                top: '90%',
                start: 80,
                end: 100
            }
        ],
        series: [
            {
                name              :  name,
                type              : 'candlestick',
                data              :  data0.values,
                animation         :  true,
                animationDuration :  3000,
                animationEasing   : 'bounceIn',
                itemStyle : {
                    color        : upColor,
                    color0       : downColor,
                    borderColor  : upBorderColor,
                    borderColor0 : downBorderColor
                },
                markPoint : {
                    label : {
                        normal : {
                            formatter : function (param) {
                                return param != null ? Math.round(param.value) : 'X';
                            }
                        }
                    },
                    data : [
                        {
                            name      : 'XX Score',
                            coord     : ['2013/5/31', 2300],
                            value     : 2300,
                            itemStyle : {
                                color : 'rgb(41,60,85)'
                            }
                        },
                        {                                                                                
                            name      : 'highest value',
                            type      : 'max',
                            valueDim  : 'highest'
                        },
                        {
                            name      : 'lowest value',
                            type      : 'min',
                            valueDim  : 'lowest'
                        },
                        {
                            name      : 'average value on close',
                            type      : 'average',
                            valueDim  : 'close'
                        }
                    ],
                    tooltip: {
                        formatter: function (param) {
                            return param.name + '<br>' + (param.data.coord || '');
                        }
                    }
                },
      /*        markLine: {
                    symbol: ['abc', 'none'],
                    data: [
                        [
                            {
                                name: 'from lowest to highest',
                                type: 'min',
                                valueDim: 'lowest',
                                symbol: 'circle',
                                symbolSize: 10,
                                label: {
                                    show: false
                                },
                                emphasis: {
                                    label: {
                                        show: false
                                    }
                                }
                            },
                            {
                                type: 'max',
                                valueDim: 'highest',
                                symbol: 'circle',
                                symbolSize: 15,
                                label: {
                                    show: true
                                },
                                emphasis: {
                                    label: {
                                        show: false
                                    }
                                }
                            }
                        ],
                        {
                            name     : 'min line on close',
                            type     : 'min',
                            valueDim : 'close'
                        },
                        {
                            name     : 'max line on close',
                            type     : 'max',
                            valueDim : 'close'
                        }
                    ]
                }      // marline   */
            },
            {
                name        : 'MA5',
                type        : 'line',
                data        : calculateMA(5),
                smooth      : true,
                lineStyle   : {
                    opacity : 0.5
                }
            },
            {
                name        : 'MA10',
                type        : 'line',
                data        : calculateMA(10),
                smooth      : true,
                lineStyle   : {
                    opacity : 0.5
                }
            },
            {
                name        : 'MA20',
                type        : 'line',
                data        : calculateMA(20),
                smooth      : true,
                lineStyle   : {
                    opacity : 0.5
                }
            },
            {
                name        : 'MA30',
                type        : 'line',
                data        : calculateMA(30),
                smooth      : true,
                lineStyle   : {
                    opacity : 0.5
                }
            },
    
        ]
    }

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

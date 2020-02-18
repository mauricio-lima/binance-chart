(()=>{
    function DOMLoaded()
    {
        setupCandleStickChart(document.getElementById("container-1"), data1, 'candles1')
        setupCandleStickChart(document.getElementById("container-2"), data1, 'candles2')
    }

    document.addEventListener('DOMContentLoaded', DOMLoaded)
})()

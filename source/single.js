(()=>{
    function DOMLoaded()
    {
        setupCandleStickChart(document.getElementById("container-1"), data1, 'candles1')
    }

    document.addEventListener('DOMContentLoaded', DOMLoaded)
})()

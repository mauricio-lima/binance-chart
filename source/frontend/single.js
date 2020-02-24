(()=>{
    async function DOMLoaded()
    {
        $('.datepicker')
            .on('changeDate', async (e) => {
                $(e.target).datepicker('hide')

                const date = `${e.date.getUTCFullYear()}${('0' + (e.date.getUTCMonth() + 1)).substr(-2,2)}${('0' + (e.date.getUTCDate())).substr(-2,2)}`
                const filename = `btc-usdt//${date.substr(0,4)}//${date.substr(4,2)}//data-btcusdt-${date}-0000-${date}-2359-utc`

                console.log(filename)
                const data = await loadJSON('data//' + filename + '.json')
                setupCandleStickChart(document.getElementById("container-1"), data , 'candles')
            })
            .datepicker({
                format    : 'dd/m/yyyy',
                language  : 'pt-BR',
                weekStart :  1,
                color     : 'red'
            })

        const filename = 'btc-usdt//2020//02//data-btcusdt-20200223-0000-20200223-2359-utc'
        setupCandleStickChart(document.getElementById("container-1"), await loadJSON('data//' + filename + '.json'), 'candles')
    }

    window.loadJSON = async (filename) => {
        if (!fetch)
            return null
        
        try
        {
            const response = await fetch(filename)
            if (response.status != 200)
                throw new Error(response.statusText)

            const json  = await response.json()
 
            return json
        }
        catch (e)
        {
            throw e
        }
    }

    $( document ).ready(DOMLoaded)
    //document.addEventListener('DOMContentLoaded', DOMLoaded)
})()

(()=>{
    async function DOMLoaded()
    {
        const filename = 'btc-usdt//2020//02//data-btcusdt-20200217-0000-20200217-2359-utc'

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
            debugger
            console.log('fetch fail')
        }
    }

    document.addEventListener('DOMContentLoaded', DOMLoaded)
})()

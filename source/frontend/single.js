(()=>{
    async function DOMLoaded()
    {
        //const filename = 'data-1'
        //const filename = 'pixv-btc//2020//02//data-200218-0000-200218-0817-utc'
        //const filename = 'link-btc//2020//02//data-200219-0000-200219-0400-utc'
        const filename = 'btc-usdt//2020//02//data-200218-0300-200219-0300-utc'

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

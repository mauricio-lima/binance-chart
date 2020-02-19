(()=>{
    async function DOMLoaded()
    {
        //const filename = 'data-1.json'
        const filename = 'pixv-btc-180220-0000-1515.json'

        setupCandleStickChart(document.getElementById("container-1"), await loadJSON(filename), 'candles')
    }

    window.loadJSON = async (filename) => {
        if (!fetch)
            return null
        
        try
        {
            const response = await fetch(filename)
            if (response.status != 200)
                throw new Error(response.statusText)

            //const text = await response.text()
            //const json = await JSON.parse(text)
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

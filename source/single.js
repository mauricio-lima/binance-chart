(()=>{
    async function DOMLoaded()
    {
        //const filename = 'data-1'
        const filename = 'pixv-btc//data-180220-0000-180220-1515-utc'
        //const filename = 'link-btc//data-190220-0000-190220-0400-utc'

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

(()=>{
    let dateComponent
    let coinSelected

    async function DOMLoaded()
    {
        $('.datepicker')
            .on('changeDate', async (e) => {
                $(e.target).datepicker('hide')

                updateChart()
            })
            .datepicker({
                format    : 'dd/m/yyyy',
                language  : 'pt-BR',
                weekStart :  1,
                color     : 'red',
            })

        dateComponent = $('#date').data('datepicker')

        $('.select2').select2()
            .on('change', (e) => {
                coinSelected =  e.target.value
                updateChart()
            })

        dateComponent.setValue(new Date('2020-2-16'))
        coinSelected = 'BTC - USDT'
        updateChart()
    }

    async function updateChart()
    {
        const symbol = coinSelected.replace(/\s+/g,'').toLowerCase()

        const date = `${dateComponent.date.getUTCFullYear()}${('0' + (dateComponent.date.getUTCMonth() + 1)).substr(-2,2)}${('0' + (dateComponent.date.getUTCDate())).substr(-2,2)}`
        const filename = `${symbol}//${date.substr(0,4)}//${date.substr(4,2)}//data-${symbol.replace('-','')}-${date}-0000-${date}-2359-utc`

        console.log(filename)
        const data = await loadJSON('data//' + filename + '.json')
        setupCandleStickChart(document.getElementById("container-1"), data , 'candles')
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

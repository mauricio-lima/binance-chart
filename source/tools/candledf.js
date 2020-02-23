#!/usr/bin/env node

const http = require('follow-redirects').http
const fs   = require('fs')


async function testRequestCandleDataFromStartUntilLimit(symbol, start, limit)
{
    return new Promise( (resolve,reject) => {
        const wait = 2000 + Math.random() * 5000
        console.log('Start', start, ' waiting', wait)
        setTimeout(() => {
            console.log('Done ' + start)
            if (wait < 3000)
                reject(new Error('selective error'))
            else
                resolve()
        }, wait)
    })
}


function formatDateTime(date)
{
    const year    = date.getFullYear()
    const month   = ('0' + (date.getUTCMonth() + 1)).substr(-2,2)
    const day     = ('0' + (date.getUTCDate()     )).substr(-2,2)
    const hours   = ('0' + (date.getUTCHours()    )).substr(-2,2)
    const minutes = ('0' + (date.getUTCMinutes()  )).substr(-2,2)

    return `${year}${month}${day}-${hours}${minutes}`
}


async function requestCandleDataFromStartUntilLimit(symbol, start, limit)
{
    return new Promise( (resolve,reject) => {
        const url = 'http://binance.com/api/v3/klines'

        const request = http.get(`${url}?symbol=${symbol}&startTime=${start}&interval=1m&limit=${limit}`)
        request.on('response', (response) => {
            const data   = []
            const weight = response.headers['x-mbx-used-weight']

            if (response.statusCode != 200)
            {
                //return reject(new Error(response.statusCode))
            }

            response.on('data', (chunk) => {
                data.push(chunk)
            })

            response.on('end',  () => {
                if (response.statusCode != 200)
                {
                    return reject(response.statusCode)
                }

                resolve({
                    data       : JSON.parse(data.join('')),
                    chunkCount : data.length,
                    weight     : weight
                })
                
               //resolve(data.length)
            })
        })
        request.on('error',    () => {
            console.log('error')
            reject()
        })
    })
}


async function requestCandleDataOfDay(symbol, day, symbolDisplayName)
{
    symbolDisplayName = symbolDisplayName || symbol

    day.setUTCHours(0,0,0,0)
    const timestamp = day.getTime()
    
    const offsets = [0, 12*60*60]   //  12 hours, 60 minutos, 60 seconds
    return new Promise( async (resolve, reject) => {
        try
        {
            const fractions = offsets.map( offset => requestCandleDataFromStartUntilLimit(symbol, timestamp + offset * 1000, 720))
            const results = await Promise.all(fractions)

            resolve({
                title  : symbol,
                data   : results[0].data.concat(results[1].data),
                weight : results[1].weight
            })
        }
        catch (e)
        {
            reject(e)
        }
    })
}


async function buildPathIfNotExists(path)
{
    return new Promise( (resolve,reject) => {
        let current = '.'

        for(element of path.split('/'))
        {
            current = [current, element].join('/')
            if (fs.existsSync(current))
                continue

            fs.mkdirSync(current)
        }
        resolve()
    })
}


async function writeDataFile(symbol, date, data)
{
    return new Promise(async (resolve, reject) => {
        try
        {
            const folder = `../frontend/data/${symbol.toLowerCase()}/${date.getUTCFullYear()}/${('0' + (date.getUTCMonth() + 1)).substr(-2,2)}`
            await buildPathIfNotExists(folder)

            const start  = new Date(date.setUTCHours(0,0,0,0))
            const finish = new Date(start.getTime() + 1439 * 60 * 1000)
            const filename = `${folder}/data-${symbol.replace('-','').toLowerCase()}-${formatDateTime(start)}-${formatDateTime(finish)}-utc.json`
            fs.writeFile(filename, data, (err) => {
                if (err)
                    return reject(err)

                resolve()
            })
        }
        catch (e)
        {
            console.log(e.message)
            reject(e)
        }
    })
}


function usage()
{
    const usage = `
    Usage:
        candledf.js symbol  date

    Both arguments are mandatory
       symbol 
           symbol pair with capitalized letters and '-' separator

       date
           date in format ISO8601 : yy-mm-dd

    Example:
       candlef.js BTC-USDT  2020-02-03

    `

    console.log(usage)
}


async function main()
{
    try
    {
        const arguments = process.argv.slice(2)
        if (arguments.length < 2)
        {
            usage()
            process.exit(1)
        }

        const symbol = arguments[0]
        const composition = symbol.match(/([A-Z]+)-([A-Z]+)/)
        if (!composition)
            throw new Error(`Symbol should have a '-' character between names and uppercase letters`)

        const epoch = Date.parse(arguments[1])
        if (isNaN(epoch)) 
            throw new Error(`Invalid date - ${arguments[1]}`)

        const date = new Date(epoch)
        const data = await requestCandleDataOfDay(composition.slice(1).join(''), date, symbol)

        console.log(`weight : ${data.weight}`)
        delete data.weight

        await writeDataFile(symbol, date, JSON.stringify(data, '', 4))
    }
    catch (e)
    {
        console.log(e.message + ' - (' + e.lineNumber  + ')')
    }
    
}


main()

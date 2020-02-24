#!/bin/bash
for i in {1..23}; do 
    node candledf.js BTC-USDT 2020-2-$i 
done

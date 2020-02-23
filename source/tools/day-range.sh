#!/bin/bash
for i in {4..15}; do 
    node candledf.js BTC-USDT 2020-2-$i 
done

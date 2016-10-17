#!/bin/bash

# Define Variables
tomorrow=$(date --date="next day" "+%Y%m%d")
#tomorrow=$(date --date="next monday" "+%Y%m%d")
today=`date +%Y-%m-%d`
pub=~/public_html/QuoVadimus/

# Get Nightly Calendar and format
wget https://www.quandl.com/api/v3/databases/ZEA/download?api_key=pDqgMz1TxeRQxoExz8VW
mv download?api_key=pDqgMz1TxeRQxoExz8VW ZEA.zip && unzip ZEA.zip && rm ZEA.zip
cut --complement -d, -f 2,3-5,7-10,12-15 ZEA-1.csv > ZEA.cut.csv && rm ZEA-1.csv
awk "/$tomorrow/" ZEA.cut.csv > tomorrow.new.csv && rm ZEA.cut.csv
sed -i 1d tomorrow.new.csv
sort -t, -k 1,1 tomorrow.new.csv > tomorrow.sorted && rm tomorrow.new.csv
sed -i '/_/d' tomorrow.sorted
# Generate the goods
cat tomorrow.sorted | while read line || [ -n "$line" ]
do
    symbol="$(echo $line | cut -d, -f 1)"
    announce="$(echo $line | cut -d, -f 3)"
    historicalData="$(curl -H "Authorization: Bearer 2IigxmuJp1Vzdq6nJKjxXwoXY9D6" https://api.tradier.com/v1/markets/history?symbol="$symbol" -H "Accept: application/json")"
    historicalDataCheck=$(echo $historicalData | ./jq-linux64 '.history' $1) 
    if [ "$historicalDataCheck" = "null" ]; then continue; fi
    # Get quote data
    data="$(curl -X GET "https://api.tradier.com/v1/markets/quotes?symbols="$symbol"" -H "Accept: application/json" -H "Authorization: Bearer 2IigxmuJp1Vzdq6nJKjxXwoXY9D6")"	
    price="$(echo $data | ./jq-linux64 '.quotes.quote.last' $1)"
echo $symbol " " $price
    if (( $(echo "$price > 20" | bc -l) )) ; then
        echo "filtered "$symbol" bc "$price" is greater than 20"
        continue
    else 
        echo "kept "$symbol" bc "$price" is less than 20"
        company="$(echo $data | ./jq-linux64 '.quotes.quote.description' $1)"
        change="$(echo $data | ./jq-linux64 '.quotes.quote.change' $1)"
        changePercent="$(echo $data | ./jq-linux64 '.quotes.quote.change_percentage' $1)"
        changePercent="$(printf "%0.2f\n" $changePercent)"
        open="$(echo $data | ./jq-linux64 '.quotes.quote.open' $1)"
        high="$(echo $data | ./jq-linux64 '.quotes.quote.high' $1)"
        high="$(printf "%0.2f\n" $high)"
        low="$(echo $data | ./jq-linux64 '.quotes.quote.low' $1)"
        low="$(printf "%0.2f\n" $low)"
        vol="$(echo $data | ./jq-linux64 '.quotes.quote.volume' $1)"
        # Calculate average volume 
        volume="$(echo $historicalData | ./jq-linux64 '.history.day[].volume' $1)"
        volume60=$(echo $volume | tr ' ' '\n' | tail -60)
        averageVolume="$(echo $volume60 | tr ' ' '\n' | awk '{ sum += $1 } END { if (NR > 0) printf("%f", sum / NR) }')"
        # Get share data
        tradierCompanyApi="$(curl -X GET "https://api.tradier.com/beta/markets/fundamentals/company?symbols="$symbol"" -H "Accept: application/json" -H "Authorization: Bearer 2IigxmuJp1Vzdq6nJKjxXwoXY9D6")"	
        marketCap="$(echo $tradierCompanyApi | ./jq-linux64 '.[].results[1].tables.share_class_profile.market_cap' $1)"
        sharesOutstanding="$(echo $tradierCompanyApi | ./jq-linux64 '.[].results[1].tables.share_class_profile.shares_outstanding' $1)"
        insiderOwnership="$(echo $tradierCompanyApi | ./jq-linux64 '.[].results[1].tables.ownership_summary.insider_shares_owned' $1)"
        short="$(echo $tradierCompanyApi | ./jq-linux64 '.[].results[1].tables.ownership_summary.short_interest' $1)"
        shortPercent="$(echo $tradierCompanyApi | ./jq-linux64 '.[].results[1].tables.ownership_summary.short_percentage_of_float' $1)"
        float=$((sharesOutstanding-insiderOwnership)) 

        # Build csv
        echo $symbol","$short","$averageVolume","$company","$price","$announce","$change","$changePercent","$open","$high","$low","$vol","$marketCap","$sharesOutstanding","$insiderOwnership","$shortPercent","$float >> tomorrow.new.csv
    fi
done

# Remove double quotes
sed -i 's/\"//g' tomorrow.new.csv

# Clean up
rm tomorrow.sorted

# Pull headlines and other vitals, then convert to JSON
echo '{"symbol":{' > data.json
cat tomorrow.new.csv | while read line || [ -n "$line" ]
do
    # Define variables for symbol card and vitals
    symbol="$(echo $line | cut -d, -f 1)"
    sharesShort="$(echo $line | cut -d, -f 2)"
    avgVol="$(echo $line | cut -d, -f 3)"
    name="$(echo $line | cut -d, -f 4)"
    name="$(echo $name | cut -c1-20)"
    price="$(echo $line | cut -d, -f 5)"
    announce="$(echo $line | cut -d, -f 6)"
    change="$(echo $line | cut -d, -f 7)"
    changePercent="$(echo $line | cut -d, -f 8)"
    open="$(echo $line | cut -d, -f 9)"
    high="$(echo $line | cut -d, -f 10)"
    low="$(echo $line | cut -d, -f 11)"
    volume="$(echo $line | cut -d, -f 12)"
    marketCap="$(echo $line | cut -d, -f 13)"
    sharesOutstanding="$(echo $line | cut -d, -f 14)"
    insiderOwnership="$(echo $line | cut -d, -f 15)"
    shortPercent="$(echo $line | cut -d, -f 16)"
    float="$(echo $line | cut -d, -f 17)"
    # Get headlines
    headlines="$(curl "https://api.intrinio.com/news?ticker="$symbol"" -u "506540ef71e2788714ac2bdd2255d337:1d3bce294c77797adefb8a602339ff21")"

    # Generate charts
    # Iterate through each symbol and pull price history
    cat tomorrow.new.csv | while read line || [ -n "$line" ]
    do
        symbol="$(echo $line | cut -d, -f 1)"
       
        # Generate 1 year  chart
        twelveMonthsAgo="$(date -d "12 months ago" +%Y-%m-%d)"
        curl -H "Authorization: Bearer 2IigxmuJp1Vzdq6nJKjxXwoXY9D6" https://api.tradier.com/v1/markets/history?symbol=$symbol"&start="$twelveMonthsAgo -H "Accept: application/json" > $symbol"-1yr.json"
        cat "$symbol"-1yr.json | ./jq-linux64 '.history.day[].date' $1 | sed 's/\"//g' $1 > date.txt    
        cat "$symbol"-1yr.json | ./jq-linux64 '.history.day[].open' $1 | sed 's/\"//g' $1 > open.txt
        cat "$symbol"-1yr.json | ./jq-linux64 '.history.day[].high' $1 | sed 's/\"//g' $1 > high.txt    
        cat "$symbol"-1yr.json | ./jq-linux64 '.history.day[].low' $1 | sed 's/\"//g' $1 > low.txt    
        cat "$symbol"-1yr.json | ./jq-linux64 '.history.day[].close' $1 | sed 's/\"//g' $1 > close.txt    
        paste -d ',' date.txt open.txt high.txt low.txt close.txt > "$symbol"-1yr.csv && sed -i '1i Date,Open,High,Low,Close' "$symbol"-1yr.csv
        sed 's/symbol/'$symbol'/g' symbol-1yr.php > $symbol"-1yr.php"
        cp "$symbol"-1yr.csv /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
        mv "$symbol"-1yr.php /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
        # Clean up
        rm date.txt && rm open.txt && rm high.txt && rm low.txt && rm close.txt && rm $symbol"-1yr.json"
        
        # Generate 6 month chart
        sixMonthsAgo="$(date -d "6 months ago" +%Y-%m-%d)"
        tail -130 "$symbol"-1yr.csv > "$symbol"-6mo.csv && sed -i '1i Date,Open,High,Low,Close' "$symbol"-6mo.csv
        sed 's/symbol/'$symbol'/g' symbol-6mo.php > $symbol"-6mo.php"
        mv "$symbol"-6mo.csv /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
        mv "$symbol"-6mo.php /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
        
        # Generate 3 month chart
        threeMonthsAgo="$(date -d "3 months ago" +%Y-%m-%d)"
        tail -65 "$symbol"-1yr.csv > "$symbol"-3mo.csv && sed -i '1i Date,Open,High,Low,Close' "$symbol"-3mo.csv
        sed 's/symbol/'$symbol'/g' symbol-3mo.php > $symbol"-3mo.php"
        mv "$symbol"-3mo.csv /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
        mv "$symbol"-3mo.php /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
        rm "$symbol"-1yr.csv    
    
        # Generate 1 month chart
        oneMonthAgo="$(date -d "1 month ago" +%Y-%m-%d)"
        curl -H "Authorization: Bearer 2IigxmuJp1Vzdq6nJKjxXwoXY9D6" https://api.tradier.com/v1/markets/history?symbol=$symbol"&start="$oneMonthAgo -H "Accept: application/json" > $symbol"-1mo.json"
        cat "$symbol"-1mo.json | ./jq-linux64 '.history.day[].date' $1 | sed 's/\"//g' $1 > date.txt    
        cat "$symbol"-1mo.json | ./jq-linux64 '.history.day[].open' $1 | sed 's/\"//g' $1 > open.txt
        cat "$symbol"-1mo.json | ./jq-linux64 '.history.day[].high' $1 | sed 's/\"//g' $1 > high.txt    
        cat "$symbol"-1mo.json | ./jq-linux64 '.history.day[].low' $1 | sed 's/\"//g' $1 > low.txt    
        cat "$symbol"-1mo.json | ./jq-linux64 '.history.day[].close' $1 | sed 's/\"//g' $1 > close.txt    
        paste -d ',' date.txt open.txt high.txt low.txt close.txt > "$symbol"-1mo.csv && sed -i '1i Date,Open,High,Low,Close' "$symbol"-1mo.csv
        sed 's/symbol/'$symbol'/g' symbol-1mo.php > $symbol"-1mo.php"
        mv "$symbol"-1mo.csv /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
        mv "$symbol"-1mo.php /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
        # Clean up
        rm date.txt && rm open.txt && rm high.txt && rm low.txt && rm close.txt && rm $symbol"-1mo.json"
    done

    # Build JSON
    echo '"'$symbol'": {"stats": {"symbol": "'$symbol'","name": "'$name'","price": "'$price'","dollarChange": "'$change'","percentChange": "'$changePercent'"},"charts": {"oneDay": "http://localhost/source/src/app/air/earnings-calendar/data/charts/'$symbol'-1d.php","oneMonth": "http://localhost/source/src/app/air/earnings-calendar/data/charts/'$symbol'-1mo.php","threeMonth": "http://localhost/source/src/app/air/earnings-calendar/data/charts/'$symbol'-3mo.php","sixMonth": "http://localhost/source/src/app/air/earnings-calendar/data/charts/'$symbol'-6mo.php","oneYear": "http://localhost/source/src/app/air/earnings-calendar/data/charts/'$symbol'-1yr.php"},"vitals": {"open": "'$open'","dayRange": "'$low' - '$high'","volume": "'$volume'","avgVol": "'$avgVol'","sharesShort": "'$sharesShort'","shortPercent": "'$shortPercent'","marketCap": "'$marketCap'","float": "'$float'"},"headlines":'$headlines'},' >> data.json
done
# Remove , from json
sed -i '$ s/.$//' data.json
echo '}}' >> data.json
mv data.json /var/www/html/source/src/app/air/earnings-calendar/data/

#!/bin/bash
# Daily Earnings Calendar Scanner

# Define Variables
#tomorrow=$(date --date="today" "+%Y%m%d")
tomorrow=$(date --date="next day" "+%Y%m%d")
#tomorrow=$(date --date="next monday" "+%Y%m%d")
today=`date +%Y-%m-%d`
ecalPath=/var/www/html/source/src/app/air/earnings-calendar/data/
tradierApi=2IigxmuJp1Vzdq6nJKjxXwoXY9D6

# Get Nightly Calendar and format
wget https://www.quandl.com/api/v3/databases/ZEA/download?api_key=pDqgMz1TxeRQxoExz8VW
mv download?api_key=pDqgMz1TxeRQxoExz8VW ZEA.zip && unzip ZEA.zip && rm ZEA.zip
cut --complement -d, -f 2,3-5,7-10,12-15 ZEA-1.csv > ZEA.cut.csv && rm ZEA-1.csv
awk "/$tomorrow/" ZEA.cut.csv > tomorrow.new.csv && rm ZEA.cut.csv
sed -i 1d tomorrow.new.csv
sort -t, -k 1,1 tomorrow.new.csv > tomorrow.sorted && rm tomorrow.new.csv
sed -i '/_/d' tomorrow.sorted

# Output the number of symbols - for information/debugging purposes only
wc -l tomorrow.sorted

# Isolate symbols
cut --complement -d, -f 2-3 tomorrow.sorted > ecal-symbols

# Make a dynamic copy of the symbols file 
cp ecal-symbols ecal-symbols-dynamic
cp tomorrow.sorted tomorrow-dynamic

# Get bulk quotes
function bulkQuotes {
    # Prepare headlines json
    echo '[' > headlines.json

    # Pull first 100 symbols and place them in a temporary reader file
    scount=$(wc -l< ecal-symbols-dynamic)
    if [[ $scount -lt 100 ]]; then
        sed -n -e '1,'$scount'p' ecal-symbols-dynamic >>  ecal-symbols-reader
    else
        sed -n -e '1,100p' ecal-symbols-dynamic >>  ecal-symbols-reader
    fi
    # Read the reader file and put all symbols on one line for bulk api call
    list=
    cat ecal-symbols-reader | while read line
    do
        list=$list$line","
        echo $list > ecal-symbols-list
    done
    # Remove first 100 symbols from dynamic file
    sed '1,100d' ecal-symbols-dynamic >> ecal-symbols-dynamic-tmp && mv ecal-symbols-dynamic-tmp ecal-symbols-dynamic
    # Remove last , in the line
    sed -i '$ s/.$//' ecal-symbols-list

    rm ecal-symbols-reader
    # Generate the goods
    list=$(cat ecal-symbols-list)

    # Get quote data
echo "vvv Getting quote data vvv"
    data="$(curl -X GET "https://api.tradier.com/v1/markets/quotes?symbols="$list"" -H "Accept: application/json" -H "Authorization: Bearer "$tradierApi"")"
    echo $data > ecal-data.json

    # Get share data
echo "vvv Getting fundamentals data vvv"
    tradierCompanyApi="$(curl -X GET "https://api.tradier.com/beta/markets/fundamentals/company?symbols="$list"" -H "Accept: application/json" -H "Authorization: Bearer "$tradierApi"")"
    echo $tradierCompanyApi > ecal-fundamentals.json
    # Pull first 100 symbols and place them in a temporary reader file
    scount=$(wc -l< tomorrow-dynamic)
    if [[ $scount -lt 100 ]]; then
        sed -n -e '1,'$scount'p' tomorrow-dynamic >>  tomorrow-reader
    else
        sed -n -e '1,100p' tomorrow-dynamic >>  tomorrow-reader
    fi
    # Remove first 100 symbols from dynamic file
    sed '1,100d' tomorrow-dynamic >> tomorrow-dynamic-tmp && mv tomorrow-dynamic-tmp tomorrow-dynamic

    jsonIndex=1
    count=$(wc -l< tomorrow-reader)
        for (( i = 1; i <= count; ++i )) {
            line=
            sed -n $jsonIndex"p" tomorrow-reader > line
            line=$(cat line)
            jsonIndex=$(($jsonIndex-1))
            # Get price and remove any symbols under $15
            price=$(./jq-linux64 '.quotes.quote['$jsonIndex'].last' ecal-data.json)
            if (( $(echo "$price > 15" | bc -l) )) ; then
                jsonIndex=$(($jsonIndex + 2))
                continue
            fi
            # Remove any symbols under $1
            if (( $(echo "$price < 1" | bc -l) )) ; then
                jsonIndex=$(($jsonIndex + 2))
                continue
            else
                symbol=$(./jq-linux64 '.quotes.quote['$jsonIndex'].symbol' ecal-data.json | sed 's/\"//g')
                # Calculate average volume 
echo "vvv Getting historical data for "$symbol" vvv"
                historicalData="$(curl -H "Authorization: Bearer "$tradierApi"" https://api.tradier.com/v1/markets/history?symbol="$symbol" -H "Accept: application/json")"
                historicalDataCheck=$(echo $historicalData | ./jq-linux64 '.history' $1)
                if [ "$historicalDataCheck" = "null" ]; then 
                    jsonIndex=$(($jsonIndex + 2))
                    continue
                 fi
                volume="$(echo $historicalData | ./jq-linux64 '.history.day[].volume' $1)"
                volume60=$(echo $volume | tr ' ' '\n' | tail -60)
                averageVolume="$(echo $volume60 | tr ' ' '\n' | awk '{ sum += $1 } END { if (NR > 0) printf("%f", sum / NR) }')"
                announce=$(echo $line | cut -d, -f 3)
                # Assign quotes data from ecal-data.json file
                company="$(./jq-linux64 '.quotes.quote['$jsonIndex'].description' ecal-data.json)"
                company="$(echo $company | sed 's/,//g')"
                change="$(./jq-linux64 '.quotes.quote['$jsonIndex'].change' ecal-data.json)"
                changePercent="$(./jq-linux64 '.quotes.quote['$jsonIndex'].change_percentage' ecal-data.json)"
                open="$(./jq-linux64 '.quotes.quote['$jsonIndex'].open' ecal-data.json)"
                high="$(./jq-linux64 '.quotes.quote['$jsonIndex'].high' ecal-data.json)"
                low="$(./jq-linux64 '.quotes.quote['$jsonIndex'].low' ecal-data.json)"
                vol="$(./jq-linux64 '.quotes.quote['$jsonIndex'].volume' ecal-data.json)"
                marketCap="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.share_class_profile.market_cap' ecal-fundamentals.json)"
                sharesOutstanding="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.share_class_profile.shares_outstanding' ecal-fundamentals.json)"
                insiderOwnership="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.ownership_summary.insider_shares_owned' ecal-fundamentals.json)"
                short="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.ownership_summary.short_interest' ecal-fundamentals.json)"
                float=$((sharesOutstanding-insiderOwnership))
                shortPercent="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.ownership_summary.short_percentage_of_float' ecal-fundamentals.json)"
                if [ "$shortPercent" = "null" ]; then 
                    shortPercent=$(echo $short / $float | bc -l)
                    shortPercent=$(echo $shortPercent \* 100 | bc -l | awk '{printf "%f", $0}')
                fi
                # Build csv spreadsheet
                echo $symbol","$short","$averageVolume","$company","$price","$announce","$change","$changePercent","$open","$high","$low","$vol","$marketCap","$sharesOutstanding","$insiderOwnership","$shortPercent","$float >> tomorrow.new.csv

                jsonIndex=$(($jsonIndex + 2))
            fi
        }

    # Clean up
    rm line && rm tomorrow-reader && rm ecal-symbols-list
}
# Check if dynamic symbol file is empty.  If not, perform bulkQuotes function
while test -s "ecal-symbols-dynamic"
do
    bulkQuotes
done

# Clean up
rm ecal-data.json && rm ecal-fundamentals.json && rm ecal-symbols && rm ecal-symbols-dynamic && rm tomorrow-dynamic

# Remove double quotes
sed -i 's/\"//g' tomorrow.new.csv

# Pull headlines and other vitals, then convert to JSON
echo '[' > data.json

# Echo number of symbols for debugging and information purposes only
wc -l tomorrow.new.csv
cat tomorrow.new.csv | while read line || [ -n "$line" ]
do
    # Define variables for symbol card and vitals
    symbol="$(echo $line | cut -d, -f 1)"
    sharesShort="$(echo $line | cut -d, -f 2)"
    avgVol="$(echo $line | cut -d, -f 3)"
    name="$(echo $line | cut -d, -f 4)"
    name="$(echo $name | cut -c1-20)"
    price="$(echo $line | cut -d, -f 5)"
    time="$(echo $line | cut -d, -f 6)"
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
echo "vvv Getting headline data for "$symbol" vvv"
    headlines="$(curl "https://api.intrinio.com/news?ticker="$symbol"" -u "506540ef71e2788714ac2bdd2255d337:1d3bce294c77797adefb8a602339ff21")"
    echo '{"symbol": "'$symbol'","headlines":'$headlines'},' >> headlines.json
       
        # Generate 1 year  chart
echo "vvv Getting 1yr chart data for "$symbol" vvv"
        twelveMonthsAgo="$(date -d "12 months ago" +%Y-%m-%d)"
        curl -H "Authorization: Bearer "$tradierApi"" https://api.tradier.com/v1/markets/history?symbol=$symbol"&start="$twelveMonthsAgo -H "Accept: application/json" > $symbol"-1yr.json"

        cat "$symbol"-1yr.json | ./jq-linux64 '.history.day[].date' $1 | sed 's/\"//g' $1 > date.txt    
        cat "$symbol"-1yr.json | ./jq-linux64 '.history.day[].open' $1 | sed 's/\"//g' $1 > open.txt
        cat "$symbol"-1yr.json | ./jq-linux64 '.history.day[].high' $1 | sed 's/\"//g' $1 > high.txt    
        cat "$symbol"-1yr.json | ./jq-linux64 '.history.day[].low' $1 | sed 's/\"//g' $1 > low.txt    
        cat "$symbol"-1yr.json | ./jq-linux64 '.history.day[].close' $1 | sed 's/\"//g' $1 > close.txt    
        paste -d ',' date.txt open.txt high.txt low.txt close.txt > "$symbol"-1yr.csv && sed -i '1i Date,Open,High,Low,Close' "$symbol"-1yr.csv
        dataCheck=$(cat $symbol"-1yr.csv")
        if [ "$dataCheck" != "" ]; then
            oneYearNull=0
            sed 's/symbol/'$symbol'/g' symbol-1yr.php > $symbol"-1yr.php"
            cp "$symbol"-1yr.csv /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
            mv "$symbol"-1yr.php /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
        else
            oneYearNull=1 
        fi
        # Clean up
        rm date.txt && rm open.txt && rm high.txt && rm low.txt && rm close.txt && rm $symbol"-1yr.json"
        
        # Generate 6 month chart
        sixMonthsAgo="$(date -d "6 months ago" +%Y-%m-%d)"
        tail -130 "$symbol"-1yr.csv > "$symbol"-6mo.csv && sed -i '1i Date,Open,High,Low,Close' "$symbol"-6mo.csv
        dataCheck=$(cat $symbol"-6mo.csv")
        if [ "$dataCheck" != "" ]; then
            sixMonthNull=0
            sed 's/symbol/'$symbol'/g' symbol-6mo.php > $symbol"-6mo.php"
            mv "$symbol"-6mo.csv /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
            mv "$symbol"-6mo.php /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
        else
            sixMonthNull=1
        fi
        
        # Generate 3 month chart
        threeMonthsAgo="$(date -d "3 months ago" +%Y-%m-%d)"
        tail -65 "$symbol"-1yr.csv > "$symbol"-3mo.csv && sed -i '1i Date,Open,High,Low,Close' "$symbol"-3mo.csv
        dataCheck=$(cat $symbol"-3mo.csv")
        if [ "$dataCheck" != "" ]; then
            threeMonthNull=0
            sed 's/symbol/'$symbol'/g' symbol-3mo.php > $symbol"-3mo.php"
            mv "$symbol"-3mo.csv /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
            mv "$symbol"-3mo.php /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
        else
            threeMonthNull=1
        fi

        # Generate 1 day chart
echo "vvv Getting 1d chart data for "$symbol" vvv"
        curl -H "Authorization: Bearer "$tradierApi"" -H "Accept: application/json" "https://api.tradier.com/v1/markets/timesales?symbol="$symbol"&interval=5min" > $symbol"-1d.json"
        cat "$symbol"-1d.json | ./jq-linux64 '.series.data[].time' $1 | sed 's/\"//g' $1 | cut -dT -f 2 > date.txt
        cat "$symbol"-1d.json | ./jq-linux64 '.series.data[].open' $1 | sed 's/\"//g' $1 > open.txt
        cat "$symbol"-1d.json | ./jq-linux64 '.series.data[].high' $1 | sed 's/\"//g' $1 > high.txt
        cat "$symbol"-1d.json | ./jq-linux64 '.series.data[].low' $1 | sed 's/\"//g' $1 > low.txt
        cat "$symbol"-1d.json | ./jq-linux64 '.series.data[].close' $1 | sed 's/\"//g' $1 > close.txt       
        paste -d ',' date.txt open.txt high.txt low.txt close.txt > "$symbol"-1d.csv && sed -i '1i Date,Open,High,Low,Close' "$symbol"-1d.csv
        dataCheck=$(cat $symbol"-1d.csv")
        if [ "$dataCheck" != "" ]; then
            oneDayNull=0
            sed 's/symbol/'$symbol'/g' symbol-1d.php > $symbol"-1d.php"
            wc=$(wc -l "$symbol"-1d.csv | cut -d' ' -f1)
            xTicks=$(($wc -2))
            sed -i 's/xTix/'$xTicks'/g' $symbol"-1d.php"
            mv "$symbol"-1d.csv /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
            mv "$symbol"-1d.php /var/www/html/source/src/app/air/earnings-calendar/data/charts/  
        else
            oneDayNull=1
        fi
        # Clean up
        rm date.txt && rm open.txt && rm high.txt && rm low.txt && rm close.txt && rm $symbol"-1d.json" && rm "$symbol"-1yr.csv 

        # Check for nulls and replace with 0
        if [ "$price" = "" ]; then price=0; fi
        if [ "$change" = "" ]; then change=0; fi
        if [ "$changePercent" = "" ]; then changePercent=0; fi
        if [ "$time" = "" ]; then time=0; fi
        if [ "$open" = "" ]; then open=0; fi
        if [ "$high" = "" ]; then high=0; fi
        if [ "$low" = "" ]; then low=0; fi
        if [ "$volume" = "" ]; then volume=0; fi
        if [ "$avgVol" = "" ]; then avgVol=0; fi
        if [ "$sharesShort" = "" ]; then sharesShort=0; fi
        if [ "$shortPercent" = "" ]; then shortPercent=0; fi
        if [ "$marketCap" = "" ]; then marketCap=0; fi
        if [ "$float" = "" ]; then float=0; fi
        
        # Build JSON
        echo '{"symbol": "'$symbol'","name": "'$name'","price": '$price',"dollarChange": '$change',"percentChange": '$changePercent',"time":'$time',"oneDayNull":"'$oneDayNull'","oneDay": "http://localhost/source/src/app/air/earnings-calendar/data/charts/'$symbol'-1d.php","oneMonthNull":"'$oneMonthNull'","oneMonth": "http://localhost/source/src/app/air/earnings-calendar/data/charts/'$symbol'-1mo.php","threeMonthNull":"'$threeMonthNull'","threeMonth": "http://localhost/source/src/app/air/earnings-calendar/data/charts/'$symbol'-3mo.php","sixMonthNull":"'$sixMonthNull'","sixMonth": "http://localhost/source/src/app/air/earnings-calendar/data/charts/'$symbol'-6mo.php","oneYearNull":"'$oneYearNull'","oneYear": "http://localhost/source/src/app/air/earnings-calendar/data/charts/'$symbol'-1yr.php","open": '$open',"high": '$high',"low":'$low',"volume": '$volume',"avgVol": '$avgVol',"sharesShort": '$sharesShort',"shortPercent": '$shortPercent',"marketCap": '$marketCap',"float": '$float',"headlines":'$headlines'},' >> data.json
done
# Remove , from data json
sed -i '$ s/.$//' data.json
echo ']' >> data.json
# Remove , from headlines json
sed -i '$ s/.$//' headlines.json
echo ']' >> headlines.json

# Clean up and prepare data for other scans
cp data.json /var/www/html/source/src/app/air/decision-engine/data/ecal-daily-data.json
mv data.json $ecalPath"data.json" && mv tomorrow.new.csv $ecalPath"ecal-daily-symbols" && mv headlines.json $ecalPath"headlines.json"
rm tomorrow.sorted

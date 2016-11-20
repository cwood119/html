#!/bin/bash
# Intraday Earnings Calendar Scanner (ecal-update-v2)

# Define Variables
pub=~/public_html/
ecalPath=~/public_html/app/app/air/earnings-calendar/data/
dePath=~/public_html/app/app/air/decision-engine/data/
tradierApi=2IigxmuJp1Vzdq6nJKjxXwoXY9D6
PIDFILE=~/ecalUpdate.pid

function ecalUpdate {
# Make a dynamic copy of the symbols file 
cut -d, -f 1 $ecalPath"ecal-daily-symbols" > ecal-update-symbols && cp ecal-update-symbols ecal-update-symbols-dynamic
cp $ecalPath"ecal-daily-symbols" today.sorted && cp today.sorted today-dynamic

# Get bulk quotes
function bulkQuotes {
    # Pull first 100 symbols and place them in a temporary reader file
    scount=$(wc -l< ecal-update-symbols-dynamic)
    if [[ $scount -lt 100 ]]; then
        sed -n -e '1,'$scount'p' ecal-update-symbols-dynamic >>  ecal-update-symbols-reader
    else
        sed -n -e '1,100p' ecal-update-symbols-dynamic >>  ecal-update-symbols-reader
    fi
    # Read the reader file and put all symbols on one line for bulk api call
    list=
    cat ecal-update-symbols-reader | while read line
    do
        list=$list$line","
        echo $list > ecal-update-symbols-list
    done
    # Remove first 100 symbols from dynamic file
    sed '1,100d' ecal-update-symbols-dynamic >> ecal-update-symbols-dynamic-tmp && mv ecal-update-symbols-dynamic-tmp ecal-update-symbols-dynamic
    # Remove last , in the line
    sed -i '$ s/.$//' ecal-update-symbols-list

    rm ecal-update-symbols-reader
    # Generate the goods
    list=$(cat ecal-update-symbols-list)

    # Get quote data
echo "vvv Getting quote data vvv"
    data="$(curl -X GET "https://api.tradier.com/v1/markets/quotes?symbols="$list"" -H "Accept: application/json" -H "Authorization: Bearer "$tradierApi"")"
    echo $data > ecal-data.json

    # Get share data
echo "vvv Getting fundamentals data vvv"
    tradierCompanyApi="$(curl -X GET "https://api.tradier.com/beta/markets/fundamentals/company?symbols="$list"" -H "Accept: application/json" -H "Authorization: Bearer "$tradierApi"")"
    echo $tradierCompanyApi > ecal-fundamentals.json
    # Pull first 100 symbols and place them in a temporary reader file
    scount=$(wc -l< today-dynamic)
    if [[ $scount -lt 100 ]]; then
        sed -n -e '1,'$scount'p' today-dynamic >>  today-reader
    else
        sed -n -e '1,100p' today-dynamic >>  today-reader
    fi
    # Remove first 100 symbols from dynamic file
    sed '1,100d' today-dynamic >> today-dynamic-tmp && mv today-dynamic-tmp today-dynamic

    jsonIndex=1
    count=$(wc -l< today-reader)
        for (( i = 1; i <= count; ++i )) {
            line=
            sed -n $jsonIndex"p" today-reader > line
            line=$(cat line)
            jsonIndex=$(($jsonIndex-1))
            # Get price and remove any symbols over $15
            price=$(./jq-linux64 '.quotes.quote['$jsonIndex'].last' ecal-data.json)
            if (( $(echo "$price > 15" | bc -l) )) ; then
                jsonIndex=$(($jsonIndex + 2))
                continue
            else
                changePercent="$(./jq-linux64 '.quotes.quote['$jsonIndex'].change_percentage' ecal-data.json)"
            if (( $(echo "$changePercent < 1" | bc -l) )) ; then
                jsonIndex=$(($jsonIndex + 2))
                continue
            else
                vol="$(./jq-linux64 '.quotes.quote['$jsonIndex'].volume' ecal-data.json)"
            if (( $(echo "$vol < 100000" | bc -l) )) ; then
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
                announce=$(echo $line | cut -d, -f 6)
                # Assign quotes data from ecal-data.json file
                company="$(./jq-linux64 '.quotes.quote['$jsonIndex'].description' ecal-data.json)"
                company="$(echo $company | sed 's/,//')"
                change="$(./jq-linux64 '.quotes.quote['$jsonIndex'].change' ecal-data.json)"
                open="$(./jq-linux64 '.quotes.quote['$jsonIndex'].open' ecal-data.json)"
                high="$(./jq-linux64 '.quotes.quote['$jsonIndex'].high' ecal-data.json)"
                low="$(./jq-linux64 '.quotes.quote['$jsonIndex'].low' ecal-data.json)"
                marketCap="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.share_class_profile.market_cap' ecal-fundamentals.json)"
                sharesOutstanding="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.share_class_profile.shares_outstanding' ecal-fundamentals.json)"
                insiderOwnership="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.ownership_summary.insider_shares_owned' ecal-fundamentals.json)"
                shortData="$(curl https://www.quandl.com/api/v3/datasets/SI/"$symbol"_SI.json?api_key=pDqgMz1TxeRQxoExz8VW)"
                short="$(echo $shortData | ./jq-linux64 '.dataset.data[0][1]' $1)"
                float=$((sharesOutstanding-insiderOwnership))
                shortPercent=$(echo $short / $float | bc -l)
                shortPercent=$(echo $shortPercent \* 100 | bc -l | awk '{printf "%f", $0}')

                # Build csv spreadsheet
                echo $symbol","$short","$averageVolume","$company","$price","$announce","$change","$changePercent","$open","$high","$low","$vol","$marketCap","$sharesOutstanding","$insiderOwnership","$shortPercent","$float >> today.new.csv

                jsonIndex=$(($jsonIndex + 2))
            fi
            fi
            fi
        }

    # Clean up
    rm line && rm today-reader && rm ecal-update-symbols-list && rm ecal-fundamentals.json
}
# Check if dynamic symbol file is empty.  If not, perform bulkQuotes function
while test -s "ecal-update-symbols-dynamic"
do
    bulkQuotes
done

# Clean up
rm ecal-data.json && rm  ecal-update-symbols && rm ecal-update-symbols-dynamic && rm today-dynamic

# Remove double quotes
sed -i 's/\"//g' today.new.csv

# Pull headlines and other vitals, then convert to JSON
echo '[' > data.json
touch symbols.txt
cat today.new.csv | while read line || [ -n "$line" ]
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
    #headlines="$(curl "https://api.intrinio.com/news?ticker="$symbol"" -u "506540ef71e2788714ac2bdd2255d337:1d3bce294c77797adefb8a602339ff21")"
    headlines="$(./jq-linux64 '.[] | select(.symbol == "'$symbol'") | .headlines' "$ecalPath"headlines.json)"

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
            cp "$symbol"-1yr.csv $pub
            mv "$symbol"-1yr.php $pub
        else
            oneYearNull=1
            rm $symbol"-1yr.csv"
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
            mv "$symbol"-6mo.csv $pub
            mv "$symbol"-6mo.php $pub
        else
            sixMonthNull=1
            rm $symbol"-6mo.csv"
        fi
        
        # Generate 3 month chart
        threeMonthsAgo="$(date -d "3 months ago" +%Y-%m-%d)"
        tail -65 "$symbol"-1yr.csv > "$symbol"-3mo.csv && sed -i '1i Date,Open,High,Low,Close' "$symbol"-3mo.csv
        dataCheck=$(cat $symbol"-3mo.csv")
        if [ "$dataCheck" != "" ]; then
            threeMonthNull=0
            sed 's/symbol/'$symbol'/g' symbol-3mo.php > $symbol"-3mo.php"
            mv "$symbol"-3mo.csv $pub
            mv "$symbol"-3mo.php $pub
        else
            threeMonthNull=1
            rm $symbol"-3mo.csv"
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
            mv "$symbol"-1d.csv $pub
            mv "$symbol"-1d.php $pub
        else
            oneDayNull=1
            rm $symbol"-1mo.csv"
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
        if [ "$sharesShort" = "null" ]; then sharesShort=0; fi
        if [ "$shortPercent" = "" ]; then shortPercent=0; fi
        if [ "$marketCap" = "" ]; then marketCap=0; fi
        if [ "$float" = "" ]; then float=0; fi 

        # Build JSON
        echo '{"list":"Calendar Movers","symbol": "'$symbol'","name": "'$name'","price": '$price',"dollarChange": '$change',"percentChange": '$changePercent',"time":'$time',"oneDayNull":"'$oneDayNull'","oneDay": "http://automatedinvestmentresearch.com/'$symbol'-1d.php","oneMonthNull":"'$oneMonthNull'","oneMonth": "http://automatedinvestmentresearch.com/'$symbol'-1mo.php","threeMonthNull":"'$threeMonthNull'","threeMonth": "http://automatedinvestmentresearch.com/'$symbol'-3mo.php","sixMonthNull":"'$sixMonthNull'","sixMonth": "http://automatedinvestmentresearch.com/'$symbol'-6mo.php","oneYearNull":"'$oneYearNull'","oneYear": "http://automatedinvestmentresearch.com/'$symbol'-1yr.php","open": '$open',"high": '$high',"low":'$low',"volume": '$volume',"avgVol": '$avgVol',"sharesShort": '$sharesShort',"shortPercent": '$shortPercent',"marketCap": '$marketCap',"float": '$float',"headlines":'$headlines'},' >> data.json
        # Copy symbol list for download
        printf $symbol"\n" >> symbols.txt

done
# Remove , from json
sed -i '$ s/.$//' data.json
echo ']' >> data.json

# Clean up and prepare data for other scans
cat data.json > $ecalPath"data.json"
mv data.json $dePath"ecal-intraday-data.json"
mv symbols.txt $ecalPath"symbols.txt"
mv today.new.csv $ecalPath"ecal-update-symbols" && rm today.sorted
}

if [ -f $PIDFILE ]
then
  PID=$(cat $PIDFILE)
  ps -p $PID > /dev/null 2>&1
  if [ $? -eq 0 ]
  then
    echo "Ecal Update is already running"
    exit 1
  else
    # Process not found assume not running
    echo $$ > $PIDFILE
    if [ $? -ne 0 ]
    then
      echo "Could not create PID file"
      exit 1
    fi
    ecalUpdate
  fi
else
  echo $$ > $PIDFILE
  if [ $? -ne 0 ]
  then
    echo "Could not create PID file"
    exit 1
  fi
fi
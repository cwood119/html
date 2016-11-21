#!/bin/bash
# This script checks to see if alerts.raw has been updated within the last 15 minutes, and generates new data if it has.
# Define Variables
pub=~/public_html/
alertsPath=~/public_html/app/app/air/alerts/data/
dePath=~/public_html/app/app/air/decision-engine/data/
tradierApi=2IigxmuJp1Vzdq6nJKjxXwoXY9D6

# Define function
function alerts {
    # Make temporary alerts directory
    mkdir ~/alerts
    ls | grep symbol-.*.php | while read file; do cp $file ~/alerts/; done
    cp jq-linux64 ~/alerts/ && cp -r xml2json ~/alerts/  && cp alerts.raw ~/alerts/ && cd ~/alerts
    # Clean up thinkorswim export
    sed -i '1,4d' alerts.raw
    # Generate symbol file
    cut -d ',' -f3 alerts.raw > alerts.symbols
    # Prepare symbols for bulk api call
    cat alerts.symbols | while read line || [ -n "$line" ]
    do    
        list=$list$line","
        echo $list > alerts-symbols-list
    done
    # File cleanup - Remove last , in the line
    sed -i '$ s/.$//' alerts-symbols-list
    # Define Variables
    pub=~/public_html/
    alertsPath=~/public_html/app/app/air/alerts/data/
    dePath=~/public_html/app/app/air/decision-engine/data/
    tradierApi=2IigxmuJp1Vzdq6nJKjxXwoXY9D6
    list=$(cat alerts-symbols-list)

    # Get bulk quote data
echo "vvv Getting quote data vvv"
    data="$(curl -X GET "https://api.tradier.com/v1/markets/quotes?symbols="$list"" -H "Accept: application/json" -H "Authorization: Bearer "$tradierApi"")"
    echo $data > alerts-data.json
    # Get bulk share data
echo "vvv Getting fundamentals data vvv"
    tradierCompanyApi="$(curl -X GET "https://api.tradier.com/beta/markets/fundamentals/company?symbols="$list"" -H "Accept: application/json" -H "Authorization: Bearer "$tradierApi"")"
    echo $tradierCompanyApi > alerts-fundamentals.json
    
    # Get individual symbol data 
    jsonIndex=1
    count=$(wc -l< alerts.symbols)
    for (( i = 1; i <= count; ++i )) {
        jsonIndex=$(($jsonIndex-1))
        symbol=$(./jq-linux64 '.quotes.quote['$jsonIndex'].symbol' alerts-data.json | sed 's/\"//g')
        time=$(cat alerts.raw | grep -w $symbol | cut -d, -f1 $1)
        timeStamp=$(date +%s -d"$time") 
        trigger=$(cat alerts.raw | grep -w $symbol | cut -d, -f4 $1)
        triggerPrice=$(cat alerts.raw | grep -w $symbol| cut -d, -f4 $1 | cut -d" " -f5 $2)
        alertStatus=$(cat alerts.raw | grep -w $symbol | cut -d, -f7 $1)
        price=$(./jq-linux64 '.quotes.quote['$jsonIndex'].last' alerts-data.json)
        changePercent="$(./jq-linux64 '.quotes.quote['$jsonIndex'].change_percentage' alerts-data.json)"
        vol="$(./jq-linux64 '.quotes.quote['$jsonIndex'].volume' alerts-data.json)"
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
        # Assign quotes data from alerts-data.json file
        company="$(./jq-linux64 '.quotes.quote['$jsonIndex'].description' alerts-data.json)"
        company="$(echo $company | sed 's/,//')"
        change="$(./jq-linux64 '.quotes.quote['$jsonIndex'].change' alerts-data.json)"
        open="$(./jq-linux64 '.quotes.quote['$jsonIndex'].open' alerts-data.json)"
        high="$(./jq-linux64 '.quotes.quote['$jsonIndex'].high' alerts-data.json)"
        low="$(./jq-linux64 '.quotes.quote['$jsonIndex'].low' alerts-data.json)"
        marketCap="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.share_class_profile.market_cap' alerts-fundamentals.json)"
        sharesOutstanding="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.share_class_profile.shares_outstanding' alerts-fundamentals.json)"
        insiderOwnership="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.ownership_summary.insider_shares_owned' alerts-fundamentals.json)"
        shortData="$(curl https://www.quandl.com/api/v3/datasets/SI/"$symbol"_SI.json?api_key=pDqgMz1TxeRQxoExz8VW)"
        short="$(echo $shortData | ./jq-linux64 '.dataset.data[0][1]' $1)"
        float=$((sharesOutstanding-insiderOwnership))
        shortPercent=$(echo $short / $float | bc -l)
        shortPercent=$(echo $shortPercent \* 100 | bc -l | awk '{printf "%f", $0}')
        # Build csv spreadsheet
        echo $symbol","$short","$averageVolume","$company","$price","$change","$changePercent","$open","$high","$low","$vol","$marketCap","$sharesOutstanding","$insiderOwnership","$shortPercent","$float","$timeStamp","$trigger","$triggerPrice","$alertStatus >> alerts.new.csv
    
        jsonIndex=$(($jsonIndex + 2))
    }
    # Remove double quotes
    sed -i 's/\"//g' alerts.new.csv

    # Pull headlines and other vitals, then convert to JSON
    echo '[' > data.json
    touch symbols.txt
    cat alerts.new.csv | while read line || [ -n "$line" ]
    do
        # Define variables for symbol card and vitals
        symbol="$(echo $line | cut -d, -f 1)"
        sharesShort="$(echo $line | cut -d, -f 2)"
        avgVol="$(echo $line | cut -d, -f 3)"
        name="$(echo $line | cut -d, -f 4)"
        name="$(echo $name | cut -c1-20)"
        price="$(echo $line | cut -d, -f 5)"
        change="$(echo $line | cut -d, -f 6)"
        changePercent="$(echo $line | cut -d, -f 7)"
        open="$(echo $line | cut -d, -f 8)"
        high="$(echo $line | cut -d, -f 9)"
        low="$(echo $line | cut -d, -f 10)"
        volume="$(echo $line | cut -d, -f 11)"
        marketCap="$(echo $line | cut -d, -f 12)"
        sharesOutstanding="$(echo $line | cut -d, -f 13)"
        insiderOwnership="$(echo $line | cut -d, -f 14)"
        shortPercent="$(echo $line | cut -d, -f 15)"
        float="$(echo $line | cut -d, -f 16)"
        timeStamp="$(echo $line | cut -d, -f 17)"
        trigger="$(echo $line | cut -d, -f 18)"
        triggerPrice="$(echo $line | cut -d, -f 19)"
        alertStatus="$(echo $line | cut -d, -f 20)"
        # Get headlines
        headlines="$(curl "https://api.intrinio.com/news?ticker="$symbol"" -u "506540ef71e2788714ac2bdd2255d337:1d3bce294c77797adefb8a602339ff21")"
        #headlines="$(./jq-linux64 '.[] | select(.symbol == "'$symbol'") | .headlines' "$alertsPath"headlines.json)"
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
        if [ "$timeStamp" = "" ]; then timeStamp=0; fi
        if [ "$open" = "null" ]; then open=0; fi
        if [ "$high" = "" ]; then high=0; fi
        if [ "$low" = "" ]; then low=0; fi
        if [ "$volume" = "" ]; then volume=0; fi
        if [ "$avgVol" = "" ]; then avgVol=0; fi
        if [ "$sharesShort" = "null" ]; then sharesShort=0; fi
        if [ "$shortPercent" = "" ]; then shortPercent=0; fi
        if [ "$marketCap" = "" ]; then marketCap=0; fi
        if [ "$float" = "" ]; then float=0; fi

        # Build JSON
        echo '{"list":"Alerts","symbol": "'$symbol'","name": "'$name'","price": '$price',"dollarChange": '$change',"percentChange": '$changePercent',"oneDayNull":"'$oneDayNull'","oneDay": "http://automatedinvestmentresearch.com/'$symbol'-1d.php","oneMonthNull":"'$oneMonthNull'","oneMonth": "http://automatedinvestmentresearch.com/'$symbol'-1mo.php","threeMonthNull":"'$threeMonthNull'","threeMonth": "http://automatedinvestmentresearch.com/'$symbol'-3mo.php","sixMonthNull":"'$sixMonthNull'","sixMonth": "http://automatedinvestmentresearch.com/'$symbol'-6mo.php","oneYearNull":"'$oneYearNull'","oneYear": "http://automatedinvestmentresearch.com/'$symbol'-1yr.php","open": '$open',"high": '$high',"low":'$low',"volume": '$volume',"avgVol": '$avgVol',"sharesShort": '$sharesShort',"shortPercent": '$shortPercent',"marketCap": '$marketCap',"float": '$float',"headlines":'$headlines',"timeStamp": '$timeStamp',"trigger": "'$trigger'","triggerPrice":'$triggerPrice',"alertStatus": "'$alertStatus'"},' >> data.json
        # Copy symbol list for download
        printf $symbol"\n" >> symbols.txt

    done
        # Remove , from json
        sed -i '$ s/.$//' data.json
        echo ']' >> data.json

        # Clean up and prepare data for other scans
        cat data.json > $alertsPath"data.json"
        mv data.json $dePath"alerts-data.json"
        mv symbols.txt $alertsPath"symbols.txt"
        mv alerts.symbols $alertsPath"alerts-symbols"
        cd ~ && rm -rf ~/alerts
}

# Checks to see if alerts.raw has been updated within the last 15 minutes
export -f alerts
find alerts.raw -mmin -14 -exec bash -c 'alerts' {} \;

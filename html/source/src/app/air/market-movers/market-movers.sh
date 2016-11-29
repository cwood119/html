#!/bin/bash

# External programs that are needed for this script to execute properly: jq-linux64, xml2json
# wget https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 &&
# chmod +x jq-linux64
# git clone https://github.com/hay/xml2json.git
# chmod +x xml2json

# Define Variables
pub=~/public_html/
gainersPath=~/public_html/app/app/air/market-movers/data/
dePath=~/public_html/app/app/air/decision-engine/data/
tradierApi=2IigxmuJp1Vzdq6nJKjxXwoXY9D6
date
# Get symbols
curl -u "506540ef71e2788714ac2bdd2255d337:1d3bce294c77797adefb8a602339ff21" "https://api.intrinio.com/securities/search?page_number=1&page_size=500&conditions=open_price~lt~15,open_price~gt~1" > gainers-symbols.json
./jq-linux64 '.data[].ticker' gainers-symbols.json | sed 's/"//g' $1 > gainers-symbols
pages=$(./jq-linux64 '.total_pages' gainers-symbols.json)
for (( i = 2; i <= pages; ++i )) {
    curl -u "506540ef71e2788714ac2bdd2255d337:1d3bce294c77797adefb8a602339ff21" "https://api.intrinio.com/securities/search?page_number=$i&page_size=500&conditions=open_price~lt~15,open_price~gt~1" > gainers-symbols.json
    ./jq-linux64 '.data[].ticker' gainers-symbols.json | sed 's/"//g' $1 >> gainers-symbols
}
rm gainers-symbols.json
cp gainers-symbols gainers-symbols-dynamic && cp gainers-symbols gainers-dynamic

function bulkQuotes {
    # Pull first 100 symbols and place them in a temporary reader file
    scount=$(wc -l< gainers-symbols-dynamic)
    if [[ $scount -lt 100 ]]; then
        sed -n -e '1,'$scount'p' gainers-symbols-dynamic >>  gainers-symbols-reader
    else
        sed -n -e '1,100p' gainers-symbols-dynamic >>  gainers-symbols-reader
    fi
    # Read the reader file and put all symbols on one line for bulk api call
    list=
    cat gainers-symbols-reader | while read line
    do
        list=$list$line","
        echo $list > gainers-symbols-list
    done
    # Remove first 100 symbols from dynamic file
    sed '1,100d' gainers-symbols-dynamic >> gainers-symbols-dynamic-tmp && mv gainers-symbols-dynamic-tmp gainers-symbols-dynamic
    # Remove last , in the line
    sed -i '$ s/.$//' gainers-symbols-list

    rm gainers-symbols-reader
    # Generate the goods
    list=$(cat gainers-symbols-list)

    # Get quote data
echo "vvv Getting quote data vvv"
    data="$(curl -X GET "https://api.tradier.com/v1/markets/quotes?symbols="$list"" -H "Accept: application/json" -H "Authorization: Bearer "$tradierApi"")"
    echo $data > gainers-data.json

    # Get share data
echo "vvv Getting fundamentals data vvv"
    tradierCompanyApi="$(curl -X GET "https://api.tradier.com/beta/markets/fundamentals/company?symbols="$list"" -H "Accept: application/json" -H "Authorization: Bearer "$tradierApi"")"
    echo $tradierCompanyApi > gainers-fundamentals.json
    # Pull first 100 symbols and place them in a temporary reader file
    scount=$(wc -l< gainers-dynamic)
    if [[ $scount -lt 100 ]]; then
        sed -n -e '1,'$scount'p' gainers-dynamic >>  gainers-reader
    else
        sed -n -e '1,100p' gainers-dynamic >>  gainers-reader
    fi
# Remove first 100 symbols from dynamic file
    sed '1,100d' gainers-dynamic >> gainers-dynamic-tmp && mv gainers-dynamic-tmp gainers-dynamic

    jsonIndex=1
    count=$(wc -l< gainers-reader)
        for (( i = 1; i <= count; ++i )) {
            line=
            sed -n $jsonIndex"p" gainers-reader > line
            line=$(cat line)
            jsonIndex=$(($jsonIndex-1))
            # Get price and remove any symbols over $15
            price=$(./jq-linux64 '.quotes.quote['$jsonIndex'].last' gainers-data.json)
            if (( $(echo "$price > 15" | bc -l) )) ; then
                jsonIndex=$(($jsonIndex + 2))
                continue
            else
                changePercent="$(./jq-linux64 '.quotes.quote['$jsonIndex'].change_percentage' gainers-data.json)"
                if (( $(echo "$changePercent < 5" | bc -l) )) ; then
                    jsonIndex=$(($jsonIndex + 2))
                    continue
                else
                    vol="$(./jq-linux64 '.quotes.quote['$jsonIndex'].volume' gainers-data.json)"
                    if (( $(echo "$vol < 250000" | bc -l) )) ; then
                        jsonIndex=$(($jsonIndex + 2))
                        continue
                    else
                        symbol=$(./jq-linux64 '.quotes.quote['$jsonIndex'].symbol' gainers-data.json | sed 's/\"//g')
                        echo $symbol >> market.movers.csv
                        jsonIndex=$(($jsonIndex + 2))
                    fi
                fi
            fi
        }

    # Clean up
    rm line && rm gainers-reader && rm gainers-symbols-list && rm gainers-fundamentals.json
}
# Check if dynamic symbol file is empty.  If not, perform bulkQuotes function
while test -s "gainers-symbols-dynamic"
do
    bulkQuotes
done

# Clean up
rm gainers-data.json && rm gainers-symbols-dynamic && rm gainers-dynamic
wc -l market.movers.csv
# Remove double quotes
sed -i 's/\"//g' market.movers.csv
# Headlines
if test -f "gainers.csv"; then rm "gainers.csv";fi
cat market.movers.csv | while read line
do
 	# Get symbol
	#symbol="$(echo $line | cut --complement -d, -f 2-5)"
        symbol=$(echo $line)
	# Get headlines
	wget "http://finance.yahoo.com/rss/headline?s="$symbol
	mv "headline?s="$symbol $symbol".xml"
	# Convert xml to json
	python xml2json/xml2json.py -t xml2json -o $symbol".json" $symbol".xml" && rm $symbol".xml"
	# Iterate through titles, search for keywords
	success=0
	pass=0
    for (( i = 0; i <= 19; ++i )) {
        title=$(./jq-linux64 '.rss.channel.item['$i'].title' $symbol".json")
        keywords=("Earnings Release" "Financial Results" "4Q profit" "4Q loss" "3Q profit" "3Q loss" "2Q profit" "2Q loss" "1Q profit" "1Q loss"  "Quarterly Report" "Earnings Analysis" "Edited Transcript" "Earnings Call Transcript" "profit forecasts" "Earnings Growth" "Earnings Estimates" "Revenue Beat" "Beats on Revenue" "EPS Beat" "Reports Fiscal Year" "Fiscal Year-End Results" "10Q" "Guidance" "Reports Q4 EPS" "Reports Q3 EPS" "Reports Q2 EPS" "Reports Q1 EPS" "Q4 EPS" "Q3 EPS" "Q2 EPS" "Q1 EPS")

        for ((j = 0; j < ${#keywords[@]}; j++))
        do
            if [[ $title  == *"${keywords[$j]}"* ]] && [[ $title != *"8-K"* ]] ; then
                success=1
            fi
        done
        # If title contains keyword, check date for relevance 
        if [[ $success -eq 1 ]] ; then
            pubDate=$(./jq-linux64 '.rss.channel.item['$i'].pubDate' $symbol".json")
            thisYear=$(date +%Y)
            thisMonth=$(date +%b)
            thisDay=$(date +%d)
            thisDay=$((10#$thisDay))
            lastMonth=$(date --date="$(date +%Y-%m-15) -1 month" +'%b')
            titleDay=$(echo ${pubDate:6:2})
            titleDay=$((10#$titleDay))
            titleMonth=$(echo ${pubDate:8:4})
            titleYear=$(echo ${pubDate:13:4})
            difference=$((thisDay-titleDay))
            (($((10#$difference)) <= -11)) && lastDifference=1 || lastDifference=0
            if [[ $thisMonth == $titleMonth && $thisYear == $titleYear || $lastMonth == $titleMonth && $thisYear == $titleYear ]] ; then
                # If headline date is from last month AND it's within a reasonable number days  
                if [[ $lastMonth == $titleMonth  &&  $lastDifference -eq 1 ]] ; then
                    pass=1
                fi
                # If headline date is from this month AND it's within 15 days
                if [[ $thisMonth == $titleMonth && $((10#$difference)) < 15 ]] ; then
                    pass=1
                fi
            fi
        fi
    }
    if [[ $pass -eq 1 ]] ; then
        echo $line >> gainers.csv
    fi
    rm $symbol".json"
done
rm market.movers.csv && rm gainers-symbols

# Get data for final list
cp gainers.csv gainers-symbols-dynamic && mv gainers.csv gainers-dynamic

function getQuotes {
    # Pull first 100 symbols and place them in a temporary reader file
    scount=$(wc -l< gainers-symbols-dynamic)
    if [[ $scount -lt 100 ]]; then
        sed -n -e '1,'$scount'p' gainers-symbols-dynamic >>  gainers-symbols-reader
    else
        sed -n -e '1,100p' gainers-symbols-dynamic >>  gainers-symbols-reader
    fi
    # Read the reader file and put all symbols on one line for bulk api call
    list=
    cat gainers-symbols-reader | while read line
    do
        list=$list$line","
        echo $list > gainers-symbols-list
    done
    # Remove first 100 symbols from dynamic file
    sed '1,100d' gainers-symbols-dynamic >> gainers-symbols-dynamic-tmp && mv gainers-symbols-dynamic-tmp gainers-symbols-dynamic
    # Remove last , in the line
    sed -i '$ s/.$//' gainers-symbols-list

    rm gainers-symbols-reader
    # Generate the goods
    list=$(cat gainers-symbols-list)

    # Get quote data
echo "vvv Getting final quote data vvv"
    data="$(curl -X GET "https://api.tradier.com/v1/markets/quotes?symbols="$list"" -H "Accept: application/json" -H "Authorization: Bearer "$tradierApi"")"
    echo $data > gainers-data.json

    # Get share data
echo "vvv Getting final fundamentals data vvv"
    tradierCompanyApi="$(curl -X GET "https://api.tradier.com/beta/markets/fundamentals/company?symbols="$list"" -H "Accept: application/json" -H "Authorization: Bearer "$tradierApi"")"
    echo $tradierCompanyApi > gainers-fundamentals.json
    # Pull first 100 symbols and place them in a temporary reader file
    scount=$(wc -l< gainers-dynamic)
    if [[ $scount -lt 100 ]]; then
        sed -n -e '1,'$scount'p' gainers-dynamic >>  gainers-reader
    else
        sed -n -e '1,100p' gainers-dynamic >>  gainers-reader
    fi
# Remove first 100 symbols from dynamic file
    sed '1,100d' gainers-dynamic >> gainers-dynamic-tmp && mv gainers-dynamic-tmp gainers-dynamic

    jsonIndex=1
    count=$(wc -l< gainers-reader)
        for (( i = 1; i <= count; ++i )) {
            line=
            sed -n $jsonIndex"p" gainers-reader > line
            line=$(cat line)
            jsonIndex=$(($jsonIndex-1))
            price=$(./jq-linux64 '.quotes.quote['$jsonIndex'].last' gainers-data.json)
            changePercent="$(./jq-linux64 '.quotes.quote['$jsonIndex'].change_percentage' gainers-data.json)"
            vol="$(./jq-linux64 '.quotes.quote['$jsonIndex'].volume' gainers-data.json)"
            symbol=$(./jq-linux64 '.quotes.quote['$jsonIndex'].symbol' gainers-data.json | sed 's/\"//g')
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
            # Assign quotes data from gainers-data.json file
            company="$(./jq-linux64 '.quotes.quote['$jsonIndex'].description' gainers-data.json)"
            company="$(echo $company | sed 's/,//')"
            change="$(./jq-linux64 '.quotes.quote['$jsonIndex'].change' gainers-data.json)"
            open="$(./jq-linux64 '.quotes.quote['$jsonIndex'].open' gainers-data.json)"
            high="$(./jq-linux64 '.quotes.quote['$jsonIndex'].high' gainers-data.json)"
            low="$(./jq-linux64 '.quotes.quote['$jsonIndex'].low' gainers-data.json)"
            marketCap="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.share_class_profile.market_cap' gainers-fundamentals.json)"
            sharesOutstanding="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.share_class_profile.shares_outstanding' gainers-fundamentals.json)"
            insiderOwnership="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.ownership_summary.insider_shares_owned' gainers-fundamentals.json)"
            shortData="$(curl https://www.quandl.com/api/v3/datasets/SI/"$symbol"_SI.json?api_key=pDqgMz1TxeRQxoExz8VW)"
            short="$(echo $shortData | ./jq-linux64 '.dataset.data[0][1]' $1)"
            float=$((sharesOutstanding-insiderOwnership))
            shortPercent=$(echo $short / $float | bc -l)
            shortPercent=$(echo $shortPercent \* 100 | bc -l | awk '{printf "%f", $0}')

            # Build csv spreadsheet
            echo $symbol","$short","$averageVolume","$company","$price","$change","$changePercent","$open","$high","$low","$vol","$marketCap","$sharesOutstanding","$insiderOwnership","$shortPercent","$float >> market.movers.csv
            jsonIndex=$(($jsonIndex + 2))
        }

    # Clean up
    rm line && rm gainers-reader && rm gainers-symbols-list && rm gainers-fundamentals.json
}
# Check if dynamic symbol file is empty.  If not, perform getQuotes function
while test -s "gainers-symbols-dynamic"
do
    getQuotes
done

# Clean up
rm gainers-data.json && rm gainers-symbols-dynamic && rm gainers-dynamic

# Remove double quotes
sed -i 's/\"//g' market.movers.csv

# Pull headlines and other vitals, then convert to JSON
echo '[' > data.json
touch symbols.txt
cat market.movers.csv | while read line || [ -n "$line" ]
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
    # Get headlines
    headlines="$(curl "https://api.intrinio.com/news?ticker="$symbol"" -u "506540ef71e2788714ac2bdd2255d337:1d3bce294c77797adefb8a602339ff21")"
    #headlines="$(./jq-linux64 '.[] | select(.symbol == "'$symbol'") | .headlines' "$ecalPath"headlines.json)"

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
    if [ "$open" = "" ]; then open=0; fi
    if [ "$high" = "" ]; then high=0; fi
    if [ "$low" = "" ]; then low=0; fi
    if [ "$volume" = "" ]; then volume=0; fi
    if [ "$avgVol" = "" ]; then avgVol=0; fi
    if [ "$sharesShort" = "null" ]; then sharesShort=0; fi
    if [ "$sharesShort" = "" ]; then sharesShort=0; fi
    if [ "$shortPercent" = "" ]; then shortPercent=0; fi
    if [ "$marketCap" = "" ]; then marketCap=0; fi
    if [ "$float" = "" ]; then float=0; fi

    # Build JSON
    echo '{"list":"Market Movers","symbol": "'$symbol'","name": "'$name'","price": '$price',"dollarChange": '$change',"percentChange": '$changePercent',"oneDayNull":"'$oneDayNull'","oneDay": "http://automatedinvestmentresearch.com/'$symbol'-1d.php","oneMonthNull":"'$oneMonthNull'","oneMonth": "http://automatedinvestmentresearch.com/'$symbol'-1mo.php","threeMonthNull":"'$threeMonthNull'","threeMonth": "http://automatedinvestmentresearch.com/'$symbol'-3mo.php","sixMonthNull":"'$sixMonthNull'","sixMonth": "http://automatedinvestmentresearch.com/'$symbol'-6mo.php","oneYearNull":"'$oneYearNull'","oneYear": "http://automatedinvestmentresearch.com/'$symbol'-1yr.php","open": '$open',"high": '$high',"low":'$low',"volume": '$volume',"avgVol": '$avgVol',"sharesShort": '$sharesShort',"shortPercent": '$shortPercent',"marketCap": '$marketCap',"float": '$float',"headlines":'$headlines'},' >> data.json
        # Copy symbol list for download
        printf $symbol"\n" >> symbols.txt

done
# Remove , from json
sed -i '$ s/.$//' data.json
echo ']' >> data.json

# Clean up and prepare data for other scans
cat data.json > $gainersPath"data.json"
mv data.json $dePath"gainers-intraday-data.json"
mv symbols.txt $gainersPath"symbols.txt"
rm market.movers.csv
date

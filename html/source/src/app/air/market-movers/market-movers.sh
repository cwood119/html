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

# Get symbols
curl -u "506540ef71e2788714ac2bdd2255d337:1d3bce294c77797adefb8a602339ff21" "https://api.intrinio.com/securities/search?page_number=1&page_size=500&conditions=open_price~lt~15,open_price~gt~1" > gainers-symbols.json
./jq-linux64 '.data[].ticker' gainers-symbols.json | sed 's/"//g' $1 > gainers-symbols
pages=$(./jq-linux64 '.total_pages' gainers-symbols.json)
# begin loop
for (( i = 2; i <= pages; ++i )) {
    curl -u "506540ef71e2788714ac2bdd2255d337:1d3bce294c77797adefb8a602339ff21" "https://api.intrinio.com/securities/search?page_number=$i&page_size=500&conditions=open_price~lt~15,open_price~gt~1" > gainers-symbols.json
    ./jq-linux64 '.data[].ticker' gainers-symbols.json | sed 's/"//g' $1 >> gainers-symbols
}
# end loop
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

                # Calculate average volume 
#echo "vvv Getting historical data for "$symbol" vvv"
                #historicalData="$(curl -H "Authorization: Bearer "$tradierApi"" https://api.tradier.com/v1/markets/history?symbol="$symbol" -H "Accept: application/json")"
#                historicalDataCheck=$(echo $historicalData | ./jq-linux64 '.history' $1)
#                if [ "$historicalDataCheck" = "null" ]; then
#                    jsonIndex=$(($jsonIndex + 2))
#                    continue
#                 fi
#                volume="$(echo $historicalData | ./jq-linux64 '.history.day[].volume' $1)"
#                volume60=$(echo $volume | tr ' ' '\n' | tail -60)
#                averageVolume="$(echo $volume60 | tr ' ' '\n' | awk '{ sum += $1 } END { if (NR > 0) printf("%f", sum / NR) }')"
#                announce=$(echo $line | cut -d, -f 6)
                # Assign quotes data from gainers-data.json file
#                company="$(./jq-linux64 '.quotes.quote['$jsonIndex'].description' gainers-data.json)"
#                company="$(echo $company | sed 's/,//')"
#                change="$(./jq-linux64 '.quotes.quote['$jsonIndex'].change' gainers-data.json)"
#                open="$(./jq-linux64 '.quotes.quote['$jsonIndex'].open' gainers-data.json)"
#                high="$(./jq-linux64 '.quotes.quote['$jsonIndex'].high' gainers-data.json)"
#                low="$(./jq-linux64 '.quotes.quote['$jsonIndex'].low' gainers-data.json)"
#                marketCap="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.share_class_profile.market_cap' gainers-fundamentals.json)"
#                sharesOutstanding="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.share_class_profile.shares_outstanding' gainers-fundamentals.json)"
#                insiderOwnership="$(./jq-linux64 '.['$jsonIndex'].results[1].tables.ownership_summary.insider_shares_owned' gainers-fundamentals.json)"
#                shortData="$(curl https://www.quandl.com/api/v3/datasets/SI/"$symbol"_SI.json?api_key=pDqgMz1TxeRQxoExz8VW)"
#                short="$(echo $shortData | ./jq-linux64 '.dataset.data[0][1]' $1)"
#                float=$((sharesOutstanding-insiderOwnership))
#                shortPercent=$(echo $short / $float | bc -l)
#                shortPercent=$(echo $shortPercent \* 100 | bc -l | awk '{printf "%f", $0}')

                # Build csv spreadsheet
#                echo $symbol","$short","$averageVolume","$company","$price","$announce","$change","$changePercent","$open","$high","$low","$vol","$marketCap","$sharesOutstanding","$insiderOwnership","$shortPercent","$float >> market.movers.csv
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

# Remove double quotes
sed -i 's/\"//g' market.movers.csv
echo 'VVV Here comes the number of symbols BEFORE headlines VVV'
wc -l market.movers.csv
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


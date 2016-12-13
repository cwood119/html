#!/bin/bash
# 90 Day Earnings Calendar Forecast Data

# Define Variables
pub=~/public_html/
ecalPath=~/public_html/app/app/air/earnings-calendar/data/
dePath=~/public_html/app/app/air/decision-engine/data/
tradierApi=2IigxmuJp1Vzdq6nJKjxXwoXY9D6
day=$(date --date="+2 day" "+%Y%m%d")

# Make temporary directory
mkdir ~/forecast
ls | grep symbol-.*.php | while read file; do cp $file ~/forecast/; done
cp jq-linux64 ~/forecast/ && cp -r xml2json ~/forecast/ && cd ~/forecast

# Pull Earnings Calendar
wget https://www.quandl.com/api/v3/databases/ZEA/download?api_key=pDqgMz1TxeRQxoExz8VW
mv download?api_key=pDqgMz1TxeRQxoExz8VW ZEA.zip && unzip ZEA.zip && rm ZEA.zip
cut --complement -d, -f 2,3-5,7-10,12-15 ZEA-1.csv > ZEA.cut.csv && rm ZEA-1.csv
sed -i '/_/d' ZEA.cut.csv

#Isolate symbols that announce within the next 90 days
for (( i = 90; i >= 0; --i )) {
    day=$(date --date="+$i day" "+%Y%m%d")
    cat ZEA.cut.csv | grep $day | cut -d, -f1 >> forecast-symbols
}
wc -l forecast-symbols
# Isolate symbols
cut -d, -f1 forecast-symbols > ecal-forecast-symbols

# Make a dynamic copy of the symbols file 
cp ecal-forecast-symbols ecal-symbols-dynamic
cp ecal-forecast-symbols tomorrow-dynamic
# Get bulk quote/
function bulkQuotes {

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
    echo $data > ecal-forecast-data.json
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
            price=$(./jq-linux64 '.quotes.quote['$jsonIndex'].last' ecal-forecast-data.json)
            if (( $(echo "$price > 15" | bc -l) )) ; then
                jsonIndex=$(($jsonIndex + 2))
                continue
            fi
            # Remove any symbols under $1
            if (( $(echo "$price < 1" | bc -l) )) ; then
                jsonIndex=$(($jsonIndex + 2))
                continue
            else
                symbol=$(./jq-linux64 '.quotes.quote['$jsonIndex'].symbol' ecal-forecast-data.json | sed 's/\"//g')
                # Build csv spreadsheet
                grep -w $symbol ZEA.cut.csv >> ecal.forecast

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

# Build 90 day forecast file
echo "date,count" > $dePath"ecal-forecast.csv"
for (( i = 90; i >= 0; --i )) {
    day=$(date --date="+$i day" "+%Y%m%d")
    count=$(cat ecal.forecast | grep $day | cut -d, -f2 | wc -l | cut -d' ' -f1)
    echo $day','$count >> $dePath"ecal-forecast.csv"
}

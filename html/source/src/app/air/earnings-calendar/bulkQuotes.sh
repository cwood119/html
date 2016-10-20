#!/bin/bash

# Define Variables
tomorrow=$(date --date="next day" "+%Y%m%d")
#tomorrow=$(date --date="next monday" "+%Y%m%d")
today=`date +%Y-%m-%d`
pub=~/public_html/QuoVadimus/

# Get Nightly Calendar and format
#wget https://www.quandl.com/api/v3/databases/ZEA/download?api_key=pDqgMz1TxeRQxoExz8VW
#mv download?api_key=pDqgMz1TxeRQxoExz8VW ZEA.zip && unzip ZEA.zip && rm ZEA.zip
#cut --complement -d, -f 2,3-5,7-10,12-15 ZEA-1.csv > ZEA.cut.csv && rm ZEA-1.csv
#awk "/$tomorrow/" ZEA.cut.csv > tomorrow.new.csv && rm ZEA.cut.csv
#sed -i 1d tomorrow.new.csv
#sort -t, -k 1,1 tomorrow.new.csv > tomorrow.sorted && rm tomorrow.new.csv
#sed -i '/_/d' tomorrow.sorted

wc -l tomorrow.sorted

# Isolate symbols
cut --complement -d, -f 2-3 tomorrow.sorted > ecal-symbols

# Make a dynamic copy of the symbols file 
cp ecal-symbols ecal-symbols-dynamic
cp tomorrow.sorted tomorrow-dynamic

# Get bulk quotes
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
    data="$(curl -X GET "https://api.tradier.com/v1/markets/quotes?symbols="$list"" -H "Accept: application/json" -H "Authorization: Bearer 2IigxmuJp1Vzdq6nJKjxXwoXY9D6")"
    echo $data > ecal-data.json

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
            price=
            symbol=
            sed -n $jsonIndex"p" tomorrow-reader > line
            line=$(cat line)
            jsonIndex=$(($jsonIndex-1))
            # Pull price and symbol from master symbol list.
            price=$(./jq-linux64 '.quotes.quote['$jsonIndex'].last' ecal-data.json)
            if (( $(echo "$price > 20" | bc -l) )) ; then
                jsonIndex=$(($jsonIndex + 2))
                continue
            else
                symbol=$(./jq-linux64 '.quotes.quote['$jsonIndex'].symbol' ecal-data.json)
                # Build csv spreadsheet
                echo $symbol","$price
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


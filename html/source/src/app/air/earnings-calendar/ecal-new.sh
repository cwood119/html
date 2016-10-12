#!/bin/bash

# Define Variables
tomorrow=$(date --date="next day" "+%Y%m%d")
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
    # Move quotes call to outside the loop, and pull all symbols
    data="$(curl -X GET "https://api.tradier.com/v1/markets/quotes?symbols="$symbol"" -H "Accept: application/json" -H "Authorization: Bearer 2IigxmuJp1Vzdq6nJKjxXwoXY9D6")"	
    price="$(echo $data | ./jq-linux64 '.quotes.quote.last' $1)"
    company="$(echo $data | ./jq-linux64 '.quotes.quote.description' $1)"
    change="$(echo $data | ./jq-linux64 '.quotes.quote.change' $1)"
    changePercent="$(echo $data | ./jq-linux64 '.quotes.quote.change_percentage' $1)"
    open="$(echo $data | ./jq-linux64 '.quotes.quote.open' $1)"
    high="$(echo $data | ./jq-linux64 '.quotes.quote.high' $1)"
    low="$(echo $data | ./jq-linux64 '.quotes.quote.low' $1)"
    vol="$(echo $data | ./jq-linux64 '.quotes.quote.volume' $1)"
    # Get average volume 
    volume="$(echo $historicalData | ./jq-linux64 '.history.day[].volume' $1)"
    volume60=$(echo $volume | tr ' ' '\n' | tail -60)
    averageVolume="$(echo $volume60 | tr ' ' '\n' | awk '{ sum += $1 } END { if (NR > 0) printf("%f", sum / NR) }')"
    # Get shares short
    shortData="$(curl https://www.quandl.com/api/v3/datasets/SI/"$symbol"_SI.json?api_key=pDqgMz1TxeRQxoExz8VW)"
    short="$(echo $shortData | ./jq-linux64 '.dataset.data[0][1]' $1)"
    # Get market cap
    marketCap="test"
    echo $symbol","$short","$averageVolume","$company","$price","$announce","$change","$changePercent","$open","$high","$low","$vol","$marketCap >> tomorrow.new.csv
done

# Remove double quotes
sed -i 's/\"//g' tomorrow.new.csv

# Filter by price
sed -i '1i Symbol,Short,ADV,Name,Price,Time' tomorrow.new.csv
awk -F, 'NR == 1 { for(i = 1; i <= NF; ++i) { col[$i] = i }; next } $col["Price"] < 20' tomorrow.new.csv > tomorrow.price.csv
sed -i '1i Symbol,Price,Date,Time' $pub"filterOne.csv"
awk -F, 'NR == 1 { for(i = 1; i <= NF; ++i) { col[$i] = i }; next } $col["Price"] > 1' tomorrow.price.csv > tomorrow.new.csv

# Clean up
rm tomorrow.sorted && rm tomorrow.price.csv

# Pull headlines and other vitals, then convert to JSON
echo '{"symbol":{' > data.json
cat tomorrow.new.csv | while read line || [ -n "$line" ]
do
    # Define variables for symbol card and vitals
    symbol="$(echo $line | cut -d, -f 1)"
    sharesShort="$(echo $line | cut -d, -f 2)"
    avgVol="$(echo $line | cut -d, -f 3)"
    name="$(echo $line | cut -d, -f 4)"
    price="$(echo $line | cut -d, -f 5)"
    announce="$(echo $line | cut -d, -f 6)"
    change="$(echo $line | cut -d, -f 7)"
    changePercent="$(echo $line | cut -d, -f 8)"
    open="$(echo $line | cut -d, -f 9)"
    high="$(echo $line | cut -d, -f 10)"
    low="$(echo $line | cut -d, -f 11)"
    volume="$(echo $line | cut -d, -f 12)"
    marketCap="$(echo $line | cut -d, -f 13)"
    # Get headlines
    headlines="$(curl "https://api.intrinio.com/news?ticker="$symbol"" -u "506540ef71e2788714ac2bdd2255d337:1d3bce294c77797adefb8a602339ff21")"
    # Build JSON
echo '"'$symbol'": {"stats": {"symbol": "'$symbol'","name": "'$name'","price": "'$price'","dollarChange": "'$change'","percentChange": "'$changePercent'"},"charts": {"1D": "http://automatedinvestmentresearch.com/BBRY.php","1M": "http://automatedinvestmentresearch.com/BBRY.php","3M": "http://automatedinvestmentresearch.com/BBRY.php","6M": "http://automatedinvestmentresearch.com/BBRY.php","1YR": "http://automatedinvestmentresearch.com/BBRY.php"},"vitals": {"open": "'$open'","dayRange": "'$low' - '$high'","volume": "'$volume'","avgVol": "'$avgVol'","sharesShort": "'$sharesShort'","shortPercent": "4.92%","marketCap": "'$marketCap'","float": "522.37M"},"headlines":'$headlines'},' >> data.json
done
sed -i '$ s/.$//' data.json
echo '}}' >> data.json


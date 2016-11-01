#!/bin/bash
# Pre-market earnings calendar scanner

# Define Variables
ecalPath=/var/www/html/source/src/app/air/earnings-calendar/data/
tradierApi=2IigxmuJp1Vzdq6nJKjxXwoXY9D6
yesterday=$(date --date="yesterday" "+%m/%d/%Y")
regularHoursClose=15:55
afterHoursClose=20:00
afterHoursEpoch=$(date -d "$yesterday $afterHoursClose" +%s)
regularHoursEpoch=$(date -d "$yesterday $regularHoursClose" +%s)
PIDFILE=~/ecalPre.pid

function ecalPre {
# Iterate through symbols and request pre market price
#
echo '[' > data.json
cat $ecalPath"ecal-daily-symbols" | while read line || [ -n "$line" ]
do
    # Define variables for symbol card and vitals
    symbol="$(echo $line | cut -d, -f 1)"
    sharesShort="$(echo $line | cut -d, -f 2)"
    avgVol="$(echo $line | cut -d, -f 3)"
    name="$(echo $line | cut -d, -f 4)"
    name="$(echo $name | cut -c1-20)"
    price="$(echo $line | cut -d, -f 5)"
    time="$(echo $line | cut -d, -f 6)"
    #change="$(echo $line | cut -d, -f 7)"
    #changePercent="$(echo $line | cut -d, -f 8)"
    open="$(echo $line | cut -d, -f 9)"
    high="$(echo $line | cut -d, -f 10)"
    low="$(echo $line | cut -d, -f 11)"
    volume="$(echo $line | cut -d, -f 12)"
    marketCap="$(echo $line | cut -d, -f 13)"
    sharesOutstanding="$(echo $line | cut -d, -f 14)"
    insiderOwnership="$(echo $line | cut -d, -f 15)"
    shortPercent="$(echo $line | cut -d, -f 16)"
    float="$(echo $line | cut -d, -f 17)"
 
    # Get time and sales data for yesterday and this morning
    curl -H "Authorization: Bearer "$tradierApi"" -H "Accept: application/json" "https://api.tradier.com/v1/markets/timesales?symbol="$symbol"&interval=5min" > $symbol"-1d.json"
    # Get pre market price 
    prePrice=$(./jq-linux64 '.series.data[-1].price' $symbol"-1d.json")    
    preTimestamp=$(./jq-linux64 '.series.data[-1].timestamp' $symbol"-1d.json")  
    # If the last tick price was later (in epoch time) than the close of after hours, it's a pre-market tick.
    if [[ $preTimestamp -gt $afterHoursEpoch ]] ; then
        if (( $(echo "$prePrice > $price" | bc -l) )) ; then
            # Calculate percent change
            change=$(echo $prePrice - $price | bc | awk '{printf "%f", $0}')
            percentCalc=$(echo $change / $price | bc -l)
            changePercent=$(echo $percentCalc \* 100 | bc -l) 
            # Get headlines
            headlines="$(curl "https://api.intrinio.com/news?ticker="$symbol"" -u "506540ef71e2788714ac2bdd2255d337:1d3bce294c77797adefb8a602339ff21")"

            # Check for nulls and replace with 0
            if [ "$prePrice" = "" ]; then prePrice=0; fi
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
            echo '{"symbol": "'$symbol'","name": "'$name'","price": '$prePrice',"dollarChange": '$change',"percentChange": '$changePercent',"time":'$time',"oneDay": "http://localhost/source/src/app/air/earnings-calendar/data/charts/'$symbol'-1d.php","oneMonth": "http://localhost/source/src/app/air/earnings-calendar/data/charts/'$symbol'-1mo.php","threeMonth": "http://localhost/source/src/app/air/earnings-calendar/data/charts/'$symbol'-3mo.php","sixMonth": "http://localhost/source/src/app/air/earnings-calendar/data/charts/'$symbol'-6mo.php","oneYear": "http://localhost/source/src/app/air/earnings-calendar/data/charts/'$symbol'-1yr.php","open": '$open',"high": '$high',"low":'$low',"volume": '$volume',"avgVol": '$avgVol',"sharesShort": '$sharesShort',"shortPercent": '$shortPercent',"marketCap": '$marketCap',"float": '$float',"headlines":'$headlines'},' >> data.json
        fi
    fi
done
# Remove , from json
sed -i '$ s/.$//' data.json
echo ']' >> data.json

# Clean up and prepare data for other scans
cp data.json /var/www/html/source/src/app/air/decision-engine/data/ecal-pre-data.json
mv data.json /var/www/html/source/src/app/air/earnings-calendar/data/
}
if [ -f $PIDFILE ]
then
  PID=$(cat $PIDFILE)
  ps -p $PID > /dev/null 2>&1
  if [ $? -eq 0 ]
  then
    echo "Ecal After is already running"
    exit 1
  else
    # Process not found assume not running
    echo $$ > $PIDFILE
    if [ $? -ne 0 ]
    then
      echo "Could not create PID file"
      exit 1
    fi
    ecalAfter
  fi
else
  echo $$ > $PIDFILE
  if [ $? -ne 0 ]
  then
    echo "Could not create PID file"
    exit 1
  fi
fi


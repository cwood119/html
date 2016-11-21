#!/bin/bash
# Get intraday headlines

# Define Variables
ecalPath=~/public_html/app/app/air/earnings-calendar/data/
PIDFILE=~/headlines.pid

# Echo number of symbols for debugging and information purposes
wc -l $ecalPath"ecal-daily-symbols"

# Iterate through symbols and request headlines
echo '[' > headlines.json
cat $ecalPath"ecal-daily-symbols" | while read line || [ -n "$line" ]
do
    symbol="$(echo $line | cut -d, -f 1)"
 
    # Get headlines
    headlines="$(curl "https://api.intrinio.com/news?ticker="$symbol"" -u "506540ef71e2788714ac2bdd2255d337:1d3bce294c77797adefb8a602339ff21")"

    # Build JSON
    echo '{"symbol": "'$symbol'","headlines":'$headlines'},' >> headlines.json
done
# Remove , from json
sed -i '$ s/.$//' headlines.json
echo ']' >> headlines.json

# Clean up and prepare data for other scans
mv headlines.json $ecalPath

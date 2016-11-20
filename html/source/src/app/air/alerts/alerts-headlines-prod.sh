#!/bin/bash
# Get alerts headlines

# Define Variables
alertsPath=~/public_html/app/app/air/alerts/data/

# Echo number of symbols for debugging and information purposes
wc -l $alertsPath"alerts-symbols"
# Make temporary alerts directory
mkdir ~/alerts-headlines && cd ~/alerts-headlines
  
# Iterate through symbols and request headlines
echo '[' > headlines.json
cat $alertsPath"alerts-symbols" | while read line || [ -n "$line" ]
do
    symbol="$(echo $line)"
    # Get headlines
    headlines="$(curl "https://api.intrinio.com/news?ticker="$symbol"" -u "506540ef71e2788714ac2bdd2255d337:1d3bce294c77797adefb8a602339ff21")"

    # Build JSON
    echo '{"symbol": "'$symbol'","headlines":'$headlines'},' >> headlines.json
done
# Remove , from json
sed -i '$ s/.$//' headlines.json
echo ']' >> headlines.json

mv headlines.json $alertsPath
rm -rf ~/alerts-headlines

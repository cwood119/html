#!/bin/bash
# Get watchlist headlines

# Define Variables
watchlistPath=~/public_html/app/app/air/watchlist/data/

# Make temporary directory
if [ -d ~/watchlist/ ]; then rm -rf ~/watchlist; fi
mkdir ~/watchlist
ls | grep symbol-.*.php | while read file; do cp $file ~/watchlist/; done
cp jq-linux64 ~/watchlist/ && cp -r xml2json ~/watchlist/ && cd ~/watchlist

# Echo number of symbols for debugging and information purposes
wc -l $watchlistPath"symbols.txt"

# Iterate through symbols and request headlines
echo '[' > headlines.json
cat $watchlistPath"symbols.txt" | while read line || [ -n "$line" ]
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
mv headlines.json $watchlistPath

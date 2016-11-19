#!/bin/bash
# Get watchlist headlines

# Define Variables
watchlistPath=~/public_html/app/app/air/watchlist/data/

# Echo number of symbols for debugging and information purposes
wc -l $watchlistPath"watchlist-symbols"
# Make temporary watchlist directory
mkdir ~/watchlist-headlines && cd ~/watchlist-headlines
  
# Iterate through symbols and request headlines
echo '[' > headlines.json
cat $watchlistPath"watchlist-symbols" | while read line || [ -n "$line" ]
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

mv headlines.json $watchlistPath
rm -rf ~/watchlist-headlines

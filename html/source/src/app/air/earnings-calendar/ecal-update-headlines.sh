#!/bin/bash
# Get intraday headlines

# Define Variables
ecalPath=/var/www/html/source/src/app/air/earnings-calendar/data/
PIDFILE=~/headlines.pid

# Echo number of symbols for debugging and information purposes
wc -l $ecalPath"ecal-daily-symbols"

function headlines {
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
mv headlines.json /var/www/html/source/src/app/air/earnings-calendar/data/
}
if [ -f $PIDFILE ]
then
  PID=$(cat $PIDFILE)
  ps -p $PID > /dev/null 2>&1
  if [ $? -eq 0 ]
  then
    echo "Headline script is already running"
    exit 1
  else
    # Process not found assume not running
    echo $$ > $PIDFILE
    if [ $? -ne 0 ]
    then
      echo "Could not create PID file"
      exit 1
    fi
    headlines
  fi
else
  echo $$ > $PIDFILE
  if [ $? -ne 0 ]
  then
    echo "Could not create PID file"
    exit 1
  fi
fi


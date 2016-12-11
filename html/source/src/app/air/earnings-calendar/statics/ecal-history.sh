#!/bin/bash
# 30 Day Earnings Calendar Historical Data

# Define Variables
pub=~/public_html/
ecalPath=~/public_html/app/app/air/earnings-calendar/data/
dePath=~/public_html/app/app/air/decision-engine/data/
today=$(date --date="today" "+%Y%m%d")

echo "date,count" > ecal-history.csv
for (( i = 0; i <= 30; ++i )) {
    day=$(date --date="$i day ago" "+%Y%m%d")
    count=$(cat tomorrow-db.csv | grep $day | cut -d, -f7 | wc -l | cut -d' ' -f1)
    echo $day','$count >> ecal-history.csv
}


#!/bin/bash
# 30 Day Earnings Calendar Historical Data

# Define Variables
pub=~/public_html/
ecalPath=~/public_html/app/app/air/earnings-calendar/data/
dePath=~/public_html/app/app/air/decision-engine/data/
today=$(date --date="today" "+%Y%m%d")

# Build 90 day history file
echo "date,count" > $dePath"ecal-history.csv"
for (( i = 0; i <= 90; ++i )) {
    day=$(date --date="$i day ago" "+%Y%m%d")
    count=$(cat tomorrow-db.csv | grep $day | cut -d, -f7 | wc -l | cut -d' ' -f1)
    echo $day','$count >> $dePath"ecal-history.csv"
}


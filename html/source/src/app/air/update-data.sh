#!/bin/bash

# Update decision engine data
cd /var/www/html/source/src/app/air/decision-engine/data/ && rm *.json && rm *.csv
wget http://automatedinvestmentresearch.com/app/app/air/decision-engine/data/ecal-forecast.csv
wget http://automatedinvestmentresearch.com/app/app/air/decision-engine/data/ecal-history.csv
wget http://automatedinvestmentresearch.com/app/app/air/decision-engine/data/ecal-after-data.json
wget http://automatedinvestmentresearch.com/app/app/air/decision-engine/data/ecal-pre-data.json
wget http://automatedinvestmentresearch.com/app/app/air/decision-engine/data/ecal-daily-data.json
wget http://automatedinvestmentresearch.com/app/app/air/decision-engine/data/gainers-intraday-data.json
wget http://automatedinvestmentresearch.com/app/app/air/decision-engine/data/ecal-intraday-data.json

# Update earnings calendar data
cd /var/www/html/source/src/app/air/earnings-calendar/data/ && rm *.json && rm symbols.txt
wget http://automatedinvestmentresearch.com/app/app/air/earnings-calendar/data/data.json
wget http://automatedinvestmentresearch.com/app/app/air/earnings-calendar/data/symbols.txt

# Update market-movers data
cd /var/www/html/source/src/app/air/market-movers/data/ && rm *.json && rm symbols.txt
wget http://automatedinvestmentresearch.com/app/app/air/market-movers/data/data.json
wget http://automatedinvestmentresearch.com/app/app/air/market-movers/data/symbols.txt

# Update alerts data
cd /var/www/html/source/src/app/air/alerts/data/ && rm *.json && rm symbols.txt
wget http://automatedinvestmentresearch.com/app/app/air/alerts/data/data.json
wget http://automatedinvestmentresearch.com/app/app/air/alerts/data/symbols.txt

# Update watchlist data
cd /var/www/html/source/src/app/air/watchlist/data/ && rm *.json && rm symbols.txt
wget http://automatedinvestmentresearch.com/app/app/air/watchlist/data/data.json
wget http://automatedinvestmentresearch.com/app/app/air/watchlist/data/symbols.txt

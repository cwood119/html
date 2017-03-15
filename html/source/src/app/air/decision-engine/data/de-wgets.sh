#!/bin/bash
rm *.json
cat wgets | while read file; do wget $file; done

<?php
# PHPlot Example: OHLC (Financial) plot, Candlesticks plot, using
# external data file, data-data format with date-formatted labels.
define('DATAFILE', 'MRTN-3mo.csv'); // External data file
require_once '/usr/local/share/php/phplot.php';

/*
  Read historical price data from a CSV data downloaded from Yahoo! Finance.
  The first line is a header which must contain: Date,Open,High,Low,Close[...]
  Each additional line has a date (YYYY-MM-DD), then 4 price values.
  Convert to PHPlot data-data data array with empty labels and time_t X
  values and return the data array.
*/
function read_prices_data_data($filename)
{
    $f = fopen($filename, 'r');
    if (!$f) {
        fwrite(STDERR, "Failed to open data file: $filename\n");
        return FALSE;
    }
    // Read and check the file header.
    $row = fgetcsv($f);
    if ($row === FALSE || $row[0] != 'Date' || $row[1] != 'Open'
            || $row[2] != 'High' || $row[3] != 'Low' || $row[4] != 'Close') {
        fwrite(STDERR, "Incorrect header in: $filename\n");
        return FALSE;
    }
    // Read the rest of the file and convert.
    while ($d = fgetcsv($f)) {
        $data[] = array('', strtotime($d[0]), $d[1], $d[2], $d[3], $d[4]);
    }
    fclose($f);
    return $data;
}



$plot = new PHPlot(530, 250);
$plot->SetDrawDashedGrid(false);
$plot->SetGridColor('#F2F2F2');
$plot->SetLightGridColor('#F2F2F2');
$plot->SetTickColor('white');
$plot->SetTickLabelColor('#778899');
$plot->SetYTickLabelPos(plotright);
$plot->SetImageBorderType('none');
//$plot->SetTitle("Candlesticks Financial Plot (data-data)\nMSFT Q1 2009");
$plot->SetDataType('data-data');
$plot->SetDataValues(read_prices_data_data(DATAFILE));
$plot->SetPlotType('candlesticks');
$plot->SetDataColors(array('#396a93', '#4682B4', '#396a93', '#4682B4'));
$plot->SetXLabelAngle(0);
$plot->SetXLabelType('time', '%b %d');
//$plot->SetXTickIncrement(7*24*60*60); // 1 week interval
$plot->SetXTickIncrement(14*24*60*60); // 2 week interval
if (method_exists($plot, 'TuneYAutoRange'))
    $plot->TuneYAutoRange(0); // Suppress Y zero magnet (PHPlot >= 6.0.0)
$plot->DrawGraph();

<?php
require 'Slim/Slim.php';
require 'mysql.php';

 \Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();


// all responses are in json
$app->response->headers->set('Content-Type', 'application/json');

// all requests are in json - add this so we dont have to json_decode everything
$app->request->headers->set('Content-Type', 'application/json');
$app->add(new \Slim\Middleware\ContentTypes());

// Endpoints
$app->map('/', function() use($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');
})->via('GET', 'POST');

$app->get('/ecal', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $ecal = get_ecal();
    if (null !== $ecal) {
        $app->response->setStatus(200);
        echo json_encode($ecal);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/ecalArchive', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $ecalArchive = get_ecalArchive();
    if (null !== $ecalArchive) {
        $app->response->setStatus(200);
        echo json_encode($ecalArchive);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/ecalUpdate', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $ecalUpdate = get_ecalUpdate();
    if (null !== $ecalUpdate) {
        $app->response->setStatus(200);
        echo json_encode($ecalUpdate);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/ecalUpdateSnapshot/:date', function ($date) use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');
    
    $ecalUpdateSnapshot = get_ecalUpdateSnapshot($date);
    if (null !== $date) {
        $app->response->setStatus(200);
        echo json_encode($ecalUpdateSnapshot);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/ecalPre', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $ecalPre = get_ecalPre();
    if (null !== $ecalPre) {
        $app->response->setStatus(200);
        echo json_encode($ecalPre);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/ecalPreUpdate', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $ecalPreUpdate = get_ecalPreUpdate();
    if (null !== $ecalPreUpdate) {
        $app->response->setStatus(200);
        echo json_encode($ecalPreUpdate);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/ecalAfter', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $ecalAfter = get_ecalAfter();
    if (null !== $ecalAfter) {
        $app->response->setStatus(200);
        echo json_encode($ecalAfter);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/ecalFuture', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $ecalFuture = get_ecalFuture();
    if (null !== $ecalFuture) {
        $app->response->setStatus(200);
        echo json_encode($ecalFuture);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/ecalForecast', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $ecalForecast = get_ecalForecast();
    if (null !== $ecalForecast) {
        $app->response->setStatus(200);
        echo json_encode($ecalForecast);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/ecalTracker', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $ecalTracker = get_ecalTracker();
    if (null !== $ecalTracker) {
        $app->response->setStatus(200);
        echo json_encode($ecalTracker);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/ecalNext', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $ecalNext = get_ecalNext();
    if (null !== $ecalNext) {
        $app->response->setStatus(200);
        echo json_encode($ecalNext);
    } else {
        $app->response->setStatus(401);
    }
});


$app->get('/gainers', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $gainers = get_gainers();
    if (null !== $gainers) {
        $app->response->setStatus(200);
        echo json_encode($gainers);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/gainersExtended', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $gainersExtended = get_gainersExtended();
    if (null !== $gainersExtended) {
        $app->response->setStatus(200);
        echo json_encode($gainersExtended);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/alerts', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $alerts = get_alerts();
    if (null !== $alerts) {
        $app->response->setStatus(200);
        echo json_encode($alerts);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/watchlist', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $watchlist = get_watchlist();
    if (null !== $watchlist) {
        $app->response->setStatus(200);
        echo json_encode($watchlist);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/when/:symbol', function ($symbol) use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');
    $when = get_when($symbol);
    if (null !== $when) {
        $app->response->setStatus(200);
        echo json_encode($when);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/ecalYear/:year', function ($year) use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $ecalYear = get_ecalYear($year);
    if (null !== $year) {
        $app->response->setStatus(200);
        echo json_encode($ecalYear);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/ecalFrom/:start/:end', function ($start,$end) use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $ecalFrom = get_ecalFrom($start,$end);
    if (null !== $start && null !== $end) {
        $app->response->setStatus(200);
        echo json_encode($ecalFrom);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/lookback', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $lookback = get_lookback();
    if (null !== $lookback) {
        $app->response->setStatus(200);
        echo json_encode($lookback);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/heatmap', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $heatmap = get_heatmap();
    if (null !== $heatmap) {
        $app->response->setStatus(200);
        echo json_encode($heatmap);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/winners', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $winners = get_winners();
    if (null !== $winners) {
        $app->response->setStatus(200);
        echo json_encode($winners);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/earningsDay/:symbol', function ($symbol) use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');
    $earningsDay = get_earningsDay($symbol);
    if (null !== $earningsDay) {
        $app->response->setStatus(200);
        echo json_encode($earningsDay);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/gapUpAndFade', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $gapUpAndFade = get_gapUpAndFade();
    if (null !== $gapUpAndFade) {
        $app->response->setStatus(200);
        echo json_encode($gapUpAndFade);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/gapperWinners', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $gapperWinners = get_gapperWinners();
    if (null !== $gapperWinners) {
        $app->response->setStatus(200);
        echo json_encode($gapperWinners);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/bullishEarningsDayReversal', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $bullishEarningsDayReversal = get_bullishEarningsDayReversal();
    if (null !== $bullishEarningsDayReversal) {
        $app->response->setStatus(200);
        echo json_encode($bullishEarningsDayReversal);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/earningsTomorrow', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $earningsTomorrow = get_earningsTomorrow();
    if (null !== $earningsTomorrow) {
        $app->response->setStatus(200);
        echo json_encode($earningsTomorrow);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/symbolLists', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $symbolLists = get_symbolLists();
    if (null !== $symbolLists) {
        $app->response->setStatus(200);
        echo json_encode($symbolLists);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/indices', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $indices = get_indices();
    if (null !== $indices) {
        $app->response->setStatus(200);
        echo json_encode($indices);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/lastAnnouncement/:symbol', function ($symbol) use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');
    $lastAnnouncement = get_lastAnnouncement($symbol);
    if (null !== $lastAnnouncement) {
        $app->response->setStatus(200);
        echo json_encode($lastAnnouncement);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/nextAnnouncement/:symbol', function ($symbol) use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');
    $nextAnnouncement = get_nextAnnouncement($symbol);
    if (null !== $nextAnnouncement) {
        $app->response->setStatus(200);
        echo json_encode($nextAnnouncement);
    } else {
        $app->response->setStatus(401);
    }
});

// Data Functions
function get_ecal() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM earnings_calendar_latest')->fetchAll();
    return $data;
}
function get_ecalArchive() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM earnings_calendar_archive ORDER BY DATE ASC')->fetchAll();
    return $data;
}

function get_ecalUpdate() {

    $pdo = connect_to_db();
    $today = date('l');

    if ($today != 'Saturday' || $today != 'Sunday' ) { $data = $pdo->query('SELECT * FROM earnings_calendar_latest WHERE announce IN (2,3,4) UNION SELECT * FROM earnings_calendar_archive WHERE date = subdate(current_date,1) AND announce = 1;')->fetchAll(); }

    if ( $today == 'Saturday' ) { $data = $pdo->query('SELECT * FROM earnings_calendar_latest WHERE announce IN (2,3,4) UNION SELECT * FROM earnings_calendar_archive WHERE date = subdate(current_date,2) AND announce = 1;')->fetchAll(); }

    if ( $today == 'Sunday' ) { $data = $pdo->query('SELECT * FROM earnings_calendar_latest WHERE announce IN (2,3,4) UNION SELECT * FROM earnings_calendar_archive WHERE date = subdate(current_date,3) AND announce = 1;')->fetchAll(); }
    return $data;

}

function get_ecalUpdateSnapshot($d) {

    $day = date('l',strtotime($d));
    $pdo = connect_to_db();

    if ($day != 'Saturday' || $day != 'Sunday' || $day != 'Monday') {$sth = $pdo->prepare('SELECT * FROM earnings_calendar_archive WHERE date = ? AND announce IN (2,3,4) OR date = subdate(?,1) AND announce = 1;'); }
    if ($day == 'Saturday') {$sth = $pdo->prepare('SELECT * FROM earnings_calendar_archive WHERE date = subdate(?,1) AND announce IN (2,3,4) OR date = subdate(?,2) AND announce = 1;'); }
    if ($day == 'Sunday') {$sth = $pdo->prepare('SELECT * FROM earnings_calendar_archive WHERE date = subdate(?,2) AND announce IN (2,3,4) OR date = subdate(?,3) AND announce = 1;'); }
    if ($day == 'Monday') {$sth = $pdo->prepare('SELECT * FROM earnings_calendar_archive WHERE date = ? AND announce IN (2,3,4) OR date = subdate(?,3) AND announce = 1;'); }
    
    $sth->bindParam(1, $d, PDO::PARAM_STR, 12);
    $sth->bindParam(2, $d, PDO::PARAM_STR, 12);
    $sth->execute();
    $data = $sth->fetchAll();
    return $data;

}

function get_ecalFuture() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM ecal_future;')->fetchAll();
    return $data;
}

function get_ecalForecast() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT DATE_FORMAT(qrOne,"%Y-%m-%d") as date,count(*) as count FROM `ecal_future` WHERE qrOne < adddate(CURRENT_DATE,90) AND qrOne > CURRENT_DATE GROUP BY qrOne ORDER BY `date` ASC;')->fetchAll();
    return $data;
}

function get_ecalTracker() {
    $pdo = connect_to_db();    
    //$data = $pdo->query('SELECT * FROM ecal_tracker WHERE erOpen != 0  ORDER BY date ASC;')->fetchAll();
    $data = $pdo->query('SELECT * FROM ecal_tracker WHERE erOpen != 0;')->fetchAll();
    return $data;
}

function get_ecalPreUpdate() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM earnings_calendar_latest WHERE announce IN (2,3,4) UNION SELECT * FROM earnings_calendar_archive WHERE date = subdate(current_date,1) AND announce = 1;')->fetchAll();
    return $data;
}

function get_ecalPre() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM ecal_pre WHERE price != 0 AND pp != 0')->fetchAll();
    return $data;
}

function get_ecalNext() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM ecal_next')->fetchAll();
    return $data;
}

function get_ecalAfter() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM ecal_after WHERE price != 0 AND ap != 0')->fetchAll();
    return $data;
}

function get_gainers() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM market_movers_latest')->fetchAll();
    return $data;
}

function get_gainersExtended() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM movers_extended_latest')->fetchAll();
    return $data;
}

function get_alerts() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM alerts_latest')->fetchAll();
    return $data;
}

function get_watchlist() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM watchlist_latest')->fetchAll();
    return $data;
}

function get_when($symbol) {
    $pdo = connect_to_db();    
    $sth = $pdo->prepare('SELECT symbol, announce, date FROM earnings_calendar_archive WHERE symbol = ? ORDER BY DATE DESC LIMIT 1');
    $sth->bindParam(1, $symbol, PDO::PARAM_STR, 12);
    $sth->execute();
    $data = $sth->fetchAll();
    //$data = $pdo->query('SELECT announce, date FROM earnings_calendar_archive WHERE symbol = "'.$symbol.'" ORDER BY DATE DESC LIMIT 1')->fetchAll();
    return $data;
}

function get_ecalYear($year) {
    $pdo = connect_to_db();    
    $sth = $pdo->prepare('SELECT symbol, announce, avgVol, date FROM earnings_calendar_archive WHERE date LIKE ? ORDER BY date ASC');
    $year = '%'.$year.'%';
    $sth->bindParam(1, $year, PDO::PARAM_STR, 12);
    $sth->execute();
    $data = $sth->fetchAll();
    return $data;
}

function get_ecalFrom($start,$end) {
    $pdo = connect_to_db();

    $sth = $pdo->prepare('
        SELECT max(id) as id, symbol, announce, avgVol, max(`earnings_calendar_archive`.`date`) as date FROM earnings_calendar_archive WHERE date BETWEEN ? AND ? GROUP BY symbol, month(`earnings_calendar_archive`.`date`) ORDER BY date ASC
    ');
    $sth->bindParam(1, $start, PDO::PARAM_STR, 12);
    $sth->bindParam(2, $end, PDO::PARAM_STR, 12);
    $sth->execute();
    $data = $sth->fetchAll();
    return $data;
}


function get_lookback() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT date,count(*) as count FROM `earnings_calendar_archive` WHERE date BETWEEN CURDATE() - INTERVAL 90 DAY AND CURDATE() GROUP BY date')->fetchAll();
    return $data;
}

function get_heatmap() {
  $pdo = connect_to_db();    
  $data = $pdo->query('SELECT date,count(*) as count FROM `earnings_calendar_archive` WHERE date BETWEEN DATE_FORMAT(CURDATE(), "%Y-%m-01") - INTERVAL 2 MONTH AND CURDATE() GROUP BY date UNION SELECT DATE_FORMAT(qrOne,"%Y-%m-%d") as date,count(*) as count FROM `ecal_future` WHERE qrOne BETWEEN DATE_FORMAT(NOW() ,"%Y-%m-01") AND LAST_DAY(DATE_ADD(NOW(), INTERVAL 2 MONTH)) GROUP BY qrOne ORDER BY `date` ASC')->fetchAll();
  return $data;
}

function get_winners() {
  $pdo = connect_to_db();    
  $data = $pdo->query('SELECT max(archiveId) as id, symbol, max(date) as date, percentChange, avgVol FROM winners GROUP BY symbol, month(date) ORDER BY date ASC')->fetchAll();
  return $data;
}

function get_earningsDay($symbol) {
    $pdo = connect_to_db();    
    $sth = $pdo->prepare('SELECT * FROM `earnings_announcements` WHERE symbol = ?');
    $sth->bindParam(1, $symbol, PDO::PARAM_STR, 12);
    $sth->execute();
    $data = $sth->fetchAll();
    return $data;
}

function get_gapUpAndFade() {
    $pdo = connect_to_db();
    $data = $pdo->query('SELECT *, ((earningsDayOpen - prevDayClose)/prevDayClose)*100 as earningsDayOpenPercentChange FROM `earnings_announcements` HAVING earningsDayOpenPercentChange >= 5 AND earningsDayPercentChange < 0')->fetchAll();
    return $data;
}

function get_gapperWinners() {
    $pdo = connect_to_db();
    $data = $pdo->query('SELECT *,  ((earningsDayOpen - prevDayClose)/prevDayClose)*100 as earningsDayOpenPercentChange FROM `earnings_announcements` HAVING earningsDayOpenPercentChange >= 5 AND earningsDayPercentChange > earningsDayOpenPercentChange')->fetchAll();
    return $data;
}

function get_bullishEarningsDayReversal() {
    $pdo = connect_to_db();
    $data = $pdo->query('SELECT *,  ((earningsDayOpen - prevDayClose)/prevDayClose)*100 as earningsDayOpenPercentChange FROM `earnings_announcements` HAVING earningsDayOpenPercentChange < 0 AND earningsDayPercentChange > 0')->fetchAll();
    return $data;
}

function get_earningsTomorrow() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM earnings_tomorrow')->fetchAll();
    return $data;
}

function get_symbolLists() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM symbol_lists')->fetchAll();
    return $data;
}

function get_indices() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM indices')->fetchAll();
    return $data;
}

function get_lastAnnouncement($symbol) {
    $pdo = connect_to_db();    
    $sth = $pdo->prepare('SELECT * FROM `earnings_announcements` WHERE symbol = ? ORDER BY earningsDate desc LIMIT 1');
    $sth->bindParam(1, $symbol, PDO::PARAM_STR, 12);
    $sth->execute();
    $data = $sth->fetchAll();
    return $data;
}

function get_nextAnnouncement($symbol) {
    $pdo = connect_to_db();    
    $sth = $pdo->prepare('SELECT id, symbol, announce as earningsTime, LEAST( IF(qrOne=0,DATE_ADD(CURRENT_DATE(), INTERVAL 365 DAY),qrOne), IF(qrTwo=0,DATE_ADD(CURRENT_DATE(), INTERVAL 365 DAY),qrTwo), IF(fr=0,DATE_ADD(CURRENT_DATE(), INTERVAL 365 DAY),fr) ) as nextAnnouncement from `ecal_future` where symbol = ?');
    $sth->bindParam(1, $symbol, PDO::PARAM_STR, 12);
    $sth->execute();
    $data = $sth->fetchAll();
    return $data;
}

$app->run();

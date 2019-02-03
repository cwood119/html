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

$app->get('/heatmapCalendar', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $heatmapCalendar = get_heatmapCalendar();
    if (null !== $heatmapCalendar) {
        $app->response->setStatus(200);
        echo json_encode($heatmapCalendar);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/customHeatmap/:start/:end', function ($start,$end) use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $customHeatmap = get_customHeatmap($start,$end);
    if (null !== $customHeatmap) {
        $app->response->setStatus(200);
        echo json_encode($customHeatmap);
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

$app->get('/earningsToday', function () use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');

    $earningsToday = get_earningsToday();
    if (null !== $earningsToday) {
        $app->response->setStatus(200);
        echo json_encode($earningsToday);
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

$app->get('/lastEarnings/:symbol', function ($symbol) use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');
    $lastEarnings = get_lastEarnings($symbol);
    if (null !== $lastEarnings) {
        $app->response->setStatus(200);
        echo json_encode($lastEarnings);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/nextEarnings/:symbol', function ($symbol) use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');
    $nextEarnings = get_nextEarnings($symbol);
    if (null !== $nextEarnings) {
        $app->response->setStatus(200);
        echo json_encode($nextEarnings);
    } else {
        $app->response->setStatus(401);
    }
});

$app->get('/dashboardEarnings/:symbol', function ($symbol) use ($app) {
    $response = $app->response();
    $response->header('Access-Control-Allow-Origin', '*');
    $response->header('Access-Control-Allow-Methods', 'GET, POST , OPTIONS');
    $response->header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, accept, x-requested-with, origin, content-type, x-xsrf-token');
    $dashboardEarnings = get_dashboardEarnings($symbol);
    $nextEarnings = get_nextEarnings($symbol);
    $quarterlyPerformance = get_quarterlyPerformance($symbol);

    if (null !== $nextEarnings || null !== $dashboardEarnings || null !== $quarterlyPerformance) {
        $app->response->setStatus(200);
        $result = array_merge($nextEarnings,$dashboardEarnings,$quarterlyPerformance);
        echo json_encode($result);
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

    if ($today != 'Saturday' || $today != 'Sunday' ) { $data = $pdo->query('SELECT * FROM earnings_calendar_latest WHERE announce IN (2,3,4) UNION SELECT * FROM earnings_calendar_archive WHERE date = subdate(current_date,1) AND announce = 1 order by symbol asc;')->fetchAll(); }

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
    $data = $pdo->query('SELECT * FROM ecal_next UNION SELECT * from earnings_calendar_latest WHERE announce = 1 order by symbol asc')->fetchAll();
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

    //$sth = $pdo->prepare('SELECT max(id) as id, symbol, announce, avgVol, max(`earnings_calendar_archive`.`date`) as date FROM earnings_calendar_archive WHERE date BETWEEN ? AND ? GROUP BY symbol, month(`earnings_calendar_archive`.`date`) ORDER BY date ASC');

    $sth = $pdo->prepare('SELECT id, symbol, announce, avgVol, date FROM earnings_calendar_archive WHERE date BETWEEN ? AND ? ORDER BY date ASC');    
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

function get_customHeatmap($start,$end) {
  $pdo = connect_to_db();    
  $sth = $pdo->prepare('SELECT date,count(*) as count FROM `earnings_calendar_archive` WHERE date BETWEEN ? AND CURDATE() GROUP BY date UNION SELECT DATE_FORMAT(qrOne,"%Y-%m-%d") as date,count(*) as count FROM `ecal_future` WHERE (qrOne BETWEEN CURDATE() AND ?) AND qrOne > current_date() GROUP BY qrOne ORDER BY `date` ASC');
  $sth->bindParam(1, $start, PDO::PARAM_STR, 12);
  $sth->bindParam(2, $end, PDO::PARAM_STR, 12);
  $sth->execute();
  $data = $sth->fetchAll();
  return $data;
}

function get_heatmapCalendar() {
  $pdo = connect_to_db();    
  //  $data = $pdo->query('SELECT DATE_FORMAT(DATE_ADD(date, INTERVAL(-WEEKDAY(date)) DAY),"%a %b %d %Y") as name, date as rawDate, DATE_FORMAT(date,"%a %b %d %Y") as date, DATE_FORMAT(date,"%a") as day, count(*) as value FROM `earnings_calendar_archive` WHERE date BETWEEN DATE_FORMAT(CURDATE(), "%Y-%m-01") - INTERVAL 2 MONTH AND CURDATE() GROUP BY date UNION SELECT DATE_FORMAT(DATE_ADD(qrOne, INTERVAL(-WEEKDAY(qrOne)) DAY),"%a %b %d %Y") as name, qrOne as rawDate, DATE_FORMAT(qrOne,"%a %b %d %Y") as date, DATE_FORMAT(qrOne,"%a") as day, count(*) as value FROM `ecal_future` WHERE qrOne BETWEEN DATE_FORMAT(NOW() ,"%Y-%m-01") AND LAST_DAY(DATE_ADD(NOW(), INTERVAL 2 MONTH)) AND qrOne > current_date() GROUP BY qrOne ORDER BY name ASC, rawDate DESC')->fetchAll(\PDO::FETCH_GROUP);
  //  $stmt = $pdo->prepare('SELECT DATE_FORMAT(DATE_ADD(date, INTERVAL(-WEEKDAY(date)) DAY),"%a %b %d %Y") as name, date as rawDate, DATE_FORMAT(date,"%a %b %d %Y") as date, DATE_FORMAT(date,"%a") as day, count(*) as value FROM `earnings_calendar_archive` WHERE date BETWEEN DATE_FORMAT(CURDATE(), "%Y-%m-01") - INTERVAL 2 MONTH AND CURDATE() GROUP BY date UNION SELECT DATE_FORMAT(DATE_ADD(qrOne, INTERVAL(-WEEKDAY(qrOne)) DAY),"%a %b %d %Y") as name, qrOne as rawDate, DATE_FORMAT(qrOne,"%a %b %d %Y") as date, DATE_FORMAT(qrOne,"%a") as day, count(*) as value FROM `ecal_future` WHERE qrOne BETWEEN DATE_FORMAT(NOW() ,"%Y-%m-01") AND LAST_DAY(DATE_ADD(NOW(), INTERVAL 2 MONTH)) AND qrOne > current_date() GROUP BY qrOne ORDER BY name ASC, rawDate DESC');
  $stmt = $pdo->prepare('select * from ((SELECT DATE_FORMAT(DATE_ADD(date, INTERVAL(-WEEKDAY(date)) DAY),"%a %b %d %Y") as name, DATE_ADD(date, INTERVAL(-WEEKDAY(date)) DAY) as sortDateAsc, date as sortDateDesc, DATE_FORMAT(date,"%a %b %d %Y") as date, DATE_FORMAT(date,"%a") as day, count(*) as value FROM `earnings_calendar_archive` WHERE date BETWEEN DATE_FORMAT(CURDATE(), "%Y-%m-01") - INTERVAL 2 MONTH AND CURDATE() GROUP BY date order by name ASC, sortDateDesc DESC ) UNION ALL (SELECT DATE_FORMAT(DATE_ADD(qrOne, INTERVAL(-WEEKDAY(qrOne)) DAY),"%a %b %d %Y") as name, DATE_ADD(qrOne, INTERVAL(-WEEKDAY(qrOne)) DAY) as sortDateAsc, qrOne as sortDateDesc, DATE_FORMAT(qrOne,"%a %b %d %Y") as date, DATE_FORMAT(qrOne,"%a") as day, count(*) as value FROM `ecal_future` WHERE qrOne BETWEEN DATE_FORMAT(NOW() ,"%Y-%m-01") AND LAST_DAY(DATE_ADD(NOW(), INTERVAL 2 MONTH)) AND qrOne > current_date() GROUP BY qrOne ORDER BY name ASC, sortDateDesc DESC)) t order by sortDateAsc ASC, sortDateDesc DESC');
  $stmt->execute();
  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

  $temp_array = array();
  foreach($result as $bf) {
    if (!isset($temp_array[$bf['name']])) {
        $temp_array[$bf['name']] = array();
    }
    $temp_array[$bf['name']][] = array(
        "date" => $bf['date'], 
        "name" => $bf['day'], 
        "value" => $bf['value']);
  }

  $final_array = array();

  foreach ($temp_array as $name => $values) {
    $final_array[] = array(
        'name' => $name,
        'series' => $values);
  }
  
  return $final_array;
}

function get_winners() {
  $pdo = connect_to_db();    
  $data = $pdo->query('SELECT id, symbol, date, percentChange, avgVol FROM winners')->fetchAll();
  //$data = $pdo->query('SELECT id, symbol, earningsDate as date, earningsDayPercentChange as percentChange, earningsDayAverageVolumeThirtyDays as avgVol FROM `earnings_announcements` where earningsDate >= subdate(CURRENT_DATE,60) and earningsDayPercentChange >= 5')->fetchAll();
  
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

function get_earningsToday() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM earnings_today ORDER BY symbol ASC')->fetchAll();
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

function get_lastEarnings($symbol) {
    $pdo = connect_to_db();    
    $sth = $pdo->prepare('SELECT *, ((earningsDayClose - earningsDayOpen)/earningsDayOpen)*100 as earningsDayPercentChangeFromOpen FROM `earnings_announcements` WHERE symbol = ? ORDER BY earningsDate desc LIMIT 1');
    $sth->bindParam(1, $symbol, PDO::PARAM_STR, 12);
    $sth->execute();
    $data = $sth->fetchAll();
    return $data;
}

function get_nextEarnings($symbol) {
    $pdo = connect_to_db();    
    //$sth = $pdo->prepare('SELECT id, symbol, announce as nextEarningsTime, LEAST( IF(qrOne=0,DATE_ADD(CURRENT_DATE(), INTERVAL 365 DAY),qrOne), IF(qrTwo=0,DATE_ADD(CURRENT_DATE(), INTERVAL 365 DAY),qrTwo), IF(fr=0,DATE_ADD(CURRENT_DATE(), INTERVAL 365 DAY),fr) ) as nextEarningsDate from `ecal_future` where symbol = ?');
    $sth = $pdo->prepare('SELECT id, symbol, earningsTime as nextEarningsTime, earningsDate as nextEarningsDate from `earnings_today` where symbol = ? and (reactionDate = current_date() and earningsTime = "AMC") UNION SELECT id, symbol, announce as nextEarningsTime, LEAST( IF(qrOne=0,DATE_ADD(CURRENT_DATE(), INTERVAL 365 DAY),qrOne), IF(qrTwo=0,DATE_ADD(CURRENT_DATE(), INTERVAL 365 DAY),qrTwo), IF(fr=0,DATE_ADD(CURRENT_DATE(), INTERVAL 365 DAY),fr) ) as nextEarningsDate from `ecal_future` where symbol = ? LIMIT 1');
    //$sth = $pdo->prepare('SELECT id, symbol, announce as nextEarningsTime, date as nextEarningsDate from `earnings_calendar_archive` where symbol = ? and (date = subdate(current_date,1) and announce = "1") UNION SELECT id, symbol, announce as nextEarningsTime, LEAST( IF(qrOne=0,DATE_ADD(CURRENT_DATE(), INTERVAL 365 DAY),qrOne), IF(qrTwo=0,DATE_ADD(CURRENT_DATE(), INTERVAL 365 DAY),qrTwo), IF(fr=0,DATE_ADD(CURRENT_DATE(), INTERVAL 365 DAY),fr) ) as nextEarningsDate from `ecal_future` where symbol = ? LIMIT 1');
    $sth->bindParam(1, $symbol, PDO::PARAM_STR, 12);
    $sth->bindParam(2, $symbol, PDO::PARAM_STR, 12);
    
    $sth->execute();
    $data = $sth->fetchAll();
    return $data;
}

function get_dashboardEarnings($symbol) {
    $today = date('l');
    $pdo = connect_to_db();    
    //if ( $today != 'Sunday' || $day != 'Monday') { $sth = $pdo->prepare('SELECT id, symbol, earningsDate, earningsTime, earningsDayOpen,earningsDayHigh,earningsDayLow,earningsDayClose,earningsDayVolume FROM `earnings_announcements` WHERE symbol = ? AND reactionDate != current_date() AND earningsDate != current_date() order by earningsDate desc limit 1'); }
    //if ( $today == 'Sunday' ) { $sth = $pdo->prepare('SELECT id, symbol, earningsDate, earningsTime, earningsDayOpen,earningsDayHigh,earningsDayLow,earningsDayClose,earningsDayVolume FROM `earnings_announcements` WHERE symbol = ? AND reactionDate != current_date() AND (earningsDate = subdate(current_date,2) AND earningsTime != "AMC") order by earningsDate desc limit 1'); }
    //if ( $today == 'Monday' ) { $sth = $pdo->prepare('SELECT id, symbol, earningsDate, earningsTime, earningsDayOpen,earningsDayHigh,earningsDayLow,earningsDayClose,earningsDayVolume FROM `earnings_announcements` WHERE symbol = ? AND reactionDate != current_date() AND (earningsDate = subdate(current_date,3) AND earningsTime != "AMC") order by earningsDate desc limit 1'); }    
    $sth = $pdo->prepare('SELECT id, symbol, earningsDate, earningsTime, earningsDayOpen,earningsDayHigh,earningsDayLow,earningsDayClose,earningsDayVolume FROM `earnings_announcements` WHERE symbol = ? AND reactionDate != current_date() AND earningsDate != current_date() order by earningsDate desc limit 1');
    $sth->bindParam(1, $symbol, PDO::PARAM_STR, 12);
    
    $sth->execute();
    $data = $sth->fetchAll();
    return $data;
}


function get_quarterlyPerformance($symbol) {
    $pdo = connect_to_db();    
    //$sth = $pdo->prepare('SELECT id, symbol, CONCAT("Q",quarter(earningsDate)," ", year(earningsDate)) as quarter, earningsDayPercentChange as changeFromClose, format(((earningsDayClose - earningsDayOpen)/earningsDayOpen)*100,2) as changeFromOpen FROM `earnings_announcements` where symbol = ? order by earningsDate desc limit 4');
    $sth = $pdo->prepare('SELECT id, symbol, CONCAT("Q",quarter(earningsDate)," ", year(earningsDate)) as quarter, earningsDayPercentChange as changeFromClose, earningsDayPercentChangeFromOpen as changeFromOpen FROM `earnings_announcements` where symbol = ? and earningsDayPercentChange is not null and earningsDayPercentChangeFromOpen is not null order by earningsDate desc limit 4');
    $sth->bindParam(1, $symbol, PDO::PARAM_STR, 12);
    $sth->execute();
    $data = $sth->fetchAll();
    return $data;
}


$app->run();

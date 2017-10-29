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

function get_ecalFuture() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM ecal_future;')->fetchAll();
    return $data;
}

function get_ecalTracker() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM ecal_tracker WHERE erOpen != 0  ORDER BY date ASC;')->fetchAll();
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
    $sth = $pdo->prepare('SELECT a.* FROM (SELECT s.symbol, s.announce, s.date FROM earnings_calendar_latest s WHERE symbol = ? ORDER BY s.DATE DESC LIMIT 1) a UNION ALL SELECT b.* FROM (SELECT t.symbol, t.announce, t.date FROM earnings_calendar_archive t WHERE symbol = ? ORDER BY t.DATE DESC LIMIT 1) b LIMIT 1;');
    $sth->bindParam(1, $symbol, PDO::PARAM_STR, 12);
    $sth->execute();
    $data = $sth->fetchAll();
    //$data = $pdo->query('SELECT announce, date FROM earnings_calendar_archive WHERE symbol = "'.$symbol.'" ORDER BY DATE DESC LIMIT 1')->fetchAll();
    return $data;
}

$app->run();

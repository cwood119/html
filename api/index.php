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


// Data Functions
function get_ecal() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM earnings_calendar_latest')->fetchAll();
    return $data;
}

function get_gainers() {
    $pdo = connect_to_db();    
    $data = $pdo->query('SELECT * FROM market_movers_latest')->fetchAll();
    return $data;
}


$app->run();

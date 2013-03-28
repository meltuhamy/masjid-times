<?php
require 'Slim/Slim.php';
require 'config.php';

/**
 * A helper function that outputs the json of data.
 * @param  mixed $data The data to output in json form
 */
function json($data){
  echo json_encode($data);
}

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

$app->db = new PDO("mysql:host={$CONFIG['db_host']};dbname={$CONFIG['db_name']};port={$CONFIG['db_port']};charset=utf8", $CONFIG['db_user'], $CONFIG['db_pass']);
$res = $app->response();




//Default json
$res['Content-Type'] = 'application/json';


/**
 * Check service is running
 */
$app->get('/', function () use ($app) {
  json("Prayer Times Live.");
});

/**
 * Gets the prayer time table for specified mosque id.
 * @var [type]
 */
$app->get('/table/:mosqueid', function($mosqueid) use ($app){
  try {
    $stmt = $app->db->prepare('SELECT * FROM prayertimes WHERE mosque_id = ?');
    $stmt->execute(array($mosqueid));
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  } catch(PDOException $ex) {
    
  }
  json($rows);
  
});

/**
 * Gets nearby mosques specified by url paramaters lat, long and range.
 */
$app->get('/mosque/', function() use ($app){
  try{
    $req = $app->request();
    $lat = $req->params('lat');
    $long = $req->params('long');

    if(!isset($lat, $long)){
      $app->response()->status(400);
      json(array('Error'=>'Lat and Long must be set'));
      return;
    }

    $maxRange = 2000;
    $defaultRange = 1000;
    $reqRange = $req->params('range');
    $range = isset($reqRange) && $reqRange < $maxRange && $reqRange > 0 ? $reqRange : $defaultRange;

    $stmt = $app->db->prepare('SELECT *, SQRT(POW(69.1 * (`lat` - ?), 2) + POW(69.1 * (? - `long`) * COS(`lat` / 57.3), 2)) AS distance FROM mosque HAVING distance < ? ORDER BY distance');
    $stmt->execute(array($lat, $long, $range));
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

  } catch(PDOException $ex){

  }
  json($rows);
});

//Run REST app
$app->run();
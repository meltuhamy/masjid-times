<?php
require 'Slim/Slim.php';
require 'config.php';

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

$app->db = new PDO("mysql:host={$CONFIG['db_host']};dbname={$CONFIG['db_name']};port={$CONFIG['db_port']};charset=utf8", $CONFIG['db_user'], $CONFIG['db_pass']);
$res = $app->response();

//Default json
$res['Content-Type'] = 'application/json';


$app->get('/', function () use ($app) {
  echo json_encode('Prayer times live');
});

$app->get('/table/:mosqueid', function($mosqueid) use ($app){
  try {
    $stmt = $app->db->prepare('SELECT * FROM prayertimes WHERE mosque_id = ?');
    $stmt->execute(array($mosqueid));
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  } catch(PDOException $ex) {
    echo "An Error occured!"; //user friendly message
    echo $ex->getMessage() ;
  }
  echo json_encode($rows);
  
});

$app->get('/mosque/', function() use ($app){
  try{
    $req = $app->request();
    $lat = $req->params('lat');
    $long = $req->params('long');

    $stmt = $app->db->prepare('SELECT `id`, `lat`, `long`, SQRT(POW(69.1 * (`lat` - ?), 2) + POW(69.1 * (? - `long`) * COS(`lat` / 57.3), 2)) AS distance FROM mosque HAVING distance < 1000 ORDER BY distance');
    $stmt->execute(array($lat, $long));
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  } catch(PDOException $ex){

  }
  echo json_encode($rows);
});

$app->get('/hello/:name', function ($name) {
  echo "Hello, $name";
});


$app->run();
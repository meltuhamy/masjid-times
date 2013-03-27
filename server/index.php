<?php
require 'Slim/Slim.php';
require 'config.php';

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

$app->db = new PDO("mysql:host={$CONFIG['db_host']};dbname={$CONFIG['db_name']};port={$CONFIG['db_port']};charset=utf8", $CONFIG['db_user'], $CONFIG['db_pass']);
$res = $app->response();


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

$app->get('/hello/:name', function ($name) {
  echo "Hello, $name";
});


$app->run();
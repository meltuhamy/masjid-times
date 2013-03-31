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
 */
$app->get('/table/:mosqueid', function($mosqueid) use ($app){
  $req = $app->request();
  $sqlBinding = array('mosqueid' => $mosqueid);

  //Get request filtering.
  $month = $req->params('month');
  $day = $req->params('day');
  $prayer = $req->params('prayer');

  try {
    $sql = 'SELECT * FROM prayertimes WHERE mosque_id = :mosqueid';
    if(isset($month)) {
      $sql .= ' AND month = :month';
      $sqlBinding['month'] = $month;
      if(isset($day)){
        $sqlBinding['day'] = $day;
        $sql .= ' AND day = :day';
      }
    }

    //Execute the statement
    $stmt = $app->db->prepare($sql);
    $stmt->execute($sqlBinding);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

  } catch(PDOException $ex) {
    //TODO: Error
  }

  //Depending on our request, we figure out what to output.
  if(isset($day)){
    $row = $rows[0];
    if(isset($prayer)){
      //TODO: Verify prayer format.
      // We output only the single prayer time.
      json($row[$prayer]);
    } else {
      // We output the single day of prayer.
      json($row);
    }
  } else {
    // We output the whole month/year of prayer times.
    json($rows);
  }
  
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

    $maxRange = 25000;
    $defaultRange = 1000;
    $reqRange = $req->params('range');
    $range = isset($reqRange) && $reqRange < $maxRange && $reqRange > 0 ? $reqRange : $defaultRange;

    $stmt = $app->db->prepare('SELECT *, SQRT(POW(69.1 * (`lat` - ?), 2) + POW(69.1 * (? - `long`) * COS(`lat` / 57.3), 2)) AS distance FROM mosque HAVING distance < ? ORDER BY distance');
    $stmt->execute(array($lat, $long, $range));
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

  } catch(PDOException $ex){
    //TODO: Error
  }
  json($rows);
});

/**
 * Gets mosque details by id
 */
$app->get('/mosque/:mosqueid', function($mosqueid) use($app){
  try{
    $stmt = $app->db->prepare('SELECT * FROM mosque WHERE id=?');
    $stmt->execute(array($mosqueid));
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
  } catch (PDOException $ex){
    //TODO: Error
  }

  json($row);
});


//Run REST app
$app->run();
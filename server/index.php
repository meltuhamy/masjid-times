<?php
require 'Slim/Slim.php';
require 'config.php';
require 'PrayerTime.php';


//TODO: Refactor getTradtionalTimes* into a static class or something.
function getTraditionalTimesDay($day, $month, $lat, $lng, $method=5)
{
  global $prayTime;
  $prayTime->setCalcMethod($method);
  $time = mktime(0,0,0,$month,$day,2004);

  //TODO Set timezone param properly.
  $times = $prayTime->getPrayerTimes($time, $lat, $lng, 0);
  return array(
    'id'=> -1,
    'month' => $month,
    'day' => $day,
    'fajr' => $times[0],
    'shuruq' => $times[1],
    'duhr' => $times[2],
    'asr' => $times[3],
    'asr2' => $times[7],
    'maghrib' => $times[5],
    'isha' => $times[6]
  );
}

function getTraditionalTimesMonth($month, $lat, $lng, $method=5)
{
  $date = mktime(0,0,0,$month,1,2004); // 2004 is a leap year so includes 29 Feb
  $data = array();
  for($day=1; $day <= date('t',$date); $day++){
    $data []= getTraditionalTimesDay($day, $month, $lat, $lng, $method);
  }
  return $data;
}

function getTraditionalTimesYear($lat, $lng, $method=5)
{
  $data = array();
  for($month = 1; $month <= 12; $month++){
    $data = array_merge($data, getTraditionalTimesMonth($month, $lat, $lng, $method));
  }
  return $data;
}

function getTraditionalTimesPrayer($day, $month, $prayer, $lat, $lng, $method=5)
{
  $times = getTraditionalTimesDay($day, $month, $lat, $lng, $method);
  return $times[$prayer];
}

function getTraditionalTimes($day, $month, $prayer, $lat, $lng, $method=5)
{
  //TODO: Caching

  if(isset($day, $month, $prayer)){
    return getTraditionalTimesPrayer($day, $month, $prayer, $lat, $lng, $method);
  }

  if(isset($day, $month)){
    return getTraditionalTimesDay($day, $month, $lat, $lng, $method);
  }

  if(isset($month)){
    return getTraditionalTimesMonth($month, $lat, $lng, $method);
  }

  // Otherwise return whole year
  return getTraditionalTimesYear($lat, $lng, $method);
}

/**
 * A helper function that outputs the json of data.
 * @param  mixed $data The data to output in json form
 */
function json($data)
{
  if (isset($_GET['callback'])) {
    echo $_GET['callback'] . "(" . json_encode($data) . ");";
  } else {
    echo json_encode($data);
  }
}

/**
 * Sets the status to zero and outputs some error json
 * @param  Slim $app     The app reference
 * @param  String $message The message we wish to output
 * @param  integer $status  The error code (HTTP)
 */
function json_error($app, $message, $status = 400)
{
  $app->response()->status($status);
  json(array('error' => $message));
}

/**
 * json_error with a specific message each time
 * @param  Slim $app     The app reference
 * @param  string $message The message (optional)
 */
function db_json_error($app, $message = 'There is a problem with the database.')
{
  json_error($app, $message, 503);
}

function getDebugDay($month, $day, $nextPrayer, $offset)
{
  // Look for the next prayer
  $prayers = array('fajr', 'shuruq', 'duhr', 'asr', 'asr2', 'maghrib', 'isha');
  $prayerTimes = array('id' => -1, 'month' => $month, 'day' => $day);
  $prayerReachedIndex = -1;
  for ($i = 0; $i < count($prayers); $i++) {
    if ($prayers[$i] == $nextPrayer) {
      // Just + offset
      $prayerReachedIndex = $i;
      $difference = 59;
      $prayerTimes[$prayers[$i]] = date("H:i", strtotime("- $difference minutes"));
    } else if ($prayerReachedIndex == -1) {
      $difference = 59 + (count($prayers) - $i);
      $prayerTimes[$prayers[$i]] = date("H:i", strtotime("- $difference minutes"));
    } else if ($i > $prayerReachedIndex) {
      // e.g. found at i=5, now i=6, so this prayer is 6-5
      $difference = 59 - ($i - $prayerReachedIndex);
      $prayerTimes[$prayers[$i]] = date("H:i", strtotime("- $difference minutes"));
    }
  }

  return $prayerTimes;
}


/**
 * Regardless of the prayer/mosque, gets the same data
 * for prayer times. This is always such that Fajr is
 * always the next prayer, and Fajr is in 3 minutes.
 *
 * If $_GET['debug_offset'] is set, sets the fajr
 * to current time + offset seconds.
 *
 * @param  integer $month  The month to get
 * @param  integer $day    The day of the month
 * @param  string $prayer The prayer to get
 * @return mixed           The array/string to output
 */
function getDebugPrayerTimes($month, $day, $prayer)
{
  //$DST = 60; // Minutes
  $offset = (isset($_GET['offset']) ? intval($_GET['offset']) : 1);
  $nextPrayer = isset($_GET['next']) ? $_GET['next'] : 'fajr';
  $setMonth = isset($month);
  $setDay = isset($day);
  $setPrayer = isset($prayer);
  if (!($setMonth || $setDay || $setPrayer)) {
    $yearTimes = array();
    for ($month = 1; $month <= 12; $month++) {
      for ($day = 1; $day <= 31; $day++) {
        $yearTimes[] = getDebugDay($month, $day, $nextPrayer, $offset);
      }
    }
    return $yearTimes;
  } else if ($setMonth && !$setDay) {
    $monthTimes = array();
    for ($day = 1; $day <= 31; $day++) {
      $monthTimes [] = getDebugDay($month, $day, $nextPrayer, $offset);
    }
    return $monthTimes;
  } else if ($setDay && $setMonth && !$setPrayer) {
    return getDebugDay($month, $day, $nextPrayer, $offset);
  } else if ($setMonth && $setDay && $setPrayer) {
    return date("H:i", time() + $offset);
  }

}


\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

$app->debug = (isset($CONFIG['DEBUG']) && $CONFIG['DEBUG']) || (isset($_GET['debug']) && $_GET['debug'] == '1' && !(isset($CONFIG['DEBUG']) && !$CONFIG['DEBUG']));
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
 * Gets the prayer time table for specified prayertimes id.
 */
$app->get('/table/', function () use ($app) {
  $req = $app->request();

  //Get request filtering.
  $month = $req->params('month');
  $day = $req->params('day');
  $prayer = $req->params('prayer');
  $method = $req->params('method');
  $prayerid = $req->params('id');
  $lat = $req->params('lat');
  $lng = $req->params('lng');


  if ($app->debug) {
    json(getDebugPrayerTimes($month, $day, $prayer));
    return;
  }

  if($method && $method != 'mosque'){
    if(!isset($lat,$lng)){
      json_error($app, 'lat and lng must be set if using traditional calculation method.');
      return;
    }

    // TODO: Implement day, month, prayer times
    json(getTraditionalTimes($day, $month, $prayer, $lat, $lng, $method));
    return;
  }

  if(!isset($prayerid)){
    json_error($app, 'You must provide a prayer times id for this method');
    return;
  }

  $sqlBinding = array('prayerid' => $prayerid);

  try {
    $sql = 'SELECT * FROM prayertimes WHERE id = :prayerid';
    if (isset($month)) {
      $sql .= ' AND month = :month';
      $sqlBinding['month'] = $month;
      if (isset($day)) {
        $sqlBinding['day'] = $day;
        $sql .= ' AND day = :day';
      }
    }

    //Execute the statement
    $stmt = $app->db->prepare($sql);
    $stmt->execute($sqlBinding);

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

  } catch (PDOException $ex) {
    db_json_error($app);
    return;
  }

  //Depending on our request, we figure out what to output.
  if (isset($day)) {
    $row = $rows[0];
    if (isset($prayer)) {
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
 * Gets nearby mosques specified by url parameters lat, long and range.
 */
$app->get('/mosque/', function () use ($app) {
  try {
    $req = $app->request();
    $lat = $req->params('lat');
    $long = $req->params('long');

    if (!isset($lat, $long)) {
      json_error($app, 'Lat and Long must be set');
      return;
    }

    $maxRange = 25000;
    $defaultRange = 1000;
    $reqRange = $req->params('range');
    $range = isset($reqRange) && $reqRange < $maxRange && $reqRange > 0 ? $reqRange : $defaultRange;

    $stmt = $app->db->prepare('SELECT *, SQRT(POW(69.1 * (`lat` - ?), 2) + POW(69.1 * (? - `long`) * COS(`lat` / 57.3), 2)) AS distance FROM mosque HAVING distance < ? ORDER BY distance');
    $stmt->execute(array($lat, $long, $range));
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

  } catch (PDOException $ex) {
    db_json_error($app);
    return;
  }
  json($rows);
});

/**
 * Gets mosque details by id
 */
$app->get('/mosque/:mosqueid', function ($mosqueid) use ($app) {
  try {
    $stmt = $app->db->prepare('SELECT * FROM mosque WHERE id=?');
    $stmt->execute(array($mosqueid));
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
  } catch (PDOException $ex) {
    db_json_error($app);
    return;
  }

  json($row);
});


//Run REST app
$app->run();
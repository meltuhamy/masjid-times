<?php
require 'PrayerTime.php';
$lat = 51.4936426;
$lng = -0.2186023;

/*
id: "2",
month: "5",
day: "6",
fajr: "03:38",
shuruq: "05:24"
asr: "17:04"
day: "6"
duhr: "13:02"
fajr: "03:38"
id: "2"
isha: "21:42"
maghrib: "20:35"
month: "5"
shuruq: "05:24"
__proto__: Object
 */
$data = array();
for($month = 1; $month <= 12; $month++){
  $date = mktime(0,0,0,$month,1,2004); // 2004 is a leap year so includes 29 Feb
  for($day=1;$day <= date('t',$date);$day++){
    $time = mktime(0,0,0,$month,$day,2004);
    $times = $prayTime->getPrayerTimes($time, $lat, $lng, 0);
    $data []= array(
      'id'=> "Method",
      'month' => $month,
      'day' => $day,
      'fajr' => $times[0],
      'shuruq' => $times[1],
      'duhr' => $times[2],
      'asr' => $times[3],
      'asr2' => $times[4],
      'maghrib' => $times[5],
      'isha' => $times[6]
    );
//    echo $month.' '.$day."\n";
  }
}

echo $data;
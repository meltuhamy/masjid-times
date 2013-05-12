<?php
include_once('PrayerTime.php');

/**
 * A static class that uses PrayerTime to work out stuff.
 * Class TraditionalTimes
 */
class TraditionalTimes {
  /**
   * The prayer times calculator object
   * @var PrayTime
   */
  private static $prayerTime;

  /**
   * Gets the prayer time instance
   * @return PrayTime
   */
  public static function prayerTimeInstance(){
    if(isset(self::$prayerTime)){
      return self::$prayerTime;
    } else{
      return self::$prayerTime = new PrayTime();
    }
  }

  /**
   * Calculates the prayer times for a day.
   * @param $day
   * @param $month
   * @param $lat
   * @param $lng
   * @param int $method
   * @return array
   */
  public static function getTraditionalTimesDay($day, $month, $lat, $lng, $method=5)
  {
    self::prayerTimeInstance()->setCalcMethod($method);
    $time = mktime(0,0,0,$month,$day,2004);

    //TODO Set timezone param properly.
    $times = self::prayerTimeInstance()->getPrayerTimes($time, $lat, $lng, 0);
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

  /**
   * Calculates the prayer times for a month
   * @param $month
   * @param $lat
   * @param $lng
   * @param int $method
   * @return array
   */
  public static function getTraditionalTimesMonth($month, $lat, $lng, $method=5)
  {
    $date = mktime(0,0,0,$month,1,2004); // 2004 is a leap year so includes 29 Feb
    $data = array();
    for($day=1; $day <= date('t',$date); $day++){
      $data []= self::getTraditionalTimesDay($day, $month, $lat, $lng, $method);
    }
    return $data;
  }


  /**
   * Calculates the prayer times for a year
   * @param $lat
   * @param $lng
   * @param int $method
   * @return array
   */
  public static function getTraditionalTimesYear($lat, $lng, $method=5)
  {
    $data = array();
    for($month = 1; $month <= 12; $month++){
      $data = array_merge($data, self::getTraditionalTimesMonth($month, $lat, $lng, $method));
    }
    return $data;
  }

  public static function getTraditionalTimesPrayer($day, $month, $prayer, $lat, $lng, $method=5)
  {
    $times = self::getTraditionalTimesDay($day, $month, $lat, $lng, $method);
    return $times[$prayer];
  }

  /**
   * Calculates the prayer times for the period of time specified by the combination of set paramaters.
   * @param $day
   * @param $month
   * @param $prayer
   * @param $lat
   * @param $lng
   * @param int $method
   * @return array
   */
  public static function getTraditionalTimes($day, $month, $prayer, $lat, $lng, $method=5)
  {
    //TODO: Caching

    if(isset($day, $month, $prayer)){
      return self::getTraditionalTimesPrayer($day, $month, $prayer, $lat, $lng, $method);
    }

    if(isset($day, $month)){
      return self::getTraditionalTimesDay($day, $month, $lat, $lng, $method);
    }

    if(isset($month)){
      return self::getTraditionalTimesMonth($month, $lat, $lng, $method);
    }

    // Otherwise return whole year
    return self::getTraditionalTimesYear($lat, $lng, $method);
  }


}
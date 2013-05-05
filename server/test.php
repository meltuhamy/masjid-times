<?php

for($month = 1; $month <= 12; $month++){
  $date = mktime(0,0,0,$month,1,2004); // 2004 is a leap year so includes 29 Feb
  for($day=1;$day <= date('t',$date);$day++){
    echo $month.' '.$day."\n";
  }
}

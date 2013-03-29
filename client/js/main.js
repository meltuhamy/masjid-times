var masjidTimes = newMasjidTimes();

var nextPrayerCounter = function(data){
  var newTimeLeft = data/60000;
  var seconds = false;
  if(newTimeLeft == 0){
    seconds = true;
    newTimeLeft = data/1000;
  }
  newTimeLeft =  Math.floor(newTimeLeft) + (seconds ? ' seconds' : ' minutes') + ' until '+ masjidTimes.next;
  $('.nextprayercounter').html(newTimeLeft);
}

$(document).ready(function(){
  //Get the nearest mosque info and log it.
  masjidTimes.requestNearestMosque(54,-5,null,function(data){
    mosque = data.response;

    //Tell masjidTimes to use this mosque from now on.
    masjidTimes.useMosque(mosque);

    //Update any mosque name place holders.
    $('.mosque-name').html(mosque.name);

    //Populate today's times.
    masjidTimes.requestTodayPrayerTimes(function(data){
      times = data.response;
      //Go through each prayer and update its html.
      for(var i = 0; i<masjidTimes.prayers.length; i++){
        $('.'+masjidTimes.prayers[i]+'-time').html(times[masjidTimes.prayers[i]]);
      }

      // Check for next prayer periodically
      masjidTimes.nextPrayerInterval(500, nextPrayerCounter);
    });
  });
});


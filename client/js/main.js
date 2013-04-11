
var masjidConfig = {url: window.location.origin+'/masjid/', debug: false};
var usingTomorrow = false;


var updatePrayerTimes = function(times){
  //Go through each prayer and update its html.
  for(var i = 0; i<masjidTimes.prayers.length; i++){
    $('.'+masjidTimes.prayers[i]+'-time').html(times[masjidTimes.prayers[i]]);
  }

  // Check for next prayer periodically
  // Update next prayer counter now then check periodically
  //nextPrayerCounter(masjidTimes.updateSecondsRemaining());
  //masjidTimes.nextPrayerInterval(nextPrayerCounter);
}

var nearestMosqueCallback = function(mosque){
  //Tell masjidTimes to use this mosque from now on.
  masjidTimes.useMosque(mosque);

  //Update any mosque name place holders.
  $('.mosque-name').html(mosque.name);

  //Populate today's times.
  masjidTimes.requestTodayPrayerTimes(function(data){
    updatePrayerTimes(data.response);
  });
}

var doButtonListeners = function(){
  $('#settings-clearcache').click(function(){
    //Clear the cache and reload.
    masjidTimes.clearLocalStorage();
    window.location.reload();
  });
}

$(document).ready(function(){
  // Button listeners
  doButtonListeners();
  masjidTimes = newMasjidTimes(masjidConfig);
  masjidTimes.getNearestMosque(nearestMosqueCallback);

});




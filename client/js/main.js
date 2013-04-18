var mt;
var masjidConfig = {url: window.location.origin+'/masjid/', debug: false};
var usingTomorrow = false;


var updatePrayerTimes = function(times){
  //Go through each prayer and update its html.
  for(var i = 0; i<mt.prayers.length; i++){
    $('.'+mt.prayers[i]+'-time').html(times[mt.prayers[i]]);
  }

  // Check for next prayer periodically
  // Update next prayer counter now then check periodically
  //nextPrayerCounter(mt.updateSecondsRemaining());
  //mt.nextPrayerInterval(nextPrayerCounter);
}

var nearestMosqueCallback = function(mosque){
  //Tell mt to use this mosque from now on.
  mt.useMosque(mosque);

  //Update any mosque name place holders.
  $('.mosque-name').html(mosque.name);

  //Populate today's times.
  mt.requestTodayPrayerTimes(function(data){
    updatePrayerTimes(data.response);
  });
}

var doButtonListeners = function(){
  $('#settings-clearcache').click(function(){
    //Clear the cache and reload.
    mt.clearLocalStorage();
    window.location.reload();
  });
}

$(document).ready(function(){
  // Button listeners
  doButtonListeners();
  mt = newMasjidTimes(masjidConfig);

  // Get the nearest mosques
  mt.on('mosques', function(nearestMosques){
    // Let the user pick a mosque
    
  });

  mt.init();

  // Let user choose a mosque
  // Ready should get fired sometime
});




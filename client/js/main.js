var mt;
var masjidConfig = {url: window.location.origin+'/masjid/', debug: false};
var usingTomorrow = false;


var populateTimes = function(mosque){
  //Update any mosque name place holders.
  $('.mosque-name').html(mosque.name);

  //Populate today's times.
  var times = mt.times.getToday();
  for(var i = 0; i<mt.prayers.length; i++){
    $('.'+mt.prayers[i]+'-time').html(times[mt.prayers[i]]);
  }
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

  // Ask for location
  navigator.geolocation.getCurrentPosition(function(positionData){
    mt.init(positionData.coords, true);
  });

  // Get the nearest mosques
  mt.on('mosques', function(nearestMosques){
    // TODO: Let the user pick a mosque
    mt.useMosque(nearestMosques[0]);
  });

  mt.ready(function(){
    populateTimes(mt.mosque);
  });

  // Let user choose a mosque
  // Ready should get fired sometime
});




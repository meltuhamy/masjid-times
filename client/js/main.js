
var masjidConfig = {url: 'http://192.168.11.14:8888/masjid/'};

var nextPrayerCounter = function(data){
  var newTimeLeft = data/60000;
  var seconds = false;
  if(newTimeLeft <= 0){
    seconds = true;
    newTimeLeft = data/1000;
  }
  newTimeLeft =  Math.floor(newTimeLeft) + (seconds ? ' seconds' : ' minutes') + ' until '+ masjidTimes.next;
  document.title = newTimeLeft;
  $('.nextprayercounter').html(newTimeLeft);
}

var yearToStorage = function(data){
  var prayerTimesString = JSON.stringify(data.response);
  localStorage.prayertimes = prayerTimesString;
}

var loadStorage = function(){
  return localStorage.prayertimes == undefined || localStorage.prayerTimes == null ? undefined : JSON.parse(localStorage.prayertimes);
}

var savedMasjidTimes = loadStorage();

var getNearestMosque = function(callback){
  // Check if we already have a location stored
  if(localStorage.nearestMosque != undefined){
    callback(JSON.parse(localStorage.nearestMosque));
  } else {
    // Find location and do request
    navigator.geolocation.getCurrentPosition(function(locationData){
      // We have location data :D
      coords = locationData.coords;

      // Get the nearest mosque info and log it.
      masjidTimes.requestNearestMosque(coords.latitude,coords.longitude,null,function(data){
        mosque = data.response;
        localStorage.nearestMosque = JSON.stringify(mosque);
      });
    });
  }
}

var nearestMosqueCallback = function(mosque){
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
    masjidTimes.nextPrayerInterval(nextPrayerCounter);
  });
}

$(document).ready(function(){
  if(savedMasjidTimes != undefined){
    //We already have the year stored
    masjidConfig.stored = savedMasjidTimes;
  }

  masjidTimes = newMasjidTimes(masjidConfig);

  getNearestMosque(nearestMosqueCallback);

});




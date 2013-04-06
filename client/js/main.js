
var masjidConfig = {url: window.location.origin+'/masjid/'};

var nextPrayerCounter = function(data){
  var timeLeftArray = remaining.getArray(Math.floor(data/1000));
  var hours = timeLeftArray[0];
  var minutes = timeLeftArray[1];
  var seconds = timeLeftArray[2];


  var outputString = '';
  // If 1 minute left, display seconds
  if(hours == 0 && minutes == 0){
    outputString = seconds + " second" + (seconds == 1 ? '' : 's');
  } else {
    outputString = hours > 0 ? (hours + ' hour' + (hours == 1 ? '' : 's') + ', ') : '';
    outputString += minutes +' minute' + (minutes == 1 ? '' : 's');
  }

  outputString += " until " + masjidTimes.next;
  
  document.title = outputString;
  $('.nextprayercounter').html(outputString);
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




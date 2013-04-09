
var masjidConfig = {url: window.location.origin+'/masjid/', debug: false};
var usingTomorrow = false;

var nextPrayerCounter = function(data){
  data = Math.abs(data);
  console.log("Next prayer check: "+(data/1000));

  if(!usingTomorrow && masjidTimes.prayerPassed('isha')){
    // Isha has passed, display tomorrow's prayer times
    $('.todaytomorrow').html('Tomorrow');
    usingTomorrow = true;
    masjidTimes.useDate('tomorrow', function(data){
      updatePrayerTimes(data.response);
    }, true);
    
  }

  //If today >= tomorrow, reload
  if(usingTomorrow){
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    var tomorrow = new Date(today.getFullYear(), masjidTimes.today.month, masjidTimes.today.day, 0, 0, 0, 0);
    if(today >= tomorrow){
      window.location.reload();
    }
  }

  
  var timeLeftArray = remaining.getArray(data/1000);
  var hours = timeLeftArray[0];
  var minutes = timeLeftArray[1] + Math.ceil(timeLeftArray[2]/60);

  var outputString = '';
  // If 1 minute left, display seconds
  if(hours == 0 && minutes == 0){
    outputString = "Less than a minute";
  } else {
    outputString = hours > 0 ? (hours + ' hour' + (hours == 1 ? '' : 's') + ', ') : '';
    outputString += minutes +' minute' + (minutes == 1 ? '' : 's');
  }

  outputString += " until " + masjidTimes.next;
  
  document.title = outputString;
  $('.nextprayercounter').html(outputString);
}

var updatePrayerTimes = function(times){
  //Go through each prayer and update its html.
  for(var i = 0; i<masjidTimes.prayers.length; i++){
    $('.'+masjidTimes.prayers[i]+'-time').html(times[masjidTimes.prayers[i]]);
  }

  // Check for next prayer periodically
  // Update next prayer counter now then check periodically
  nextPrayerCounter(masjidTimes.updateSecondsRemaining());
  masjidTimes.nextPrayerInterval(nextPrayerCounter);
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




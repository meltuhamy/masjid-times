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
};

var doButtonListeners = function(){
  $('#settings-clearcache').click(function(){
    //Clear the cache and reload.
    mt.clearLocalStorage();
    window.location.reload();
  });
};

var updateRemaining = function(){
  var next = mt.times.getNext();
  var textArray = remaining.getArray(next.remaining/1000);
  textArray[0] = textArray[0] == 0 ? undefined : (textArray[0] == 1? textArray[0] + ' Hour' : textArray[0] + ' Hours' );
  textArray[1] = textArray[1] == 0 ? undefined : (textArray[1] == 1? textArray[1] + ' Minute' : textArray[1] + ' Minutes' );

  var text = "" + textArray[0] + (textArray[0] == undefined? "" : ", ") + textArray[1];
  $('.nextprayercounter').html(text + '  until '+ next.prayer);
  window.document.title = next.prayer.toUpperCase()+" in " + text+" | Masjid Times";

}

$(document).ready(function(){
  // Button listeners
  doButtonListeners();
  mt = newMasjidTimes(masjidConfig);

  // Ask for location
  navigator.geolocation.getCurrentPosition(function(positionData){
    mt.init(positionData.coords);
  });

  // Get the nearest mosques
  mt.on('mosques', function(nearestMosques){
    // TODO: Let the user pick a mosque
    mt.useMosque(nearestMosques[0]);
  });

  mt.on('tick', function(){
    // Do this every second
    updateRemaining();
  });

  mt.ready(function(){
    populateTimes(mt.mosque);
    updateRemaining();
  });

  // Let user choose a mosque
  // Ready should get fired sometime
});




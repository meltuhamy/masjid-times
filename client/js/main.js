var mt;
var masjidConfig = {url: window.location.origin+'/masjid/', debug: false};
var usingTomorrow = false;


var populateTimes = function(mosque){
  //Update any mosque name place holders.
  $('.mosque-name').html(mosque.name);

  //Populate today's times.
  var times = mt.times.getToday();
  var timesTomorrow = mt.times.getTomorrow();
  for(var i = 0; i<mt.prayers.length; i++){
    $('.today .'+mt.prayers[i]+'-time').html(times[mt.prayers[i]]);
    $('.tomorrow .'+mt.prayers[i]+'-time').html(timesTomorrow[mt.prayers[i]]);
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
  textArray[0] = textArray[0] == undefined || textArray[0] == 0 ? '' : (textArray[0] == 1? textArray[0] + ' Hour' : textArray[0] + ' Hours' );
  textArray[1] = textArray[1] == undefined || textArray[1] == 0 ? '' : (textArray[1] == 1? textArray[1] + ' Minute' : textArray[1] + ' Minutes' );

  var text = '';

  if(textArray[0] == '' && textArray[1] == '' && textArray[2] != undefined){
    // Less than a minute remaining.
    text = ''+textArray[2] + (textArray[2] == 1 ? ' Second' : ' Seconds');
  } else{
    text = "" + textArray[0] + (textArray[0] == '' ? "" : (textArray[1] != 0 ? ", " : "")) + textArray[1];
  }
  $('.nextprayercounter').html(text + '  until '+ next.prayer);
  window.document.title = next.prayer.toUpperCase()+" in " + text+" | Masjid Times";

};

var pickMosqueDialog = function(mosques){
  /*
  A mosque looks like this:
   capacity: "1100"
   contact: "020 7736 9060"
   description: "Arab"
   distance: "1.4017961344562937"
   dst-end: null
   dst-start: null
   id: "6"
   lat: "51.476309"
   location: "7 Bridges Place, Parsons Green, London, Greater London, SW6 4HW"
   long: "-0.201616"
   name: "Al-Muntada Al-Islami Trust"
   prayertimes_id: "2"
   */
  var numMosques = mosques.length;
  numMosques = numMosques < 5 ? numMosques : 4; // Max 4 mosques
  var text = "The app uses prayer times from your nearest mosque. By default the mosque which is nearest to you will be used. If you prefer, you can select a mosque from below.";

  text += "<ol id='mosque-list'>";
  for(var i = 0; i< numMosques; i++){
    var mosque = mosques[i];
    text += "<li data-mosque-index='"+i+"'><b>"+mosque.name+"</b><br /><span class='label'>"+Math.round(mosque.distance*10)/10+" km</span> "+mosque.location+"</li>";
  }
  text += "</ol>";
  bootbox.alert(text, function(){
    mt.useMosque(mosques[$('#mosque-list').find('li.selected').data('mosque-index')]);
  });
  $('#mosque-list').find('li:first').addClass('selected');
  $('#mosque-list').find('li').click(function(){
    $('#mosque-list').find('li').removeClass('selected');
    $(this).addClass('selected');
  });
};

$(document).ready(function(){
  // Button listeners
  doButtonListeners();
  mt = newMasjidTimes(masjidConfig);

  // NOTE: Event handlers should be called first before init.

  // Get the nearest mosques
  mt.on('mosques', function(nearestMosques){
    // TODO: Let the user pick a mosque
    pickMosqueDialog(nearestMosques);
    //mt.useMosque(nearestMosques[0]);
  });

  mt.on('tick', function(){
    // Do this every second
    updateRemaining();
  });

  mt.on('day', function(){
    // It's a new day :) Update today's prayer times.
    populateTimes(mt.mosque);
  });

  mt.ready(function(){
    populateTimes(mt.mosque);
    updateRemaining();
  });

  // Ask for location
  if(!mt.coordsCached()){
    navigator.geolocation.getCurrentPosition(function(positionData){
      mt.init(positionData.coords);
    }, function(error){
      if(error.PERMISSION_DENIED){
        bootbox.alert("Turning off location services is currently not supported. Stay tuned for updates :)");
      }
    });
  } else {
    mt.init();
  }

});


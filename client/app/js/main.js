var mt;
var backgrounds;
var handledAlarms = [];
var chrome = chrome || undefined;

mt = newMasjidTimes(masjidConfig);


window.location.reload = function(){
  if(chrome && chrome.app){
    chrome.runtime.reload();
  } else {
    window.location.reload();
  }
};
var fixBackgroundHeight = function(){
  // Fix background height (very hacky :( )
  $('#top-dashboard .background').height($('#top-dashboard').outerHeight());
};

var makeTransparent = function(prayer, opacity, animated){
  opacity = opacity || 0.0;
  var element = $.type(prayer) == 'string' ? '#top-dashboard #'+prayer+'-bg.background' : prayer;
  if(animated){
    $(element).animate({'opacity':opacity}, {
      duration: 1000,
      easing: 'swing'
    });
  } else {
    $(element).css('opacity', opacity);
  }
};

var makeOpaque = function(prayer, animated){
  var element = $.type(prayer) == 'string' ? '#top-dashboard #'+prayer+'-bg.background' : prayer;

  if(animated){
    $(element).animate({'opacity':1.0}, {
      duration: 1000,
      easing: 'swing'
    });
  } else {
    $(element).css('opacity',1.0);
  }
};

var setBackgroundState = function(prayer, completeness){
  // Set all opacity to 1 initially, then pop stack
  var i;
  for (i = 0; i < backgrounds.length; i++) {
    var current = backgrounds[i];
    if (current.prayer != prayer) {
      if (backgrounds[i + 1] && backgrounds[i + 1].prayer == prayer && completeness != undefined) {
        makeTransparent(current.element, 1 - completeness);
      } else {
        makeTransparent(current.element);
      }
    } else {
      makeOpaque(current.element);
      break;
    }
  }
};

var updateBackground = function(next, previous){
  var nextDate = next.date, previousDate = previous.date, remaining = next.remaining;
  var diff = nextDate - previousDate;
  var percentDone = 1 - remaining/diff;
  setBackgroundState(next.prayer, percentDone);

};

/**
 * Helper function to display prayer times into DOM
 * @param mosque
 */
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

  fixBackgroundHeight();

};

/**
 * Helper function to register click listeners
 */
var doButtonListeners = function(){
/*  $('#settings-clearcache').click(function(){
    //Clear the cache and reload.
    mt.clearLocalStorage();
    window.location.href = "#/home";
  });*/
};

/**
 * Helper function that allows the user to select a mosque
 * @param mosques
 */
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
  var text = "Select a mosque";

  text += "<ol id='mosque-list'>";
  for(var i = 0; i< numMosques; i++){
    var mosque = mosques[i];
    text += "<li data-mosque-index='"+i+"'><b>"+mosque.name+"</b><br /><span class='label label-default'>"+Math.round(mosque.distance*10)/10+" km</span> "+mosque.location+"</li>";
  }
  text += "</ol>";
  bootbox.alert(text, function(){
    var mosque = mosques[$('#mosque-list').find('li.selected').data('mosque-index')];
    mt.useMosque(mosque);
    humane.log("Mosque saved:<br />"+mosque.name);
    $('body').scrollTop(0);
  });
  var mosqueList = $('#mosque-list');
  $(mosqueList).find('li:first').addClass('selected');
  $(mosqueList).find('li').click(function(){
    $('#mosque-list').find('li').removeClass('selected');
    $(this).addClass('selected');
  });
};

/**
 * Set up the sound manager.
 */
soundManager.setup({
  preferFlash: false,
  url: 'swf/',
  flashVersion: 9, // optional: shiny features (default = 8)// optional: ignore Flash where possible, use 100% HTML5 mode
  // preferFlash: false,
  onready: function() {
    // Ready to use; soundManager.createSound() etc. can now be called.
    window.takbir = soundManager.createSound({
      id: 'takbir',
      url: 'audio/takbir.ogg',
      onload: function() { console.log('sound loaded!', this); }
      // other options here..
    });

  }
});



/**
 * Finally...
 */
$(document).ready(function(){

});


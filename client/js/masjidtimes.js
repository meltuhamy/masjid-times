/**
 * Creates a new masjidTimes Object
 * @param  {Object} config The configuration object
 * @return {Object}        The config (masjidTimes params)
 */
var newMasjidTimes = function(config, my){
  //Check jQuery and jStorage requirements
  if(!(jQuery && $.jStorage)){
    throw "jQuery and jStorage are required.";
    return null;
  }

  my = my || {};

  var ref = this;

  //Private properties
  var events = {
    ready: $.Callbacks(),  // Fired when succesfully fetched prayer data 
    prayer: $.Callbacks(), // Fired when any prayer has just passed
    fajr: $.Callbacks(),
    shuruq: $.Callbacks(),
    duhr: $.Callbacks(),
    asr: $.Callbacks(),
    asr2: $.Callbacks(),
    maghrib: $.Callbacks(),
    isha: $.Callbacks()
  };

  var l = {
    prayerTimes: 'prayertimes',
    nearestMosque: 'nearestMosque'
  };

  //Private methods
  var toJSON = function(data){
    return (typeof data) == 'string' ? JSON.parse(data) : data;
  };

  var prepareData = function(data){
    data.debug = config.debug? '1' : undefined;
    return data;
  };

  /**
   * Turns a time string of the form "hours:minutes" into an object
   * with properties hours and minutes
   * @param  {String} timeString The time string e.g. 04:00
   * @return {Object}            Object literal with properties hours, minutes
   */
  var stringToHoursMinutes = function(timeString){
    var split = timeString.split(":");
    return {hours: parseInt(split[0]), minutes: parseInt(split[1])};
  };

  /**
   * Turns a time string of the form "hours:minutes" into a date object
   * @param  {String} timeString The string to convert
   * @return {Date}              Todays date at that time.
   */
  var stringToTodayDate = function(timeString){
    var split, now;
    split = stringToHoursMinutes(timeString);
    now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), split.hours, split.minutes, 0, 0);
  };

  var calculateNextPrayer = function(fromDate){
    var allPrayers = prayers;
    var now = fromDate === undefined ? new Date() : fromDate;
    now.setSeconds(0); // Ensures no annoying rounding stuff.

    // Tomorrow's fajr if isha is past
    if(prayerPassed('isha')){
      return 'fajr';
    }

    var nearestPrayer = '';
    var minDiff = 86400000; // 24 hours (i.e. max diff initially)

    for(var i=0; i<allPrayers.length; i++){
      var prayer = allPrayers[i]; // e.g. "fajr" is first
      var prayerDate = stringToTodayDate(today[prayer]);
      var diff = prayerDate - now;

      // Only consider times in the future.
      if(diff >= 0 && diff < minDiff){
        minDiff = diff;
        nearestPrayer = prayer;
      }
    }
    return nearestPrayer;
  };



  // Public properties

  // A list of all the prayers
  var prayers = ['fajr','shuruq','duhr','asr','maghrib','isha'];

  // Acts like an ENUM
  var PRAYER = {
    fajr: 0,
    shuruq: 1,
    duhr: 2,
    asr: 3,
    maghrib: 4,
    isha: 5
  };

  // Holds the mosque information that we're using
  var mosque = undefined;

  // The today object shows today's prayer times.
  var today = undefined;

  // Next prayer
  var next = undefined;

  var public = {prayers: prayers, PRAYER: PRAYER, mosque: mosque, today: today, next:next};



  //Public methods
  
  var prayerPassed = function(prayer){
    return new Date() >= stringToTodayDate(today[prayer]);
  }

  public.prayerPassed = prayerPassed;

  /**
   * Clears all local storage stored by masjidtimes
   */
  var clearLocalStorage = function(){
    for(var k in l){
      if (l.hasOwnProperty(k)) localStorage.removeItem(k);
    }
  }

  public.clearLocalStorage = clearLocalStorage;

  var storeNearestMosque = function(mosque){
    localStorage[l.nearestMosque] = JSON.stringify(mosque);
  }

  public.storeNearestMosque = storeNearestMosque;

  var loadNearestMosque = function(){
    return localStorage[l.nearestMosque] == undefined ? undefined : JSON.parse(localStorage[l.nearestMosque]);
  }
  public.loadNearestMosque = loadNearestMosque;

  /**
   * Asynchronously does ajax request to get array of nearest mosques
   * @param  {Number}    lat      The latitude to search from
   * @param  {Number}    lng      The longitude to search from
   * @param  {[Number]}  range    (Optional) The range to search for
   * @param  {Function}  callback Callback function for when the request is done.
   */
  var requestNearestMosques = function(lat, lng, range, callback){
    $.ajax({
      url: config.url+'mosque/',
      type: 'GET',
      data: prepareData({'lat': lat, 'long': lng, 'range':range}),
      cache: true
    }).done(function(data){
      data = toJSON(data);
      callback({request: {'lat': lat, 'long': lng, 'range':range}, response: data});
    }).error(function(data){
      console.error('ajax error');
      console.error(data);
    });
  }
  public.requestNearestMosques = requestNearestMosques;

  /**
   * Asynchronously does ajax request to get the nearest mosque.
   * @param  {Number}    lat      The latitude to search from
   * @param  {Number}    lng      The longitude to search from
   * @param  {[Number]}  range    (Optional) The range to search for
   * @param  {Function}  callback Callback function for when the request is done.
   */
  var requestNearestMosque = function(lat, lng, range, callback){
    requestNearestMosques(lat, lng, range, function(data){
      callback({request: data.request, response: data.response[0]});
    });
  }
  public.requestNearestMosque = requestNearestMosque;

  var useMosque = function(mosqueData){
    mosque = mosqueData;
  }
  public.useMosque = useMosque;

  var getNearestMosque = function(callback){
    // Check if we already have a location stored
    if(loadNearestMosque() != undefined){
      callback(loadNearestMosque());
    } else {
      // Find location and do request
      navigator.geolocation.getCurrentPosition(function(locationData){
        // We have location data :D
        coords = locationData.coords;

        // Get the nearest mosque info and log it.
        requestNearestMosque(coords.latitude,coords.longitude,null,function(data){
          mosque = data.response;
          storeNearestMosque(mosque);
          callback(mosque);
        });
      });
    }
  }

  public.getNearestMosque = getNearestMosque;

  var requestTodayPrayerTimesByID = function(mosqueid, callback, inDate, sync){
    var date, day, month, async;
    date = inDate != undefined ? inDate : new Date;
    day = date.getDate();
    month = date.getMonth() + 1;
    async = sync != undefined ? !sync : true;

    $.ajax({
      url: config.url+'table/'+mosqueid,
      type: 'GET',
      data: prepareData({'month': month, 'day': day}),
      cache: true,
      async: async
    }).done(function(data){
      data = toJSON(data);
      //Update the today object
      today = data;
      callback({request: {'month': month, 'day': day}, response: data});
    });
  }
  public.requestTodayPrayerTimesByID = requestTodayPrayerTimesByID;

  /**
   * Uses mosque data to get the mosque's prayer times.
   * public.useMosque() should have been envoked before calling this.
   * @param  {Function} callback The function to call when request done.
   */
  var requestTodayPrayerTimes = function(callback, inDate, sync){
    if(mosque.prayertimes_id != undefined)
      requestTodayPrayerTimesByID(mosque.prayertimes_id, callback, inDate, sync);
  }
  public.requestTodayPrayerTimes = requestTodayPrayerTimes;

  var requestAllPrayerTimes = function(mosqueid, callback){
    $.ajax({
      url: config.url+'table/'+mosqueid,
      type: 'GET',
      cache: true
    }).done(function(data){
      data = toJSON(data);
      //Update the year object
      year = data;
      callback({response: data});
    });
  }
  public.requestAllPrayerTimes = requestAllPrayerTimes;

  var useDate = function(date, callback, sync){
    var dateToUse = new Date();
    // Sets todays prayer times to the date givens prayer times
    if(date == 'tomorrow'){
      dateToUse.setHours(0);
      dateToUse.setMinutes(0);
      dateToUse = new Date(dateToUse.getTime() + 24 * 60 * 60 * 1000);
    }

    //Request prayer time using the date
    requestTodayPrayerTimes(function(data){
      today = data.response;
      callback(data);
    }, dateToUse, sync);
  }
  public.useDate = useDate;




  //Constructor
  return public;
}

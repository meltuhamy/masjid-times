/**
 * Creates a new masjidTimes Object
 * @param  {Object} config The configuration object
 * @return {Object}        The config (masjidTimes params)
 */
var newMasjidTimes = function(config){
  // Private properties
  private = {
    // Store a configuration passed in
    config: config,

    //The next prayer interval id
    nextPrayerTimeoutId: {},

    // The function to call when time for prayer
    nextPrayerCallback: {},

    // The frequency to check for next prayer
    nextPrayerFrequency: {},

    // Local storage ids
    ls: {
      prayerTimes: 'prayertimes',
      nearestMosque: 'nearestMosque'
    }
  };

  //Private methods
  
  private.toJSON = function(data){
    return (typeof data) == 'string' ? JSON.parse(data) : data;
  }
  /**
   * Turns a time string of the form "hours:minutes" into an object
   * with properties hours and minutes
   * @param  {String} timeString The time string e.g. 04:00
   * @return {Object}            Object literal with properties hours, minutes
   */
  private.stringToHoursMinutes = function(timeString){
    var split = timeString.split(":");
    return {hours: parseInt(split[0]), minutes: parseInt(split[1])};
  }

  /**
   * Turns a time string of the form "hours:minutes" into a date object
   * @param  {String} timeString The string to convert
   * @return {Date}              Todays date at that time.
   */
  private.stringToTodayDate = function(timeString){
    var split, now;
    split = private.stringToHoursMinutes(timeString);
    now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), split.hours, split.minutes, 0, 0);
  }

  private.calculateNextPrayer = function(fromDate){
    var allPrayers = public.prayers;
    var now = fromDate === undefined ? new Date() : fromDate;
    now.setSeconds(0); // Ensures no annoying rounding stuff.

    var nearestPrayer = '';
    var minDiff = 86400000; // 24 hours (i.e. max diff initially)

    for(var i=0; i<allPrayers.length; i++){
      var prayer = allPrayers[i]; // e.g. "fajr" is first
      var prayerDate = private.stringToTodayDate(public.today[prayer]);
      var diff = prayerDate - now;

      // Only consider times in the future.
      if(diff >= 0 && diff < minDiff){
        minDiff = diff;
        nearestPrayer = prayer;
      }
    }
    return nearestPrayer;
  }

  private.prayerPassed = function(prayer){
    return new Date() >= private.stringToTodayDate(public.today[prayer]);
  }

  private.nextPrayerChecker = function(){
    public.updateSecondsRemaining();
    private.nextPrayerCallback(public.millisecondsToNextPrayer);
    public.nextPrayerInterval(private.nextPrayerCallback);
  }


  // Public properties
  public = {
    // A list of all the prayers
    prayers: ['fajr','shuruq','duhr','asr','maghrib','isha'],

    // Acts like an ENUM
    PRAYER: {
      fajr: 0,
      shuruq: 1,
      duhr: 2,
      asr: 3,
      maghrib: 4,
      isha: 5
    },

    // Holds the mosque information that we're using
    mosque: undefined,

    // The today object shows today's prayer times.
    today: undefined,

    // Next prayer
    next: undefined,

    //Time remaining until the next prayer
    millisecondsToNextPrayer: {}
  };

  //Public methods
  
  /**
   * Clears all local storage stored by masjidtimes
   */
  public.clearLocalStorage = function(){
    for(var k in private.ls){
      if (private.ls.hasOwnProperty(k)) localStorage.removeItem(k);
    }
  }

  public.storeNearestMosque = function(mosque){
    localStorage[private.ls.nearestMosque] = JSON.stringify(mosque);
  }

  public.loadNearestMosque = function(){
    return localStorage[private.ls.nearestMosque] == undefined ? undefined : JSON.parse(localStorage[private.ls.nearestMosque]);
  }

  /**
   * Asynchronously does ajax request to get array of nearest mosques
   * @param  {Number}    lat      The latitude to search from
   * @param  {Number}    lng      The longitude to search from
   * @param  {[Number]}  range    (Optional) The range to search for
   * @param  {Function}  callback Callback function for when the request is done.
   */
  public.requestNearestMosques = function(lat, lng, range, callback){
    $.ajax({
      url: private.config.url+'mosque/',
      type: 'GET',
      data: {'lat': lat, 'long': lng, 'range':range},
      cache: true
    }).done(function(data){
      data = private.toJSON(data);
      callback({request: {'lat': lat, 'long': lng, 'range':range}, response: data});
    }).error(function(data){
      console.error('ajax error');
      console.error(data);
    });
  }

  /**
   * Asynchronously does ajax request to get the nearest mosque.
   * @param  {Number}    lat      The latitude to search from
   * @param  {Number}    lng      The longitude to search from
   * @param  {[Number]}  range    (Optional) The range to search for
   * @param  {Function}  callback Callback function for when the request is done.
   */
  public.requestNearestMosque = function(lat, lng, range, callback){
    public.requestNearestMosques(lat, lng, range, function(data){
      callback({request: data.request, response: data.response[0]});
    });
  }

  public.useMosque = function(mosqueData){
    public.mosque = mosqueData;
  }

  public.getNearestMosque = function(callback){
    // Check if we already have a location stored
    if(public.loadNearestMosque() != undefined){
      callback(public.loadNearestMosque());
    } else {
      // Find location and do request
      navigator.geolocation.getCurrentPosition(function(locationData){
        // We have location data :D
        coords = locationData.coords;

        // Get the nearest mosque info and log it.
        public.requestNearestMosque(coords.latitude,coords.longitude,null,function(data){
          mosque = data.response;
          public.storeNearestMosque(mosque);
          callback(mosque);
        });
      });
    }
  }

  public.requestTodayPrayerTimesByID = function(mosqueid, callback){
    var date, day, month;
    date = new Date;
    day = date.getDate();
    month = date.getMonth() + 1;

    $.ajax({
      url: private.config.url+'table/'+mosqueid,
      type: 'GET',
      data: {'month': month, 'day': day},
      cache: true
    }).done(function(data){
      data = private.toJSON(data);
      //Update the today object
      public.today = data;
      callback({request: {'month': month, 'day': day}, response: data});
    });
  }

  /**
   * Uses mosque data to get the mosque's prayer times.
   * public.useMosque() should have been envoked before calling this.
   * @param  {Function} callback The function to call when request done.
   */
  public.requestTodayPrayerTimes = function(callback){
    if(public.mosque.prayertimes_id != undefined) public.requestTodayPrayerTimesByID(public.mosque.prayertimes_id, callback);
  }

  public.nextPrayerInterval = function(callback){
    private.nextPrayerCallback = callback;

    if(!isNaN(private.nextPrayerTimeoutId)){
      //Interval already set. Clear it.
      clearTimeout(private.nextPrayerTimeoutId);
    }

    //Do a next prayer check now...
    //private.nextPrayerCallback(public.updateSecondsRemaining());

    //Check every second
    private.nextPrayerFrequency = 20000;

    //Set the new interval
    private.nextPrayerTimeoutId = setTimeout(private.nextPrayerChecker, private.nextPrayerFrequency);
  }

  public.updateSecondsRemaining = function(){
    var allPrayers = public.prayers;
    var now = new Date();
    now.setSeconds(0);

    // Check what's the nearest (next) prayer time 
    next = public.next;   
    if(next === undefined || private.prayerPassed(next)){
      //Prayer has passed, check next prayer
      public.next = private.calculateNextPrayer(now);
    }

    // Update number of seconds remaining
    return public.millisecondsToNextPrayer = private.stringToTodayDate(public.today[public.next]) - now;
  }

  public.requestAllPrayerTimes = function(mosqueid, callback){
    $.ajax({
      url: private.config.url+'table/'+mosqueid,
      type: 'GET',
      cache: true
    }).done(function(data){
      data = private.toJSON(data);
      //Update the year object
      public.year = data;
      callback({response: data});
    });
  }





  //Constructor
  return public;
}

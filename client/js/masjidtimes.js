/**
 * Creates a new masjidTimes Object
 * @param  {Object} config The configuration object
 * @param  {Object} my     Used for inheritance
 * @return {Object}        The masjid times object
 */
var newMasjidTimes = function (config, my) {
  //Check jQuery and jStorage requirements
  if (!(jQuery && $.jStorage)) {
    throw "jQuery and jStorage are required.";
  }


                                      /*--------------------*
                                            Properties
                                      /*--------------------*/
  var my = my || {};

  var ref = this;

  /**
   * Everything everyone outside this function will see.
   * @type {Object}
   */
  var that;


  /**
   * A list of all prayers
   * @type {Array}
   */
  var prayers = ['fajr', 'shuruq', 'duhr', 'asr', 'maghrib', 'isha'];

  /**
   * A namespace which has all the prayer names.
   * Can be used as an enum
   * @type {Object}
   */
  var PRAYER = {
    fajr: 0,
    shuruq: 1,
    duhr: 2,
    asr: 3,
    maghrib: 4,
    isha: 5
  };

  /**
   * Gets a date object with some augmented properties.
   * @param [options]   Will be passed into the Date constructor.
   * @returns {Date}  The date object with some augmented properties e.g. date.day
   */
  var getDate = function(options){
    var date = options == undefined ? new Date() : new Date(options);
    date.day = date.getDate();
    date.month = date.getMonth()+1;
    return date;
  }
  /**
   * Today's date
   * @type {Date}
   */
  var today = getDate();

  /**
   * This object is basically a namespace for all the localStorage objects
   * used by MasjidTimes.
   * @type {Object}
   * @property {string} prayerTimes    A year of prayer times
   * @property {string} mosque         The mosque we are using
   */
  var l = {
    prayer: 'prayerTimes',
    mosque: 'nearestMosque'
  };

  /**
   * The mosque we are using
   * @type {Object}
   * @property {Object} mosque The mosque we are using
   * @property {Object} times  The prayer times we are using
   */
  var using = {};

  /**
   * Whether or not masjidTimes has been initialised (i.e. whether or not 'ready' has been fired)
   * @type {boolean}
   */
  var initialised = false;

  /**
   * If we're waiting for a mosque to be selected
   * @type {boolean}
   */
  var triggeredMosqueSelection = false;



  /**
   * These define the masjid times events.
   * Each item in this object is a jQuery Callbacks object, which is basically
   * a list of functions that get executed when the event gets fired.
   *
   * See http://api.jquery.com/category/callbacks-object/ for details.
   * @type {Object}
   */
  var events = {
    ready: $.Callbacks(),       // Got prayer data and mosque data
    prayer: $.Callbacks(),      // A prayer has passed
    fajr: $.Callbacks(),        // Fajr has passed
    shuruq: $.Callbacks(),      // Shuruq has passed
    duhr: $.Callbacks(),        // Duhr has passed
    asr: $.Callbacks(),         // Asr has passed
    asr2: $.Callbacks(),        // Asr (hanafi) has passed
    maghrib: $.Callbacks(),     // Maghrib has passed
    isha: $.Callbacks(),        // Isha has passed
    mosques: $.Callbacks(),     // Got nearest mosques
    mosque: $.Callbacks(),      // Mosque has been chosen
    prayertimes: $.Callbacks(), // Got prayer times
    debug: $.Callbacks()        // Event that is used for debugging what events got fired etc.
  };



                                                /*--------------------*
                                                       Methods
                                                /*--------------------*/
  /**
   * Provides asynchronous server request functionalities specific to the prayertimes api.
   * @type {Object}
   */
  var ajax = {};

  /**
   * Performs a get request on the server.
   * @param {string}   url      The url to call (e.g. 'mosque/')
   * @param {Object}   data     The data to send to the server
   * @param {function} callback The function to call on success
   * @param {function} [errorCallback] Called when there was an error. Optional
   */
  ajax.get = function (url, data, callback, errorCallback) {
    var req = prepareData(data);
    var reqUrl = config.url + url;
    $.ajax({url: reqUrl, data: req, type: 'GET', cache: true}).done(function (responseData) {
      responseData = toJSON(responseData);
      callback($.extend(responseData, {_request: req}));
    }).error(function (errorData) {
          if (errorCallback == undefined) {
            console.error({url: reqUrl, request:req, response: "AJAX Error: "+errorData.statusText+" ("+errorData.status+") : "+errorData.responseText});
          } else {
            errorCallback(errorData);
          }
        });
  };

  /**
   * Requests array of nearest mosques
   * @param {{lat:Number, lng:Number, [range]:Number}} options The options of the function.
   * @param {Function} callback Function called once request completed
   */
  ajax.nearestMosques = function (options, callback) {
    ajax.get('mosque/', options, callback);
  };

  /**
   * Requests the mosque with a given mosque id
   * @param {Number}   id        The id of the mosque
   * @param {Function} callback  Function called once request completed
   */
  ajax.mosqueById = function (id, callback) {
    ajax.get('mosque/' + id, {}, callback);
  };

  /**
   * Requests the prayer times. Result depends on options given.
   * If only the id is provided, gets prayer times for the whole year. Otherwise for that month/day/prayer.
   * @param {{id:Number, [month]:Number, [day]:Number, [prayer]:string}} options
   * @param {Function} callback
   */
  ajax.prayerTimesById = function (options, callback) {
    ajax.get('table/'+ options.id, options, callback);
  };


  /**
   * Clears all local storage stored by masjidTimes
   */
  var clearLocalStorage = function () {
    for (var k in l) {
      if (l.hasOwnProperty(k)) $.jStorage.deleteKey(k);
    }
  };


  /**
   * Takes in some string|json and turns it into json if it isn't already.
   * @param  {string|Object}  data
   * @return {Object}         The data in JSON form
   */
  var toJSON = function (data) {
    return (typeof data) == 'string' ? JSON.parse(data) : data;
  };

  /**
   * Augments the data with metadata.
   * The metadata right now is just debug info, but it could also be
   * other stuff like authentication if we want to.
   * @param  {Object} data The data we are going to send
   * @return {Object}      The date we are going to send, augmented with metadata.
   */
  var prepareData = function (data) {
    data.debug = config.debug ? '1' : undefined;
    return data;
  };

  /**
   * Turns a time string of the form "hours:minutes" into an object
   * with properties hours and minutes
   * @param  {String} timeString The time string e.g. 04:00
   * @return {{hours:Number, minutes:Number}}    Object literal with properties hours, minutes
   */
  var stringToHoursMinutes = function (timeString) {
    var split = timeString.split(":");
    return {hours: parseInt(split[0]), minutes: parseInt(split[1])};
  };

  /**
   * Turns a time string of the form "hours:minutes" into a date object
   * @param  {String} timeString The string to convert
   * @return {Date}              Today's date at that time.
   */
  var stringToTodayDate = function (timeString) {
    var split, now;
    split = stringToHoursMinutes(timeString);
    now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), split.hours, split.minutes, 0, 0);
  };

  /**
   * Has the given prayer passed yet?
   * @param  {string} prayer The prayer in question e.g. 'fajr'
   * @return {boolean}       True if the prayer has passed the current time (e.g. true if fajr was in the past)
   */
  var prayerPassed = function (prayer) {
    return new Date() >= stringToTodayDate(today[prayer]);
  };

  /**
   * Uses today's time to calculate what the next prayer will be.
   * @param  {Date} fromDate The date we want to calculate the nearest prayer from.
   * @return {string}        The nearest (next prayer) after the date given (e.g. 'fajr')
   */
  var calculateNextPrayer = function (fromDate) {
    var now = fromDate === undefined ? new Date() : fromDate;
    now.setSeconds(0); // Ensures no annoying rounding stuff.

    // Tomorrow's fajr if isha is past
    if (prayerPassed('isha')) {
      return 'fajr';
    }

    var nearestPrayer = '';
    var minDiff = 86400000; // 24 hours (i.e. max diff initially)

    for (var i = 0; i < prayers.length; i++) {
      var prayer = prayers[i]; // e.g. "fajr" is first
      var prayerDate = stringToTodayDate(today[prayer]);
      var diff = prayerDate - now;

      // Only consider times in the future.
      if (diff >= 0 && diff < minDiff) {
        minDiff = diff;
        nearestPrayer = prayer;
      }
    }
    return nearestPrayer;
  };


                                              /*--------------------*
                                                 App logic / public
                                              /*--------------------*/

  /**
   * Adds a callback to an event
   * @param  {string}   event       The event name
   * @param  {Function} newCallback The callback to add
   * @return {Object}               The MasjidTimes object.
   */
  var on = function (event, newCallback) {
    //Get the callbacks object
    var callback = events[event];
    if (callback) {
      // Add callback to the queue
      if (typeof callback.fire == 'function') {
        callback.add(newCallback);
      }
    }
    return that;
  };


  var fire = function (event, args) {
    var callback = events[event];
    if (callback) {
      callback.fire(args);
      events.debug.fire({event: event, args: args});
    }
    return that;
  };


  on('debug', function(data){
    console.debug({Event : data.event, args: data.args});
  });

  on('mosque', function(mosque){
    // Someone has chosen a mosque.
    using.mosque = mosque;
    $.jStorage.set(l.mosque, mosque);

    if(!initialised){
      checkInit();
    }
  });

  on('prayertimes', function(prayerTimes){
    // We have got the prayer times.
    using.prayer = prayerTimes;
    $.jStorage.set(l.prayer, prayerTimes);
    if(!initialised){
      checkInit();
    }
  });

  on('ready', function(){
    initialised = true;
  });

  var ready = function(callback){
    on('ready', callback);
  }




  /**
   * Tells masjidTimes to use the mosque provided
   * @param {Object} mosque  A mosque object
   */
  var useMosque = function(mosque){
    // Fire the mosque event
    fire('mosque', mosque);
  };

  /**
   * Checks if we have enough data loaded that we can consider masjidTimes ready
   * @returns {Boolean} True if masjidTimes is ready.
   */
  var isReady = function(){
    return isStorageReady() && isUsingReady();
  };

  /**
   * Checks if masjidTimes has loaded stuff into memory yet
   * @returns {boolean} True if everything's loaded up
   */
  var isUsingReady = function(){
    return using != undefined && using.mosque != undefined && using.prayer != undefined;
  };

  /**
   * Checks if everything that needs to be stored in local storage has been stored or not.
   * @returns {boolean} True if everything's been stored.
   */
  var isStorageReady = function(){
    return $.jStorage.get(l.mosque) != undefined && $.jStorage.get(l.prayer) != undefined;
  };

  /**
   * Gets data from local storage and puts it into using.
   */
  var loadFromStorage = function(){
    using.mosque = $.jStorage.get(l.mosque);
    using.prayer = $.jStorage.get(l.prayer);
  }

  /**
   * Gets data from using and puts it into local storage.
   */
  var putToStorage = function(){
    $.jStorage.set(l.mosque, using.mosque);
    $.jStorage.set(l.prayer, using.prayer);
  }


  var checkInit = function(forced){
    if(forced){
      clearLocalStorage();
    }
    if(isReady()){
      fire('ready');
    } else if(isStorageReady() && !isUsingReady()){
      // Case when there is stuff in storage but isn't loaded yet:
      loadFromStorage();
      fire('ready');
    } else if(isUsingReady() && !isStorageReady()){
      // Case when using is ready but we haven't stored it to local storage
      putToStorage();
      fire('ready');
    } else{
      // Case when nothing is ready.
      // Here we need to request from server if we haven't already.
      if(using.mosque == undefined && !triggeredMosqueSelection){
        // We don't have a mosque chosen yet.
        ajax.nearestMosques(using.coords, function(nearestMosques){
          fire('mosques', nearestMosques);
          triggeredMosqueSelection = true;
        });
      }

      if(using.prayer == undefined && using.mosque != undefined){
        // TODO: Match the mosque's prayer times id with the using.prayer id in this if check
        // We have a mosque chosen but don't have its prayer times yet.
        ajax.prayerTimesById({id: using.mosque.prayerid}, function(prayerTimes){
          fire('prayertimes', prayerTimes);
        });
      }
    }
  };


  /**
   * Loads stuff from local storage. If forced, then does a new request.
   * @param {{longitude:Number, latitude:Number}} [coords] The user's location
   * @param {boolean} [forced] If true, empties local storage and requests new thing from server.
   * @returns {Object}
   */
  var init = function(coords, forced) {
    using.coords = {lat: coords.latitude, long: coords.longitude};
    checkInit(forced);
    return that;
  };

  /**
   * A set of properties and methods to do with prayer times.
   * @type {{getToday}}
   */
  var times = {};


  times.getToday = function(){
    if(initialised){
      // Search the prayer times for todays date.
      return $.grep(using.prayer, function(element, index){return element.month == today.month && element.day == today.day;})[0];
    }
  }



  that = using;
  that.times = times;
  that.prayers = prayers;
  that.ready = ready;

  that.ajax = ajax;
  that.clearLocalStorage = clearLocalStorage;
  that.useMosque = useMosque;
  that.init = init;
  that.prayerPassed = prayerPassed;
  that.fire = fire;
  that.on = on;





  //Constructor
  return that;
};

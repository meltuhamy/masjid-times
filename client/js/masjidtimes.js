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
   * This object is basically a namespace for all the localStorage objects
   * used by MasjidTimes.
   * @type {Object}
   * @property {string} prayerTimes    A year of prayer times
   * @property {string} mosque         The mosque we are using
   */
  var l = {
    prayerTimes: 'prayerTimes',
    nearestMosque: 'nearestMosque'
  };

  /**
   * The mosque we are using
   * @type {Object}
   * @property {Object} mosque The mosque we are using
   * @property {Object} times  The prayer times we are using
   */
  var using = {};



  /**
   * These define the masjid times events.
   * Each item in this object is a jQuery Callbacks object, which is basically
   * a list of functions that get executed when the event gets fired.
   *
   * See http://api.jquery.com/category/callbacks-object/ for details.
   * @type {Object}
   */
  var events = {
    ready: $.Callbacks(),   // Got prayer data and mosque data
    prayer: $.Callbacks(),  // A prayer has passed
    fajr: $.Callbacks(),    // Fajr has passed
    shuruq: $.Callbacks(),  // Shuruq has passed
    duhr: $.Callbacks(),    // Duhr has passed
    asr: $.Callbacks(),     // Asr has passed
    asr2: $.Callbacks(),    // Asr (hanafi) has passed
    maghrib: $.Callbacks(), // Maghrib has passed
    isha: $.Callbacks(),    // Isha has passed
    mosques: $.Callbacks()  // Got nearest mosques
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
    $.ajax({url: config.url + url, data: prepareData(data), type: 'GET', cache: true}).done(function (responseData) {
      responseData = toJSON(responseData);
      callback($.extend(responseData, {_request: data}));
    }).error(function (errorData) {
          if (errorCallback == undefined) {
            console.error("AJAX Error");
            console.error(errorData);
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
      if (l.hasOwnProperty(k)) $.deleteKey(k);
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
      if (typeof callback == 'function') {
        callback.add(newCallback);
      }
    }
    return that;
  };


  var fire = function (event, args) {
    var callback = events[event];
    if (callback) {
      callback.fire(args);
    }
    return that;
  };




  /**
   * Tells masjidTimes to use the mosque provided
   * @param {Object} mosque  A mosque object
   */
  var useMosque = function(mosque){
    using.mosque = mosque;
  };


  /**
   * Loads stuff from local storage. If forced, then does a new request.
   * @param {boolean} forced If true, empties local storage and requests new thing from server.
   * @returns {Object}
   */
  var init = function(forced) {
    // Get nearest mosques or load last used mosque
    // Get the prayer times (whole year).
    return that;
  };



  that = {
    prayers: prayers,
    PRAYER: PRAYER,
    mosque: mosque,
    today: today,
    next: next
  };

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

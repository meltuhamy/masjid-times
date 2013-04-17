/**
 * Creates a new masjidTimes Object
 * @param  {Object} config The configuration object
 * @param  {Object} my     Used for inheritence
 * @return {Object}        The masjid times object
 */
var newMasjidTimes = function (config, my) {
  //Check jQuery and jStorage requirements
  if (!(jQuery && $.jStorage)) {
    throw "jQuery and jStorage are required.";
    return null;
  }

  var my = my || {};

  var ref = this;

  //Private properties

  /**
   * These define the masjid times events.
   * Each item in this object is a jQuery Callbacks object, which is basically
   * a list of functions that get executed when the event gets fired.
   *
   * See http://api.jquery.com/category/callbacks-object/ for details.
   * @type {Object}
   */
  var events = {
    ready: $.Callbacks(),  // Fired when succesfully fetched prayer data 
    prayer: $.Callbacks(), // Fired when any prayer has just passed
    fajr: $.Callbacks(),
    shuruq: $.Callbacks(),
    duhr: $.Callbacks(),
    asr: $.Callbacks(),
    asr2: $.Callbacks(),
    maghrib: $.Callbacks(),
    isha: $.Callbacks(),
    mosques: $.Callbacks()
  };


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
   * @param {{lat:Number, lng:Number, range:Number}} options The options of the function.
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
   * This object is basically a namespace for all the localstorage objects
   * used by MasjidTimes.
   * @type {Object}
   */
  var l = {
    prayerTimes: 'prayertimes',
    nearestMosque: 'nearestMosque'
  };

  //Private methods

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
   * @return {Object}            Object literal with properties hours, minutes
   */
  var stringToHoursMinutes = function (timeString) {
    var split = timeString.split(":");
    return {hours: parseInt(split[0]), minutes: parseInt(split[1])};
  };

  /**
   * Turns a time string of the form "hours:minutes" into a date object
   * @param  {String} timeString The string to convert
   * @return {Date}              Todays date at that time.
   */
  var stringToTodayDate = function (timeString) {
    var split, now;
    split = stringToHoursMinutes(timeString);
    now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), split.hours, split.minutes, 0, 0);
  };

  /**
   * Uses today's time to calculate what the next prayer will be.
   * @param  {Date} fromDate The date we want to calculate the nearest prayer from.
   * @return {string}        The nearest (next prayer) after the date given (e.g. 'fajr')
   */
  var calculateNextPrayer = function (fromDate) {
    var allPrayers = prayers;
    var now = fromDate === undefined ? new Date() : fromDate;
    now.setSeconds(0); // Ensures no annoying rounding stuff.

    // Tomorrow's fajr if isha is past
    if (prayerPassed('isha')) {
      return 'fajr';
    }

    var nearestPrayer = '';
    var minDiff = 86400000; // 24 hours (i.e. max diff initially)

    for (var i = 0; i < allPrayers.length; i++) {
      var prayer = allPrayers[i]; // e.g. "fajr" is first
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


  // Public properties

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
   * Holds the mosque information that we're using.
   * Starts undefined then gets populated when ready.
   * @type {Object}
   */
  var mosque = undefined;

  /**
   * The today object shows today's prayer times.
   * Starts undefined then gets populated when ready.
   * @type {Object}
   */
  var today = undefined;

  /**
   * The next prayer.
   * Starts undefined then gets populated when ready.
   * @type {Object}
   */
  var next = undefined;

  /**
   * Everything everyone outside this function will see.
   * @type {Object}
   */
  var that = {prayers: prayers, PRAYER: PRAYER, mosque: mosque, today: today, next: next};


  //Public methods

  /**
   * Adds a callback to an event
   * @param  {string}   event    The event name
   * @param  {Function} callback The callback to add
   * @return {Object}            The MasjidTimes object.
   */
  var on = function (event, callback) {
    //Get the callbacks object
    var callback = events[event];
    if (callback) {
      // Add callback to the queue
      if (typeof callback == 'function') {
        callback.add(callback);
      }
    }
    return that;
  }
  that.on = on;


  var fire = function (event, args) {
    var callback = events[event];
    if (callback) {
      callback.fire(args);
    }
    return that;
  }
  that.fire = fire;

  /**
   * Had the prayer passed yet?
   * @param  {string} prayer The prayer in question e.g. 'fajr'
   * @return {boolean}       True if the prayer has passed the current time (e.g. true if fajr was in the past)
   */
  var prayerPassed = function (prayer) {
    return new Date() >= stringToTodayDate(today[prayer]);
  }

  that.prayerPassed = prayerPassed;

  /**
   * Clears all local storage stored by masjidtimes
   */
  var clearLocalStorage = function () {
    for (var k in l) {
      if (l.hasOwnProperty(k)) localStorage.removeItem(k);
    }
  }

  that.clearLocalStorage = clearLocalStorage;

  /**
   * Store the nearest mosque in local storage.
   * @param  {Object} mosque The nearest mosque / mosque we want to store
   */
  var storeNearestMosque = function (mosque) {
    localStorage[l.nearestMosque] = JSON.stringify(mosque);
  }
  that.storeNearestMosque = storeNearestMosque;

  /**
   * Loads and returns the nearest mosque from local storage
   * @return {Object} The mosque that was stored.
   */
  var loadNearestMosque = function () {
    return localStorage[l.nearestMosque] == undefined ? undefined : JSON.parse(localStorage[l.nearestMosque]);
  }
  that.loadNearestMosque = loadNearestMosque;

  /**
   * Asynchronously does ajax request to get array of nearest mosques
   * @param  {Number}    lat      The latitude to search from
   * @param  {Number}    lng      The longitude to search from
   * @param  {[Number]}  range    (Optional) The range to search for
   * @param  {Function}  callback Callback function for when the request is done.
   */
  var requestNearestMosques = function (lat, lng, range, callback) {
    $.ajax({
      url: config.url + 'mosque/',
      type: 'GET',
      data: prepareData({'lat': lat, 'long': lng, 'range': range}),
      cache: true
    }).done(function (data) {
          data = toJSON(data);
          callback({request: {'lat': lat, 'long': lng, 'range': range}, response: data});
        }).error(function (data) {
          console.error('ajax error');
          console.error(data);
        });
  }
  that.requestNearestMosques = requestNearestMosques;

  /**
   * Asynchronously does ajax request to get the nearest mosque.
   * @param  {Number}    lat      The latitude to search from
   * @param  {Number}    lng      The longitude to search from
   * @param  {[Number]}  range    (Optional) The range to search for
   * @param  {Function}  callback Callback function for when the request is done.
   */
  var requestNearestMosque = function (lat, lng, range, callback) {
    requestNearestMosques(lat, lng, range, function (data) {
      callback({request: data.request, response: data.response[0]});
    });
  }
  that.requestNearestMosque = requestNearestMosque;

  /**
   * Lets prayer times use that mosque from now on.
   * @param  {Object} mosqueData The mosque to use
   */
  var useMosque = function (mosqueData) {
    mosque = mosqueData;
  }
  that.useMosque = useMosque;

  /**
   * Loads from storage the mosque we want to use.
   * Otherwise, requests the nearest mosque from server.
   * @param  {Function} callback What to do once we have the mosque
   */
  var getNearestMosque = function (callback) {
    // Check if we already have a location stored
    if (loadNearestMosque() != undefined) {
      callback(loadNearestMosque());
    } else {
      // Find location and do request
      navigator.geolocation.getCurrentPosition(function (locationData) {
        // We have location data :D
        coords = locationData.coords;

        // Get the nearest mosque info and log it.
        requestNearestMosque(coords.latitude, coords.longitude, null, function (data) {
          mosque = data.response;
          storeNearestMosque(mosque);
          callback(mosque);
        });
      });
    }
  }

  that.getNearestMosque = getNearestMosque;

  /**
   * Gets the prayer times from a prayer timetable id
   * @param  {number}   mosqueid The prayertimes id
   * @param  {Function} callback What to do once we have the data
   * @param  {Date}     inDate   The date for which to get prayer times
   * @param  {boolean}  sync     Whether or not this is an asynch call
   */
  var requestTodayPrayerTimesByID = function (mosqueid, callback, inDate, sync) {
    var date, day, month, async;
    date = inDate != undefined ? inDate : new Date;
    day = date.getDate();
    month = date.getMonth() + 1;
    async = sync != undefined ? !sync : true;

    $.ajax({
      url: config.url + 'table/' + mosqueid,
      type: 'GET',
      data: prepareData({'month': month, 'day': day}),
      cache: true,
      async: async
    }).done(function (data) {
          data = toJSON(data);
          //Update the today object
          today = data;
          callback({request: {'month': month, 'day': day}, response: data});
        });
  }
  that.requestTodayPrayerTimesByID = requestTodayPrayerTimesByID;

  /**
   * Uses mosque data to get the mosque's prayer times.
   * public.useMosque() should have been envoked before calling this.
   * @param  {Function} callback The function to call when request done.
   * @param sync
   * @param inDate
   */
  var requestTodayPrayerTimes = function (callback, inDate, sync) {
    if (mosque.prayertimes_id != undefined)
      requestTodayPrayerTimesByID(mosque.prayertimes_id, callback, inDate, sync);
  }
  that.requestTodayPrayerTimes = requestTodayPrayerTimes;

  /**
   * Given a prayer times id, gets a whole year of prayer times
   * @param  {number}   mosqueid Prayer times id
   * @param  {Function} callback The function to call once we got the prayer times
   */
  var requestAllPrayerTimes = function (mosqueid, callback) {
    $.ajax({
      url: config.url + 'table/' + mosqueid,
      type: 'GET',
      cache: true
    }).done(function (data) {
          data = toJSON(data);
          //Update the year object
          year = data;
          callback({response: data});
        });
  }
  that.requestAllPrayerTimes = requestAllPrayerTimes;

  /**
   * Tells prayer times to use specific set of prayer time siginified by the date given
   * @param  {Date}      date       The date for which to get prayer times
   * @param  {Function}  callback   What to do once we have the prayer times
   * @param  {boolean}   sync       Whether or not this is a synchronous callback
   */
  var useDate = function (date, callback, sync) {
    var dateToUse = new Date();
    // Sets todays prayer times to the date givens prayer times
    if (date == 'tomorrow') {
      dateToUse.setHours(0);
      dateToUse.setMinutes(0);
      dateToUse = new Date(dateToUse.getTime() + 24 * 60 * 60 * 1000);
    }

    //Request prayer time using the date
    requestTodayPrayerTimes(function (data) {
      today = data.response;
      callback(data);
    }, dateToUse, sync);
  }
  that.useDate = useDate;

  var init = function () {
    // Get nearest mosques or load last used mosque
    // Get the prayer times (whole year).
  }


  //Constructor
  return that;
}

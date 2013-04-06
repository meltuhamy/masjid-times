// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
(function($){
  if(navigator.geolocation){return;}
  var domWrite = function(){
      setTimeout(function(){
        throw('document.write is overwritten by geolocation shim. This method is incompatible with this plugin');
      }, 1);
    },
    id = 0
  ;
  var geoOpts = $.webshims.cfg.geolocation || {};
  navigator.geolocation = (function(){
    var pos;
    var api = {
      getCurrentPosition: function(success, error, opts){
        var locationAPIs = 2,
          errorTimer,
          googleTimer,
          calledEnd,
          endCallback = function(){
            if(calledEnd){return;}
            if(pos){
              calledEnd = true;
              success($.extend({timestamp: new Date().getTime()}, pos));
              resetCallback();
              if(window.JSON && window.sessionStorage){
                try{
                  sessionStorage.setItem('storedGeolocationData654321', JSON.stringify(pos));
                } catch(e){}
              }
            } else if(error && !locationAPIs) {
              calledEnd = true;
              resetCallback();
              error({ code: 2, message: "POSITION_UNAVAILABLE"});
            }
          },
          googleCallback = function(){
            locationAPIs--;
            getGoogleCoords();
            endCallback();
          },
          resetCallback = function(){
            $(document).unbind('google-loader', resetCallback);
            clearTimeout(googleTimer);
            clearTimeout(errorTimer);
          },
          getGoogleCoords = function(){
            if(pos || !window.google || !google.loader || !google.loader.ClientLocation){return false;}
            var cl = google.loader.ClientLocation;
                  pos = {
              coords: {
                latitude: cl.latitude,
                        longitude: cl.longitude,
                        altitude: null,
                        accuracy: 43000,
                        altitudeAccuracy: null,
                        heading: parseInt('NaN', 10),
                        velocity: null
              },
                      //extension similiar to FF implementation
              address: $.extend({streetNumber: '', street: '', premises: '', county: '', postalCode: ''}, cl.address)
                  };
            return true;
          },
          getInitCoords = function(){
            if(pos){return;}
            getGoogleCoords();
            if(pos || !window.JSON || !window.sessionStorage){return;}
            try{
              pos = sessionStorage.getItem('storedGeolocationData654321');
              pos = (pos) ? JSON.parse(pos) : false;
              if(!pos.coords){pos = false;} 
            } catch(e){
              pos = false;
            }
          }
        ;
        
        getInitCoords();
        
        if(!pos){
          if(geoOpts.confirmText && !confirm(geoOpts.confirmText.replace('{location}', location.hostname))){
            if(error){
              error({ code: 1, message: "PERMISSION_DENIED"});
            }
            return;
          }
          $.ajax({
            url: 'http://freegeoip.net/json/',
            dataType: 'jsonp',
            cache: true,
            jsonp: 'callback',
            success: function(data){
              locationAPIs--;
              if(!data){return;}
              pos = pos || {
                coords: {
                  latitude: data.latitude,
                          longitude: data.longitude,
                          altitude: null,
                          accuracy: 43000,
                          altitudeAccuracy: null,
                          heading: parseInt('NaN', 10),
                          velocity: null
                },
                        //extension similiar to FF implementation
                address: {
                  city: data.city,
                  country: data.country_name,
                  countryCode: data.country_code,
                  county: "",
                  postalCode: data.zipcode,
                  premises: "",
                  region: data.region_name,
                  street: "",
                  streetNumber: ""
                }
                    };
              endCallback();
            },
            error: function(){
              locationAPIs--;
              endCallback();
            }
          });
          clearTimeout(googleTimer);
          if (!window.google || !window.google.loader) {
            googleTimer = setTimeout(function(){
              //destroys document.write!!!
              if (geoOpts.destroyWrite) {
                document.write = domWrite;
                document.writeln = domWrite;
              }
              $(document).one('google-loader', googleCallback);
              $.webshims.loader.loadScript('http://www.google.com/jsapi', false, 'google-loader');
            }, 800);
          } else {
            locationAPIs--;
          }
        } else {
          setTimeout(endCallback, 1);
          return;
        }
        if(opts && opts.timeout){
          errorTimer = setTimeout(function(){
            resetCallback();
            if(error) {
              error({ code: 3, message: "TIMEOUT"});
            }
          }, opts.timeout);
        } else {
          errorTimer = setTimeout(function(){
            locationAPIs = 0;
            endCallback();
          }, 10000);
        }
      },
      clearWatch: $.noop
    };
    api.watchPosition = function(a, b, c){
      api.getCurrentPosition(a, b, c);
      id++;
      return id;
    };
    return api;
  })();
  
  $.webshims.isReady('geolocation', true);
})(jQuery);


/**
 * Javascript Countdown
 * Copyright (c) 2009 Markus Hedlund
 * Version 1.1
 * Licensed under MIT license
 * http://www.opensource.org/licenses/mit-license.php
 * http://labs.mimmin.com/countdown
 */

var remaining = {
  /**
   * Get the difference of the passed date, and now. The different formats of the taget parameter are:
   * January 12, 2009 15:14:00     (Month dd, yyyy hh:mm:ss)
   * January 12, 2009              (Month dd, yyyy)
   * 09,00,12,15,14,00             (yy,mm,dd,hh,mm,ss) Months range from 0-11, not 1-12.
   * 09,00,12                      (yy,mm,dd)          Months range from 0-11, not 1-12.
   * 500                           (milliseconds)
   * 2009-01-12 15:14:00           (yyyy-mm-dd hh-mm-ss)
   * 2009-01-12 15:14              (yyyy-mm-dd hh-mm)
   * @param target Target date. Can be either a date object or a string (formated like '24 December, 2010 15:00:00')
   * @return Difference in seconds
   */
  getSeconds: function(target) {
    var today = new Date();

    if (typeof(target) == 'object') {
      var targetDate = target;
    } else {
      var matches = target.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})(:(\d{2}))?/); // YYYY-MM-DD HH-MM-SS
      if (matches != null) {
        matches[7] = typeof(matches[7]) == 'undefined' ? '00' : matches[7];
        var targetDate = new Date(matches[1], matches[2] - 1, matches[3], matches[4], matches[5], matches[7]);
      } else {
        var targetDate = new Date(target);
      }
    }

    return Math.floor((targetDate.getTime() - today.getTime()) / 1000);
  },

  /**
   * @param seconds Difference in seconds
   * @param i18n A language object (see code)
   * @param onlyLargestUnit Return only the largest unit (see documentation)
   * @param hideEmpty Hide empty units (see documentation)
   * @return String formated something like '1 week, 1 hours, 1 second'
   */
  getString: function(seconds, i18n, onlyLargestUnit, hideEmpty) {
    if (seconds < 1) {
      return '';
    }

    if (typeof(hideEmpty) == 'undefined' || hideEmpty == null) {
      hideEmpty = true;
    }
    if (typeof(onlyLargestUnit) == 'undefined' || onlyLargestUnit == null) {
      onlyLargestUnit = false;
    }
    if (typeof(i18n) == 'undefined' || i18n == null) {
      i18n = {
        weeks: ['week', 'weeks'],
        days: ['day', 'days'],
        hours: ['hour', 'hours'],
        minutes: ['minute', 'minutes'],
        seconds: ['second', 'seconds']
      };
    }

    var units = {
      weeks: 7 * 24 * 60 * 60,
      days: 24 * 60 * 60,
      hours: 60 * 60,
      minutes: 60,
      seconds: 1
    };

    var returnArray = [];
    var value;
    for (unit in units) {
      value = units[unit];
      if (seconds / value >= 1 || unit == 'seconds' || !hideEmpty) {
        secondsConverted = Math.floor(seconds / value);
        var i18nUnit = i18n[unit][secondsConverted == 1 ? 0 : 1];
        returnArray.push(secondsConverted + ' ' + i18nUnit);
        seconds -= secondsConverted * value;

        if (onlyLargestUnit) {
          break;
        }
      }
    };

    return returnArray.join(', ');
  },

  /**
   * @param seconds Difference in seconds
   * @return String formated something like '169:00:01'
   */
  getStringDigital: function(seconds) {
    if (seconds < 1) {
      return '';
    }

    remainingTime = remaining.getArray(seconds);

    for (index in remainingTime) {
      remainingTime[index] = remaining.padNumber(remainingTime[index]);
    };

    return remainingTime.join(':');
  },

  /**
   * @param seconds Difference in seconds
   * @return Array with hours, minutes and seconds
   */
  getArray: function(seconds) {
    if (seconds < 1) {
      return [];
    }

    var units = [60 * 60, 60, 1];

    var returnArray = [];
    var value;
    for (index in units) {
      value = units[index];
      secondsConverted = Math.floor(seconds / value);
      returnArray.push(secondsConverted);
      seconds -= secondsConverted * value;
    };

    return returnArray;
  },

  /**
   * @param number An integer
   * @return Integer padded with a 0 if necessary
   */
  padNumber: function(number) {
    return (number >= 0 && number < 10) ? '0' + number : number;
  }
};

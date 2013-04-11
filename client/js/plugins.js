// JStorage http://www.jstorage.info/
(function(){function C(){var a="{}";if("userDataBehavior"==h){d.load("jStorage");try{a=d.getAttribute("jStorage")}catch(b){}try{r=d.getAttribute("jStorage_update")}catch(c){}g.jStorage=a}D();x();E()}function u(){var a;clearTimeout(F);F=setTimeout(function(){if("localStorage"==h||"globalStorage"==h)a=g.jStorage_update;else if("userDataBehavior"==h){d.load("jStorage");try{a=d.getAttribute("jStorage_update")}catch(b){}}if(a&&a!=r){r=a;var k=l.parse(l.stringify(c.__jstorage_meta.CRC32)),p;C();p=l.parse(l.stringify(c.__jstorage_meta.CRC32));
var e,y=[],f=[];for(e in k)k.hasOwnProperty(e)&&(p[e]?k[e]!=p[e]&&"2."==String(k[e]).substr(0,2)&&y.push(e):f.push(e));for(e in p)p.hasOwnProperty(e)&&(k[e]||y.push(e));s(y,"updated");s(f,"deleted")}},25)}function s(a,b){a=[].concat(a||[]);if("flushed"==b){a=[];for(var c in j)j.hasOwnProperty(c)&&a.push(c);b="deleted"}c=0;for(var p=a.length;c<p;c++){if(j[a[c]])for(var e=0,d=j[a[c]].length;e<d;e++)j[a[c]][e](a[c],b);if(j["*"]){e=0;for(d=j["*"].length;e<d;e++)j["*"][e](a[c],b)}}}function v(){var a=
(+new Date).toString();"localStorage"==h||"globalStorage"==h?g.jStorage_update=a:"userDataBehavior"==h&&(d.setAttribute("jStorage_update",a),d.save("jStorage"));u()}function D(){if(g.jStorage)try{c=l.parse(String(g.jStorage))}catch(a){g.jStorage="{}"}else g.jStorage="{}";z=g.jStorage?String(g.jStorage).length:0;c.__jstorage_meta||(c.__jstorage_meta={});c.__jstorage_meta.CRC32||(c.__jstorage_meta.CRC32={})}function w(){if(c.__jstorage_meta.PubSub){for(var a=+new Date-2E3,b=0,k=c.__jstorage_meta.PubSub.length;b<
k;b++)if(c.__jstorage_meta.PubSub[b][0]<=a){c.__jstorage_meta.PubSub.splice(b,c.__jstorage_meta.PubSub.length-b);break}c.__jstorage_meta.PubSub.length||delete c.__jstorage_meta.PubSub}try{g.jStorage=l.stringify(c),d&&(d.setAttribute("jStorage",g.jStorage),d.save("jStorage")),z=g.jStorage?String(g.jStorage).length:0}catch(p){}}function q(a){if(!a||"string"!=typeof a&&"number"!=typeof a)throw new TypeError("Key name must be string or numeric");if("__jstorage_meta"==a)throw new TypeError("Reserved key name");
return!0}function x(){var a,b,k,d,e=Infinity,g=!1,f=[];clearTimeout(G);if(c.__jstorage_meta&&"object"==typeof c.__jstorage_meta.TTL){a=+new Date;k=c.__jstorage_meta.TTL;d=c.__jstorage_meta.CRC32;for(b in k)k.hasOwnProperty(b)&&(k[b]<=a?(delete k[b],delete d[b],delete c[b],g=!0,f.push(b)):k[b]<e&&(e=k[b]));Infinity!=e&&(G=setTimeout(x,e-a));g&&(w(),v(),s(f,"deleted"))}}function E(){var a;if(c.__jstorage_meta.PubSub){var b,k=A;for(a=c.__jstorage_meta.PubSub.length-1;0<=a;a--)if(b=c.__jstorage_meta.PubSub[a],
b[0]>A){var k=b[0],d=b[1];b=b[2];if(t[d])for(var e=0,g=t[d].length;e<g;e++)t[d][e](d,l.parse(l.stringify(b)))}A=k}}var n=window.jQuery||window.$||(window.$={}),l={parse:window.JSON&&(window.JSON.parse||window.JSON.decode)||String.prototype.evalJSON&&function(a){return String(a).evalJSON()}||n.parseJSON||n.evalJSON,stringify:Object.toJSON||window.JSON&&(window.JSON.stringify||window.JSON.encode)||n.toJSON};if(!l.parse||!l.stringify)throw Error("No JSON support found, include //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js to page");
var c={__jstorage_meta:{CRC32:{}}},g={jStorage:"{}"},d=null,z=0,h=!1,j={},F=!1,r=0,t={},A=+new Date,G,B={isXML:function(a){return(a=(a?a.ownerDocument||a:0).documentElement)?"HTML"!==a.nodeName:!1},encode:function(a){if(!this.isXML(a))return!1;try{return(new XMLSerializer).serializeToString(a)}catch(b){try{return a.xml}catch(c){}}return!1},decode:function(a){var b="DOMParser"in window&&(new DOMParser).parseFromString||window.ActiveXObject&&function(a){var b=new ActiveXObject("Microsoft.XMLDOM");b.async=
"false";b.loadXML(a);return b};if(!b)return!1;a=b.call("DOMParser"in window&&new DOMParser||window,a,"text/xml");return this.isXML(a)?a:!1}};n.jStorage={version:"0.4.3",set:function(a,b,d){q(a);d=d||{};if("undefined"==typeof b)return this.deleteKey(a),b;if(B.isXML(b))b={_is_xml:!0,xml:B.encode(b)};else{if("function"==typeof b)return;b&&"object"==typeof b&&(b=l.parse(l.stringify(b)))}c[a]=b;for(var g=c.__jstorage_meta.CRC32,e=l.stringify(b),j=e.length,f=2538058380^j,h=0,m;4<=j;)m=e.charCodeAt(h)&255|
(e.charCodeAt(++h)&255)<<8|(e.charCodeAt(++h)&255)<<16|(e.charCodeAt(++h)&255)<<24,m=1540483477*(m&65535)+((1540483477*(m>>>16)&65535)<<16),m^=m>>>24,m=1540483477*(m&65535)+((1540483477*(m>>>16)&65535)<<16),f=1540483477*(f&65535)+((1540483477*(f>>>16)&65535)<<16)^m,j-=4,++h;switch(j){case 3:f^=(e.charCodeAt(h+2)&255)<<16;case 2:f^=(e.charCodeAt(h+1)&255)<<8;case 1:f^=e.charCodeAt(h)&255,f=1540483477*(f&65535)+((1540483477*(f>>>16)&65535)<<16)}f^=f>>>13;f=1540483477*(f&65535)+((1540483477*(f>>>16)&
65535)<<16);g[a]="2."+((f^f>>>15)>>>0);this.setTTL(a,d.TTL||0);s(a,"updated");return b},get:function(a,b){q(a);return a in c?c[a]&&"object"==typeof c[a]&&c[a]._is_xml?B.decode(c[a].xml):c[a]:"undefined"==typeof b?null:b},deleteKey:function(a){q(a);return a in c?(delete c[a],"object"==typeof c.__jstorage_meta.TTL&&a in c.__jstorage_meta.TTL&&delete c.__jstorage_meta.TTL[a],delete c.__jstorage_meta.CRC32[a],w(),v(),s(a,"deleted"),!0):!1},setTTL:function(a,b){var d=+new Date;q(a);b=Number(b)||0;return a in
c?(c.__jstorage_meta.TTL||(c.__jstorage_meta.TTL={}),0<b?c.__jstorage_meta.TTL[a]=d+b:delete c.__jstorage_meta.TTL[a],w(),x(),v(),!0):!1},getTTL:function(a){var b=+new Date;q(a);return a in c&&c.__jstorage_meta.TTL&&c.__jstorage_meta.TTL[a]?(a=c.__jstorage_meta.TTL[a]-b)||0:0},flush:function(){c={__jstorage_meta:{CRC32:{}}};w();v();s(null,"flushed");return!0},storageObj:function(){function a(){}a.prototype=c;return new a},index:function(){var a=[],b;for(b in c)c.hasOwnProperty(b)&&"__jstorage_meta"!=
b&&a.push(b);return a},storageSize:function(){return z},currentBackend:function(){return h},storageAvailable:function(){return!!h},listenKeyChange:function(a,b){q(a);j[a]||(j[a]=[]);j[a].push(b)},stopListening:function(a,b){q(a);if(j[a])if(b)for(var c=j[a].length-1;0<=c;c--)j[a][c]==b&&j[a].splice(c,1);else delete j[a]},subscribe:function(a,b){a=(a||"").toString();if(!a)throw new TypeError("Channel not defined");t[a]||(t[a]=[]);t[a].push(b)},publish:function(a,b){a=(a||"").toString();if(!a)throw new TypeError("Channel not defined");
c.__jstorage_meta||(c.__jstorage_meta={});c.__jstorage_meta.PubSub||(c.__jstorage_meta.PubSub=[]);c.__jstorage_meta.PubSub.unshift([+new Date,a,b]);w();v()},reInit:function(){C()}};a:{n=!1;if("localStorage"in window)try{window.localStorage.setItem("_tmptest","tmpval"),n=!0,window.localStorage.removeItem("_tmptest")}catch(H){}if(n)try{window.localStorage&&(g=window.localStorage,h="localStorage",r=g.jStorage_update)}catch(I){}else if("globalStorage"in window)try{window.globalStorage&&(g=window.globalStorage[window.location.hostname],
h="globalStorage",r=g.jStorage_update)}catch(J){}else if(d=document.createElement("link"),d.addBehavior){d.style.behavior="url(#default#userData)";document.getElementsByTagName("head")[0].appendChild(d);try{d.load("jStorage")}catch(K){d.setAttribute("jStorage","{}"),d.save("jStorage"),d.load("jStorage")}n="{}";try{n=d.getAttribute("jStorage")}catch(L){}try{r=d.getAttribute("jStorage_update")}catch(M){}g.jStorage=n;h="userDataBehavior"}else{d=null;break a}D();x();"localStorage"==h||"globalStorage"==
h?"addEventListener"in window?window.addEventListener("storage",u,!1):document.attachEvent("onstorage",u):"userDataBehavior"==h&&setInterval(u,1E3);E();"addEventListener"in window&&window.addEventListener("pageshow",function(a){a.persisted&&u()},!1)}})();


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

/**
 * Creates a new masjidTimes Object
 * @param  {Object} config The configuration object
 * @param  {Object} my     Used for inheritance
 * @return {Object}        The masjid times object
 */
var newMasjidTimes = function (config, my) {

                                      /*--------------------*
                                            Properties
                                      /*--------------------*/
  var my = my || {};

  var ref = this;

  // Callbacks
  var Callbacks = jQuery?jQuery.Callbacks:function(e){e=typeof e==="string"?optionsCache[e]||createOptions(e):jQuery.extend({},e);var t,n,r,i,s,o,u=[],a=!e.once&&[],f=function(c){t=e.memory&&c;n=true;o=i||0;i=0;s=u.length;r=true;for(;u&&o<s;o++){if(u[o].apply(c[0],c[1])===false&&e.stopOnFalse){t=false;break}}r=false;if(u){if(a){if(a.length){f(a.shift())}}else if(t){u=[]}else{l.disable()}}},l={add:function(){if(u){var n=u.length;(function o(t){jQuery.each(t,function(t,n){var r=jQuery.type(n);if(r==="function"){if(!e.unique||!l.has(n)){u.push(n)}}else if(n&&n.length&&r!=="string"){o(n)}})})(arguments);if(r){s=u.length}else if(t){i=n;f(t)}}return this},remove:function(){if(u){jQuery.each(arguments,function(e,t){var n;while((n=jQuery.inArray(t,u,n))>-1){u.splice(n,1);if(r){if(n<=s){s--}if(n<=o){o--}}}})}return this},has:function(e){return e?jQuery.inArray(e,u)>-1:!!(u&&u.length)},empty:function(){u=[];s=0;return this},disable:function(){u=a=t=undefined;return this},disabled:function(){return!u},lock:function(){a=undefined;if(!t){l.disable()}return this},locked:function(){return!a},fireWith:function(e,t){t=t||[];t=[e,t.slice?t.slice():t];if(u&&(!n||a)){if(r){a.push(t)}else{f(t)}}return this},fire:function(){l.fireWith(this,arguments);return this},fired:function(){return!!n}};return l}

  // Extend
  var extend = jQuery?jQuery.extend:function(){var e,t,n,r,i,s,o=arguments[0]||{},u=1,a=arguments.length,f=false;if(typeof o==="boolean"){f=o;o=arguments[1]||{};u=2}if(typeof o!=="object"&&!jQuery.isFunction(o)){o={}}if(a===u){o=this;--u}for(;u<a;u++){if((e=arguments[u])!=null){for(t in e){n=o[t];r=e[t];if(o===r){continue}if(f&&r&&(jQuery.isPlainObject(r)||(i=jQuery.isArray(r)))){if(i){i=false;s=n&&jQuery.isArray(n)?n:[]}else{s=n&&jQuery.isPlainObject(n)?n:{}}o[t]=jQuery.extend(f,s,r)}else if(r!==undefined){o[t]=r}}}}return o};

  // Each
  var each = jQuery?jQuery.each:function(e,t,n){var r,i=0,s=e.length,o=isArraylike(e);if(n){if(o){for(;i<s;i++){r=t.apply(e[i],n);if(r===false){break}}}else{for(i in e){r=t.apply(e[i],n);if(r===false){break}}}}else{if(o){for(;i<s;i++){r=t.call(e[i],i,e[i]);if(r===false){break}}}else{for(i in e){r=t.call(e[i],i,e[i]);if(r===false){break}}}}return e};

  // If there is a storage methods, check and augment, otherwise use our own
  if(config.storage != undefined && config.storage.get != undefined && config.storage.set != undefined && config.storage.remove != undefined){
    // Use config's storage methods
    if(config.storage.setKey == undefined){
      // Augment it so that we can setKey
      config.storage.setKey = function(key, value, cb){
        var o = {};
        o[key] = value;
        config.storage.set(o, cb);
      };
    }
  } else {
    // JSON
    var JSON;if(!JSON){JSON={}}(function(){"use strict";function f(e){return e<10?"0"+e:e}function quote(e){escapable.lastIndex=0;return escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return typeof t==="string"?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,s,o=gap,u,a=t[e];if(a&&typeof a==="object"&&typeof a.toJSON==="function"){a=a.toJSON(e)}if(typeof rep==="function"){a=rep.call(t,e,a)}switch(typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a){return"null"}gap+=indent;u=[];if(Object.prototype.toString.apply(a)==="[object Array]"){s=a.length;for(n=0;n<s;n+=1){u[n]=str(n,a)||"null"}i=u.length===0?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+o+"]":"["+u.join(",")+"]";gap=o;return i}if(rep&&typeof rep==="object"){s=rep.length;for(n=0;n<s;n+=1){if(typeof rep[n]==="string"){r=rep[n];i=str(r,a);if(i){u.push(quote(r)+(gap?": ":":")+i)}}}}else{for(r in a){if(Object.prototype.hasOwnProperty.call(a,r)){i=str(r,a);if(i){u.push(quote(r)+(gap?": ":":")+i)}}}}i=u.length===0?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+o+"}":"{"+u.join(",")+"}";gap=o;return i}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(e){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(e){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;if(typeof JSON.stringify!=="function"){JSON.stringify=function(e,t,n){var r;gap="";indent="";if(typeof n==="number"){for(r=0;r<n;r+=1){indent+=" "}}else if(typeof n==="string"){indent=n}rep=t;if(t&&typeof t!=="function"&&(typeof t!=="object"||typeof t.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":e})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&typeof i==="object"){for(n in i){if(Object.prototype.hasOwnProperty.call(i,n)){r=walk(i,n);if(r!==undefined){i[n]=r}else{delete i[n]}}}}return reviver.call(e,t,i)}var j;text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})();

    // jStorage
    if(!(jQuery&&jQuery.jStorage))(function(){function v(){var e=false;if("localStorage"in window){try{window.localStorage.setItem("_tmptest","tmpval");e=true;window.localStorage.removeItem("_tmptest")}catch(t){}}if(e){try{if(window.localStorage){i=window.localStorage;u="localStorage";l=i.jStorage_update}}catch(n){}}else if("globalStorage"in window){try{if(window.globalStorage){i=window.globalStorage[window.location.hostname];u="globalStorage";l=i.jStorage_update}}catch(r){}}else{s=document.createElement("link");if(s.addBehavior){s.style.behavior="url(#default#userData)";document.getElementsByTagName("head")[0].appendChild(s);try{s.load("jStorage")}catch(o){s.setAttribute("jStorage","{}");s.save("jStorage");s.load("jStorage")}var a="{}";try{a=s.getAttribute("jStorage")}catch(f){}try{l=s.getAttribute("jStorage_update")}catch(c){}i.jStorage=a;u="userDataBehavior"}else{s=null;return}}S();N();g();C();if("addEventListener"in window){window.addEventListener("pageshow",function(e){if(e.persisted){y()}},false)}}function m(){var e="{}";if(u=="userDataBehavior"){s.load("jStorage");try{e=s.getAttribute("jStorage")}catch(t){}try{l=s.getAttribute("jStorage_update")}catch(n){}i.jStorage=e}S();N();C()}function g(){if(u=="localStorage"||u=="globalStorage"){if("addEventListener"in window){window.addEventListener("storage",y,false)}else{document.attachEvent("onstorage",y)}}else if(u=="userDataBehavior"){setInterval(y,1e3)}}function y(){var e;clearTimeout(f);f=setTimeout(function(){if(u=="localStorage"||u=="globalStorage"){e=i.jStorage_update}else if(u=="userDataBehavior"){s.load("jStorage");try{e=s.getAttribute("jStorage_update")}catch(t){}}if(e&&e!=l){l=e;b()}},25)}function b(){var e=n.parse(n.stringify(r.__jstorage_meta.CRC32)),t;m();t=n.parse(n.stringify(r.__jstorage_meta.CRC32));var i,s=[],o=[];for(i in e){if(e.hasOwnProperty(i)){if(!t[i]){o.push(i);continue}if(e[i]!=t[i]&&String(e[i]).substr(0,2)=="2."){s.push(i)}}}for(i in t){if(t.hasOwnProperty(i)){if(!e[i]){s.push(i)}}}w(s,"updated");w(o,"deleted")}function w(e,t){e=[].concat(e||[]);if(t=="flushed"){e=[];for(var n in a){if(a.hasOwnProperty(n)){e.push(n)}}t="deleted"}for(var r=0,i=e.length;r<i;r++){if(a[e[r]]){for(var s=0,o=a[e[r]].length;s<o;s++){a[e[r]][s](e[r],t)}}if(a["*"]){for(var s=0,o=a["*"].length;s<o;s++){a["*"][s](e[r],t)}}}}function E(){var e=(+(new Date)).toString();if(u=="localStorage"||u=="globalStorage"){i.jStorage_update=e}else if(u=="userDataBehavior"){s.setAttribute("jStorage_update",e);s.save("jStorage")}y()}function S(){if(i.jStorage){try{r=n.parse(String(i.jStorage))}catch(e){i.jStorage="{}"}}else{i.jStorage="{}"}o=i.jStorage?String(i.jStorage).length:0;if(!r.__jstorage_meta){r.__jstorage_meta={}}if(!r.__jstorage_meta.CRC32){r.__jstorage_meta.CRC32={}}}function x(){L();try{i.jStorage=n.stringify(r);if(s){s.setAttribute("jStorage",i.jStorage);s.save("jStorage")}o=i.jStorage?String(i.jStorage).length:0}catch(e){}}function T(e){if(!e||typeof e!="string"&&typeof e!="number"){throw new TypeError("Key name must be string or numeric")}if(e=="__jstorage_meta"){throw new TypeError("Reserved key name")}return true}function N(){var e,t,n,i,s=Infinity,o=false,u=[];clearTimeout(p);if(!r.__jstorage_meta||typeof r.__jstorage_meta.TTL!="object"){return}e=+(new Date);n=r.__jstorage_meta.TTL;i=r.__jstorage_meta.CRC32;for(t in n){if(n.hasOwnProperty(t)){if(n[t]<=e){delete n[t];delete i[t];delete r[t];o=true;u.push(t)}else if(n[t]<s){s=n[t]}}}if(s!=Infinity){p=setTimeout(N,s-e)}if(o){x();E();w(u,"deleted")}}function C(){var e,t;if(!r.__jstorage_meta.PubSub){return}var n,i=h;for(e=t=r.__jstorage_meta.PubSub.length-1;e>=0;e--){n=r.__jstorage_meta.PubSub[e];if(n[0]>h){i=n[0];k(n[1],n[2])}}h=i}function k(e,t){if(c[e]){for(var r=0,i=c[e].length;r<i;r++){c[e][r](e,n.parse(n.stringify(t)))}}}function L(){if(!r.__jstorage_meta.PubSub){return}var e=+(new Date)-2e3;for(var t=0,n=r.__jstorage_meta.PubSub.length;t<n;t++){if(r.__jstorage_meta.PubSub[t][0]<=e){r.__jstorage_meta.PubSub.splice(t,r.__jstorage_meta.PubSub.length-t);break}}if(!r.__jstorage_meta.PubSub.length){delete r.__jstorage_meta.PubSub}}function A(e,t){if(!r.__jstorage_meta){r.__jstorage_meta={}}if(!r.__jstorage_meta.PubSub){r.__jstorage_meta.PubSub=[]}r.__jstorage_meta.PubSub.unshift([+(new Date),e,t]);x();E()}function O(e,t){var n=e.length,r=t^n,i=0,s;while(n>=4){s=e.charCodeAt(i)&255|(e.charCodeAt(++i)&255)<<8|(e.charCodeAt(++i)&255)<<16|(e.charCodeAt(++i)&255)<<24;s=(s&65535)*1540483477+(((s>>>16)*1540483477&65535)<<16);s^=s>>>24;s=(s&65535)*1540483477+(((s>>>16)*1540483477&65535)<<16);r=(r&65535)*1540483477+(((r>>>16)*1540483477&65535)<<16)^s;n-=4;++i}switch(n){case 3:r^=(e.charCodeAt(i+2)&255)<<16;case 2:r^=(e.charCodeAt(i+1)&255)<<8;case 1:r^=e.charCodeAt(i)&255;r=(r&65535)*1540483477+(((r>>>16)*1540483477&65535)<<16)}r^=r>>>13;r=(r&65535)*1540483477+(((r>>>16)*1540483477&65535)<<16);r^=r>>>15;return r>>>0}var e="0.4.3",t=window.jQuery||window.$||(window.$={}),n={parse:window.JSON&&(window.JSON.parse||window.JSON.decode)||String.prototype.evalJSON&&function(e){return String(e).evalJSON()}||t.parseJSON||t.evalJSON,stringify:Object.toJSON||window.JSON&&(window.JSON.stringify||window.JSON.encode)||t.toJSON};if(!n.parse||!n.stringify){throw new Error("No JSON support found, include //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js to page")}var r={__jstorage_meta:{CRC32:{}}},i={jStorage:"{}"},s=null,o=0,u=false,a={},f=false,l=0,c={},h=+(new Date),p,d={isXML:function(e){var t=(e?e.ownerDocument||e:0).documentElement;return t?t.nodeName!=="HTML":false},encode:function(e){if(!this.isXML(e)){return false}try{return(new XMLSerializer).serializeToString(e)}catch(t){try{return e.xml}catch(n){}}return false},decode:function(e){var t="DOMParser"in window&&(new DOMParser).parseFromString||window.ActiveXObject&&function(e){var t=new ActiveXObject("Microsoft.XMLDOM");t.async="false";t.loadXML(e);return t},n;if(!t){return false}n=t.call("DOMParser"in window&&new DOMParser||window,e,"text/xml");return this.isXML(n)?n:false}};t.jStorage={version:e,set:function(e,t,i){T(e);i=i||{};if(typeof t=="undefined"){this.deleteKey(e);return t}if(d.isXML(t)){t={_is_xml:true,xml:d.encode(t)}}else if(typeof t=="function"){return undefined}else if(t&&typeof t=="object"){t=n.parse(n.stringify(t))}r[e]=t;r.__jstorage_meta.CRC32[e]="2."+O(n.stringify(t),2538058380);this.setTTL(e,i.TTL||0);w(e,"updated");return t},get:function(e,t){T(e);if(e in r){if(r[e]&&typeof r[e]=="object"&&r[e]._is_xml){return d.decode(r[e].xml)}else{return r[e]}}return typeof t=="undefined"?null:t},deleteKey:function(e){T(e);if(e in r){delete r[e];if(typeof r.__jstorage_meta.TTL=="object"&&e in r.__jstorage_meta.TTL){delete r.__jstorage_meta.TTL[e]}delete r.__jstorage_meta.CRC32[e];x();E();w(e,"deleted");return true}return false},setTTL:function(e,t){var n=+(new Date);T(e);t=Number(t)||0;if(e in r){if(!r.__jstorage_meta.TTL){r.__jstorage_meta.TTL={}}if(t>0){r.__jstorage_meta.TTL[e]=n+t}else{delete r.__jstorage_meta.TTL[e]}x();N();E();return true}return false},getTTL:function(e){var t=+(new Date),n;T(e);if(e in r&&r.__jstorage_meta.TTL&&r.__jstorage_meta.TTL[e]){n=r.__jstorage_meta.TTL[e]-t;return n||0}return 0},flush:function(){r={__jstorage_meta:{CRC32:{}}};x();E();w(null,"flushed");return true},storageObj:function(){function e(){}e.prototype=r;return new e},index:function(){var e=[],t;for(t in r){if(r.hasOwnProperty(t)&&t!="__jstorage_meta"){e.push(t)}}return e},storageSize:function(){return o},currentBackend:function(){return u},storageAvailable:function(){return!!u},listenKeyChange:function(e,t){T(e);if(!a[e]){a[e]=[]}a[e].push(t)},stopListening:function(e,t){T(e);if(!a[e]){return}if(!t){delete a[e];return}for(var n=a[e].length-1;n>=0;n--){if(a[e][n]==t){a[e].splice(n,1)}}},subscribe:function(e,t){e=(e||"").toString();if(!e){throw new TypeError("Channel not defined")}if(!c[e]){c[e]=[]}c[e].push(t)},publish:function(e,t){e=(e||"").toString();if(!e){throw new TypeError("Channel not defined")}A(e,t)},reInit:function(){m()}};v()})();

    // jStorage/chrome.storage API wrapper
    var storage = {
      /**
       * Get an item from storage
       * @param key
       * @param cb
       */
      get: function(key, cb){
        cb($.jStorage.get(key));
      },

      /**
       * Augment the storage with an object
       * @param object
       * @param [cb]
       */
      set: function(object, cb){
        for (var prop in object) {
          if( object.hasOwnProperty( prop ) ) {
            $.jStorage.set(prop, object[prop]);
          }
        }
        if(typeof cb == 'function') cb();
      },

      /**
       * Add an item using a key to the storage
       * @param key
       * @param value
       * @param [cb]
       */
      setKey: function(key, value, cb){
        var o = {};
        o[key] = value;
        this.set(o, cb);
      },

      /**
       * Remove an item with a given key from storage
       * @param key
       * @param [cb]
       */
      remove: function(key, cb){
        $.jStorage.deleteKey(key);
        if(typeof cb == 'function') cb();
      }
    };
  }


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
   * @param [options]   Will be passed into the Date constructor. If this is a date object, then that object will be used.
   * @returns {Date}  The date object with some augmented properties e.g. date.day
   */
  var getDate = function(options){
    var date;
    if(options == undefined){
      if(times.tick == undefined){
        date = new Date();
      } else {
        date = times.tick;
      }
    } else if(options == 'forced'){
      date = new Date();
    } else if($.type(options) == 'date'){
      date = new Date(options.getTime());
    } else {
      date = new Date(options);
    }
    date.day = date.getDate();
    date.month = date.getMonth()+1;
    return date;
  };


  /**
   * This object is basically a namespace for all the localStorage objects
   * used by MasjidTimes.
   * @type {Object}
   * @property {string} prayerTimes    A year of prayer times
   * @property {string} mosque         The mosque we are using
   */
  var l = {
    prayer: 'prayerTimes',
    mosque: 'nearestMosque',
    coords: 'coords'
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
    ready: Callbacks(),       // Got prayer data and mosque data
    prayer: Callbacks(),      // A prayer has passed
    fajr: Callbacks(),        // Fajr has passed
    shuruq: Callbacks(),      // Shuruq has passed
    duhr: Callbacks(),        // Duhr has passed
    asr: Callbacks(),         // Asr has passed
    asr2: Callbacks(),        // Asr (hanafi) has passed
    maghrib: Callbacks(),     // Maghrib has passed
    isha: Callbacks(),        // Isha has passed
    mosques: Callbacks(),     // Got nearest mosques
    mosque: Callbacks(),      // Mosque has been chosen
    prayertimes: Callbacks(), // Got prayer times
    debug: Callbacks(),       // Event that is used for debugging what events got fired etc.
    tick: Callbacks(),        // Time tick
    day: Callbacks()          // We've just reached the end of the day.
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
    $.ajax({url: reqUrl, data: req, type: 'GET', cache: true, dataType: 'jsonp'}).done(function (responseData) {
      responseData = toJSON(responseData);
      callback(extend(responseData, {_request: req}));
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
    ajax.get('table/', options, callback);
  };


  /**
   * Takes care of timing events etc.
   * @type {{start, stop, id}}
   */
  var ticker = {};
  ticker.start = function(){
    ticker.stop();
    ticker.id = setInterval(function(){
      fire('tick', times.getNext());
    }, 1000);
  };

  ticker.stop = function(){
    clearInterval(ticker.id);
  };

  /**
   * Clears all local storage stored by masjidTimes
   */
  var clearLocalStorage = function () {
    for (var k in l) {
      if (l.hasOwnProperty(k)) storage.remove(l[k]);
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
    data.next = config.debug ? 'isha' : undefined;
    return data;
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
    if(data.event != 'tick') console.debug({Event : data.event, args: data.args});
  });

  on('mosque', function(mosque){
    // Someone has chosen a mosque.
    using.mosque = mosque;

    storage.setKey(l.mosque, mosque, function(){
      if(!initialised){
        checkInit();
      }
    });
  });

  on('prayertimes', function(prayerTimes){
    // We have got the prayer times.
    using.prayer = prayerTimes;
    storage.setKey(l.prayer, prayerTimes, function(){
      if(!initialised){
        checkInit();
      }
    });
  });

  on('ready', function(){
    initialised = true;
    ticker.start();
    // Start ticker
  });

  on('tick', function(nextTimes){
    var newTick = getDate('forced');
    if(times.tick != undefined && (times.tick.day != newTick.day || times.tick.month != newTick.month)){
      // We're on a different day than before.
      fire('day', times.getDay(newTick));
    }

    if(nextTimes.remaining <= 1000){
      fire('prayer', nextTimes);
    }

    // From now on, we can treat tick as the current date/time.
    times.tick = newTick;
  });

  on('prayer', function(nextTimes){
    fire(nextTimes.prayer, nextTimes);
  });


  /**
   * Same as on('ready')
   * @param {Function} callback
   */
  var ready = function(callback){
    on('ready', callback);
  };




  /**
   * Tells masjidTimes to use the mosque provided
   * @param {Object} mosque  A mosque object
   */
  var useMosque = function(mosque){
    // Fire the mosque event
    fire('mosque', mosque);
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
   */
  var isStorageReady = function(readyCB, notReadyCB){
    storage.get(l.mosque, function(mosque){
      storage.get(l.prayer, function(prayer){
        if(mosque != undefined && prayer != undefined){
          readyCB(mosque, prayer);
        } else {
          notReadyCB(mosque, prayer);
        }
      });
    });
  };

  /**
   * Gets data from local storage and puts it into using.
   */
  var loadFromStorage = function(cb, mosque, prayer){
    if(mosque!=undefined && prayer != undefined){
      using.mosque = mosque;
      using.prayer = prayer;
      cb()
    } else {
      storage.get(l.mosque, function(mosque){
        using.mosque = mosque;
        storage.get(l.prayer, function(prayer){
          using.prayer = prayer;
          cb();
        });
      });
    }

  };

  /**
   * Gets data from using and puts it into local storage.
   */
  var putToStorage = function(cb){
    storage.setKey(l.mosque, using.mosque, function(){
      storage.setKey(l.prayer, using.prayer, function(){
        cb()
      })
    });
  };


  var checkInit = function(forced){
    if(forced){
      clearLocalStorage();
    }
    isStorageReady(function (mosque, prayer) {
      // We have the stuff in storage!
      loadFromStorage(function () {
        fire('ready');
      }, mosque, prayer);
    }, function () {
      // We don't have the stuff in storage!
      if (isUsingReady()) {
        // We have the stuff in memory!
        putToStorage(function () {
          fire('ready');
        });
      } else {
        // We don't have the stuff in memory!
        // Nothing is ready.
        // Here we need to request from server if we haven't already.
        if (using.mosque == undefined && !triggeredMosqueSelection) {
          // We don't have a mosque chosen yet.
          ajax.nearestMosques(using.coords, function (nearestMosques) {
            fire('mosques', nearestMosques);
            triggeredMosqueSelection = true;
          });
        }
        if (using.prayer == undefined && using.mosque != undefined) {
          // TODO: Match the mosque's prayer times id with the using.prayer id in this if check
          // We have a mosque chosen but don't have its prayer times yet.
          ajax.prayerTimesById({id: using.mosque.prayertimes_id}, function (prayerTimes) {
            fire('prayertimes', prayerTimes);
          });
        }
      }
    });
  };
  /**
   * Loads stuff from local storage. If forced, then does a new request.
   * @param {{longitude:Number, latitude:Number}} [coords] The user's location
   * @param {boolean} [forced] If true, empties local storage and requests new thing from server.
   * @returns {Object}
   */
  var init = function(coords, forced) {
    if(coords == undefined){
      // Check cache
      storage.get(l.coords, function(cachedCoords){
        if(cachedCoords == undefined){
          throw "MasjidTimes failed to initialise. Coordinates not defined";
        } else {
          using.coords = {lat: cachedCoords.latitude, long:cachedCoords.longitude};
          checkInit(forced);
        }
      });
    } else {
      // Set using to coords
      using.coords = {lat: coords.latitude, long:coords.longitude};
      storage.setKey(l.coords, coords, function(){
        checkInit(forced);
      });
    }
  };

  var initFromCoords = function(nonCachedCb, cachedCallback){
    storage.get(l.coords, function(cachedCoords){
      if(cachedCoords != undefined){
        init(cachedCoords);
        if(typeof cachedCallback == 'function') cachedCallback(cachedCoords);
      } else {
        nonCachedCb(function(coords){
          init(coords);
        });
      }
    });
  };

  /**
   * A set of properties and methods to do with prayer times.
   * @type {{getDay, getToday, today, getNext, getDifference, stringToHoursMinutes, stringToDate, prayerPassed}}
   */
  var times = {};

  /**
   * Gets the prayer times for a specific date.
   * @param {{month:Number, day:Number}|Date} date
   */
  times.getDay = function(date){
    date = getDate(date);
    // TODO: Create new version of grep which has indexing (e.g. skip a month if wrong month)
    return $.grep(using.prayer, function(element, index){return element.month == date.month && element.day == date.day;})[0];
  };

  /**
   * Gets the prayer times for today
   * @returns {*}
   */
  times.getToday = function(){
    if(initialised){
      // Search the prayer times for todays date.
      var realToday = getDate();
      if(times.today !== undefined && realToday.day == times.today.day && realToday.month == times.today.month){
        //console.debug("Cache hit");
        return times.today;
      } else {
        //console.debug("Cache miss");
        return times.today = times.getDay(realToday);
      }
    } else{
      throw "MasjidTimes is not initialised.";
    }
  };

  /**
   * Gets the prayer times for tomorrow. Uses today's object.
   * @returns {*}
   */
  times.getTomorrow = function(){
    if(initialised){
      return times.getDay(new Date(getDate().getTime() + 24 * 60 * 60 * 1000));
    } else{
      throw "MasjidTimes is not initialised.";
    }
  };

  /**
   * Gets the next prayer from now.
   * Prayer could be the following day's fajr. Remaining is number of milliseconds till next prayer
   * @returns {{prayer: string, remaining: Number, date: Date}}
   */

  times.getNext = function(){
    var today = times.getToday();

    // Cache check
    var now = getDate();
    if(times.next != undefined && times.next.date > now){
      // Cache hit; now just change remaining time.
      times.next.remaining = times.next.date - now;
      return times.next;
    }

    var nextPrayer, nextPrayerDifference, nextPrayerDate, prayerDateTime = undefined;
    var counter = 0;

    while(nextPrayer == undefined){
      // The next date to check:
      // Get the prayer times for the date of (today's date + counter * 1 day)
      // The nextPrayerDate is normalised, meaning that hours, minutes, seconds are 0.
      var nextPrayerDateTime = getDate(getDate().getTime() + counter * 86400000);
      nextPrayerDate = times.normaliseDate(nextPrayerDateTime);
      if(counter == 1){
        nextPrayerDateTime = nextPrayerDate;
      }

      var nextPrayerTimes = times.getDay(nextPrayerDate);
      each(prayers, function(index, prayer){
        // For each prayer (e.g. 'fajr'), find out what that prayers difference is.
        var difference = (prayerDateTime = times.stringToDate(nextPrayerTimes[prayer], nextPrayerDateTime)) - (counter == 0 ? nextPrayerDateTime : getDate());
        if(difference > 0){
          // This is the next prayer
          nextPrayer = prayer;
          nextPrayerDifference = difference;
          return false; //Break out of the loop
        }
      });
      counter++;
    }

    return times.next = {prayer: nextPrayer, remaining: nextPrayerDifference, date: prayerDateTime};
  };


  /**
   * Turns a datetime object into one which only has the date set and everything else set to zero.
   * e.g. 24 March 12:32 => 24 March 00:00
   * @param date
   * @returns {Date}
   */
  times.normaliseDate = function(date){
    date = getDate(date);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return getDate(date);
  };

  /**
   * Turns a time string of the form "hours:minutes" into an object
   * with properties hours and minutes
   * @param  {String} timeString The time string e.g. 04:00
   * @return {{hours:Number, minutes:Number}}    Object literal with properties hours, minutes
   */
  times.stringToHoursMinutes = function (timeString) {
    var split = timeString.split(":");
    return {hours: parseInt(split[0]), minutes: parseInt(split[1])};
  };

  /**
   * Turns a time string of the form "hours:minutes" into a date object
   * @param  {String} timeString The string to convert
   * @param  {Date}  [date]      The date to match. If not set, gets today's date
   * @return {Date}              Today's date at that time.
   */
  times.stringToDate = function (timeString, date) {
    var split, now, newDate;
    split = times.stringToHoursMinutes(timeString);
    now = getDate(date);
    return new Date(now.getFullYear(), now.getMonth(), now.day, split.hours, split.minutes, 0, 0);
  };

  /**
   * Has the given prayer passed yet?
   * @param  {string} prayer The prayer in question e.g. 'fajr'
   * @return {boolean}       True if the prayer has passed the current time (e.g. true if fajr was in the past)
   */
  times.prayerPassed = function (prayer) {
    return getDate() >= times.stringToDate(today[prayer]);
  };





  that = using;
  that.times = times;
  that.prayers = prayers;
  that.ready = ready;
  that.ajax = ajax;
  that.clearLocalStorage = clearLocalStorage;
  that.useMosque = useMosque;
  that.init = init;
  that.initFromCoords = initFromCoords;
  that.fire = fire;
  that.on = on;





  //Constructor
  return that;
};

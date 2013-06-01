String.prototype.toCapitalize = function()
{
  return this.toLowerCase().replace(/^.|\s\S/g, function(a) { return a.toUpperCase(); });
}
//JSON2
/*
    http://www.JSON.org/json2.js
    2011-02-23

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
var JSON;
if (!JSON) {
  JSON = {};
}

(function() {
  "use strict";

  function f(n) {
    // Format integers to have at least two digits.
    return n < 10 ? '0' + n : n;
  }

  if (typeof Date.prototype.toJSON !== 'function') {

    Date.prototype.toJSON = function(key) {

      return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null;
    };

    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
      return this.valueOf();
    };
  }

  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap, indent, meta = { // table of character substitutions
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"': '\\"',
      '\\': '\\\\'
    },
    rep;


  function quote(string) {

    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
      var c = meta[a];
      return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
  }


  function str(key, holder) {

    // Produce a string from holder[key].
    var i, // The loop counter.
    k, // The member key.
    v, // The member value.
    length, mind = gap,
      partial, value = holder[key];

    // If the value has a toJSON method, call it to obtain a replacement value.
    if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
      value = value.toJSON(key);
    }

    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.
    if (typeof rep === 'function') {
      value = rep.call(holder, key, value);
    }

    // What happens next depends on the value's type.
    switch (typeof value) {
    case 'string':
      return quote(value);

    case 'number':

      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null';

    case 'boolean':
    case 'null':

      // If the value is a boolean or null, convert it to a string. Note:
      // typeof null does not produce 'null'. The case is included here in
      // the remote chance that this gets fixed someday.
      return String(value);

      // If the type is 'object', we might be dealing with an object or an array or
      // null.
    case 'object':

      // Due to a specification blunder in ECMAScript, typeof null is 'object',
      // so watch out for that case.
      if (!value) {
        return 'null';
      }

      // Make an array to hold the partial results of stringifying this object value.
      gap += indent;
      partial = [];

      // Is the value an array?
      if (Object.prototype.toString.apply(value) === '[object Array]') {

        // The value is an array. Stringify every element. Use null as a placeholder
        // for non-JSON values.
        length = value.length;
        for (i = 0; i < length; i += 1) {
          partial[i] = str(i, value) || 'null';
        }

        // Join all of the elements together, separated with commas, and wrap them in
        // brackets.
        v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
        gap = mind;
        return v;
      }

      // If the replacer is an array, use it to select the members to be stringified.
      if (rep && typeof rep === 'object') {
        length = rep.length;
        for (i = 0; i < length; i += 1) {
          if (typeof rep[i] === 'string') {
            k = rep[i];
            v = str(k, value);
            if (v) {
              partial.push(quote(k) + (gap ? ': ' : ':') + v);
            }
          }
        }
      } else {

        // Otherwise, iterate through all of the keys in the object.
        for (k in value) {
          if (Object.prototype.hasOwnProperty.call(value, k)) {
            v = str(k, value);
            if (v) {
              partial.push(quote(k) + (gap ? ': ' : ':') + v);
            }
          }
        }
      }

      // Join all of the member texts together, separated with commas,
      // and wrap them in braces.
      v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
      gap = mind;
      return v;
    }
  }

  // If the JSON object does not yet have a stringify method, give it one.
  if (typeof JSON.stringify !== 'function') {
    JSON.stringify = function(value, replacer, space) {

      // The stringify method takes a value and an optional replacer, and an optional
      // space parameter, and returns a JSON text. The replacer can be a function
      // that can replace values, or an array of strings that will select the keys.
      // A default replacer method can be provided. Use of the space parameter can
      // produce text that is more easily readable.
      var i;
      gap = '';
      indent = '';

      // If the space parameter is a number, make an indent string containing that
      // many spaces.
      if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
          indent += ' ';
        }

        // If the space parameter is a string, it will be used as the indent string.
      } else if (typeof space === 'string') {
        indent = space;
      }

      // If there is a replacer, it must be a function or an array.
      // Otherwise, throw an error.
      rep = replacer;
      if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
      }

      // Make a fake root object containing our value under the key of ''.
      // Return the result of stringifying the value.
      return str('', {
        '': value
      });
    };
  }


  // If the JSON object does not yet have a parse method, give it one.
  if (typeof JSON.parse !== 'function') {
    JSON.parse = function(text, reviver) {

      // The parse method takes a text and an optional reviver function, and returns
      // a JavaScript value if the text is a valid JSON text.
      var j;

      function walk(holder, key) {

        // The walk method is used to recursively walk the resulting structure so
        // that modifications can be made.
        var k, v, value = holder[key];
        if (value && typeof value === 'object') {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if (v !== undefined) {
                value[k] = v;
              } else {
                delete value[k];
              }
            }
          }
        }
        return reviver.call(holder, key, value);
      }


      // Parsing happens in four stages. In the first stage, we replace certain
      // Unicode characters with escape sequences. JavaScript handles many characters
      // incorrectly, either silently deleting them, or treating them as line endings.
      text = String(text);
      cx.lastIndex = 0;
      if (cx.test(text)) {
        text = text.replace(cx, function(a) {
          return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        });
      }

      // In the second stage, we run the text against regular expressions that look
      // for non-JSON patterns. We are especially concerned with '()' and 'new'
      // because they can cause invocation, and '=' because it can cause mutation.
      // But just to be safe, we want to reject all unexpected forms.

      // We split the second stage into 4 regexp operations in order to work around
      // crippling inefficiencies in IE's and Safari's regexp engines. First we
      // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
      // replace all simple value tokens with ']' characters. Third, we delete all
      // open brackets that follow a colon or comma or that begin the text. Finally,
      // we look to see that the remaining characters are only whitespace or ']' or
      // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
      if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

        // In the third stage we use the eval function to compile the text into a
        // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
        // in JavaScript: it can begin a block or an object literal. We wrap the text
        // in parens to eliminate the ambiguity.
        j = eval('(' + text + ')');

        // In the optional fourth stage, we recursively walk the new structure, passing
        // each name/value pair to a reviver function for possible transformation.
        return typeof reviver === 'function' ? walk({
          '': j
        }, '') : j;
      }

      // If the text is not JSON parseable, then a SyntaxError is thrown.
      throw new SyntaxError('JSON.parse');
    };
  }
}());


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

/**
 * bootbox.js v3.2.0
 *
 * http://bootboxjs.com/license.txt
 */
var bootbox=window.bootbox||function(w,n){function k(b,a){"undefined"===typeof a&&(a=p);return"string"===typeof j[a][b]?j[a][b]:a!=t?k(b,t):b}var p="en",t="en",u=!0,s="static",v="",l={},g={},m={setLocale:function(b){for(var a in j)if(a==b){p=b;return}throw Error("Invalid locale: "+b);},addLocale:function(b,a){"undefined"===typeof j[b]&&(j[b]={});for(var c in a)j[b][c]=a[c]},setIcons:function(b){g=b;if("object"!==typeof g||null===g)g={}},setBtnClasses:function(b){l=b;if("object"!==typeof l||null===
    l)l={}},alert:function(){var b="",a=k("OK"),c=null;switch(arguments.length){case 1:b=arguments[0];break;case 2:b=arguments[0];"function"==typeof arguments[1]?c=arguments[1]:a=arguments[1];break;case 3:b=arguments[0];a=arguments[1];c=arguments[2];break;default:throw Error("Incorrect number of arguments: expected 1-3");}return m.dialog(b,{label:a,icon:g.OK,"class":l.OK,callback:c},{onEscape:c||!0})},confirm:function(){var b="",a=k("CANCEL"),c=k("CONFIRM"),e=null;switch(arguments.length){case 1:b=arguments[0];
  break;case 2:b=arguments[0];"function"==typeof arguments[1]?e=arguments[1]:a=arguments[1];break;case 3:b=arguments[0];a=arguments[1];"function"==typeof arguments[2]?e=arguments[2]:c=arguments[2];break;case 4:b=arguments[0];a=arguments[1];c=arguments[2];e=arguments[3];break;default:throw Error("Incorrect number of arguments: expected 1-4");}var h=function(){if("function"===typeof e)return e(!1)};return m.dialog(b,[{label:a,icon:g.CANCEL,"class":l.CANCEL,callback:h},{label:c,icon:g.CONFIRM,"class":l.CONFIRM,
  callback:function(){if("function"===typeof e)return e(!0)}}],{onEscape:h})},prompt:function(){var b="",a=k("CANCEL"),c=k("CONFIRM"),e=null,h="";switch(arguments.length){case 1:b=arguments[0];break;case 2:b=arguments[0];"function"==typeof arguments[1]?e=arguments[1]:a=arguments[1];break;case 3:b=arguments[0];a=arguments[1];"function"==typeof arguments[2]?e=arguments[2]:c=arguments[2];break;case 4:b=arguments[0];a=arguments[1];c=arguments[2];e=arguments[3];break;case 5:b=arguments[0];a=arguments[1];
  c=arguments[2];e=arguments[3];h=arguments[4];break;default:throw Error("Incorrect number of arguments: expected 1-5");}var q=n("<form></form>");q.append("<input autocomplete=off type=text value='"+h+"' />");var h=function(){if("function"===typeof e)return e(null)},d=m.dialog(q,[{label:a,icon:g.CANCEL,"class":l.CANCEL,callback:h},{label:c,icon:g.CONFIRM,"class":l.CONFIRM,callback:function(){if("function"===typeof e)return e(q.find("input[type=text]").val())}}],{header:b,show:!1,onEscape:h});d.on("shown",
    function(){q.find("input[type=text]").focus();q.on("submit",function(a){a.preventDefault();d.find(".btn-primary").click()})});d.modal("show");return d},dialog:function(b,a,c){function e(){var a=null;"function"===typeof c.onEscape&&(a=c.onEscape());!1!==a&&f.modal("hide")}var h="",l=[];c||(c={});"undefined"===typeof a?a=[]:"undefined"==typeof a.length&&(a=[a]);for(var d=a.length;d--;){var g=null,k=null,j=null,m="",p=null;if("undefined"==typeof a[d].label&&"undefined"==typeof a[d]["class"]&&"undefined"==
    typeof a[d].callback){var g=0,k=null,r;for(r in a[d])if(k=r,1<++g)break;1==g&&"function"==typeof a[d][r]&&(a[d].label=k,a[d].callback=a[d][r])}"function"==typeof a[d].callback&&(p=a[d].callback);a[d]["class"]?j=a[d]["class"]:d==a.length-1&&2>=a.length&&(j="btn-primary");g=a[d].label?a[d].label:"Option "+(d+1);a[d].icon&&(m="<i class='"+a[d].icon+"'></i> ");k=a[d].href?a[d].href:"javascript:;";h="<a data-handler='"+d+"' class='btn "+j+"' href='"+k+"'>"+m+""+g+"</a>"+h;l[d]=p}d=["<div class='bootbox modal' tabindex='-1' style='overflow:hidden;'>"];
  if(c.header){j="";if("undefined"==typeof c.headerCloseButton||c.headerCloseButton)j="<a href='javascript:;' class='close'>&times;</a>";d.push("<div class='modal-header'>"+j+"<h3>"+c.header+"</h3></div>")}d.push("<div class='modal-body'></div>");h&&d.push("<div class='modal-footer'>"+h+"</div>");d.push("</div>");var f=n(d.join("\n"));("undefined"===typeof c.animate?u:c.animate)&&f.addClass("fade");(h="undefined"===typeof c.classes?v:c.classes)&&f.addClass(h);f.find(".modal-body").html(b);f.on("keyup.dismiss.modal",
      function(a){27===a.which&&c.onEscape&&e("escape")});f.on("click","a.close",function(a){a.preventDefault();e("close")});f.on("shown",function(){f.find("a.btn-primary:first").focus()});f.on("hidden",function(){f.remove()});f.on("click",".modal-footer a",function(b){var c=n(this).data("handler"),d=l[c],e=null;"undefined"!==typeof c&&"undefined"!==typeof a[c].href||(b.preventDefault(),"function"===typeof d&&(e=d()),!1!==e&&f.modal("hide"))});n("body").append(f);f.modal({backdrop:"undefined"===typeof c.backdrop?
      s:c.backdrop,keyboard:!1,show:!1});f.on("show",function(){n(w).off("focusin.modal")});("undefined"===typeof c.show||!0===c.show)&&f.modal("show");return f},modal:function(){var b,a,c,e={onEscape:null,keyboard:!0,backdrop:s};switch(arguments.length){case 1:b=arguments[0];break;case 2:b=arguments[0];"object"==typeof arguments[1]?c=arguments[1]:a=arguments[1];break;case 3:b=arguments[0];a=arguments[1];c=arguments[2];break;default:throw Error("Incorrect number of arguments: expected 1-3");}e.header=a;
  c="object"==typeof c?n.extend(e,c):e;return m.dialog(b,[],c)},hideAll:function(){n(".bootbox").modal("hide")},animate:function(b){u=b},backdrop:function(b){s=b},classes:function(b){v=b}},j={en:{OK:"OK",CANCEL:"Cancel",CONFIRM:"OK"},fr:{OK:"OK",CANCEL:"Annuler",CONFIRM:"D'accord"},de:{OK:"OK",CANCEL:"Abbrechen",CONFIRM:"Akzeptieren"},es:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Aceptar"},br:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Sim"},nl:{OK:"OK",CANCEL:"Annuleren",CONFIRM:"Accepteren"},ru:{OK:"OK",CANCEL:"\u041e\u0442\u043c\u0435\u043d\u0430",
  CONFIRM:"\u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c"},it:{OK:"OK",CANCEL:"Annulla",CONFIRM:"Conferma"}};return m}(document,window.jQuery);window.bootbox=bootbox;

!function(t,e,i){"undefined"!=typeof module?module.exports=i(t,e):"function"==typeof define&&"object"==typeof define.amd?define(i):e[t]=i(t,e)}("humane",this,function(){var t=window,e=document,i={on:function(e,i,n){"addEventListener"in t?e.addEventListener(i,n,!1):e.attachEvent("on"+i,n)},off:function(e,i,n){"removeEventListener"in t?e.removeEventListener(i,n,!1):e.detachEvent("on"+i,n)},bind:function(t,e){return function(){t.apply(e,arguments)}},isArray:Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)},config:function(t,e){return null!=t?t:e},transSupport:!1,useFilter:/msie [678]/i.test(navigator.userAgent),_checkTransition:function(){var t=e.createElement("div"),i={webkit:"webkit",Moz:"",O:"o",ms:"MS"};for(var n in i)n+"Transition"in t.style&&(this.vendorPrefix=i[n],this.transSupport=!0)}};i._checkTransition();var n=function(e){e||(e={}),this.queue=[],this.baseCls=e.baseCls||"humane",this.addnCls=e.addnCls||"",this.timeout="timeout"in e?e.timeout:2500,this.waitForMove=e.waitForMove||!1,this.clickToClose=e.clickToClose||!1,this.container=e.container;try{this._setupEl()}catch(n){i.on(t,"load",i.bind(this._setupEl,this))}};return n.prototype={constructor:n,_setupEl:function(){var t=e.createElement("div");t.style.display="none",this.container||(this.container=e.body),this.container.appendChild(t),this.el=t,this.removeEvent=i.bind(this.remove,this),this.transEvent=i.bind(this._afterAnimation,this),this._run()},_afterTimeout:function(){i.config(this.currentMsg.waitForMove,this.waitForMove)?this.removeEventsSet||(i.on(e.body,"mousemove",this.removeEvent),i.on(e.body,"click",this.removeEvent),i.on(e.body,"keypress",this.removeEvent),i.on(e.body,"touchstart",this.removeEvent),this.removeEventsSet=!0):this.remove()},_run:function(){if(!this._animating&&this.queue.length&&this.el){this._animating=!0,this.currentTimer&&(clearTimeout(this.currentTimer),this.currentTimer=null);var t=this.queue.shift(),e=i.config(t.clickToClose,this.clickToClose);e&&(i.on(this.el,"click",this.removeEvent),i.on(this.el,"touchstart",this.removeEvent));var n=i.config(t.timeout,this.timeout);n>0&&(this.currentTimer=setTimeout(i.bind(this._afterTimeout,this),n)),i.isArray(t.html)&&(t.html="<ul><li>"+t.html.join("<li>")+"</ul>"),this.el.innerHTML=t.html,this.currentMsg=t,this.el.className=this.baseCls,i.transSupport?(this.el.style.display="block",setTimeout(i.bind(this._showMsg,this),50)):this._showMsg()}},_setOpacity:function(t){i.useFilter?this.el.filters.item("DXImageTransform.Microsoft.Alpha").Opacity=100*t:this.el.style.opacity=t+""},_showMsg:function(){var t=i.config(this.currentMsg.addnCls,this.addnCls);if(i.transSupport)this.el.className=this.baseCls+" "+t+" "+this.baseCls+"-animate";else{var e=0;this.el.className=this.baseCls+" "+t+" "+this.baseCls+"-js-animate",this._setOpacity(0),this.el.style.display="block";var n=this,s=setInterval(function(){1>e?(e+=.1,e>1&&(e=1),n._setOpacity(e)):clearInterval(s)},30)}},_hideMsg:function(){var t=i.config(this.currentMsg.addnCls,this.addnCls);if(i.transSupport)this.el.className=this.baseCls+" "+t,i.on(this.el,i.vendorPrefix?i.vendorPrefix+"TransitionEnd":"transitionend",this.transEvent);else var e=1,n=this,s=setInterval(function(){e>0?(e-=.1,0>e&&(e=0),n._setOpacity(e)):(n.el.className=n.baseCls+" "+t,clearInterval(s),n._afterAnimation())},30)},_afterAnimation:function(){i.transSupport&&i.off(this.el,i.vendorPrefix?i.vendorPrefix+"TransitionEnd":"transitionend",this.transEvent),this.currentMsg.cb&&this.currentMsg.cb(),this.el.style.display="none",this._animating=!1,this._run()},remove:function(t){var n="function"==typeof t?t:null;i.off(e.body,"mousemove",this.removeEvent),i.off(e.body,"click",this.removeEvent),i.off(e.body,"keypress",this.removeEvent),i.off(e.body,"touchstart",this.removeEvent),i.off(this.el,"click",this.removeEvent),i.off(this.el,"touchstart",this.removeEvent),this.removeEventsSet=!1,n&&(this.currentMsg.cb=n),this._animating?this._hideMsg():n&&n()},log:function(t,e,i,n){var s={};if(n)for(var o in n)s[o]=n[o];if("function"==typeof e)i=e;else if(e)for(var o in e)s[o]=e[o];return s.html=t,i&&(s.cb=i),this.queue.push(s),this._run(),this},spawn:function(t){var e=this;return function(i,n,s){return e.log.call(e,i,n,s,t),e}},create:function(t){return new n(t)}},new n});


/** @license
 *
 * SoundManager 2: JavaScript Sound for the Web
 * ----------------------------------------------
 * http://schillmania.com/projects/soundmanager2/
 *
 * Copyright (c) 2007, Scott Schiller. All rights reserved.
 * Code provided under the BSD License:
 * http://schillmania.com/projects/soundmanager2/license.txt
 *
 * V2.97a.20130512
 */
(function(l,h){function V(V,la){function W(b){return c.preferFlash&&D&&!c.ignoreFlash&&c.flash[b]!==h&&c.flash[b]}function r(b){return function(c){var d=this._s;return!d||!d._a?null:b.call(this,c)}}this.setupOptions={url:V||null,flashVersion:8,debugMode:!0,debugFlash:!1,useConsole:!0,consoleOnly:!0,waitForWindowLoad:!1,bgColor:"#ffffff",useHighPerformance:!1,flashPollingInterval:null,html5PollingInterval:null,flashLoadTimeout:1E3,wmode:null,allowScriptAccess:"always",useFlashBlock:!1,useHTML5Audio:!0,
  html5Test:/^(probably|maybe)$/i,preferFlash:!0,noSWFCache:!1,idPrefix:"sound"};this.defaultOptions={autoLoad:!1,autoPlay:!1,from:null,loops:1,onid3:null,onload:null,whileloading:null,onplay:null,onpause:null,onresume:null,whileplaying:null,onposition:null,onstop:null,onfailure:null,onfinish:null,multiShot:!0,multiShotEvents:!1,position:null,pan:0,stream:!0,to:null,type:null,usePolicyFile:!1,volume:100};this.flash9Options={isMovieStar:null,usePeakData:!1,useWaveformData:!1,useEQData:!1,onbufferchange:null,
  ondataerror:null};this.movieStarOptions={bufferTime:3,serverURL:null,onconnect:null,duration:null};this.audioFormats={mp3:{type:['audio/mpeg; codecs\x3d"mp3"',"audio/mpeg","audio/mp3","audio/MPA","audio/mpa-robust"],required:!0},mp4:{related:["aac","m4a","m4b"],type:['audio/mp4; codecs\x3d"mp4a.40.2"',"audio/aac","audio/x-m4a","audio/MP4A-LATM","audio/mpeg4-generic"],required:!1},ogg:{type:["audio/ogg; codecs\x3dvorbis"],required:!1},opus:{type:["audio/ogg; codecs\x3dopus","audio/opus"],required:!1},
  wav:{type:['audio/wav; codecs\x3d"1"',"audio/wav","audio/wave","audio/x-wav"],required:!1}};this.movieID="sm2-container";this.id=la||"sm2movie";this.debugID="soundmanager-debug";this.debugURLParam=/([#?&])debug=1/i;this.versionNumber="V2.97a.20130512";this.altURL=this.movieURL=this.version=null;this.enabled=this.swfLoaded=!1;this.oMC=null;this.sounds={};this.soundIDs=[];this.didFlashBlock=this.muted=!1;this.filePattern=null;this.filePatterns={flash8:/\.mp3(\?.*)?$/i,flash9:/\.mp3(\?.*)?$/i};this.features=
{buffering:!1,peakData:!1,waveformData:!1,eqData:!1,movieStar:!1};this.sandbox={};this.html5={usingFlash:null};this.flash={};this.ignoreFlash=this.html5Only=!1;var Ja,c=this,Ka=null,k=null,X,p=navigator.userAgent,La=l.location.href.toString(),n=document,ma,Ma,na,m,u=[],L=!1,M=!1,q=!1,x=!1,oa=!1,N,w,pa,Y,qa,E,F,G,Na,ra,Z,sa,$,ta,H,ua,O,va,aa,I,Oa,wa,Pa,xa,Qa,P=null,ya=null,Q,za,J,ba,ca,s,R=!1,Aa=!1,Ra,Sa,Ta,da=0,S=null,ea,Ua=[],fa,v=null,Va,ga,T,y,ha,Ba,Wa,t,fb=Array.prototype.slice,z=!1,Ca,D,Da,Xa,
    B,ia,Ya=0,U=p.match(/(ipad|iphone|ipod)/i),Za=p.match(/android/i),C=p.match(/msie/i),gb=p.match(/webkit/i),ja=p.match(/safari/i)&&!p.match(/chrome/i),Ea=p.match(/opera/i),hb=p.match(/firefox/i),Fa=p.match(/(mobile|pre\/|xoom)/i)||U||Za,$a=!La.match(/usehtml5audio/i)&&!La.match(/sm2\-ignorebadua/i)&&ja&&!p.match(/silk/i)&&p.match(/OS X 10_6_([3-7])/i),Ga=n.hasFocus!==h?n.hasFocus():null,ka=ja&&(n.hasFocus===h||!n.hasFocus()),ab=!ka,bb=/(mp3|mp4|mpa|m4a|m4b)/i,Ha=n.location?n.location.protocol.match(/http/i):
        null,cb=!Ha?"http://":"",db=/^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4||m4v|m4a|m4b|mp4v|3gp|3g2)\s*(?:$|;)/i,eb="mpeg4 aac flv mov mp4 m4v f4v m4a m4b mp4v 3gp 3g2".split(" "),ib=RegExp("\\.("+eb.join("|")+")(\\?.*)?$","i");this.mimePattern=/^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;this.useAltURL=!Ha;var Ia;try{Ia=Audio!==h&&(Ea&&opera!==h&&10>opera.version()?new Audio(null):new Audio).canPlayType!==h}catch(jb){Ia=!1}this.hasHTML5=Ia;this.setup=function(b){var e=!c.url;b!==h&&q&&v&&c.ok();pa(b);
  b&&(e&&(O&&b.url!==h)&&c.beginDelayedInit(),!O&&(b.url!==h&&"complete"===n.readyState)&&setTimeout(H,1));return c};this.supported=this.ok=function(){return v?q&&!x:c.useHTML5Audio&&c.hasHTML5};this.getMovie=function(b){return X(b)||n[b]||l[b]};this.createSound=function(b,e){function d(){a=ba(a);c.sounds[a.id]=new Ja(a);c.soundIDs.push(a.id);return c.sounds[a.id]}var a,f=null;if(!q||!c.ok())return!1;e!==h&&(b={id:b,url:e});a=w(b);a.url=ea(a.url);void 0===a.id&&(a.id=c.setupOptions.idPrefix+Ya++);if(s(a.id,
    !0))return c.sounds[a.id];if(ga(a))f=d(),f._setup_html5(a);else{if(c.html5Only||c.html5.usingFlash&&a.url&&a.url.match(/data\:/i))return d();8<m&&null===a.isMovieStar&&(a.isMovieStar=!(!a.serverURL&&!(a.type&&a.type.match(db)||a.url&&a.url.match(ib))));a=ca(a,void 0);f=d();8===m?k._createSound(a.id,a.loops||1,a.usePolicyFile):(k._createSound(a.id,a.url,a.usePeakData,a.useWaveformData,a.useEQData,a.isMovieStar,a.isMovieStar?a.bufferTime:!1,a.loops||1,a.serverURL,a.duration||null,a.autoPlay,!0,a.autoLoad,
    a.usePolicyFile),a.serverURL||(f.connected=!0,a.onconnect&&a.onconnect.apply(f)));!a.serverURL&&(a.autoLoad||a.autoPlay)&&f.load(a)}!a.serverURL&&a.autoPlay&&f.play();return f};this.destroySound=function(b,e){if(!s(b))return!1;var d=c.sounds[b],a;d._iO={};d.stop();d.unload();for(a=0;a<c.soundIDs.length;a++)if(c.soundIDs[a]===b){c.soundIDs.splice(a,1);break}e||d.destruct(!0);delete c.sounds[b];return!0};this.load=function(b,e){return!s(b)?!1:c.sounds[b].load(e)};this.unload=function(b){return!s(b)?
    !1:c.sounds[b].unload()};this.onposition=this.onPosition=function(b,e,d,a){return!s(b)?!1:c.sounds[b].onposition(e,d,a)};this.clearOnPosition=function(b,e,d){return!s(b)?!1:c.sounds[b].clearOnPosition(e,d)};this.start=this.play=function(b,e){var d=null,a=e&&!(e instanceof Object);if(!q||!c.ok())return!1;if(s(b,a))a&&(e={url:e});else{if(!a)return!1;a&&(e={url:e});e&&e.url&&(e.id=b,d=c.createSound(e).play())}null===d&&(d=c.sounds[b].play(e));return d};this.setPosition=function(b,e){return!s(b)?!1:c.sounds[b].setPosition(e)};
  this.stop=function(b){return!s(b)?!1:c.sounds[b].stop()};this.stopAll=function(){for(var b in c.sounds)c.sounds.hasOwnProperty(b)&&c.sounds[b].stop()};this.pause=function(b){return!s(b)?!1:c.sounds[b].pause()};this.pauseAll=function(){var b;for(b=c.soundIDs.length-1;0<=b;b--)c.sounds[c.soundIDs[b]].pause()};this.resume=function(b){return!s(b)?!1:c.sounds[b].resume()};this.resumeAll=function(){var b;for(b=c.soundIDs.length-1;0<=b;b--)c.sounds[c.soundIDs[b]].resume()};this.togglePause=function(b){return!s(b)?
      !1:c.sounds[b].togglePause()};this.setPan=function(b,e){return!s(b)?!1:c.sounds[b].setPan(e)};this.setVolume=function(b,e){return!s(b)?!1:c.sounds[b].setVolume(e)};this.mute=function(b){var e=0;b instanceof String&&(b=null);if(b)return!s(b)?!1:c.sounds[b].mute();for(e=c.soundIDs.length-1;0<=e;e--)c.sounds[c.soundIDs[e]].mute();return c.muted=!0};this.muteAll=function(){c.mute()};this.unmute=function(b){b instanceof String&&(b=null);if(b)return!s(b)?!1:c.sounds[b].unmute();for(b=c.soundIDs.length-
      1;0<=b;b--)c.sounds[c.soundIDs[b]].unmute();c.muted=!1;return!0};this.unmuteAll=function(){c.unmute()};this.toggleMute=function(b){return!s(b)?!1:c.sounds[b].toggleMute()};this.getMemoryUse=function(){var b=0;k&&8!==m&&(b=parseInt(k._getMemoryUse(),10));return b};this.disable=function(b){var e;b===h&&(b=!1);if(x)return!1;x=!0;for(e=c.soundIDs.length-1;0<=e;e--)Pa(c.sounds[c.soundIDs[e]]);N(b);t.remove(l,"load",F);return!0};this.canPlayMIME=function(b){var e;c.hasHTML5&&(e=T({type:b}));!e&&v&&(e=b&&
      c.ok()?!!(8<m&&b.match(db)||b.match(c.mimePattern)):null);return e};this.canPlayURL=function(b){var e;c.hasHTML5&&(e=T({url:b}));!e&&v&&(e=b&&c.ok()?!!b.match(c.filePattern):null);return e};this.canPlayLink=function(b){return b.type!==h&&b.type&&c.canPlayMIME(b.type)?!0:c.canPlayURL(b.href)};this.getSoundById=function(b,e){return!b?null:c.sounds[b]};this.onready=function(b,c){if("function"===typeof b)c||(c=l),qa("onready",b,c),E();else throw Q("needFunction","onready");return!0};this.ontimeout=function(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  c){if("function"===typeof b)c||(c=l),qa("ontimeout",b,c),E({type:"ontimeout"});else throw Q("needFunction","ontimeout");return!0};this._wD=this._writeDebug=function(b,c){return!0};this._debug=function(){};this.reboot=function(b,e){var d,a,f;for(d=c.soundIDs.length-1;0<=d;d--)c.sounds[c.soundIDs[d]].destruct();if(k)try{C&&(ya=k.innerHTML),P=k.parentNode.removeChild(k)}catch(h){}ya=P=v=k=null;c.enabled=O=q=R=Aa=L=M=x=z=c.swfLoaded=!1;c.soundIDs=[];c.sounds={};Ya=0;if(b)u=[];else for(d in u)if(u.hasOwnProperty(d)){a=
      0;for(f=u[d].length;a<f;a++)u[d][a].fired=!1}c.html5={usingFlash:null};c.flash={};c.html5Only=!1;c.ignoreFlash=!1;l.setTimeout(function(){ta();e||c.beginDelayedInit()},20);return c};this.reset=function(){return c.reboot(!0,!0)};this.getMoviePercent=function(){return k&&"PercentLoaded"in k?k.PercentLoaded():null};this.beginDelayedInit=function(){oa=!0;H();setTimeout(function(){if(Aa)return!1;aa();$();return Aa=!0},20);G()};this.destruct=function(){c.disable(!0)};Ja=function(b){var e,d,a=this,f,g,K,
      A,l,n,r=!1,p=[],q=0,v,x,u=null,y;d=e=null;this.sID=this.id=b.id;this.url=b.url;this._iO=this.instanceOptions=this.options=w(b);this.pan=this.options.pan;this.volume=this.options.volume;this.isHTML5=!1;this._a=null;y=this.url?!1:!0;this.id3={};this._debug=function(){};this.load=function(b){var e=null,d;b!==h?a._iO=w(b,a.options):(b=a.options,a._iO=b,u&&u!==a.url&&(a._iO.url=a.url,a.url=null));a._iO.url||(a._iO.url=a.url);a._iO.url=ea(a._iO.url);d=a.instanceOptions=a._iO;if(!d.url&&!a.url)return a;
    if(d.url===a.url&&0!==a.readyState&&2!==a.readyState)return 3===a.readyState&&d.onload&&ia(a,function(){d.onload.apply(a,[!!a.duration])}),a;a.loaded=!1;a.readyState=1;a.playState=0;a.id3={};if(ga(d))e=a._setup_html5(d),e._called_load||(a._html5_canplay=!1,a.url!==d.url&&(a._a.src=d.url,a.setPosition(0)),a._a.autobuffer="auto",a._a.preload="auto",a._a._called_load=!0,d.autoPlay&&a.play());else{if(c.html5Only||a._iO.url&&a._iO.url.match(/data\:/i))return a;try{a.isHTML5=!1,a._iO=ca(ba(d)),d=a._iO,
        8===m?k._load(a.id,d.url,d.stream,d.autoPlay,d.usePolicyFile):k._load(a.id,d.url,!!d.stream,!!d.autoPlay,d.loops||1,!!d.autoLoad,d.usePolicyFile)}catch(f){I({type:"SMSOUND_LOAD_JS_EXCEPTION",fatal:!0})}}a.url=d.url;return a};this.unload=function(){0!==a.readyState&&(a.isHTML5?(A(),a._a&&(a._a.pause(),u=ha(a._a))):8===m?k._unload(a.id,"about:blank"):k._unload(a.id),f());return a};this.destruct=function(b){a.isHTML5?(A(),a._a&&(a._a.pause(),ha(a._a),z||K(),a._a._s=null,a._a=null)):(a._iO.onfailure=
      null,k._destroySound(a.id));b||c.destroySound(a.id,!0)};this.start=this.play=function(b,e){var d,f,g,K,A;f=!0;f=null;e=e===h?!0:e;b||(b={});a.url&&(a._iO.url=a.url);a._iO=w(a._iO,a.options);a._iO=w(b,a._iO);a._iO.url=ea(a._iO.url);a.instanceOptions=a._iO;if(!a.isHTML5&&a._iO.serverURL&&!a.connected)return a.getAutoPlay()||a.setAutoPlay(!0),a;ga(a._iO)&&(a._setup_html5(a._iO),l());1===a.playState&&!a.paused&&(d=a._iO.multiShot,d||(a.isHTML5&&a.setPosition(a._iO.position),f=a));if(null!==f)return f;
    b.url&&b.url!==a.url&&(!a.readyState&&!a.isHTML5&&8===m&&y?y=!1:a.load(a._iO));a.loaded||(0===a.readyState?(!a.isHTML5&&!c.html5Only?(a._iO.autoPlay=!0,a.load(a._iO)):a.isHTML5?a.load(a._iO):f=a,a.instanceOptions=a._iO):2===a.readyState&&(f=a));if(null!==f)return f;!a.isHTML5&&(9===m&&0<a.position&&a.position===a.duration)&&(b.position=0);if(a.paused&&0<=a.position&&(!a._iO.serverURL||0<a.position))a.resume();else{a._iO=w(b,a._iO);if(null!==a._iO.from&&null!==a._iO.to&&0===a.instanceCount&&0===a.playState&&
        !a._iO.serverURL){d=function(){a._iO=w(b,a._iO);a.play(a._iO)};if(a.isHTML5&&!a._html5_canplay)a.load({oncanplay:d}),f=!1;else if(!a.isHTML5&&!a.loaded&&(!a.readyState||2!==a.readyState))a.load({onload:d}),f=!1;if(null!==f)return f;a._iO=x()}(!a.instanceCount||a._iO.multiShotEvents||a.isHTML5&&a._iO.multiShot&&!z||!a.isHTML5&&8<m&&!a.getAutoPlay())&&a.instanceCount++;a._iO.onposition&&0===a.playState&&n(a);a.playState=1;a.paused=!1;a.position=a._iO.position!==h&&!isNaN(a._iO.position)?a._iO.position:
        0;a.isHTML5||(a._iO=ca(ba(a._iO)));a._iO.onplay&&e&&(a._iO.onplay.apply(a),r=!0);a.setVolume(a._iO.volume,!0);a.setPan(a._iO.pan,!0);a.isHTML5?2>a.instanceCount?(l(),f=a._setup_html5(),a.setPosition(a._iO.position),f.play()):(g=new Audio(a._iO.url),K=function(){t.remove(g,"onended",K);a._onfinish(a);ha(g);g=null},A=function(){t.remove(g,"canplay",A);try{g.currentTime=a._iO.position/1E3}catch(b){}g.play()},t.add(g,"ended",K),a._iO.position?t.add(g,"canplay",A):g.play()):(f=k._start(a.id,a._iO.loops||
        1,9===m?a.position:a.position/1E3,a._iO.multiShot||!1),9===m&&!f&&a._iO.onplayerror&&a._iO.onplayerror.apply(a))}return a};this.stop=function(b){var c=a._iO;1===a.playState&&(a._onbufferchange(0),a._resetOnPosition(0),a.paused=!1,a.isHTML5||(a.playState=0),v(),c.to&&a.clearOnPosition(c.to),a.isHTML5?a._a&&(b=a.position,a.setPosition(0),a.position=b,a._a.pause(),a.playState=0,a._onTimer(),A()):(k._stop(a.id,b),c.serverURL&&a.unload()),a.instanceCount=0,a._iO={},c.onstop&&c.onstop.apply(a));return a};
    this.setAutoPlay=function(b){a._iO.autoPlay=b;a.isHTML5||(k._setAutoPlay(a.id,b),b&&!a.instanceCount&&1===a.readyState&&a.instanceCount++)};this.getAutoPlay=function(){return a._iO.autoPlay};this.setPosition=function(b){b===h&&(b=0);var c=a.isHTML5?Math.max(b,0):Math.min(a.duration||a._iO.duration,Math.max(b,0));a.position=c;b=a.position/1E3;a._resetOnPosition(a.position);a._iO.position=c;if(a.isHTML5){if(a._a){if(a._html5_canplay){if(a._a.currentTime!==b)try{a._a.currentTime=b,(0===a.playState||
        a.paused)&&a._a.pause()}catch(e){}}else if(b)return a;a.paused&&a._onTimer(!0)}}else b=9===m?a.position:b,a.readyState&&2!==a.readyState&&k._setPosition(a.id,b,a.paused||!a.playState,a._iO.multiShot);return a};this.pause=function(b){if(a.paused||0===a.playState&&1!==a.readyState)return a;a.paused=!0;a.isHTML5?(a._setup_html5().pause(),A()):(b||b===h)&&k._pause(a.id,a._iO.multiShot);a._iO.onpause&&a._iO.onpause.apply(a);return a};this.resume=function(){var b=a._iO;if(!a.paused)return a;a.paused=!1;
      a.playState=1;a.isHTML5?(a._setup_html5().play(),l()):(b.isMovieStar&&!b.serverURL&&a.setPosition(a.position),k._pause(a.id,b.multiShot));!r&&b.onplay?(b.onplay.apply(a),r=!0):b.onresume&&b.onresume.apply(a);return a};this.togglePause=function(){if(0===a.playState)return a.play({position:9===m&&!a.isHTML5?a.position:a.position/1E3}),a;a.paused?a.resume():a.pause();return a};this.setPan=function(b,c){b===h&&(b=0);c===h&&(c=!1);a.isHTML5||k._setPan(a.id,b);a._iO.pan=b;c||(a.pan=b,a.options.pan=b);return a};
    this.setVolume=function(b,e){b===h&&(b=100);e===h&&(e=!1);a.isHTML5?a._a&&(a._a.volume=Math.max(0,Math.min(1,b/100))):k._setVolume(a.id,c.muted&&!a.muted||a.muted?0:b);a._iO.volume=b;e||(a.volume=b,a.options.volume=b);return a};this.mute=function(){a.muted=!0;a.isHTML5?a._a&&(a._a.muted=!0):k._setVolume(a.id,0);return a};this.unmute=function(){a.muted=!1;var b=a._iO.volume!==h;a.isHTML5?a._a&&(a._a.muted=!1):k._setVolume(a.id,b?a._iO.volume:a.options.volume);return a};this.toggleMute=function(){return a.muted?
        a.unmute():a.mute()};this.onposition=this.onPosition=function(b,c,e){p.push({position:parseInt(b,10),method:c,scope:e!==h?e:a,fired:!1});return a};this.clearOnPosition=function(a,b){var c;a=parseInt(a,10);if(isNaN(a))return!1;for(c=0;c<p.length;c++)if(a===p[c].position&&(!b||b===p[c].method))p[c].fired&&q--,p.splice(c,1)};this._processOnPosition=function(){var b,c;b=p.length;if(!b||!a.playState||q>=b)return!1;for(b-=1;0<=b;b--)c=p[b],!c.fired&&a.position>=c.position&&(c.fired=!0,q++,c.method.apply(c.scope,
        [c.position]));return!0};this._resetOnPosition=function(a){var b,c;b=p.length;if(!b)return!1;for(b-=1;0<=b;b--)c=p[b],c.fired&&a<=c.position&&(c.fired=!1,q--);return!0};x=function(){var b=a._iO,c=b.from,e=b.to,d,f;f=function(){a.clearOnPosition(e,f);a.stop()};d=function(){if(null!==e&&!isNaN(e))a.onPosition(e,f)};null!==c&&!isNaN(c)&&(b.position=c,b.multiShot=!1,d());return b};n=function(){var b,c=a._iO.onposition;if(c)for(b in c)if(c.hasOwnProperty(b))a.onPosition(parseInt(b,10),c[b])};v=function(){var b,
        c=a._iO.onposition;if(c)for(b in c)c.hasOwnProperty(b)&&a.clearOnPosition(parseInt(b,10))};l=function(){a.isHTML5&&Ra(a)};A=function(){a.isHTML5&&Sa(a)};f=function(b){b||(p=[],q=0);r=!1;a._hasTimer=null;a._a=null;a._html5_canplay=!1;a.bytesLoaded=null;a.bytesTotal=null;a.duration=a._iO&&a._iO.duration?a._iO.duration:null;a.durationEstimate=null;a.buffered=[];a.eqData=[];a.eqData.left=[];a.eqData.right=[];a.failures=0;a.isBuffering=!1;a.instanceOptions={};a.instanceCount=0;a.loaded=!1;a.metadata={};
      a.readyState=0;a.muted=!1;a.paused=!1;a.peakData={left:0,right:0};a.waveformData={left:[],right:[]};a.playState=0;a.position=null;a.id3={}};f();this._onTimer=function(b){var c,f=!1,g={};if(a._hasTimer||b){if(a._a&&(b||(0<a.playState||1===a.readyState)&&!a.paused))c=a._get_html5_duration(),c!==e&&(e=c,a.duration=c,f=!0),a.durationEstimate=a.duration,c=1E3*a._a.currentTime||0,c!==d&&(d=c,f=!0),(f||b)&&a._whileplaying(c,g,g,g,g);return f}};this._get_html5_duration=function(){var b=a._iO;return(b=a._a&&
        a._a.duration?1E3*a._a.duration:b&&b.duration?b.duration:null)&&!isNaN(b)&&Infinity!==b?b:null};this._apply_loop=function(a,b){a.loop=1<b?"loop":""};this._setup_html5=function(b){b=w(a._iO,b);var c=z?Ka:a._a,e=decodeURI(b.url),d;z?e===decodeURI(Ca)&&(d=!0):e===decodeURI(u)&&(d=!0);if(c){if(c._s)if(z)c._s&&(c._s.playState&&!d)&&c._s.stop();else if(!z&&e===decodeURI(u))return a._apply_loop(c,b.loops),c;d||(f(!1),c.src=b.url,Ca=u=a.url=b.url,c._called_load=!1)}else a._a=b.autoLoad||b.autoPlay?new Audio(b.url):
        Ea&&10>opera.version()?new Audio(null):new Audio,c=a._a,c._called_load=!1,z&&(Ka=c);a.isHTML5=!0;a._a=c;c._s=a;g();a._apply_loop(c,b.loops);b.autoLoad||b.autoPlay?a.load():(c.autobuffer=!1,c.preload="auto");return c};g=function(){if(a._a._added_events)return!1;var b;a._a._added_events=!0;for(b in B)B.hasOwnProperty(b)&&a._a&&a._a.addEventListener(b,B[b],!1);return!0};K=function(){var b;a._a._added_events=!1;for(b in B)B.hasOwnProperty(b)&&a._a&&a._a.removeEventListener(b,B[b],!1)};this._onload=function(b){var c=
        !!b||!a.isHTML5&&8===m&&a.duration;a.loaded=c;a.readyState=c?3:2;a._onbufferchange(0);a._iO.onload&&ia(a,function(){a._iO.onload.apply(a,[c])});return!0};this._onbufferchange=function(b){if(0===a.playState||b&&a.isBuffering||!b&&!a.isBuffering)return!1;a.isBuffering=1===b;a._iO.onbufferchange&&a._iO.onbufferchange.apply(a);return!0};this._onsuspend=function(){a._iO.onsuspend&&a._iO.onsuspend.apply(a);return!0};this._onfailure=function(b,c,e){a.failures++;if(a._iO.onfailure&&1===a.failures)a._iO.onfailure(a,
        b,c,e)};this._onfinish=function(){var b=a._iO.onfinish;a._onbufferchange(0);a._resetOnPosition(0);a.instanceCount&&(a.instanceCount--,a.instanceCount||(v(),a.playState=0,a.paused=!1,a.instanceCount=0,a.instanceOptions={},a._iO={},A(),a.isHTML5&&(a.position=0)),(!a.instanceCount||a._iO.multiShotEvents)&&b&&ia(a,function(){b.apply(a)}))};this._whileloading=function(b,c,e,d){var f=a._iO;a.bytesLoaded=b;a.bytesTotal=c;a.duration=Math.floor(e);a.bufferLength=d;a.durationEstimate=!a.isHTML5&&!f.isMovieStar?
        f.duration?a.duration>f.duration?a.duration:f.duration:parseInt(a.bytesTotal/a.bytesLoaded*a.duration,10):a.duration;a.isHTML5||(a.buffered=[{start:0,end:a.duration}]);(3!==a.readyState||a.isHTML5)&&f.whileloading&&f.whileloading.apply(a)};this._whileplaying=function(b,c,e,d,f){var g=a._iO;if(isNaN(b)||null===b)return!1;a.position=Math.max(0,b);a._processOnPosition();!a.isHTML5&&8<m&&(g.usePeakData&&(c!==h&&c)&&(a.peakData={left:c.leftPeak,right:c.rightPeak}),g.useWaveformData&&(e!==h&&e)&&(a.waveformData=
    {left:e.split(","),right:d.split(",")}),g.useEQData&&(f!==h&&f&&f.leftEQ)&&(b=f.leftEQ.split(","),a.eqData=b,a.eqData.left=b,f.rightEQ!==h&&f.rightEQ&&(a.eqData.right=f.rightEQ.split(","))));1===a.playState&&(!a.isHTML5&&(8===m&&!a.position&&a.isBuffering)&&a._onbufferchange(0),g.whileplaying&&g.whileplaying.apply(a));return!0};this._oncaptiondata=function(b){a.captiondata=b;a._iO.oncaptiondata&&a._iO.oncaptiondata.apply(a,[b])};this._onmetadata=function(b,c){var e={},d,f;d=0;for(f=b.length;d<f;d++)e[b[d]]=
        c[d];a.metadata=e;a._iO.onmetadata&&a._iO.onmetadata.apply(a)};this._onid3=function(b,c){var e=[],d,f;d=0;for(f=b.length;d<f;d++)e[b[d]]=c[d];a.id3=w(a.id3,e);a._iO.onid3&&a._iO.onid3.apply(a)};this._onconnect=function(b){b=1===b;if(a.connected=b)a.failures=0,s(a.id)&&(a.getAutoPlay()?a.play(h,a.getAutoPlay()):a._iO.autoLoad&&a.load()),a._iO.onconnect&&a._iO.onconnect.apply(a,[b])};this._ondataerror=function(b){0<a.playState&&a._iO.ondataerror&&a._iO.ondataerror.apply(a)}};va=function(){return n.body||
      n._docElement||n.getElementsByTagName("div")[0]};X=function(b){return n.getElementById(b)};w=function(b,e){var d=b||{},a,f;a=e===h?c.defaultOptions:e;for(f in a)a.hasOwnProperty(f)&&d[f]===h&&(d[f]="object"!==typeof a[f]||null===a[f]?a[f]:w(d[f],a[f]));return d};ia=function(b,c){!b.isHTML5&&8===m?l.setTimeout(c,0):c()};Y={onready:1,ontimeout:1,defaultOptions:1,flash9Options:1,movieStarOptions:1};pa=function(b,e){var d,a=!0,f=e!==h,g=c.setupOptions;for(d in b)if(b.hasOwnProperty(d))if("object"!==typeof b[d]||
      null===b[d]||b[d]instanceof Array||b[d]instanceof RegExp)f&&Y[e]!==h?c[e][d]=b[d]:g[d]!==h?(c.setupOptions[d]=b[d],c[d]=b[d]):Y[d]===h?a=!1:c[d]instanceof Function?c[d].apply(c,b[d]instanceof Array?b[d]:[b[d]]):c[d]=b[d];else if(Y[d]===h)a=!1;else return pa(b[d],d);return a};t=function(){function b(a){a=fb.call(a);var b=a.length;d?(a[1]="on"+a[1],3<b&&a.pop()):3===b&&a.push(!1);return a}function c(b,e){var h=b.shift(),k=[a[e]];if(d)h[k](b[0],b[1]);else h[k].apply(h,b)}var d=l.attachEvent,a={add:d?
      "attachEvent":"addEventListener",remove:d?"detachEvent":"removeEventListener"};return{add:function(){c(b(arguments),"add")},remove:function(){c(b(arguments),"remove")}}}();B={abort:r(function(){}),canplay:r(function(){var b=this._s,c;if(b._html5_canplay)return!0;b._html5_canplay=!0;b._onbufferchange(0);c=b._iO.position!==h&&!isNaN(b._iO.position)?b._iO.position/1E3:null;if(b.position&&this.currentTime!==c)try{this.currentTime=c}catch(d){}b._iO._oncanplay&&b._iO._oncanplay()}),canplaythrough:r(function(){var b=
      this._s;b.loaded||(b._onbufferchange(0),b._whileloading(b.bytesLoaded,b.bytesTotal,b._get_html5_duration()),b._onload(!0))}),ended:r(function(){this._s._onfinish()}),error:r(function(){this._s._onload(!1)}),loadeddata:r(function(){var b=this._s;!b._loaded&&!ja&&(b.duration=b._get_html5_duration())}),loadedmetadata:r(function(){}),loadstart:r(function(){this._s._onbufferchange(1)}),play:r(function(){this._s._onbufferchange(0)}),playing:r(function(){this._s._onbufferchange(0)}),progress:r(function(b){var c=
      this._s,d,a,f=0,f=b.target.buffered;d=b.loaded||0;var g=b.total||1;c.buffered=[];if(f&&f.length){d=0;for(a=f.length;d<a;d++)c.buffered.push({start:1E3*f.start(d),end:1E3*f.end(d)});f=1E3*(f.end(0)-f.start(0));d=Math.min(1,f/(1E3*b.target.duration))}isNaN(d)||(c._onbufferchange(0),c._whileloading(d,g,c._get_html5_duration()),d&&(g&&d===g)&&B.canplaythrough.call(this,b))}),ratechange:r(function(){}),suspend:r(function(b){var c=this._s;B.progress.call(this,b);c._onsuspend()}),stalled:r(function(){}),
    timeupdate:r(function(){this._s._onTimer()}),waiting:r(function(){this._s._onbufferchange(1)})};ga=function(b){return!b||!b.type&&!b.url&&!b.serverURL?!1:b.serverURL||b.type&&W(b.type)?!1:b.type?T({type:b.type}):T({url:b.url})||c.html5Only||b.url.match(/data\:/i)};ha=function(b){var c;b&&(c=ja&&!U?null:hb?"about:blank":null,b.src=c,void 0!==b._called_unload&&(b._called_load=!1));z&&(Ca=null);return c};T=function(b){if(!c.useHTML5Audio||!c.hasHTML5)return!1;var e=b.url||null;b=b.type||null;var d=c.audioFormats,
      a;if(b&&c.html5[b]!==h)return c.html5[b]&&!W(b);if(!y){y=[];for(a in d)d.hasOwnProperty(a)&&(y.push(a),d[a].related&&(y=y.concat(d[a].related)));y=RegExp("\\.("+y.join("|")+")(\\?.*)?$","i")}a=e?e.toLowerCase().match(y):null;!a||!a.length?b&&(e=b.indexOf(";"),a=(-1!==e?b.substr(0,e):b).substr(6)):a=a[1];a&&c.html5[a]!==h?e=c.html5[a]&&!W(a):(b="audio/"+a,e=c.html5.canPlayType({type:b}),e=(c.html5[a]=e)&&c.html5[b]&&!W(b));return e};Wa=function(){function b(a){var b,d,f=b=!1;if(!e||"function"!==typeof e.canPlayType)return b;
    if(a instanceof Array){b=0;for(d=a.length;b<d;b++)if(c.html5[a[b]]||e.canPlayType(a[b]).match(c.html5Test))f=!0,c.html5[a[b]]=!0,c.flash[a[b]]=!!a[b].match(bb);b=f}else a=e&&"function"===typeof e.canPlayType?e.canPlayType(a):!1,b=!(!a||!a.match(c.html5Test));return b}if(!c.useHTML5Audio||!c.hasHTML5)return v=c.html5.usingFlash=!0,!1;var e=Audio!==h?Ea&&10>opera.version()?new Audio(null):new Audio:null,d,a,f={},g;g=c.audioFormats;for(d in g)if(g.hasOwnProperty(d)&&(a="audio/"+d,f[d]=b(g[d].type),f[a]=
      f[d],d.match(bb)?(c.flash[d]=!0,c.flash[a]=!0):(c.flash[d]=!1,c.flash[a]=!1),g[d]&&g[d].related))for(a=g[d].related.length-1;0<=a;a--)f["audio/"+g[d].related[a]]=f[d],c.html5[g[d].related[a]]=f[d],c.flash[g[d].related[a]]=f[d];f.canPlayType=e?b:null;c.html5=w(c.html5,f);c.html5.usingFlash=Va();v=c.html5.usingFlash;return!0};sa={};Q=function(){};ba=function(b){8===m&&(1<b.loops&&b.stream)&&(b.stream=!1);return b};ca=function(b,c){if(b&&!b.usePolicyFile&&(b.onid3||b.usePeakData||b.useWaveformData||
      b.useEQData))b.usePolicyFile=!0;return b};ma=function(){return!1};Pa=function(b){for(var c in b)b.hasOwnProperty(c)&&"function"===typeof b[c]&&(b[c]=ma)};xa=function(b){b===h&&(b=!1);(x||b)&&c.disable(b)};Qa=function(b){var e=null;if(b)if(b.match(/\.swf(\?.*)?$/i)){if(e=b.substr(b.toLowerCase().lastIndexOf(".swf?")+4))return b}else b.lastIndexOf("/")!==b.length-1&&(b+="/");b=(b&&-1!==b.lastIndexOf("/")?b.substr(0,b.lastIndexOf("/")+1):"./")+c.movieURL;c.noSWFCache&&(b+="?ts\x3d"+(new Date).getTime());
    return b};ra=function(){m=parseInt(c.flashVersion,10);8!==m&&9!==m&&(c.flashVersion=m=8);var b=c.debugMode||c.debugFlash?"_debug.swf":".swf";c.useHTML5Audio&&(!c.html5Only&&c.audioFormats.mp4.required&&9>m)&&(c.flashVersion=m=9);c.version=c.versionNumber+(c.html5Only?" (HTML5-only mode)":9===m?" (AS3/Flash 9)":" (AS2/Flash 8)");8<m?(c.defaultOptions=w(c.defaultOptions,c.flash9Options),c.features.buffering=!0,c.defaultOptions=w(c.defaultOptions,c.movieStarOptions),c.filePatterns.flash9=RegExp("\\.(mp3|"+
      eb.join("|")+")(\\?.*)?$","i"),c.features.movieStar=!0):c.features.movieStar=!1;c.filePattern=c.filePatterns[8!==m?"flash9":"flash8"];c.movieURL=(8===m?"soundmanager2.swf":"soundmanager2_flash9.swf").replace(".swf",b);c.features.peakData=c.features.waveformData=c.features.eqData=8<m};Oa=function(b,c){if(!k)return!1;k._setPolling(b,c)};wa=function(){};s=this.getSoundById;J=function(){var b=[];c.debugMode&&b.push("sm2_debug");c.debugFlash&&b.push("flash_debug");c.useHighPerformance&&b.push("high_performance");
    return b.join(" ")};za=function(){Q("fbHandler");var b=c.getMoviePercent(),e={type:"FLASHBLOCK"};if(c.html5Only)return!1;c.ok()?c.oMC&&(c.oMC.className=[J(),"movieContainer","swf_loaded"+(c.didFlashBlock?" swf_unblocked":"")].join(" ")):(v&&(c.oMC.className=J()+" movieContainer "+(null===b?"swf_timedout":"swf_error")),c.didFlashBlock=!0,E({type:"ontimeout",ignoreInit:!0,error:e}),I(e))};qa=function(b,c,d){u[b]===h&&(u[b]=[]);u[b].push({method:c,scope:d||null,fired:!1})};E=function(b){b||(b={type:c.ok()?
      "onready":"ontimeout"});if(!q&&b&&!b.ignoreInit||"ontimeout"===b.type&&(c.ok()||x&&!b.ignoreInit))return!1;var e={success:b&&b.ignoreInit?c.ok():!x},d=b&&b.type?u[b.type]||[]:[],a=[],f,e=[e],g=v&&!c.ok();b.error&&(e[0].error=b.error);b=0;for(f=d.length;b<f;b++)!0!==d[b].fired&&a.push(d[b]);if(a.length){b=0;for(f=a.length;b<f;b++)a[b].scope?a[b].method.apply(a[b].scope,e):a[b].method.apply(this,e),g||(a[b].fired=!0)}return!0};F=function(){l.setTimeout(function(){c.useFlashBlock&&za();E();"function"===
      typeof c.onload&&c.onload.apply(l);c.waitForWindowLoad&&t.add(l,"load",F)},1)};Da=function(){if(D!==h)return D;var b=!1,c=navigator,d=c.plugins,a,f=l.ActiveXObject;if(d&&d.length)(c=c.mimeTypes)&&(c["application/x-shockwave-flash"]&&c["application/x-shockwave-flash"].enabledPlugin&&c["application/x-shockwave-flash"].enabledPlugin.description)&&(b=!0);else if(f!==h&&!p.match(/MSAppHost/i)){try{a=new f("ShockwaveFlash.ShockwaveFlash")}catch(g){a=null}b=!!a}return D=b};Va=function(){var b,e,d=c.audioFormats;
    if(U&&p.match(/os (1|2|3_0|3_1)/i))c.hasHTML5=!1,c.html5Only=!0,c.oMC&&(c.oMC.style.display="none");else if(c.useHTML5Audio&&(!c.html5||!c.html5.canPlayType))c.hasHTML5=!1;if(c.useHTML5Audio&&c.hasHTML5)for(e in fa=!0,d)if(d.hasOwnProperty(e)&&d[e].required)if(c.html5.canPlayType(d[e].type)){if(c.preferFlash&&(c.flash[e]||c.flash[d[e].type]))b=!0}else fa=!1,b=!0;c.ignoreFlash&&(b=!1,fa=!0);c.html5Only=c.hasHTML5&&c.useHTML5Audio&&!b;return!c.html5Only};ea=function(b){var e,d,a=0;if(b instanceof Array){e=
      0;for(d=b.length;e<d;e++)if(b[e]instanceof Object){if(c.canPlayMIME(b[e].type)){a=e;break}}else if(c.canPlayURL(b[e])){a=e;break}b[a].url&&(b[a]=b[a].url);b=b[a]}return b};Ra=function(b){b._hasTimer||(b._hasTimer=!0,!Fa&&c.html5PollingInterval&&(null===S&&0===da&&(S=setInterval(Ta,c.html5PollingInterval)),da++))};Sa=function(b){b._hasTimer&&(b._hasTimer=!1,!Fa&&c.html5PollingInterval&&da--)};Ta=function(){var b;if(null!==S&&!da)return clearInterval(S),S=null,!1;for(b=c.soundIDs.length-1;0<=b;b--)c.sounds[c.soundIDs[b]].isHTML5&&
      c.sounds[c.soundIDs[b]]._hasTimer&&c.sounds[c.soundIDs[b]]._onTimer()};I=function(b){b=b!==h?b:{};"function"===typeof c.onerror&&c.onerror.apply(l,[{type:b.type!==h?b.type:null}]);b.fatal!==h&&b.fatal&&c.disable()};Xa=function(){if(!$a||!Da())return!1;var b=c.audioFormats,e,d;for(d in b)if(b.hasOwnProperty(d)&&("mp3"===d||"mp4"===d))if(c.html5[d]=!1,b[d]&&b[d].related)for(e=b[d].related.length-1;0<=e;e--)c.html5[b[d].related[e]]=!1};this._setSandboxType=function(b){};this._externalInterfaceOK=function(b){if(c.swfLoaded)return!1;
    c.swfLoaded=!0;ka=!1;$a&&Xa();setTimeout(na,C?100:1)};aa=function(b,e){function d(a,b){return'\x3cparam name\x3d"'+a+'" value\x3d"'+b+'" /\x3e'}if(L&&M)return!1;if(c.html5Only)return ra(),c.oMC=X(c.movieID),na(),M=L=!0,!1;var a=e||c.url,f=c.altURL||a,g=va(),k=J(),l=null,l=n.getElementsByTagName("html")[0],m,r,q,l=l&&l.dir&&l.dir.match(/rtl/i);b=b===h?c.id:b;ra();c.url=Qa(Ha?a:f);e=c.url;c.wmode=!c.wmode&&c.useHighPerformance?"transparent":c.wmode;if(null!==c.wmode&&(p.match(/msie 8/i)||!C&&!c.useHighPerformance)&&
      navigator.platform.match(/win32|win64/i))Ua.push(sa.spcWmode),c.wmode=null;g={name:b,id:b,src:e,quality:"high",allowScriptAccess:c.allowScriptAccess,bgcolor:c.bgColor,pluginspage:cb+"www.macromedia.com/go/getflashplayer",title:"JS/Flash audio component (SoundManager 2)",type:"application/x-shockwave-flash",wmode:c.wmode,hasPriority:"true"};c.debugFlash&&(g.FlashVars="debug\x3d1");c.wmode||delete g.wmode;if(C)a=n.createElement("div"),r=['\x3cobject id\x3d"'+b+'" data\x3d"'+e+'" type\x3d"'+g.type+'" title\x3d"'+
      g.title+'" classid\x3d"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase\x3d"'+cb+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version\x3d6,0,40,0"\x3e',d("movie",e),d("AllowScriptAccess",c.allowScriptAccess),d("quality",g.quality),c.wmode?d("wmode",c.wmode):"",d("bgcolor",c.bgColor),d("hasPriority","true"),c.debugFlash?d("FlashVars",g.FlashVars):"","\x3c/object\x3e"].join("");else for(m in a=n.createElement("embed"),g)g.hasOwnProperty(m)&&a.setAttribute(m,g[m]);wa();k=J();if(g=
      va())if(c.oMC=X(c.movieID)||n.createElement("div"),c.oMC.id)q=c.oMC.className,c.oMC.className=(q?q+" ":"movieContainer")+(k?" "+k:""),c.oMC.appendChild(a),C&&(m=c.oMC.appendChild(n.createElement("div")),m.className="sm2-object-box",m.innerHTML=r),M=!0;else{c.oMC.id=c.movieID;c.oMC.className="movieContainer "+k;m=k=null;c.useFlashBlock||(c.useHighPerformance?k={position:"fixed",width:"8px",height:"8px",bottom:"0px",left:"0px",overflow:"hidden"}:(k={position:"absolute",width:"6px",height:"6px",top:"-9999px",
    left:"-9999px"},l&&(k.left=Math.abs(parseInt(k.left,10))+"px")));gb&&(c.oMC.style.zIndex=1E4);if(!c.debugFlash)for(q in k)k.hasOwnProperty(q)&&(c.oMC.style[q]=k[q]);try{C||c.oMC.appendChild(a),g.appendChild(c.oMC),C&&(m=c.oMC.appendChild(n.createElement("div")),m.className="sm2-object-box",m.innerHTML=r),M=!0}catch(s){throw Error(Q("domError")+" \n"+s.toString());}}return L=!0};$=function(){if(c.html5Only)return aa(),!1;if(k||!c.url)return!1;k=c.getMovie(c.id);k||(P?(C?c.oMC.innerHTML=ya:c.oMC.appendChild(P),
      P=null,L=!0):aa(c.id,c.url),k=c.getMovie(c.id));"function"===typeof c.oninitmovie&&setTimeout(c.oninitmovie,1);return!0};G=function(){setTimeout(Na,1E3)};Na=function(){var b,e=!1;if(!c.url||R)return!1;R=!0;t.remove(l,"load",G);if(ka&&!Ga)return!1;q||(b=c.getMoviePercent(),0<b&&100>b&&(e=!0));setTimeout(function(){b=c.getMoviePercent();if(e)return R=!1,l.setTimeout(G,1),!1;!q&&ab&&(null===b?c.useFlashBlock||0===c.flashLoadTimeout?c.useFlashBlock&&za():!c.useFlashBlock&&fa?l.setTimeout(function(){c.setup({preferFlash:!1}).reboot();
    c.didFlashBlock=!0;c.beginDelayedInit()},1):E({type:"ontimeout",ignoreInit:!0}):0!==c.flashLoadTimeout&&xa(!0))},c.flashLoadTimeout)};Z=function(){if(Ga||!ka)return t.remove(l,"focus",Z),!0;Ga=ab=!0;R=!1;G();t.remove(l,"focus",Z);return!0};N=function(b){if(q)return!1;if(c.html5Only)return q=!0,F(),!0;var e=!0,d;if(!c.useFlashBlock||!c.flashLoadTimeout||c.getMoviePercent())q=!0,x&&(d={type:!D&&v?"NO_FLASH":"INIT_TIMEOUT"});if(x||b)c.useFlashBlock&&c.oMC&&(c.oMC.className=J()+" "+(null===c.getMoviePercent()?
      "swf_timedout":"swf_error")),E({type:"ontimeout",error:d,ignoreInit:!0}),I(d),e=!1;x||(c.waitForWindowLoad&&!oa?t.add(l,"load",F):F());return e};Ma=function(){var b,e=c.setupOptions;for(b in e)e.hasOwnProperty(b)&&(c[b]===h?c[b]=e[b]:c[b]!==e[b]&&(c.setupOptions[b]=c[b]))};na=function(){if(q)return!1;if(c.html5Only)return q||(t.remove(l,"load",c.beginDelayedInit),c.enabled=!0,N()),!0;$();try{k._externalInterfaceTest(!1),Oa(!0,c.flashPollingInterval||(c.useHighPerformance?10:50)),c.debugMode||k._disableDebug(),
      c.enabled=!0,c.html5Only||t.add(l,"unload",ma)}catch(b){return I({type:"JS_TO_FLASH_EXCEPTION",fatal:!0}),xa(!0),N(),!1}N();t.remove(l,"load",c.beginDelayedInit);return!0};H=function(){if(O)return!1;O=!0;Ma();wa();!D&&c.hasHTML5&&c.setup({useHTML5Audio:!0,preferFlash:!1});Wa();!D&&v&&(Ua.push(sa.needFlash),c.setup({flashLoadTimeout:1}));n.removeEventListener&&n.removeEventListener("DOMContentLoaded",H,!1);$();return!0};Ba=function(){"complete"===n.readyState&&(H(),n.detachEvent("onreadystatechange",
      Ba));return!0};ua=function(){oa=!0;t.remove(l,"load",ua)};ta=function(){if(Fa&&(c.setupOptions.useHTML5Audio=!0,c.setupOptions.preferFlash=!1,U||Za&&!p.match(/android\s2\.3/i)))U&&(c.ignoreFlash=!0),z=!0};ta();Da();t.add(l,"focus",Z);t.add(l,"load",G);t.add(l,"load",ua);n.addEventListener?n.addEventListener("DOMContentLoaded",H,!1):n.attachEvent?n.attachEvent("onreadystatechange",Ba):I({type:"NO_DOM2_EVENTS",fatal:!0})}var la=null;if(void 0===l.SM2_DEFER||!SM2_DEFER)la=new V;l.SoundManager=V;l.soundManager=
    la})(window);
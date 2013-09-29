'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var myModule = angular.module('myApp.services', []);
myModule.factory('masjidtimes', function(){
  var mt = newMasjidTimes(masjidConfig);


  return mt;
}).factory('soundManager', function(){
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
 }).factory('backgroundManager', function(){
      var backgrounds;

      var backgroundManager =  {
        reset: function(){
          backgrounds = [
            {prayer: 'fajr-top', element: $('#top-dashboard #fajr-bg.background')},
            {prayer: 'shuruq', element: $('#top-dashboard #shuruq-bg.background')},
            {prayer: 'duhr', element: $('#top-dashboard #duhr-bg.background')},
            {prayer: 'asr', element: $('#top-dashboard #asr-bg.background')},
            {prayer: 'maghrib', element: $('#top-dashboard #maghrib-bg.background')},
            {prayer: 'isha', element: $('#top-dashboard #isha-bg.background')},
            {prayer: 'fajr', element: $('#top-dashboard #isha-fajr-bg.background')}
          ];
        },
        fixBackgroundHeight: function () {
          // Fix background height (very hacky :( )
          $('#top-dashboard .background').height($('#top-dashboard').outerHeight());
        },

        makeTransparent: function (prayer, opacity) {
          opacity = opacity || 0.0;
          var element = $.type(prayer) == 'string' ? '#top-dashboard #' + prayer + '-bg.background' : prayer;
          $(element).css('opacity', opacity);
        },

        makeOpaque: function (prayer) {
          var element = $.type(prayer) == 'string' ? '#top-dashboard #' + prayer + '-bg.background' : prayer;
          $(element).css('opacity', 1.0);

        },

        setBackgroundState: function (prayer, completeness) {
          // Set all opacity to 1 initially, then pop stack
          var i;
          for (i = 0; i < backgrounds.length; i++) {
            var current = backgrounds[i];
            if (current.prayer != prayer) {
              if (backgrounds[i + 1] && backgrounds[i + 1].prayer == prayer && completeness != undefined) {
                this.makeTransparent(current.element, 1 - completeness);
              } else {
                this.makeTransparent(current.element);
              }
            } else {
              this.makeOpaque(current.element);
              break;
            }
          }
        },

        updateBackground: function (next, previous) {
          var nextDate = next.date, previousDate = previous.date, remaining = next.remaining;
          var diff = nextDate - previousDate;
          var percentDone = 1 - remaining / diff;
          this.setBackgroundState(next.prayer, percentDone);
        }
      }
      backgroundManager.reset();
      return backgroundManager;
    });
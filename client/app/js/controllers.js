'use strict';
var checkAppCache = function(){
  return;
  try{
    if(!(window.chrome && window.chrome.app && window.chrome.app.getIsInstalled())){
      window.applicationCache.update();
      window.applicationCache.addEventListener('updateready', function(e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
          // Browser downloaded a new app cache.
          // Swap it in and reload the page to get the new hotness.
          window.applicationCache.swapCache();
          window.location.reload();
        } else {
          // Manifest didn't changed. Nothing new to server.
        }
      }, false);
    }
  } catch (e) {
    console.error("There was a problem checking for updates.", e);
  }
};
/* Controllers */

angular.module('myApp.controllers', []).
    controller('bodyCtrl', ['$scope', function($scope) {
      $scope.setCurrentNav = function(newNav){
        $scope.currentNav = newNav;
      };
      $scope.setCurrentNav('home'); // default.
    }])
    .controller('MasjidTimesCtrl', ['$scope', '$route', 'masjidtimes', 'backgroundManager', function($scope, $route, mt, background) {
      $scope.setCurrentNav('home');

      /**
       * Helper function to display prayer times into DOM
       * @param mosque
       */
      var populateTimes = function(mosque){
        //Update any mosque name place holders.
        $('.mosque-name').html(mosque.name);

        //Populate today's times.
        var times = mt.times.getToday();
        var timesTomorrow = mt.times.getTomorrow();
        for(var i = 0; i<mt.prayers.length; i++){
          $('.today .'+mt.prayers[i]+'-time').html(times[mt.prayers[i]]);
          $('.tomorrow .'+mt.prayers[i]+'-time').html(timesTomorrow[mt.prayers[i]]);
        }

        background.fixBackgroundHeight();

      };


      /**
       * Helper function that allows the user to select a mosque
       * @param mosques
       */
      var pickMosqueDialog = function(mosques){
        /*
         A mosque looks like this:
         capacity: "1100"
         contact: "020 7736 9060"
         description: "Arab"
         distance: "1.4017961344562937"
         dst-end: null
         dst-start: null
         id: "6"
         lat: "51.476309"
         location: "7 Bridges Place, Parsons Green, London, Greater London, SW6 4HW"
         long: "-0.201616"
         name: "Al-Muntada Al-Islami Trust"
         prayertimes_id: "2"
         */
        var numMosques = mosques.length;
        numMosques = numMosques < 5 ? numMosques : 4; // Max 4 mosques
        var text = "Select a mosque";

        text += "<ol id='mosque-list'>";
        for(var i = 0; i< numMosques; i++){
          var mosque = mosques[i];
          text += "<li data-mosque-index='"+i+"'><b>"+mosque.name+"</b><br /><span class='label label-default'>"+Math.round(mosque.distance*10)/10+" km</span> "+mosque.location+"</li>";
        }
        text += "</ol>";
        bootbox.alert(text, function(){
          var mosque = mosques[$('#mosque-list').find('li.selected').data('mosque-index')];
          mt.useMosque(mosque);
          humane.log("Mosque saved:<br />"+mosque.name);
          $('body').scrollTop(0);
        });
        var mosqueList = $('#mosque-list');
        $(mosqueList).find('li:first').addClass('selected');
        $(mosqueList).find('li').click(function(){
          $('#mosque-list').find('li').removeClass('selected');
          $(this).addClass('selected');
        });
      };



      console.log(mt);
      //fittext
      $('.nextprayercounter').fitText(1.7);
      $(window).trigger('resize');


      var updateRemaining = function(next){
        next = mt.times.getNext();
        var text, title, previous;
        previous =  mt.times.getPrevious();
        background.updateBackground(next, previous);

        if(next.remaining > 1000){
          var textArray = remaining.getArray(next.remaining/1000);
          textArray[0] = textArray[0] == undefined || textArray[0] == 0 ? '' : (textArray[0] == 1? textArray[0] + ' Hour' : textArray[0] + ' Hours' );
          textArray[1] = textArray[1] == undefined || textArray[1] == 0 ? '' : (textArray[1] == 1? textArray[1] + ' Minute' : textArray[1] + ' Minutes' );

          if(textArray[0] == '' && textArray[1] == '' && textArray[2] != undefined){
            // Less than a minute remaining.
            text = ''+textArray[2] + (textArray[2] == 1 ? ' Second' : ' Seconds');
          } else{
            text = "" + textArray[0] + (textArray[0] == '' ? "" : (textArray[1] != 0 ? ", " : "")) + textArray[1];
          }
          title = next.prayer.toUpperCase()+" in " + text+" | Masjid Times";
          text = text + '  until '+ next.prayer;
        } else {
          text = 'Prayer time!';
          title = 'Prayer time!';
        }

        window.document.title = title;


        if(!$scope.$$phase) {
          //$digest or $apply
          $scope.$apply(function () {
            $scope.nextPrayerCounterText = text;
            $scope.previous = previous;
            $scope.next = next;

            if(/isha|fajr/.test(next.prayer)){
              $scope.dashboardColor = {'color': 'white', 'text-shadow': '0px 0px 7px #090808'};
            } else {
              $scope.dashboardColor = undefined;
            }
          });
        } else {
          $scope.nextPrayerCounterText = text;
          $scope.previous = previous;
          $scope.next = next;
          if(/isha|fajr/.test(next.prayer)){
            $scope.dashboardColor = {'color': 'white', 'text-shadow': '0px 0px 7px #090808'};
          } else {
            $scope.dashboardColor = undefined;
          }
        }

        $(window).trigger('resize');

      };

      checkAppCache();

      background.fixBackgroundHeight();
      $(window).resize(function(){
        background.fixBackgroundHeight();
      });

      // Show the today tab by default.
      $scope.todayTomorrow = 'today';


      // We should only do this stuff once.
      if(!mt.initialised){
        // NOTE: Event handlers should be called first before init.

        // Get the nearest mosques
        mt.on('mosques', function(nearestMosques){
          pickMosqueDialog(nearestMosques);
        });

        mt.on('tick', function(next){
          updateRemaining(next);
        });

        mt.on('day', function(){
          // It's a new day :) Update today's prayer times.
          populateTimes(mt.mosque);
        });

        mt.on('prayer', function(prayerTimes){
          var id = prayerTimes.date.getTime();
          if(handledAlarms[id] == undefined){
            handledAlarms[id] = prayerTimes;
            setTimeout(function(){
              takbir.play();
              humane.log("Time for "+prayerTimes.prayer.toCapitalize()+ "! <span class='nextprayercounter'></span> ");
              updateRemaining();

              if(chrome && chrome.runtime && chrome.runtime.getBackgroundPage){
                chrome.runtime.getBackgroundPage(function(bg){bg.setMasjidTimeAlarms(mt)});
              }

            }, 1000);
          }
        });

        mt.ready(function(){
          populateTimes(mt.mosque);
          updateRemaining();

          // Fire any things we were waiting for
          if(window.fireWhenReady){
            mt.fire(window.fireWhenReady.name, window.fireWhenReady.args);
            window.fireWhenReady = undefined;
          }

          if(chrome && chrome.runtime && chrome.runtime.getBackgroundPage){
            chrome.runtime.getBackgroundPage(function(bg){bg.setMasjidTimeAlarms(mt)});
          }
        });

        // Ask for location
        mt.initFromCoords(function(cb){
          $('#nextprayercounter').html("This isn't si7r. We're calculating your location...");
          console.debug("getCurrentPosition called.");
          navigator.geolocation.getCurrentPosition(function(positionData){
            console.debug("Received current position: ", positionData);
            cb(positionData.coords);
          }, function(error){
            var doThisWhenError = function () {
              mt.initFromNothing();
            };
            switch(error.code){
              case error.PERMISSION_DENIED:
                bootbox.alert("Y u decline position ya3ni? <br /><br />We'll let you choose from the list of ALL mosques we have available.", doThisWhenError);
                break;
              case error.POSITION_UNAVAILABLE:
                bootbox.alert("It looks like we can't find your position! Maybe you're in the sahara desert or, ya3ni, your browser not very good. <br /><br />We'll let you choose from the list of ALL mosques we have available.", doThisWhenError);
                break;
              case error.TIMEOUT:
                bootbox.alert("It's taking longer than expected to figure out your position. Either your browser is lazy or, ya3ni, there's something wrong. <br /><br />We'll let you choose from the list of ALL mosques we have available.", doThisWhenError);
                break;
            }
          }, {timeout: 5000});
          if(mt.initialised){
            populateTimes(mt.mosque);
            updateRemaining();
          }
        });
      } else {
        // If mt has been initialised before, update the text and stuff.
        updateRemaining();
      }


    }]).controller('AboutPageCtrl', ['$scope',function($scope){
      $scope.setCurrentNav('about');

      checkAppCache();

    }]).controller('SettingsCtrl', ['$scope', '$route', 'masjidtimes', function($scope, $route, mt){
      $scope.setCurrentNav('settings');

      checkAppCache();

      $scope.clearCache = function(){
        // Clear cache
        mt.clearLocalStorage();
        $route.reload();
        humane.log("Cache cleared");
      };
    }]);
'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MasjidTimesCtrl', [function() {
      $('#top-nav').children('li').removeClass('active');
      $('#home-nav').addClass('active');
      if(mt.mosque){
        populateTimes(mt.mosque);
        updateRemaining();
      }
    }]).controller('AboutPageCtrl', [function(){
      $('#top-nav').children('li').removeClass('active');
      $('#about-nav').addClass('active');

    }]);
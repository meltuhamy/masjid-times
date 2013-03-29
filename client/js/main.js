var masjidTimes = newMasjidTimes();

$(document).ready(function(){
  //Get the nearest mosque info and log it.
  masjidTimes.requestNearestMosque(54,-5,null,function(data){
    mosque = data.response;
    $('.mosque-name').html(mosque.name);

    //Populate today's times.
    masjidTimes.requestTodayPrayerTimes(mosque.id, function(data){
      times = data.response;
      $('.fajr-time').html(times.fajr);
      $('.shuruq-time').html(times.shuruq);
      $('.duhr-time').html(times.duhr);
      $('.asr-time').html(times.asr);
      $('.maghrib-time').html(times.maghrib);
      $('.isha-time').html(times.isha);
    });
  });
});
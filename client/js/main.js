var masjidTimes = newMasjidTimes();

$(document).ready(function(){
  //Get the nearest mosque info and log it.
  masjidTimes.requestNearestMosque(54,-5,null,function(data){
    mosque = data.response;
    $('.mosque-name').html(mosque.name);
  });
});
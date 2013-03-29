/**
 * Creates a new masjidTimes Object
 * @param  {Object} config The configuration object
 * @return {Object}        The config (masjidTimes params)
 */
var newMasjidTimes = function(config){
  // Private properties
  private = {};
  private.config = config;

  // Public properties
  public = {};

  /**
   * Asynchronously does ajax request to get array of nearest mosques
   * @param  {Number}    lat      The latitude to search from
   * @param  {Number}    lng      The longitude to search from
   * @param  {[Number]}  range    (Optional) The range to search for
   * @param  {Function}  callback Callback function for when the request is done.
   */
  public.requestNearestMosques = function(lat, lng, range, callback){
    $.ajax({
      url: 'http://localhost:8888/masjid/mosque/',
      type: 'GET',
      data: {'lat': lat, 'long': lng, 'range':range},
      cache: true
    }).done(function(data){
      callback({request: {'lat': lat, 'long': lng, 'range':range}, response: data});
    });
  }

  /**
   * Asynchronously does ajax request to get the nearest mosque.
   * @param  {Number}    lat      The latitude to search from
   * @param  {Number}    lng      The longitude to search from
   * @param  {[Number]}  range    (Optional) The range to search for
   * @param  {Function}  callback Callback function for when the request is done.
   */
  public.requestNearestMosque = function(lat, lng, range, callback){
    public.requestNearestMosques(lat, lng, range, function(data){
      callback({request: data.request, response: data.response[0]});
    });
  }

  public.requestTodayPrayerTimes = function(mosqueid, callback){
    var date, day, month;
    date = new Date;
    day = date.getDate();
    month = date.getMonth() + 1;

    $.ajax({
      url: 'http://localhost:8888/masjid/table/'+mosqueid,
      type: 'GET',
      data: {'month': month, 'day': day},
      cache: true
    }).done(function(data){
      callback({request: {'month': month, 'day': day}, response: data});
    });
  }

  //Constructor
  return public;
}

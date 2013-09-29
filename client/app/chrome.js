/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/trunk/apps/app.runtime.html
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */

var appWindow, mt, mtAlarms;

mtAlarms = [];


var openWindow = function(callback){
  // Center window on screen.
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var width = 780;
  var height = 600;

  if(appWindow && appWindow.contentWindow && appWindow.contentWindow.window){
    appWindow.show();
    appWindow.focus();
    if(typeof callback === 'function') callback(appWindow.contentWindow.window);
  } else {
    chrome.app.window.create('index.html', {
      bounds: {
        width: width,
        height: height,
        left: Math.round((screenWidth-width)/2),
        top: Math.round((screenHeight-height)/2)
      }
    }, function(newWindow){
      appWindow = newWindow;
      if(typeof callback === 'function') callback(appWindow.contentWindow.window);
    });
  }
};

var setMasjidTimeAlarms = function(data){
  console.log("Received message from app", data);
  mt = data;
  var next = mt.times.getNext();
  var nextStamp = next.date.getTime();
  var id = "prayer:"+nextStamp;

  if(mtAlarms[id] === undefined){
    chrome.alarms.create(id,{
      when: nextStamp
    });
    mtAlarms[id] = next;
    console.log("Added new prayer alarm: ",id, next);
  } else{
    console.log("Alarm already exists for:",id, next);
  }
};

chrome.app.runtime.onLaunched.addListener(function() {
  openWindow();
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    console.debug('Storage key "%s" in namespace "%s" changed. ' +
        ' %s => %s ',
        key,
        namespace,
        storageChange.oldValue,
        storageChange.newValue);
  }
});



//chrome.alarms.create('test',{
//  periodInMinutes: 1
//});

chrome.alarms.onAlarm.addListener(function(alarm){
  console.log(alarm);
  var isPrayer = /prayer:\d+/;
  if(isPrayer.test(alarm.name)){
    console.log("PRAYER ALARM!!!");
    var next = mtAlarms[alarm.name];
    if(next){
      openWindow(function(app){
        app.fireWhenReady = {name: 'prayer', args: next};
      });
    }
  }
});
/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/trunk/apps/app.runtime.html
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */

var appWindow;
chrome.app.runtime.onLaunched.addListener(function() {
  // Center window on screen.
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var width = 780;
  var height = 600;

  if(appWindow && appWindow.contentWindow && appWindow.contentWindow.window){
    appWindow.show();
    appWindow.focus();
  } else {
    chrome.app.window.create('chrome.html', {
      bounds: {
        width: width,
        height: height,
        left: Math.round((screenWidth-width)/2),
        top: Math.round((screenHeight-height)/2)
      }
    }, function(newWindow){
      appWindow = newWindow;
    });
  }
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
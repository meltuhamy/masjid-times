var masjidConfig;
if(window.chrome && window.chrome.app && window.chrome.app.runtime){
  // it's a chrome packaged app!
  masjidConfig = {url: 'http://localhost:8888/masjid/', debug: false, storage: chrome.storage.local}

} else {
  // it's a browser!
  masjidConfig = {url: (window.location.protocol + "//" + window.location.host+'/masjid/'), debug: false};

}

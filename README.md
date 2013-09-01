Masjid Times
============

Finally a prayer times app that works with your Mosque!

Have you ever used a prayer times reminder application which calculates your prayer times using your location and some complex maths? The problem is, these prayer times might end up not matching your nearest Mosque...

Masjid Times uses actual prayer times from your mosque and alerts you when it's time for prayer!

Source code
-----------
Right now, the project consists of three main areas:

1. The [web service](https://github.com/meltuhamy/masjid-times/blob/master/server/index.php) found in ```server/index.php``` - this is the core of the prayer times web application (and other applications which I'm planning to do :P).
2. The MasjidTimes [client library](https://github.com/meltuhamy/masjid-times/blob/master/client/js/masjidtimes.js) found in ```client/js/masjidtimes.js```- This is an event-driven javascript library that runs in the browser. It is used to drive the web app. Documentation for this is coming soon :)
3. The MasjidTimes [web app](https://github.com/meltuhamy/masjid-times/tree/master/client) found in ```client/``` - This is the HTML, CSS and JavaScript that uses the MasjidTimes library and web service to show prayer times. You can see it live [here](http://meltuhamy.com/masjid-times).

I have plans of taking this further and creating native mobile apps that work in the same way as the web app. The idea is that since the web service is isolated from all application logic, we can use the prayer times API to create an application in any language and environment.

Prayer Times Web Service
------------------------
An API is provided to get prayer times using a simple HTTP RESTful interface. Check the [wiki](https://github.com/meltuhamy/masjid-times/wiki/Prayer-Times-Web-Service) for details.

Prayer Times Calculation
------------------------
This project is different from dozens of similar projects in that the prayer time table is stored in the database for each *mosque* rather than calculated using a prayer times calculation method that calculates the prayer times using your location. This is better because it means you pray at the same time as your local mosque. However, the idea is that if there is no nearby mosque, we give the user their prayer times using the traditional calculation method approach. 

Thus, prayer times calculation is one of 8 methods:

1. University of Islamic Sciences, Karachi, 
2. Islamic Society of North America (ISNA), 
3. Muslim World League, 
4. Umm al-Qura, Makkah, 
5. Egyptian General Authority of Survey, 
6. Institute of Geophysics, Tehran, 
7. Ithna Ashari 
8. **Your local mosque**.

Unfortunately, there is no way of automating how we get the prayer times from your local mosque, so these must be added manually to my [database](https://github.com/meltuhamy/masjid-times/blob/master/server/dummy.sql).

Prayer times are calculated on the server. They are returned to the client as a JSON response. See the [web service API](https://github.com/meltuhamy/masjid-times/wiki/Prayer-Times-Web-Service) for details.

How to set up server
--------------------
1. Copy ```config.sample.php``` to ```config.php``` and change it to match your db details.
2. Import the database structure in ```db_structure.sql``` and if you want to, the dummy data ```dummy.sql```.
3. Set up your HTTP server to use ```server``` directory for serving files (this can be done by sym-linking the folder into your htdocs folder.)
4. Test the service using a POST client like [Postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?utm_source=chrome-ntp-icon).


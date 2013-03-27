Masjid Times
============

Finally a prayer times app that works with your Mosque!

Have you ever used a prayer times reminder application which calculates your prayer times using your location and some complex maths? The problem is, these prayer times might end up not matching your nearest Mosque...

Masjid Times uses actual prayer times from your mosque and alerts you when it's time for prayer!

How to set up server
--------------------
1. Copy ```config.sample.php``` to ```config.php``` and change it to match your db details.
2. Import the database structure in ```db_structure.sql``` and if you want to, the dummy data ```dummy.sql```.
3. Set up your HTTP server to use ```server``` directory for serving files (this can be done by sym-linking the folder into your htdocs folder.)
4. Test the service using a POST client like [Postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?utm_source=chrome-ntp-icon).
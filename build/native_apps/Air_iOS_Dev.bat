ECHO OFF
ECHO.
ECHO compiling iOS version via Air, which might take a few minutes...
CALL adt -package -target ipa-ad-hoc -provisioning-profile Slideshow.mobileprovision -storetype pkcs12 -keystore iphone_dev.p12 ../../bin/native_apps/iOS_Air.ipa Air_config.xml icons -C splashScreens splashScreen-320x480.png splashScreen-640x960.png splashScreen-1024x748.png splashScreen-768x1004.png -C ../../bin app.swf app.css assets
ECHO compilation complete
ECHO.
ECHO installing application on the device (needs Air 3.4+)...
CALL adt -installApp -platform ios -package ../../bin/native_apps/iOS_Air.ipa
ECHO installation complete
ECHO.

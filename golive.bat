@echo off
rm -rfs live
mkdir live
mkdir live\json
mkdir live\jquery
mkdir live\img

echo Copying files...
copy /Q .htaccess live\
copy /Q *.html live\
copy /Q *.js live\
copy /Q *.css live\
copy /Q json\*.json live\json\
copy /Q jquery\*.js live\jquery\
copy /Q img\*.* live\img\

erase live\prod.js
erase live\prod-live.js
erase live\go.js

copy /Q prod-live.js live\prod.js

:done
echo Done.

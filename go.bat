@echo off
set PATH=.;C:\bat;C:\xsbin;c:\binnt\amd64;C:\binnt;C:\Strawberry\perl\bin;C:\Progra~1\git\bin;C:\ProgramData\chocolatey\bin
set PATH=%PATH%;C:\Users\i826538\AppData\Local\Programs\Micros~1;C:\Users\I826538\.krew\bin;C:\HANA\XSA\bin;C:\Progra~1\Maven\Apache~1.0\bin
set PATH=%PATH%;C:\Users\I826538\AppData\Roaming\npm;C:\asa17\bin64;C:\scripts;C:\scripts\ooperl;C:\python3;C:\python3\Scripts;C:\Progra~1\nodejs
set PATH=%PATH%;C:\wc11\binnt;C:\wc11\binw;C:\jdk1.8.0_211\bin;C:\jdk1.8.0_211\jre\bin;C:\Progra~2\PuTTY;C:\Progra~1\docker\docker\resources
set PATH=%PATH%;C:\Progra~1\docker\docker\resources\bin;C:\Progra~1\docker\docker\bin;C:\Windows\system32;C:\Windows;C:\Windows\system32\wbem
set PATH=%PATH%;C:\Windows\system32\openssh;C:\Users\I826538\Documents\Lacrosse\NLLScorigami\node_modules\.bin

start node go.js
start http://127.0.0.1:8001/

#!/bin/sh

. /Applications/SQLAnywhere17/System/bin64/sa_config.sh

#node go-daemon.js start
if [[ "$1" != "noweb" ]]; then
    open http://127.0.0.1:8001/ &
fi
if [[ -f "go.txt" ]]; then
    cat go.txt
fi
node go.js

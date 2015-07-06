#!/bin/sh

cd $(dirname $0)
jsdoc -v -t=template src ~/src/enchant.js/lang/ja/enchant.js -d=doc

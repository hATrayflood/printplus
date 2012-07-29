#!/bin/sh

rm   -rf /tmp/printplus
mkdir -p /tmp/printplus
git add .
git checkout-index -a -f --prefix=/tmp/printplus/
cd /tmp/printplus
rm  -f build.sh
rm  -f ${OLDPWD}/../printplus-fx+tb+sm.xpi
zip -r ${OLDPWD}/../printplus-fx+tb+sm.xpi * > /dev/null

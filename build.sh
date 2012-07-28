#!/bin/sh

rm   -rf /tmp/printplus
mkdir -p /tmp/printplus
git checkout-index -a -f --prefix=/tmp/printplus/
cd /tmp/printplus
rm  -f ../printplus.xpi
zip -r ../printplus.xpi * > /dev/null

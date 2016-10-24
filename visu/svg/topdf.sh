#!/bin/bash

for f in *.svg; do
    out=`echo $f | sed 's/svg/pdf/'`
    inkscape -T -A $out $f
done
pdftk *.pdf cat output PaintDocV1.2.pdf
ls *.pdf | grep -v PaintDocV1.2.pdf | xargs rm
rm *.svg

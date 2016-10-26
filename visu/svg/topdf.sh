#!/bin/bash

for f in p*.svg; do
    out=`echo $f | sed 's/svg/pdf/'`
    inkscape -T -A $out $f
    echo $out
done
pdftk p*.pdf cat output PaintDocV2.0.pdf
rm p*.pdf
rm p*.svg

#!/bin/bash

node pguide.js
for f in `ls a*.svg b*.svg p*.svg`; do
    out=`echo $f | sed 's/svg/pdf/'`
    inkscape -T -A $out $f
    echo $out
done

# hack for the hyperlinks p. ii
svglinkify.py b02.svg b02.pdf b02_links.pdf
mv b02_links.pdf b02.pdf

pdftk a*.pdf b*.pdf p*.pdf cat output PaintDoc.pdf
rm a*.pdf b*.pdf p*.pdf p*.svg

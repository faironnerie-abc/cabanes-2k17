#!/bin/bash

node atlas_book.js
for f in `ls p*.svg`; do
    out=`echo $f | sed 's/svg/pdf/'`
    echo -A $out $f
done | inkscape --shell
echo

pdftk p*.pdf cat output atlas_book.pdf
rm p*.svg p*.pdf

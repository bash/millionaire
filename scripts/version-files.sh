#!/bin/bash

identifier () {
  shasum $1 | awk '{print $1}' | base64 | cut -c1-10
}

FILES=(
    public/templates/*.html
    public/css/*.css
    public/js/*.js
    public/polyfills/*.js
)

PREFIX="public"

for FILE in ${FILES[@]}; do
  EXTENSION="${FILE##*.}"
  FILENAME="${FILE%.*}"
  VERSIONED="${FILENAME}-$(identifier "${FILE}").${EXTENSION}"

  echo "${VERSIONED#$PREFIX}"
done

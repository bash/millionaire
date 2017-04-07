#!/bin/bash

identifier () {
  shasum $1 | awk '{print $1}' | cut -c1-10
}

FILES=(
    public/templates/*.html
    public/css/*.css
    public/js/*.js
    public/polyfills/*.js
)

TEMPLATE=$(cat public/index.html)
TEMPLATE_MAP=$(./scripts/template-map.py public/templates/*.html)
PREFIX="public"

for FILE in ${FILES[@]}; do
  EXTENSION="${FILE##*.}"
  FILENAME="${FILE%.*}"
  VERSIONED="${FILENAME}-$(identifier "${FILE}").${EXTENSION}"

  TEMPLATE=$(echo "${TEMPLATE}" | ./scripts/replace.py "${FILE#$PREFIX}" "${VERSIONED#$PREFIX}")

  mv "${FILE}" "${VERSIONED}"
done

echo "${TEMPLATE}" \
    | ./scripts/replace.py "window.templateMap = {}" "window.templateMap = ${TEMPLATE_MAP}" \
    > public/index.html

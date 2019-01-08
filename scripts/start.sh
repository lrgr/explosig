#!/usr/bin/env bash
set -e

cp -R /dist /var/www
if [[ "$IMUSE_SERVER_URL" ]]; then
    NEW_URL=$(sed -e 's/[]\/$*.^[]/\\&/g' <<< $IMUSE_SERVER_URL)
    sed -i -- "s/https:\/\/imuse\-server\.lrgr\.io\//$NEW_URL/g" /var/www/js/app.*.js
fi

exec nginx
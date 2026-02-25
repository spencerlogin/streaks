#!/bin/sh
set -eu

CERT_DIR="/etc/letsencrypt/live/spencerlogin.com"
HTTP_CONF="/etc/nginx/conf.d/site.http.conf"
HTTPS_CONF="/etc/nginx/conf.d/site.https.conf"
ACTIVE_CONF="/etc/nginx/conf.d/default.conf"

if [ -f "$CERT_DIR/fullchain.pem" ] && [ -f "$CERT_DIR/privkey.pem" ]; then
  cp "$HTTPS_CONF" "$ACTIVE_CONF"
else
  cp "$HTTP_CONF" "$ACTIVE_CONF"
fi

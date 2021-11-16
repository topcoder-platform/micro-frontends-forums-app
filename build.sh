#!/bin/bash
set -eo pipefail
APP_NAME=$1
UPDATE_CACHE=""

docker build -f docker/Dockerfile -t $APP_NAME:latest \
--build-arg APPMODE=$APPMODE \
--build-arg APPENV=$APPENV .

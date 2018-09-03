#!/bin/bash

BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" # /code/deploy/scripts/
ROOT_DIR=$(dirname "$(dirname "$BASE_DIR")") # /code/
SERVER_DIR=${ROOT_DIR}/server

docker pull devtc/pennyworth:server-latest || true
docker build --cache-from devtc/pennyworth:server-latest --tag devtc/pennyworth:server-latest ${SERVER_DIR}

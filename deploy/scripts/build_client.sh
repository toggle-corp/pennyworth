#!/bin/bash

: '
This clones client required dependencies:
    - React-store
    - ravl
'

BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )" # /code/deploy/scripts/
ROOT_DIR=$(dirname "$(dirname "$BASE_DIR")") # /code/
CLIENT_DIR=${ROOT_DIR}/client

mkdir -p ${CLIENT_DIR}/src/vendor

git clone https://github.com/toggle-corp/react-store.git ${CLIENT_DIR}/src/vendor/react-store
git --git-dir=${CLIENT_DIR}/src/vendor/react-store/.git --no-pager show --pretty=fuller --quiet
cp ${CLIENT_DIR}/src/vendor/react-store/stylesheets/_user-imports-sample.scss ${CLIENT_DIR}/src/vendor/react-store/stylesheets/_user-imports.scss

git clone https://github.com/toggle-corp/ravl.git ${CLIENT_DIR}/src/vendor/ravl
git --git-dir=${CLIENT_DIR}/src/vendor/ravl/.git --no-pager show --pretty=fuller --quiet

docker pull devtc/pennyworth:client-latest || true
docker build --cache-from devtc/pennyworth:client-latest --tag devtc/pennyworth:client-latest ${CLIENT_DIR}

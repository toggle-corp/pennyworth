#!/bin/bash

: '
Right now, RC Docker image is pushed to dockerhub
'

echo "************************************************************";
echo "RC Branch=${PENNYWORTH_RC_BRANCH}, Branch=${TRAVIS_BRANCH}, Pull request=${TRAVIS_PULL_REQUEST}"
echo "************************************************************";

# Ignore pull request
if ! [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
    echo '[Travis Build] Pull request found ... exiting...'
    exit
fi

# Ignore non rc branch
if ! [ "${TRAVIS_BRANCH}" == "${PENNYWORTH_RC_BRANCH}" ]; then
    echo "Non Rc Branch: ${TRAVIS_BRANCH}, current RC branch: ${PENNYWORTH_RC_BRANCH} ...exiting...";
    exit
fi


docker tag devtc/pennyworth:server-latest devtc/pennyworth:server-release
docker push devtc/pennyworth:server-release

#!/bin/bash

yarn build
cd build
mv index.html 200.html
surge -d https://pennyworth.surge.sh

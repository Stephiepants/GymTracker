#!/bin/bash

#git pull
cd ./pose-detection/demos/live_video
rm -rf .cache dist node_modules
yarn build-dep
yarn
yarn watch


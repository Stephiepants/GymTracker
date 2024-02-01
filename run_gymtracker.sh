#!/bin/bash

#git pull
cd ./GymTracker_app/Application
rm -rf .cache dist node_modules
yarn build-dep
yarn
yarn watch


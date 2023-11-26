#!/bin/bash

#git pull
cd ./GymTracker/Application
rm -rf .cache dist node_modules
yarn build-dep
yarn
yarn watch


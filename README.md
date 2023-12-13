# GymTracker

Try our GymTracker application and get inspired with what you can do with pose-detection models in the gym!

-------------------------------------------------------------------------------

## How to run the application
If you want to run the application locally, you need to set up the environment on your computer

First make sure you have node.js, yarn and python installed on your computer.

To check if you already have yarn, python and node.js installed on your computer type these commands one by one in the Terminal/Command-line:

yarn -v 

python -v

node -v

If the software is not found or recognized follow the links below for installation

To install node.js:
https://nodejs.org/en/download

To install yarn:
https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable

To install python:
https://www.python.org/downloads/

Afterwards follow these steps:

1. Go to the 'Application' folder, e.g. `cd GymTracker/GymTracker_app/Application`

2. Remove cache etc. `rm -rf .cache dist node_modules`

3. Build dependency. `yarn build-dep`

4. Install dependencies. `yarn`

5. Run the demo. `yarn watch`

6. The demo runs at `localhost:1234/?model=movenet`

## Errors mac:
If you encounter errors during step 5 and you have a mac you can try to remove the yarn.lock, package-lock.json and noduel_module file in Application folder.

## Errors windows/linux:
Some users need to install "Visual Studio" with the workload "Desktop development with C++" included.

One way to do so is to follow the steps in the following link: https://learn.microsoft.com/en-us/cpp/build/vscpp-step-0-installation?view=msvc-170

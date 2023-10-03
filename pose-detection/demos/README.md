# Demos

Try our demos and get inspired with what you can do with pose-detection models!

## Table of Contents
1.  [Live Camera Demo](#live-camera-demo)

2. [Upload a Video Demo](#upload-a-video-demo)

3. [How to Run a Demo](#how-to-run-a-demo)

-------------------------------------------------------------------------------

## Live Camera Demo
This demo uses your camera to get live stream and tracks your poses in real-time.
You can try out different models, runtimes and backends to see the difference. It
works on laptops, iPhones and android phones.

[MoveNet model entry](https://storage.googleapis.com/tfjs-models/demos/pose-detection/index.html?model=movenet)

[BlazePose model entry](https://storage.googleapis.com/tfjs-models/demos/pose-detection/index.html?model=blazepose)

[PoseNet model entry](https://storage.googleapis.com/tfjs-models/demos/pose-detection/index.html?model=posenet)


## Upload a Video Demo
This demo allows you to upload a video (in .mp4 format) to run with the model.
Once the video is processed, it automatically downloads the video with pose keypoints.

[MoveNet model entry](https://storage.googleapis.com/tfjs-models/demos/pose-detection-upload-video/index.html?model=movenet)

[BlazePose model entry](https://storage.googleapis.com/tfjs-models/demos/pose-detection-upload-video/index.html?model=blazepose)

[PoseNet model entry](https://storage.googleapis.com/tfjs-models/demos/pose-detection-upload-video/index.html?model=posenet)


## How to Run a Demo
If you want to run any of the demos locally, you need to set up the environment on your computer

First make sure you have node.js, yarn and python installed on your computer. 

To install node.js: 
https://nodejs.org/en/download 

To install yarn:
https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable 

To install python:
https://www.python.org/downloads/ 

Afterwards follow these steps:

1. Go to the demo folder, e.g. `cd live_video`

2. Remove cache etc. `rm -rf .cache dist node_modules`

3. Build dependency. `yarn build-dep`

4. Install dependencies. `yarn`

5. Run the demo. `yarn watch`

6. The demo runs at `localhost:1234`. (Remember to provide URL model parameter e. g. `localhost:1234/?model=movenet`)

## Errors mac:
If you encounter errors during step 5 and you have a mac you can try to remove the yarn.lock, package-lock.json and noduel_module file in live_video folder. 

## Errors windows/linux:


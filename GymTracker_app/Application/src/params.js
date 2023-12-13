/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// Import necessary modules from external libraries and local files.
import * as posedetection from '@tensorflow-models/pose-detection'; // Import the 'pose-detection' module from TensorFlow.js.
import { isiOS } from './util'; // Import the 'isiOS' function from a local 'util' file.

// Define some constants for default values in the application.
export const DEFAULT_LINE_WIDTH = 4; // Define the default line width as 2.
export const DEFAULT_RADIUS = 3; // Define the default radius as 4.

// Define a set of predefined video size options.
export const VIDEO_SIZE = {
  '640 X 480': { width: 640, height: 480 }, // Option 1: 640 pixels wide and 480 pixels tall.
  '640 X 360': { width: 640, height: 360 }, // Option 2: 640 pixels wide and 360 pixels tall.
  '360 X 270': { width: 360, height: 270 }, // Option 3: 360 pixels wide and 270 pixels tall.
};

export const AVAILABLE_EXERCISE = {
  "Squat": {exercise: "Squat"},
  "Deadlift": {exercise: "Deadlift"},
  "Bicep curl": {exercise: "BicepCurl"}
}

// Define an initial application state with various properties.
export const STATE = {
  camera: { targetFPS: 60, sizeOption: '640 X 480' }, // Camera settings, defaulting to 640x480 and 60 FPS.
  backend: '', // The backend used for TensorFlow.js (empty initially).
  flags: {}, // Flags configuration (empty initially).
  modelConfig: {}, // Model configuration (empty initially).
  Exercise: "Bicep curl"
};

// Define configuration options for the BlazePose model.
export const BLAZEPOSE_CONFIG = {
  maxPoses: 1, // Maximum number of poses to detect (set to 1).
  type: 'full', // Type of detection (full).
  scoreThreshold: 0.65, // Minimum confidence score for a pose to be considered valid.
  render3D: true, // Whether to render poses in 3D (true).
};

// Define configuration options for the PoseNet model.
export const POSENET_CONFIG = {
  maxPoses: 1, // Maximum number of poses to detect (set to 1).
  scoreThreshold: 0.5, // Minimum confidence score for a pose to be considered valid.
};

// Define configuration options for the MoveNet model.
export const MOVENET_CONFIG = {
  maxPoses: 1, // Maximum number of poses to detect (set to 1).
  type: 'lightning', // Type of detection (lightning).
  scoreThreshold: 0.3, // Minimum confidence score for a pose to be considered valid.
  customModel: '', // Custom model (empty initially).
  enableTracking: false, // Whether to enable pose tracking (false).
};
/**
 * This map descripes tunable flags and theior corresponding types.
 *
 * The flags (keys) in the map satisfy the following two conditions:
 * - Is tunable. For example, `IS_BROWSER` and `IS_CHROME` is not tunable,
 * because they are fixed when running the scripts.
 * - Does not depend on other flags when registering in `ENV.registerFlag()`.
 * This rule aims to make the list streamlined, and, since there are
 * dependencies between flags, only modifying an independent flag without
 * modifying its dependents may cause inconsistency.
 * (`WEBGL_RENDER_FLOAT32_CAPABLE` is an exception, because only exposing
 * `WEBGL_FORCE_F16_TEXTURES` may confuse users.)
 */

// Define a map that describes tunable flags and their corresponding types.
export const TUNABLE_FLAG_VALUE_RANGE_MAP = {
  WEBGL_VERSION: [1, 2],
  WASM_HAS_SIMD_SUPPORT: [true, false],
  WASM_HAS_MULTITHREAD_SUPPORT: [true, false],
  WEBGL_CPU_FORWARD: [true, false],
  WEBGL_PACK: [true, false],
  WEBGL_FORCE_F16_TEXTURES: [true, false],
  WEBGL_RENDER_FLOAT32_CAPABLE: [true, false],
  WEBGL_FLUSH_THRESHOLD: [-1, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
  CHECK_COMPUTATION_FOR_ERRORS: [true, false],
};

// Define a map that associates specific TensorFlow.js backends with sets of flags.
export const BACKEND_FLAGS_MAP = {
  ['tfjs-wasm']: ['WASM_HAS_SIMD_SUPPORT', 'WASM_HAS_MULTITHREAD_SUPPORT'],
  ['tfjs-webgl']: [
    'WEBGL_VERSION', 'WEBGL_CPU_FORWARD', 'WEBGL_PACK',
    'WEBGL_FORCE_F16_TEXTURES', 'WEBGL_RENDER_FLOAT32_CAPABLE',
    'WEBGL_FLUSH_THRESHOLD'
  ],
  ['tfjs-webgpu']: [],
  ['mediapipe-gpu']: []
};

// Define a map that associates pose detection models with compatible backends.
export const MODEL_BACKEND_MAP = {
  [posedetection.SupportedModels.PoseNet]: ['tfjs-webgl', 'tfjs-webgpu'],
  [posedetection.SupportedModels.MoveNet]: ['tfjs-webgl', 'tfjs-wasm', 'tfjs-webgpu'],
  [posedetection.SupportedModels.BlazePose]: ['mediapipe-gpu', 'tfjs-webgl', 'tfjs-webgpu']
}


// Define a map that provides human-readable names for tunable flags.
export const TUNABLE_FLAG_NAME_MAP = {
  PROD: 'production mode',
  WEBGL_VERSION: 'webgl version',
  WASM_HAS_SIMD_SUPPORT: 'wasm SIMD',
  WASM_HAS_MULTITHREAD_SUPPORT: 'wasm multithread',
  WEBGL_CPU_FORWARD: 'cpu forward',
  WEBGL_PACK: 'webgl pack',
  WEBGL_FORCE_F16_TEXTURES: 'enforce float16',
  WEBGL_RENDER_FLOAT32_CAPABLE: 'enable float32',
  WEBGL_FLUSH_THRESHOLD: 'GL flush wait time(ms)'
};

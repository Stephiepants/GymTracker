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
// This function sets up a statistics monitoring tool using the Stats.js library.
export function setupStats() {
  // Create a new Stats.js object, which will display various performance statistics.
  const stats = new Stats();

  // Add a custom FPS (Frames Per Second) panel to the statistics.
  // It displays FPS metrics with a cyan background and dark blue text.
  stats.customFpsPanel = stats.addPanel(new Stats.Panel('FPS', '#0ff', '#002'));

  // Show the FPS panel by default.
  stats.showPanel(stats.domElement.children.length - 1);

  // Find the HTML element with the id 'stats' and store it in the 'parent' variable.
  const parent = document.getElementById('stats');

  // Append the DOM element of the Stats.js object to the 'parent' element.
  parent.appendChild(stats.domElement);

  // Find all the canvas elements within the 'parent' element.
  const statsPanes = parent.querySelectorAll('canvas');

  // Loop through each found canvas element.
  for (let i = 0; i < statsPanes.length; ++i) {
    // Set the width of the canvas element to 140 pixels.
    statsPanes[i].style.width = '140px';

    // Set the height of the canvas element to 80 pixels.
    statsPanes[i].style.height = '80px';
  }

  // Return the Stats.js object, which can be used for updating and displaying statistics.
  return stats;
}

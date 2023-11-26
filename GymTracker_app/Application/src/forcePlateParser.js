// Define a function to parse sensor data
// import { buffer } from "stream/consumers";
import * as BLE_forcePlates from "./BLE_forceplates";

let forcePair1;
let forcePair2;
let total = 0;
let canUpdateChart = true; // Flag to determine if chart can be updated
const operationDurationAverage = null;
let meanValueBack = 0;
let meanValueFront = 0;

const bufferSize = 10; // Size of buffer before updating chart

let sensorDataBuffers = {
  Chart0011: { front: [], back: [] }, // Buffers for ForcePlate0011
  Chart0010: { front: [], back: [] }, // Buffers for ForcePlate0010
};

// Global variables for counting notifications
let ParseCount = 0;
let lastSecond = Date.now();

function average(arr) {
  return arr.reduce((acc, val) => acc + val, 0) / arr.length;
}

export function parseSensorData(name, event) {
  // Extract the sensor data from the event's buffer
  const data = new Uint8Array(event.target.value.buffer);
  // console.log(data)

  // Check if the first byte (startByte) is correct (equal to 12)
  if (data[0] !== 12) {
    //console.log("DBG: StartByte data[0] =! 12, returning null");
    return null; // If it's not 12, return null to indicate an error
  }
  // Increment notification count
  ParseCount++;

  // Extract the timestamp from the event
  const time = event.timeStamp;

  // Convert the frame counter from bytes to a single number
  const frameCounter = data[3] | (data[2] << 8);

  // Initialize an empty array to store force data
  const forceData = [];

  // Initialize an array to store total forces
  const totalForceArr = [];

  // Loop through the sensor data buffer to parse force data
  for (let i = 4; i < 20; i += 4) {
    // Extract and convert force pair 1
    forcePair1 = intToFloat(data[i + 1] | (data[i] << 8)); // bakre sensorn
    /* const backRightSensor = data[4]; // index 4 & 8 & 12 & 16 is back right sensor
    console.log("backRightsensor " + backRightSensor); */

    /* const backLeftSensor = intToFloat(data[5]); //  index 5 & 9 & 13 & 17 is left back sensor
    console.log("backLeftsensor " + backLeftSensor); */
    /* const frontRightSensor = intToFloat(data[6] << 8); // index 6 & 10 & 14 & 18 is front right sensor
    console.log("frontrightsensor " + frontRightSensor); */

    // const frontLeftSensor = intToFloat(data[14]); // index 7 & 11 & 15 & 19 is front left sensor
    // console.log("frontlefttsensor " + frontLeftSensor);
    // Extract and convert force pair 2
    forcePair2 = intToFloat(data[i + 3] | (data[i + 2] << 8)); // främre sensorn

    // Calculate the total force for this data point
    const totalForce = forcePair1 + forcePair2;

    // Check if the f
    if (forcePair1 < 10 || forcePair2 < 10) {
      // At the end of all calculations and chart updates
      const operationEndTime = Date.now();
      const operationDuration =
        operationEndTime - BLE_forcePlates.operationStartTime;

      // console.log(
      //   "Total operation time W/O updating chart: " + operationDuration + " ms"
      // );

      // Check if a second has passed
      const currentTime = Date.now();
      if (currentTime - lastSecond >= 1000) {
        // 1000 milliseconds = 1 second
        //console.log("Parses per second w/o updating charts:", ParseCount);

        // Reset the count and update the time
        ParseCount = 0;
        lastSecond = currentTime;
      }
      return null; //
    }

    const chartId = name === "ForcePlate0011" ? "Chart0011" : "Chart0010";
    const chartLabel =
      name === "ForcePlate0011" ? "Right foot (0011)" : "Left foot (0010)";
    // console.log("this is chartId " + chartId);
    // Adding the data point to the correct buffer

    // console.log("this is the back sensor: " + sensorDataBuffers[chartId].front);
    // console.log("this is forcepair2: " + forcePair2);

    if (forcePair2 > 10) {
      // om den framre sensors lägg till datapunkt i arrayn

      sensorDataBuffers[chartId].front.push(forcePair2);

      // console.log(
      //   "this is the front sensor after pushing: " +
      //     sensorDataBuffers[chartId].front
      // );
    }
    if (forcePair1 > 10) {
      sensorDataBuffers[chartId].back.push(forcePair1);
    }

    // Check if both buffers are ready for processing
    if (sensorDataBuffers[chartId].front.length >= bufferSize) {
      meanValueFront = average(sensorDataBuffers[chartId].front);

      createOrUpdateThrottledBarChart(
        chartId,
        chartLabel,
        meanValueBack,
        meanValueFront
      );

      addSensorValue(chartId, meanValueFront, meanValueBack);

      sensorDataBuffers[chartId].front = [];
    }

    if (sensorDataBuffers[chartId].back.length >= bufferSize) {
      meanValueBack = average(sensorDataBuffers[chartId].back);
      // totalForce = meanValueBack + meanValueFront;

      createOrUpdateThrottledBarChart(
        chartId,
        chartLabel,
        meanValueBack,
        meanValueFront
      );

      addSensorValue(chartId, meanValueFront, meanValueBack);
      // Empty array
      sensorDataBuffers[chartId].back = [];

      // if (forcePair2 > 10) {
      //   console.log("total force: " + totalForce);
      //   updateChart(forcePair1 + forcePair2, time);
      //   totalForce = 0;
      // }
    }

    // if (totalForce > 10) {
    //   updateChart(totalForce, time);
    //   totalForce = 0;
    // }

    // Update the chart with both mean values

    //   createOrUpdateThrottledBarChart(
    //     chartId,
    //     chartLabel,
    //     forcePair1,
    //     forcePair2
    //   );

    ///////// old chart code starts here //////////
    // if (name == "ForcePlate0011") {
    //   createAndUpdateBarChart0011(forcePair1, forcePair2); // creates and updates the chart with the values from sensor 0011
    // } else {
    //   createAndUpdateBarChart0010(forcePair1, forcePair2); //creates and updates the chart with the values from sensor 0010
    // }
    ///////// old chart code ends here //////////

    // Add the parsed force data to the forceData array
    forceData.push({
      f1: forcePair1,
      f2: forcePair2,
      tf: totalForce,
    });

    // Add the total force to the totalForceArr
    totalForceArr.push(totalForce);
  }

  // Calculate the average force from the totalForceArr
  const avgForce = calculateAverage(totalForceArr);

  const updateInterval = 200; // Time in milliseconds (1 second in this case)

  // Function to handle chart updates
  function handleUpdate(avgForce, time) {
    if (canUpdateChart) {
      // Update the chart
      //console.log("this is the average force" + avgForce);
      updateChart(avgForce, time);

      // Prevent further updates until the interval passes
      canUpdateChart = false;
      setTimeout(() => {
        canUpdateChart = true;
      }, updateInterval);
    }
  }

  if (avgForce > 20) handleUpdate(avgForce, time); //Filters out avgforce values below set value
  // console.log("total force before: " + totalForce);
  // if (totalForce > 10) {
  //   updateChart(totalForce, time);
  //   totalForce = 0;
  // }
  // updateChart(avgForce, time);

  // At the end of all calculations and chart updates
  const operationEndTime = Date.now();
  const operationDuration =
    operationEndTime - BLE_forcePlates.operationStartTime;

  console.log(
    "Total operation time after running chart code: " +
      operationDuration +
      " ms"
  );

  // Check if a second has passed
  const currentTime = Date.now();
  if (currentTime - lastSecond >= 1000) {
    // 1000 milliseconds = 1 second
    console.log("Parses per second:", ParseCount);

    // Reset the count and update the time
    ParseCount = 0;
    lastSecond = currentTime;
  }

  // Return an object containing the parsed values
  return {
    name,
    time,
    frameCounter,
    avgForce,
    forceData,
  };
}

// Helper function to convert an integer to a floating-point number
function intToFloat(value) {
  // Split the integer value into integer and fractional parts
  const integerPart = value >> 4; // Get the integer part (8 bits)
  const fractionalPart = value & 0x0f; // Get the fractional part (4 bits)

  // Combine the integer and fractional parts to form a float
  return integerPart + fractionalPart / 16;
}

// Helper function to calculate the average of an array of numbers
function calculateAverage(array) {
  if (array.length === 0) {
    return 0; // Return 0 if the array is empty to avoid division by zero
  }

  // Calculate the sum of all numbers in the array
  const sum = array.reduce(
    (accumulator, currentValue) => accumulator + currentValue
  );

  // Calculate and return the average
  const average = sum / array.length;
  return average;
}

///////// old chart code starts here //////////

// let Chart0011;
// let Chart0010;

// Function to create and update a bar chart for 0011
// function createAndUpdateBarChart0011(back, front) {
//   // Get the canvas element by its ID
//   const ctx = document.getElementById("Chart0011").getContext("2d");

//   // Initialize or update chart data
//   if (!Chart0011) {
//     // Create a new bar chart instance with initial data
//     Chart0011 = new Chart(ctx, {
//       type: "bar",
//       data: {
//         labels: ["Backsensor", "Frontsensor"],
//         datasets: [
//           {
//             label: "Right foot (0011)",
//             data: [back, front],
//             backgroundColor: [
//               "rgba(255, 99, 132, 0.2)", // Color for the first bar
//               "rgba(54, 162, 235, 0.2)", // Color for the second bar
//             ],
//             borderColor: [
//               "rgba(255, 99, 132, 1)", // Border color for the first bar
//               "rgba(54, 162, 235, 1)", // Border color for the second bar
//             ],
//             borderWidth: 1, // Border width for all bars
//           },
//         ],
//       },
//       options: {
//         // maintainAspectRatio: false, // Disable aspect ratio constraint
//         scales: {
//           y: {
//             max: 300,
//             beginAtZero: true,
//           },
//         },
//       },
//     });
//   } else {
//     // Update the chart data with new values
//     Chart0011.data.datasets[0].data = [back, front];

//     const chartInterval_0011 = setInterval(() => {
//       console.log("updating 0011");
//       // Call the update method for your chart here
//       Chart0011.update();
//     }, 50);
//     // Chart0011.update();
//   }
// }

// // Function to create and update a bar chart for 0010
// function createAndUpdateBarChart0010(back, front) {
//   // Get the canvas element by its ID
//   const ctx = document.getElementById("Chart0010").getContext("2d");

//   // Initialize or update chart data
//   if (!Chart0010) {
//     // Create a new bar chart instance with initial data
//     Chart0010 = new Chart(ctx, {
//       type: "bar",
//       data: {
//         labels: ["Backsensor", "Frontsensor"],
//         datasets: [
//           {
//             label: "Left foot (0010)",
//             data: [back, front],
//             backgroundColor: [
//               "rgba(255, 99, 132, 0.2)", // Color for the first bar
//               "rgba(54, 162, 235, 0.2)", // Color for the second bar
//             ],
//             borderColor: [
//               "rgba(255, 99, 132, 1)", // Border color for the first bar
//               "rgba(54, 162, 235, 1)", // Border color for the second bar
//             ],
//             borderWidth: 1, // Border width for all bars
//           },
//         ],
//       },
//       options: {
//         // maintainAspectRatio: false, // Disable aspect ratio constraint
//         scales: {
//           y: {
//             max: 300,
//             beginAtZero: true,
//           },
//         },
//       },
//     });
//   } else {
//     // Update the chart data with new values
//     Chart0010.data.datasets[0].data = [back, front];

//     const chartInterval_0010 = setInterval(() => {
//       console.log("updating 0010");
//       // Call the update method for your chart here
//       Chart0010.update();
//     }, 50);
//     // Chart0010.update();
//   }
// }

///////// old chart code ends here //////////

// // Define a global variable for charts
let charts = {};
let chartElements = {};

function getChartElement(id) {
  if (!chartElements[id]) {
    chartElements[id] = document.getElementById(id);
  }
  return chartElements[id];
}

// Create or update a throttled bar chart
const createOrUpdateThrottledBarChart = function (
  chartId,
  chartLabel,
  back,
  front
) {
  const ctx = getChartElement(chartId).getContext("2d");

  if (!charts[chartId]) {
    // Create a new chart instance
    charts[chartId] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Backsensor", "Frontsensor"],
        datasets: [
          {
            label: chartLabel,
            data: [back, front],
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)", // Color for the back sensor
              "rgba(54, 162, 235, 0.5)", // Color for the front sensor
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)", // Border color for the back sensor
              "rgba(54, 162, 235, 1)", // Border color for the front sensor
            ],
            borderWidth: 1, // Border width for both sensors
          },
        ],
      },
      options: {
        animation: false,
        plugins: {
          legend: {
            labels: {
              usePointStyle: false,
              color: "rgb(0, 255, 106)", // Set the font color for labels
              boxWidth: 0,
              boxHeight: 0,
              font: {
                size: 20, // Set the font size for labels
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 50,
              color: "rgb(0, 255, 106)", // Set the font color for y-axis ticks
              font: {
                size: 20, // Set the font size for y-axis ticks
              },
            },
          },
          x: {
            // x-axis configuration
            ticks: {
              font: {
                size: 20, // Set the font size for x-axis labels
              },
              color: (context) => {
                // Check the label of the tick
                if (context.tick.label === "Backsensor") {
                  return "rgb(255, 99, 132)"; // Color for "Backsensor"
                } else if (context.tick.label === "Frontsensor") {
                  return "rgb(54, 162, 235)"; // Color for "Frontsensor"
                }
                return "rgb(0, 0, 0)"; // Default color for other labels (if any)
              },
            },
          },
        },
      },
    });
  } else {
    // Update the chart data with new values
    charts[chartId].data.datasets[0].data = [back, front];
    if ([back] > 10 || [front] > 10) charts[chartId].update();
  }
};

function resetBarCharts(chartId1, chartId2) {
  // Check if the first chart exists and reset it
  if (charts[chartId1]) {
    charts[chartId1].data.datasets[0].data = [0, 0]; // Reset the data values to zero
    console.log("DBG: Bar Chart 1 RESET!");
    charts[chartId1].update(); // Update the chart to reflect the changes
  }

  // Check if the second chart exists and reset it
  if (charts[chartId2]) {
    charts[chartId2].data.datasets[0].data = [0, 0]; // Reset the data values to zero
    console.log("DBG: Bar Chart 2 RESET!");
    charts[chartId2].update(); // Update the chart to reflect the changes
  }
}

// Throttle function do control how often the chart.update function is being executed
// function throttle(fn, delay) {
//   let lastExecutionTime = 0;
//   let timeoutId;

//   return function (...args) {
//     const currentTime = Date.now();

//     if (currentTime - lastExecutionTime >= delay) {
//       clearTimeout(timeoutId);
//       lastExecutionTime = currentTime;
//       fn.apply(this, args);
//     } else {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//         lastExecutionTime = currentTime;
//         fn.apply(this, args);
//       }, delay);
//     }
//   };
// }

//Chart-related code below this line
// Get a reference to the canvas element
const chartCanvas = document.getElementById("totalForceChart");

// Initialize the Chart.js chart with default data
const ctx_chart = chartCanvas.getContext("2d");

// Define the configuration for the Chart.js chart
const chartConfig = {
  type: "line", // Specify the chart type as a line chart
  data: {
    labels: [], // An array to hold X-axis labels (timestamps or time intervals)
    datasets: [
      {
        label: "Total Force [N]", // Label for the dataset
        data: [], // An array to hold numerical data points for the force plate values
        borderColor: "rgb(0, 255, 106)", // Color of the line
        borderWidth: 4, // Width of the line
        fill: false, // Fill the area under the line (set to 'false' for just lines)
        pointRadius: 0, // No dots for each data point
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        labels: {
          usePointStyle: false,
          color: "rgb(0, 255, 106)", // Set the font color for labels
          boxWidth: 0,
          boxHeight: 0,
          font: {
            size: 20, // Set the font size for labels
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear", // X-axis scale type is linear
        position: "bottom", // X-axis position at the bottom
        display: false,
      },
      y: {
        type: "linear",
        beginAtZero: true, // Start Y-axis from zero
        display: true,
        ticks: {
          stepSize: 100,
          color: "rgb(0, 255, 106)", // Set the font color
          font: {
            size: 25, // Set the font size
          },
        },
      },
    },
  },
};

// Create a new Chart.js chart instance using the canvas context and configuration
const totalForceChart = new Chart(ctx_chart, chartConfig);

/// Function to update the chart with new data or maintain the existing data
function updateChart(newNumericValue, time) {
  // Add the new data point to the chart
  totalForceChart.data.labels.push(time);
  //console.log('DBG: totalForceChart.data.datasets:', totalForceChart.data.datasets[0]);
  totalForceChart.data.datasets[0].data.push(newNumericValue);

  totalForceChart.update();
}

document.querySelector("#resetCharts").addEventListener("click", function () {
  resetChart();
  resetBarCharts("Chart0010", "Chart0011");
});

// Function to reset the chart completely
function resetChart() {
  // Clear the labels and data arrays
  totalForceChart.data.labels = [];
  totalForceChart.data.datasets[0].data = [];
  console.log("DBG: Chart RESET!");

  // Update the chart to reflect the changes
  totalForceChart.update();
}

/////////////////////HEATMAP CODE/////////////////////////////////
// // minimal heatmap instance configuration
var heatmapInstance = h337.create({
  container: document.querySelector(".heatmap"), // container is required
  radius: 20,

  gradient: {
    // Adjust the gradient colors
    0: "white",
    ".1": "blue",
    ".5": "yellow",
    ".8": "red",
  },
});

// Object to store information about two different forceplates
const forceplates = {
  // Information related to forceplate Chart0010
  Chart0010: {
    frontSensorPoints: [
      { x: 132, y: 115 }, // Coordinates for the Left foot front point
    ],
    backSensorPoints: [
      { x: 132, y: 225 }, // Coordinates for the Left foot's heel point
    ],
    maxFrontValue: 0, // Maximum force value for the front sensor
    maxBackValue: 0, // Maximum force value for the back sensor
  },

  // Information related to forceplate Chart0011
  Chart0011: {
    frontSensorPoints: [
      { x: 440, y: 115 }, // Coordinates for the Right foot front point
    ],
    backSensorPoints: [
      { x: 440, y: 225 }, // Coordinates for the Right foot's heel point
    ],
    maxFrontValue: 0, // Maximum force value for the front sensor
    maxBackValue: 0, // Maximum force value for the back sensor
  },
};

// Decay factor per update
const decayFactor = 0.95;

// Decay the max values over time to allow dynamic changes
function decayMaxValues() {
  Object.keys(forceplates).forEach((key) => {
    let forceplate = forceplates[key];
    forceplate.maxFrontValue = Math.max(
      forceplate.maxFrontValue * decayFactor,
      1
    );
    forceplate.maxBackValue = Math.max(
      forceplate.maxBackValue * decayFactor,
      1
    );
  });
}

// Call this function at a regular interval, e.g., every second
setInterval(decayMaxValues, 1000);

// Update the heatmap with new data points
function updateHeatmap() {
  // Clear the existing heatmap data
  heatmapInstance.setData({ max: 100, min: 0, data: [] });

  // Iterate over each forceplate
  Object.keys(forceplates).forEach((key) => {
    let forceplate = forceplates[key];
    let frontPoint = forceplate.frontSensorPoints[0]; // Assuming one point per sensor for simplicity
    let backPoint = forceplate.backSensorPoints[0];

    // Create data points with the normalized value
    let frontDataPoint = {
      x: frontPoint.x,
      y: frontPoint.y,
      value: forceplate.frontSensorValue,
    };
    let backDataPoint = {
      x: backPoint.x,
      y: backPoint.y,
      value: forceplate.backSensorValue,
    };

    // Add the data points to the heatmap instance
    heatmapInstance.addData([frontDataPoint, backDataPoint]);
  });
}

// Function to add sensor values
function addSensorValue(side, frontSensorValue, backSensorValue) {
  // Get the corresponding forceplate
  let forceplate = forceplates[side];
  if (!forceplate) {
    console.error("Invalid side provided:", side);
    return;
  }

  // Calculate normalized values
  let normalizedFrontValue =
    (frontSensorValue / forceplate.maxFrontValue) * 100;
  let normalizedBackValue = (backSensorValue / forceplate.maxBackValue) * 100;

  // Update the max values if needed
  forceplate.maxFrontValue = Math.max(
    forceplate.maxFrontValue,
    frontSensorValue
  );
  forceplate.maxBackValue = Math.max(forceplate.maxBackValue, backSensorValue);

  // Ensure we only add values to the heatmap if they are above the threshold
  forceplate.frontSensorValue =
    frontSensorValue > 20 ? normalizedFrontValue : 0;
  forceplate.backSensorValue = backSensorValue > 20 ? normalizedBackValue : 0;

  // Update the heatmap visualization
  updateHeatmap();
}

/////////////// SIMULATION CODE ///////////////////
let increasing = true; // This flag determines whether the value is increasing or decreasing

function simulateForceApplication() {
  let currentForce = 0; // Starting force value
  let startTime = 0;

  const updateInterval = 200; // How often to update the force value in milliseconds
  const maxForce = 300; // The maximum force value
  const increment = (maxForce - 20) / (3000 / updateInterval); // How much to increment each time

  setInterval(() => {
    // Call the function to update the heatmap with the current force values for both sensors
    addSensorValue("Chart0010", currentForce, currentForce);
    addSensorValue("Chart0011", currentForce, currentForce);

    updateChart(currentForce, startTime);
    startTime++;

    if (increasing) {
      // If increasing, increment the force value
      currentForce += increment;
      if (currentForce >= maxForce) {
        // Once the maximum is reached, start decreasing
        increasing = false;
      }
    } else {
      // If decreasing, decrement the force value
      currentForce -= increment;
      if (currentForce <= 20) {
        // Once the minimum is reached, start increasing
        increasing = true;
      }
    }
    //console.log("DBG: currentForce = ", currentForce)
  }, updateInterval);
}

// Start the simulation
simulateForceApplication();

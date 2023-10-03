// Define a function to parse sensor data

export function parseSensorData(name, event) {
  // Extract the sensor data from the event's buffer
  const data = new Uint8Array(event.target.value.buffer);
  // console.log(data)

  // Check if the first byte (startByte) is correct (equal to 12)
  if (data[0] !== 12) {
    console.log("DBG: StartByte data[0] =! 12, returning null");
    return null; // If it's not 12, return null to indicate an error
  }

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
    const forcePair1 = intToFloat(data[i + 1] | (data[i] << 8)); // bakre sensorn

    // Extract and convert force pair 2
    const forcePair2 = intToFloat(data[i + 3] | (data[i + 2] << 8)); // främre sensorn

    // Calculate the total force for this data point
    const totalForce = forcePair1 + forcePair2;

    const chartId = name === "ForcePlate0011" ? "Chart0011" : "Chart0010";
    const chartLabel =
      name === "ForcePlate0011" ? "Sensor Values 0011" : "Sensor Values 0010";
    //console.log(chartId + " " + chartLabel);
    createOrUpdateThrottledBarChart(
      chartId,
      chartLabel,
      forcePair1,
      forcePair2
    );

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
  //  console.log("this is the average force" + avgForce);

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
const createOrUpdateThrottledBarChart = throttle(function (
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
              "rgba(255, 99, 132, 0.2)", // Color for the back sensor
              "rgba(54, 162, 235, 0.2)", // Color for the front sensor
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
        scales: {
          y: {
            max: 300,
            beginAtZero: true,
          },
        },
      },
    });
  } else {
    // Update the chart data with new values
    charts[chartId].data.datasets[0].data = [back, front];
    charts[chartId].update();
  }
},
50); // Adjust the throttle delay

// Throttle function do control how often the chart.update function is being executed
function throttle(fn, delay) {
  let lastExecutionTime = 0;
  let timeoutId;

  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecutionTime >= delay) {
      clearTimeout(timeoutId);
      lastExecutionTime = currentTime;
      fn.apply(this, args);
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastExecutionTime = currentTime;
        fn.apply(this, args);
      }, delay);
    }
  };
}


// minimal heatmap instance configuration
var heatmapInstance = h337.create({
  container: document.querySelector('.heatmap'), // container is required
  radius: 20,
});

// Function to generate a random integer between min and max, inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Array of constant x and y values for the 6 different points
const points = [
  {x: 80, y: 120},  //Left foot - pinky point
  {x: 140, y: 100}, //Left foot - big toe point
  {x: 120, y: 225}, //Left foot - heel point
  {x: 310, y: 100}, //Right foot - pinky point
  {x: 370, y: 120}, //Right foot - big toe point
  {x: 330, y: 225}, //Right foot - heel point
];

var numberOfPoints = 0;
function addRandomDataPoint() {
  // Use modulo to loop over the 6 points
  const point = points[numberOfPoints % 6];

  var dataPoint = {
    x: point.x, // constant x coordinate from the points array
    y: point.y, // constant y coordinate from the points array
    value: getRandomInt(1, 750), // random value between 1 and 750
  };
  //console.log("DBG: datapoint.value is: ", dataPoint.value)
  numberOfPoints++;

  if(numberOfPoints <= 100)
    heatmapInstance.addData(dataPoint);
  else {
    heatmapInstance.setData({ data: [] });
    numberOfPoints = 0;
  }
}

// Set an interval to call addRandomDataPoint every 0.1 seconds
setInterval(addRandomDataPoint, 100);

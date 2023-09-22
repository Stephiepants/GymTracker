import { ForcePlateUUIDS } from "./UUIDs";
import * as forcePlateParser from "./forcePlateParser";
import { updateChart } from "./renderer_canvas2d";

var acquiredNotifyGATTCharacteristic;
var acquiredWriteGATTCharacteristic;
var battery_levelServiceUUID = "0000180f-0000-1000-8000-00805f9b34fb";
var battery_levelReadNotifyCharacteristic =
  "00002a19-0000-1000-8000-00805f9b34fb";
var acquiredBatteryGATTCharacteristic;
//var heartRateGATTServiceUUID = '0000180d-0000-1000-8000-00805f9b34fb' //Heart_rate service
//var heartRateMeasurementGATTCharacteristic = '00002a37-0000-1000-8000-00805f9b34fb' //Heat_rate_measurement characteristic
//let sharedData

document.querySelector("#connect").disabled = false;
document.querySelector("#start").disabled = true;
document.querySelector("#stop").disabled = true;
document.querySelector("#writeStart").disabled = true;
document.querySelector("#writeStop").disabled = true;
document.querySelector("#writeTare").disabled = true;
document.querySelector("#battery_level").disabled = true;
//document.querySelector('#writeGain1').disabled = true
//document.querySelector('#writeGain2').disabled = true
//document.querySelector('#writeFlash').disabled = true

export function isWebBluetoothEnabled() {
  if (!navigator.bluetooth) {
    console.log("Web Bluetooth API is not available in this browser!");
    return false;
  }

  return true;
}

export async function onConnectButtonClick() {
  let service;

  try {
    console.log("Requesting Bluetooth Device...");
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: [ForcePlateUUIDS.PRIMARY_SERVICE] },
        { namePrefix: "ForcePlate" },
      ],
      optionalServices: [battery_levelServiceUUID],
    });

    console.log("Connecting to GATT Server...");
    const server = await device.gatt.connect();
    console.log("DBG: GattServer connection OK!");

    console.log("Getting ForcePlate Service...");
    service = await server.getPrimaryService(ForcePlateUUIDS.PRIMARY_SERVICE);
    console.log("DBG: Service OK!");

    console.log("Getting ForcePlate Notify Characteristic...");
    const notifyCharacteristic = await service.getCharacteristic(
      ForcePlateUUIDS.NOTIFY
    );
    acquiredNotifyGATTCharacteristic = notifyCharacteristic;
    console.log("DBG: NotifyChar OK!");

    console.log("Getting ForcePlate Write Characteristic...");
    const writeCharacteristic = await service.getCharacteristic(
      ForcePlateUUIDS.WRITE
    );
    acquiredWriteGATTCharacteristic = writeCharacteristic;
    console.log("DBG: WriteChar OK!");

    // console.log('Getting Battery Service...');
    // service_battery = await server.getPrimaryService(battery_levelServiceUUID);
    // console.log("DBG: Battery Service OK!")

    // console.log('Getting ForcePlate Battery Characteristic...');
    // const BatteryReadNotifyCharacteristic = await service_battery.getCharacteristic(battery_levelReadNotifyCharacteristic);
    // acquiredBatteryGATTCharacteristic = BatteryReadNotifyCharacteristic;
    // console.log("DBG: Battery Notify/Read Char OK!")

    // console.log('Reading Battery Level...');
    // const value = await acquiredBatteryGATTCharacteristic.readValue();

    // console.log('> Battery Level is ' + value.getUint8(0) + '%');

    document.querySelector("#start").disabled = false;
    document.querySelector("#writeStart").disabled = false;
    document.querySelector("#writeStop").disabled = false;
    document.querySelector("#writeTare").disabled = false;
    document.querySelector("#battery_level").disabled = false;
  } catch (error) {
    console.log("Argh! " + error);
  }
}

export async function onBatteryButtonClick() {
  try {
    console.log("Reading Battery Level...");
    const value = await acquiredBatteryGATTCharacteristic.readValue();

    console.log("> Battery Level is " + value.getUint8(0) + "%");
  } catch (error) {
    log("Argh! " + error);
  }
}

export function onStopButtonClick() {
  if (acquiredNotifyGATTCharacteristic) {
    acquiredNotifyGATTCharacteristic
      .stopNotifications()
      .then(() => {
        console.log("> Notifications stopped");
        acquiredNotifyGATTCharacteristic.removeEventListener(
          "characteristicvaluechanged",
          handleNotification
        );
        document.querySelector("#start").disabled = false;
        document.querySelector("#stop").disabled = true;
      })
      .catch((error) => {
        console.log("Argh! " + error);
      });
  }
}

export async function onStartButtonClick() {
  try {
    await acquiredNotifyGATTCharacteristic.startNotifications();
    console.log("> Notify Notifications started");
    acquiredNotifyGATTCharacteristic.addEventListener(
      "characteristicvaluechanged",
      handleNotification
    );
    document.querySelector("#start").disabled = true;
    document.querySelector("#stop").disabled = false;
  } catch (error) {
    console.log("Argh! " + error);
  }
}

export function onWriteButtonClick(valueToWrite) {
  if (acquiredWriteGATTCharacteristic) {
    acquiredWriteGATTCharacteristic
      .writeValue(valueToWrite)
      .then(() => {
        console.log("Value written successfully to BLE device:", valueToWrite);
      })
      .catch((error) => {
        console.error("Error writing value: ", error);
      });
  }
}

// Event handler for incoming notifications
function handleNotification(event) {
  // Handle incoming data from the device

  //Make function to pass "avForce" from both forceplates and pass into chart
  //Function to update main chart: updateChart(AvgForce, TimeOfEvent);

  // Check if the event object has the expected structure
  if (event.currentTarget.service.device.name == "ForcePlate0011") {
    //console.log('Received notification event forceplate 0011:', event);
    forcePlateParser.parseSensorData("ForcePlate0011", event);
  } else {
    //console.log('Received notification event forceplate 0010:', event);
    forcePlateParser.parseSensorData("ForcePlate0010", event);
  }
}

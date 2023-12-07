import {BleManager, Device, ScanMode, ScanOptions,} from 'react-native-ble-plx';
import {defaultProperties, MZDS01_NAME, pairDevice as pairMZDS01,} from './mzds01';
import {DEVICE_NAME, PeripheralProperties} from './index';
import {usePeripheralStore, useStartupStore} from '../state';
import {PermissionsAndroid, Platform} from 'react-native';
import {logError, logMsg} from "./logger";

export interface Peripheral {
  device: Device; // BleManagerDevice
  name: string;
  model: DEVICE_NAME;
  connected?: boolean;
  connecting?: boolean;
  properties: PeripheralProperties;
}

export const bleManager = new BleManager();

const scanOptions: ScanOptions = {
  allowDuplicates: false,
  scanMode: ScanMode.LowLatency,
  // callbackType: ScanCallbackType.AllMatches
};

const SCAN_DURATION = 5000;

export const bleScan = async () => {
  usePeripheralStore.getState().setScanning(true);
  if (!bleManager) {
    logError('[scanAndConnect] bleManager needs to be created first!', new Error('bleManager needs to be created first!'));
    return;
  }

  // const devices: Device[] = [];
  logMsg('[scanAndConnect] starting device scan');
  bleManager.startDeviceScan(null, scanOptions, (error, device) => {
    if (error) {
      // Handle error (scanning will be stopped automatically)
      logError('[scanAndConnect] startDeviceScan error', error);
      return;
    }
    if (device?.name) {
      // devices.push(device!);
      const peripheral: Peripheral = {
        device: device!,
        name: device!.name ?? 'no_name',
        model: device!.name === MZDS01_NAME ? MZDS01_NAME : 'unknown',
        properties: defaultProperties,
      };
      usePeripheralStore.getState().addPeripheral(device!.id, peripheral);
      connectDevice(peripheral.device).then(() => {});
    }
  });
  setTimeout(() => {
    bleManager.stopDeviceScan();
    usePeripheralStore.getState().setScanning(false);
    const peripherals = usePeripheralStore.getState().peripherals;
    console.log(
      '[scanAndConnect] device scan complete - peripheral count:',
      Array.from(peripherals.values()).length,
    );
    // for (const peripheral of peripherals.values()) {
    //   connectDevice(peripheral.device).then(() => {});
    // }
    useStartupStore.getState().setInitialScan(true);
  }, SCAN_DURATION);
};

const connectDevice = async (device: Device) => {
  if (device.name !== MZDS01_NAME) {
    // logMsg('[connectDevice] device is not MZDS01');
    return;
  }
  if (device.name === MZDS01_NAME) {
    logMsg('[connectDevice] connecting to MZDS01');
    // const isInitialScan = !useStartupStore.getState().initialScan;
    // if (isInitialScan) {
    //   await device.cancelConnection();
    // } // else {
    //   const isDeviceConnected = await device.isConnected();
    //   if (isDeviceConnected) {
    //     return;
    //   }
    // }
    device
      .connect()
      .then(_dev => {
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(_dev => {
        // Do work on device with services and characteristics
        pairMZDS01(device);
        // const updatedPeripheral: Peripheral = {
        //   name: device!.name ?? 'no_name',
        //   model: device!.name === MZDS01_NAME ? MZDS01_NAME : 'unknown',
        //   device: device,
        //   connected: true,
        //   connecting: false,
        // };
        const updatedPeripheral = usePeripheralStore
          .getState()
          .getPeripheral(device.id);
        if (updatedPeripheral) {
          updatedPeripheral.connected = true;
          updatedPeripheral.connecting = false;
          updatedPeripheral.properties = {...defaultProperties, paired: true};
          // add to store
          usePeripheralStore
            .getState()
            .addPeripheral(device.id, updatedPeripheral);
        }
      })
      .catch(error => {
        // Handle errors
        logError('[connectDevice] {MZDS01} error', error);
      });
  }
};

export const handleAndroidPermissions = () => {

  if (Platform.OS === 'ios') {
    return true
  }
  if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
    const apiLevel = parseInt(Platform.Version.toString(), 10)

    if (apiLevel < 31) {
      return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(result => {
        // todo
        const success = result === PermissionsAndroid.RESULTS.GRANTED
        if (success) {
          useStartupStore.getState().setPermissionGranted(true);
        } else {
          logError(
            '[handleAndroidPermissions] User refuses runtime permissions android <12',
            new Error('User refuses runtime permissions android <12'),
          );
        }
        return success
      })
    }

    if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ]).then(result => {
        const success: boolean = (
          result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED
        )
        if (success) {
          useStartupStore.getState().setPermissionGranted(true);
        } else {
          logError(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
            new Error('User refuses runtime permissions android 12+'),
          );
        }
        return success
      });
    }
  }
};

import {
  BleManager,
  Device,
  ScanMode,
  ScanOptions,
} from 'react-native-ble-plx';
import {
  defaultProperties,
  MZDS01_NAME,
  pairDevice as pairMZDS01,
} from './mzds01';
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
  if (Platform.OS === 'android' && Platform.Version >= 31) {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]).then(result => {
      if (result) {
        // success
        logMsg(
          '[handleAndroidPermissions] User accepts runtime permissions android 12+',
        );
        useStartupStore.getState().setPermissionGranted(true);
      } else {
        // failure
        logError(
          '[handleAndroidPermissions] User refuses runtime permissions android 12+',
            new Error('User refuses runtime permissions android 12+'),
        );
      }
    });
  } else if (Platform.OS === 'android' && Platform.Version >= 23) {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then(checkResult => {
      if (checkResult) {
        logMsg(
          '[handleAndroidPermissions] runtime permission Android <12 already OK',
        );
      } else {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ).then(requestResult => {
          if (requestResult) {
            // success
            logMsg(
              '[handleAndroidPermissions] User accepts runtime permission android <12',
            );
            useStartupStore.getState().setPermissionGranted(true);
          } else {
            // failure
            logError(
              '[handleAndroidPermissions] User refuses runtime permission android <12',
                new Error('User refuses runtime permission android <12'),
            );
          }
        });
      }
    });
  } else {
    logMsg(
      '[handleAndroidPermissions] runtime permission not needed for this platform',
    );
    useStartupStore.getState().setPermissionGranted(true);
  }
};

export const enableBluetooth = () => {
  // TODO: this function is broken if bluetooth is already enabled.
  //  to be replaced with a bluetooth power library
  // logMsg('[enableBluetooth] enabling bluetooth...');
  // if (Platform.OS === 'android') {
  //   bleManager
  //     .enable()
  //     .then(() => {
  //       logMsg('[enableBluetooth] Bluetooth is enabled');
  //       useStartupStore.getState().setBluetoothEnabled(true);
  //     })
  //     .catch(error => {
  //       logError('[enableBluetooth] Bluetooth is NOT enabled', error);
  //     });
  // } else {
  //   logMsg('[enableBluetooth] Bluetooth is enabled');
  useStartupStore.getState().setBluetoothEnabled(true);
  // }
};

import {useEffect} from 'react';
import {usePeripheralStore, useStartupStore} from '../state';
import {
  bleManager,
  bleScan,
  handleAndroidPermissions,
} from '../utils/ble';
import {
  State as BleManagerState,
  Subscription,
} from 'react-native-ble-plx';
import {logError, logMsg} from "../utils/logger";

const SCAN_INTERVAL = 10; // seconds

const BLE = () => {
  const isPermissionGranted = useStartupStore(
    state => state.isPermissionGranted,
  );
  const isBluetoothEnabled = useStartupStore(state => state.isBluetoothEnabled);
  const setBluetoothEnabled = useStartupStore(state => state.setBluetoothEnabled);

  let scanInterval: NodeJS.Timer;

  const continuousScan = () => {

    bleScan().then(() => {});

    // Schedule subsequent scans every x seconds
    const interval = SCAN_INTERVAL * 1000; // 60 seconds in milliseconds
    scanInterval = setInterval(bleScan, interval);
  };

  // // handled in ble state listener
  // useEffect(() => {
  //   handleAndroidPermissions();
  // }, []);

  useEffect(() => {
      const subscription = bleManager.onStateChange(state => {
        switch (state) {
          case BleManagerState.PoweredOff:
            clearInterval(scanInterval);
            setBluetoothEnabled(false);
            logMsg('bluetooth is off, enabling...')
            bleManager.enable().catch(error => {
              logError('Failed to enable bluetooth', error);
            })
            break;
          case BleManagerState.Unauthorized:
            clearInterval(scanInterval);
            logError("Bluetooth permissions not granted", new Error('Bluetooth permissions not granted'))
            handleAndroidPermissions();
            break;
          case BleManagerState.PoweredOn:
            setBluetoothEnabled(true);
            logMsg('bluetooth is on')
            handleAndroidPermissions(); // sometimes state is powered on but permissions are not granted...
            continuousScan();
            break;
          default:
            clearInterval(scanInterval);
            logError(`Unsupported BLE state: ${state}`, new Error('Unsupported BLE state:' + state))
            break;
        }

      }, true);
      return () => {
        bleManager.stopDeviceScan();
        clearInterval(scanInterval);
        subscription.remove();
      };
  }, [
    // bleManager, bleManager.state, isPermissionGranted, isBluetoothEnabled
  ]);

  const peripherals = usePeripheralStore(state => state.peripherals);
  const setPeripheral = usePeripheralStore(state => state.setPeripheral);
  const removePeripheral = usePeripheralStore(state => state.removePeripheral);
  const setPeripheralProperty = usePeripheralStore(
    state => state.setPeripheralProperty,
  );

  useEffect(() => {
    const subscriptions: Subscription[] = [];

    peripherals.forEach(peripheral => {
      const subscription = bleManager.onDeviceDisconnected(
        peripheral.device.id,
        (error, device) => {
          logMsg('device disconnected', peripheral.device.id);
          // logMsg('device disconnected error', error);
          // logMsg('device disconnected device', device);
          setPeripheral(peripheral.device.id, {
            connected: false,
            connecting: false,
          });
          setPeripheralProperty(peripheral.device.id, 'paired', false);
          // removePeripheral(peripheral.device.id); // <-- this removes the device from the list
        },
      );
      subscriptions.push(subscription);
    });

    return () => {
      subscriptions.map(s => s.remove());
    };
  }, [peripherals, removePeripheral, setPeripheral, setPeripheralProperty]);

  // logMsg('peripherals map updated', [...peripherals.entries()]);

  return null;
};

export default BLE;

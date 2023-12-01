import {useEffect} from 'react';
import {usePeripheralStore, useStartupStore} from '../state';
import {
  bleManager,
  bleScan,
  enableBluetooth,
  handleAndroidPermissions,
} from '../utils/ble';
import {
  State as BleManagerState,
  Subscription,
} from '@my01/react-native-ble-plx';
import {logError, logMsg} from "../utils/logger";

const SCAN_INTERVAL = 10; // seconds

const BLE = () => {
  const isBluetoothEnabled = useStartupStore(state => state.isBluetoothEnabled);
  const isPermissionGranted = useStartupStore(
    state => state.isPermissionGranted,
  );

  // console.log('isBluetoothEnabled', isBluetoothEnabled);
  // console.log('isPermissionGranted', isPermissionGranted);

  let scanInterval: NodeJS.Timer;

  const continuousScan = () => {
    bleScan().then(() => {});

    // Schedule subsequent scans every x seconds
    const interval = SCAN_INTERVAL * 1000; // 60 seconds in milliseconds
    scanInterval = setInterval(bleScan, interval);
  };

  useEffect(() => {
    handleAndroidPermissions();
  }, []);

  useEffect(() => {
    if (isPermissionGranted) {
      enableBluetooth();
    }
  }, [isPermissionGranted]);

  useEffect(() => {
    if (isPermissionGranted && isBluetoothEnabled) {
      const subscription = bleManager.onStateChange(state => {
        if (state === BleManagerState.PoweredOn) {
          continuousScan();
        } else {
          logMsg('bluetooth is not on')
          bleManager.enable().catch(error => {
            logError('Failed to enable bluetooth', error);
          })
        }
      }, true);
      return () => {
        bleManager.stopDeviceScan();
        clearInterval(scanInterval);
        subscription.remove();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bleManager, bleManager.state, isPermissionGranted, isBluetoothEnabled]);

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

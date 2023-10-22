import {create} from 'zustand';
import zustandFlipper from 'react-native-flipper-zustand';

interface StartupState {
  initialScan: boolean;
  setInitialScan: (initialScan: boolean) => void;
  isBluetoothEnabled: boolean;
  isPermissionGranted: boolean;
  setBluetoothEnabled: (isBluetoothEnabled: boolean) => void;
  setPermissionGranted: (isPermissionGranted: boolean) => void;
}

export const useStartupStore = create<StartupState>()(
  zustandFlipper(set => ({
    initialScan: false,
    setInitialScan: (initialScan: boolean) => set({initialScan}),
    isBluetoothEnabled: false,
    isPermissionGranted: false,
    setBluetoothEnabled: (isBluetoothEnabled: boolean) =>
      set({isBluetoothEnabled}),
    setPermissionGranted: (isPermissionGranted: boolean) =>
      set({isPermissionGranted}),
  })),
);

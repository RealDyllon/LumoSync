import {create} from 'zustand';
import zustandFlipper from 'react-native-flipper-zustand';

interface StartupState {
  initialScan: boolean;
  setInitialScan: (initialScan: boolean) => void;
  isBluetoothEnabled: boolean;
  setBluetoothEnabled: (isBluetoothEnabled: boolean) => void;
  isPermissionGranted: boolean;
  setPermissionGranted: (isPermissionGranted: boolean) => void;
  isPermissionDenied: boolean;
  setPermissionDenied: (isPermissionDenied: boolean) => void;
}

export const useStartupStore = create<StartupState>()(
  zustandFlipper(set => ({
    initialScan: false,
    setInitialScan: (initialScan: boolean) => set({initialScan}),
    isBluetoothEnabled: false,
    setBluetoothEnabled: (isBluetoothEnabled: boolean) =>
      set({isBluetoothEnabled}),
    isPermissionGranted: false,
    setPermissionGranted: (isPermissionGranted: boolean) =>
      set({isPermissionGranted}),
    isPermissionDenied: false,
    setPermissionDenied: (isPermissionDenied: boolean) =>
      set({isPermissionDenied}),
  })),
);

import {create} from 'zustand';
import zustandFlipper from 'react-native-flipper-zustand';
import {Peripheral} from '../utils/ble';
import {defaultProperties, setProperty} from '../utils/mzds01';
import {PeripheralProperties} from '../utils';
import {Optional} from '../types/utilityTypes';
import {ProgramKeyFrame} from '../utils/programs';

export const programModes = {
  CHASING_LIGHT: 'CHASING_LIGHT',
  EVERY_OTHER_LIGHT: 'EVERY_OTHER_LIGHT',
  CHRISTMAS_LIGHTS: 'CHRISTMAS_LIGHTS',
  CHRISTMAS_LIGHTS2: 'CHRISTMAS_LIGHTS2',
  FADE: 'FADE',
  RGB: 'RGB',
  RGB_UNISON: 'RGB_UNISON',
  RGB_CHASE: 'RGB_CHASE',
  NEON: 'NEON',
  NEON2: 'NEON2',
} as const;

export type ProgramMode = keyof typeof programModes;

export type GroupedPeripheralProperties = Optional<
  PeripheralProperties,
  'paired'
> & {
  programMode: {
    enabled: boolean;
    program: ProgramMode;
  };
};

export interface PeripheralState {
  isScanning: boolean;
  setScanning: (isScanning: boolean) => void;
  peripherals: Map<string, Peripheral>;
  getPeripheral: (id: string) => Peripheral | undefined;
  setPeripheral: (id: string, updatedPeripheral: Partial<Peripheral>) => void;
  addPeripheral: (id: string, updatedPeripheral: Peripheral) => void;
  removePeripheral: (id: string) => void;
  resetPeripherals: () => void;
  groupedPeripherals: Set<string>; //ids
  setGroupedPeripherals: (groupedPeripherals: string[]) => void;
  addToGroupedPeripherals: (id: string) => Promise<void>;
  removeFromGroupedPeripherals: (id: string) => Promise<void>;
  toggleGroupedPeripheral: (id: string) => Promise<void>;
  setPeripheralProperty: <K extends keyof Peripheral['properties']>(
    id: string | string[],
    key: K,
    value: Peripheral['properties'][K],
  ) => void;
  groupedPeripheralProperties: GroupedPeripheralProperties;
  setGroupedPeripheralProperty: <K extends keyof GroupedPeripheralProperties>(
    key: K,
    value: GroupedPeripheralProperties[K],
  ) => void;
  programStatus: ProgramKeyFrame;
  setProgramStatus: (programStatus: ProgramKeyFrame) => void;
}

const initialPeripherals = new Map<string, Peripheral>();

export const usePeripheralStore = create<PeripheralState>()(
  zustandFlipper((set, get) => ({
    // scanning
    isScanning: false,
    setScanning: isScanning => set({isScanning}),
    // peripherals
    peripherals: initialPeripherals,
    getPeripheral: id => get().peripherals.get(id),
    setPeripheral: (id, updatedPeripheral) => {
      const oldPeripheral = get().peripherals.get(id);
      if (oldPeripheral) {
        set(state => ({
          peripherals: new Map(
            state.peripherals.set(id, {...oldPeripheral, ...updatedPeripheral}),
          ),
        }));
      }
    },
    addPeripheral: (id, updatedPeripheral) =>
      set(state => ({
        peripherals: new Map(state.peripherals.set(id, updatedPeripheral)),
      })),
    removePeripheral: id =>
      set(state => {
        const peripherals = new Map(state.peripherals);
        peripherals.delete(id);
        return {peripherals};
      }),
    resetPeripherals: () => set({peripherals: initialPeripherals}),
    // grouped
    groupedPeripherals: new Set<string>(),
    setGroupedPeripherals: groupedPeripherals =>
      set({groupedPeripherals: new Set(groupedPeripherals)}),
    addToGroupedPeripherals: async id => {
      // write grouped properties
      const groupedProperties = get().groupedPeripheralProperties;
      const {color, ...propertiesWithoutColor} = groupedProperties;
      const {lightMode, ...propertiesWithoutLightMode} = groupedProperties;
      const propertiesToWrite = groupedProperties.lightMode === 'STATIC_COLOR' ? propertiesWithoutLightMode : propertiesWithoutColor;
      for (const [key, value] of Object.entries(propertiesToWrite)) {
        if (key !== 'programMode') {
          await setProperty(
            id,
            key as keyof PeripheralProperties,
            value as string | number | boolean,
          );
        }
      }
      set(state => ({
        groupedPeripherals: new Set(state.groupedPeripherals.add(id)),
      }));
    },
    removeFromGroupedPeripherals: async id => {
      // write individual properties
      const properties = get().peripherals.get(id)?.properties;
      if (properties) {
        const {color, ...propertiesWithoutColor} = properties;
        const {lightMode, ...propertiesWithoutLightMode} = properties;
        const propertiesToWrite = properties.lightMode === 'STATIC_COLOR' ? propertiesWithoutLightMode : propertiesWithoutColor;
        for (const [key, value] of Object.entries(propertiesToWrite)) {
          // console.log('writing', key, value)
          await setProperty(id, key as keyof PeripheralProperties, value);
        }
      }
      set(state => {
        state.groupedPeripherals.delete(id);
        return {groupedPeripherals: new Set(state.groupedPeripherals)};
      });
    },
    toggleGroupedPeripheral: async id => {
      if (get().groupedPeripherals.has(id)) {
        await get().removeFromGroupedPeripherals(id);
      } else {
        await get().addToGroupedPeripherals(id);
      }
    },
    // isGrouped: id => get().groupedPeripherals.has(id),
    // peripheral controls
    setPeripheralProperty: async (id, key, value) => {
      await setProperty(id, key, value);
      const ids = typeof id === 'string' ? [id] : id;
      return set(state => {
        for (const peripheralId of ids) {
          const peripheral = state.peripherals.get(peripheralId);
          if (peripheral) {
            peripheral.properties[key] = value;
            return {
              peripherals: new Map(
                state.peripherals.set(peripheralId, {...peripheral}),
              ),
            };
          }
        }
        return state;
      });
    },
    groupedPeripheralProperties: {
      ...defaultProperties,
      lightMode: 'STATIC_COLOR',
      color: '#ff00ff',
      programMode: {enabled: false, program: 'CHASING_LIGHT'},
    },
    setGroupedPeripheralProperty: async (key, value) => {
      const ids = Array.from(get().groupedPeripherals);
      if (key === 'programMode') {
        return set({
          groupedPeripheralProperties: {
            ...get().groupedPeripheralProperties,
            programMode: value as GroupedPeripheralProperties['programMode'],
          },
        });
      }
      await Promise.all(
        ids.map(id => setProperty(id, key, value as string | number | boolean)),
      );
      return set({
        groupedPeripheralProperties: {
          ...get().groupedPeripheralProperties,
          [key]: value,
        },
      });
    },
    // program
    programStatus: {
      peripherals: new Map(),
    },
    setProgramStatus: programStatus => set({programStatus}),
  })),
);

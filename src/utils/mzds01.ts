import {
  Base64,
  Characteristic,
  Device,
  Service,
} from '@my01/react-native-ble-plx';
import {bleManager} from './ble';
import {usePeripheralStore} from '../state';

var Buffer = require('@craftzdog/react-native-buffer').Buffer;

export const lightMode = {
  RAINBOW: 'RAINBOW',
  WARM_WHITE: 'WARM_WHITE',
  STATIC_COLOR: 'STATIC_COLOR',
} as const;

export type LightMode = (typeof lightMode)[keyof typeof lightMode];

export const MZDS01_NAME = 'MZDS01' as const;

export interface Properties {
  paired: boolean; // data exchange handshake
  power: boolean;
  lightMode: LightMode;
  brightness: number;
  color: string;
  strobe: boolean;
  strobeFreq: number;
}

export const defaultProperties: Properties = {
  paired: false,
  power: true,
  lightMode: lightMode.WARM_WHITE,
  brightness: 40,
  color: '#2dff08', // todo?
  strobe: false,
  strobeFreq: 1,
};

export const codes = {
  pairing: {
    '1': '/gEAAlAR',
    '2': '/gEAAjAE',
    '3': '/gEAEFAB' + 'MjAyMzAzMjkxMjM0MjI=', // fake datetime
    '4': '/gEABiABAAABAA==',
  },
  power: {
    on: '/gEAAwABAQ==', // todo: no on code, just send light mode code
    off: '/gEAAwABAA==',
  },
  lightMode: {
    [lightMode.WARM_WHITE]: '/gEABiABAAABAA==',
    [lightMode.RAINBOW]: '/gEABiABAAAAAA==',
    [lightMode.STATIC_COLOR]: '/gEABiABAA3d0A==', // this is static blue
  },
  brightness: {
    prefix: '/gEAAxAC',
  },
  color: {
    prefix: '/gEABiAB',
  },
  // TODO: add more codes
} as const;

const colorHexToBase64 = (hex: string) => {
  const colorHexValue = hex.substring(1).concat('00');
  const colorEncodedValue = Buffer.from(colorHexValue, 'hex').toString(
    'base64',
  );
  console.debug('[colorHexToBase64]', colorEncodedValue);
  return codes.color.prefix + colorEncodedValue;
};

export const setProperty = async <
  K extends keyof Properties,
  T extends Properties[K],
>(
  deviceIds: string | string[],
  property: K,
  value: T,
) => {
  switch (property) {
    case 'paired': // don't set paired property
      // console.error('[setProperty] cannot set paired property');
      break;
    case 'power':
      // console.debug('[setProperty] power', value);
      await writeData(deviceIds, codes.power[value ? 'on' : 'off']);
      break;
    case 'lightMode':
      // console.debug('[setProperty] lightMode', value);
      if (value === lightMode.STATIC_COLOR) {
        const deviceIdString =
          typeof deviceIds === 'string' ? deviceIds : deviceIds[0];
        const color = usePeripheralStore
          .getState()
          .peripherals.get(deviceIdString)?.properties.color;
        // console.debug('[setProperty] lightMode {STATIC_COLOR}', color);
        if (color) {
          const colorPayload = colorHexToBase64(color as string);
          await writeData(deviceIds, colorPayload);
        }
      } else {
        await writeData(deviceIds, codes.lightMode[value as LightMode]);
      }
      break;
    case 'brightness':
      // console.debug('[setProperty] brightness', value);
      const brightnessHexValue = value.toString(16).padStart(2, '0');
      const brightnessEncodedValue = Buffer.from(
        brightnessHexValue,
        'hex',
      ).toString('base64');
      const brightnessPayload =
        codes.brightness.prefix + brightnessEncodedValue;
      await writeData(deviceIds, brightnessPayload);
      break;
    case 'color':
      // console.debug('[setProperty] color', value);
      if (value === '#000000') {
        break;
      }
      const colorPayload = colorHexToBase64(value as string);
      await writeData(deviceIds, colorPayload);
      break;
    default:
      console.warn('[setProperty] unknown property', property);
  }
};

const writeData = async (deviceIds: string | string[], data: Base64) => {
  const ids = Array.isArray(deviceIds) ? deviceIds : [deviceIds];
  bleManager.devices(ids).then(devices => {
    devices.forEach(async (device, _i) => {
      // if (!(await device.isConnected())) {
      //   await device.connect();
      // }
      device.discoverAllServicesAndCharacteristics().then(async dev => {
        // Do work on device with services and characteristics
        // console.log('writing data to device', data);

        const services = await dev.services();
        for (const service of services) {
          const characteristics = await dev.characteristicsForService(
            service.uuid,
          );

          for (const characteristic of characteristics) {
            if (characteristic.isWritableWithResponse) {
              await dev.writeCharacteristicWithResponseForService(
                service.uuid,
                characteristic.uuid,
                data,
              );
            }
          }
        }
      });
    });
  });
};

export const pairDevice = async (dev: Device) => {
  console.log('writing to chars');

  const services = await dev.services();

  const writeChars = async (
    service: Service,
    characteristics: Characteristic[],
    data: Base64,
  ) => {
    for (const characteristic of characteristics) {
      if (characteristic.isWritableWithResponse) {
        await dev.writeCharacteristicWithResponseForService(
          service.uuid,
          characteristic.uuid,
          data,
        );
      }
    }
  };

  for (const service of services) {
    const characteristics = await dev.characteristicsForService(service.uuid);
    await writeChars(service, characteristics, codes.pairing['1']);
    await writeChars(service, characteristics, codes.pairing['2']);
    await writeChars(service, characteristics, codes.pairing['3']);
    await writeChars(service, characteristics, codes.pairing['4']);
    // todo: read values from device
  }
};

import {lightMode} from './mzds01';
import {PeripheralProperties} from './index';
import {Optional} from '../types/utilityTypes';

export type ProgramKeyFramePeripheral = Optional<
  Pick<PeripheralProperties, 'power' | 'lightMode' | 'brightness' | 'color'>,
  'color'
>;

export interface ProgramKeyFrame {
  peripherals: Map<string, ProgramKeyFramePeripheral>;
}

interface Program {
  keyframeDuration: number;
  keyFrames: ProgramKeyFrame[];
}

const chasingLight = (ids: string[]): Program => {
  const lightOn: ProgramKeyFramePeripheral = {
    power: true,
    lightMode: lightMode.WARM_WHITE,
    brightness: 40,
  };
  const lightOff: ProgramKeyFramePeripheral = {...lightOn, power: false};
  const keyframes: ProgramKeyFrame[] = ids.map((id, index) => {
    const arr: ProgramKeyFramePeripheral[] = Array(ids.length).fill(lightOff);
    arr[index] = lightOn;
    return {
      peripherals: new Map(arr.map((p, i) => [ids[i], p])),
    };
  });
  return {
    keyframeDuration: 250,
    keyFrames: keyframes,
  };
};

const everyOtherLight = (ids: string[]): Program => {
  const lightOn: ProgramKeyFramePeripheral = {
    power: true,
    lightMode: lightMode.WARM_WHITE,
    brightness: 40,
  };
  const lightOff: ProgramKeyFramePeripheral = {...lightOn, power: false};
  const keyframes: ProgramKeyFrame[] = [0, 1].map((_num, index) => {
    const arr: ProgramKeyFramePeripheral[] = Array(ids.length).fill(lightOff);
    // for each element in arr
    // if index is even, turn on
    // if index is odd, turn off
    arr.forEach((p, i) => {
      if (i % 2 === index) {
        arr[i] = lightOn;
      }
    });
    return {
      peripherals: new Map(arr.map((p, i) => [ids[i], p])),
    };
  });
  return {
    keyframeDuration: 250,
    keyFrames: keyframes,
  };
};

const christmasLights = (ids: string[]): Program => {
  const red: ProgramKeyFramePeripheral = {
    power: true,
    lightMode: lightMode.STATIC_COLOR,
    brightness: 40,
    color: '#ff0000',
  };
  const green: ProgramKeyFramePeripheral = {...red, color: '#00ff00'};
  const keyframes: ProgramKeyFrame[] = [0, 1].map((_num, index) => {
    const arr: ProgramKeyFramePeripheral[] = Array(ids.length).fill(red);
    // for each element in arr
    // if index is even, turn on
    // if index is odd, turn off
    arr.forEach((p, i) => {
      if (i % 2 === index) {
        arr[i] = green;
      }
    });
    return {
      peripherals: new Map(arr.map((p, i) => [ids[i], p])),
    };
  });
  return {
    keyframeDuration: 250,
    keyFrames: keyframes,
  };
};

const fade = (ids: string[]): Program => {
  const lightOn: ProgramKeyFramePeripheral = {
    power: true,
    lightMode: lightMode.WARM_WHITE,
    brightness: 40,
  };
  const keyframes: ProgramKeyFrame[] = [0, 10, 20, 30, 40].map(
    (brightness, index) => {
      const arr: ProgramKeyFramePeripheral[] = Array(ids.length).fill({
        ...lightOn,
        brightness,
      });
      arr[index] = lightOn;
      return {
        peripherals: new Map(arr.map((p, i) => [ids[i], p])),
      };
    },
  );
  return {
    keyframeDuration: 250,
    keyFrames: keyframes,
  };
};

export const programs = {
  chasingLight,
  everyOtherLight,
  christmasLights,
  fade,
};

import {lightMode} from './mzds01';
import {PeripheralProperties} from './index';
import {Optional} from '../types/utilityTypes';

export type ProgramKeyFramePeripheral = Optional<
  Pick<PeripheralProperties, 'power' | 'lightMode' | 'brightness' | 'color'>,
  'color'
> | Optional<
  Pick<PeripheralProperties, 'power' | 'lightMode' | 'brightness' | 'color'>,
  'lightMode'
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
    // lightMode: lightMode.STATIC_COLOR,
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

const christmasLights2 = (ids: string[]): Program => {
  const red: ProgramKeyFramePeripheral = {
    power: true,
    // lightMode: lightMode.STATIC_COLOR,
    brightness: 40,
    color: '#ff0000',
  };
  const green: ProgramKeyFramePeripheral = {...red, color: '#00ff00'};
  const keyframes: ProgramKeyFrame[] = [0, 1].map((_num, index) => {
    const arr: ProgramKeyFramePeripheral[] = Array(ids.length).fill(index ? red : green);
    return {
      peripherals: new Map(arr.map((p, i) => [ids[i], p])),
    };
  });
  return {
    keyframeDuration: 250,
    keyFrames: keyframes,
  };
}

const fade = (ids: string[]): Program => {
  const lightOn: ProgramKeyFramePeripheral = {
    power: true,
    lightMode: lightMode.WARM_WHITE,
    brightness: 40,
  };
  const keyframes: ProgramKeyFrame[] = [10, 20, 30, 40].map(
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

const rgb = (ids: string[]): Program => {
  const red: ProgramKeyFramePeripheral = {
    power: true,
    // lightMode: lightMode.STATIC_COLOR,
    brightness: 40,
    color: '#ff0000',
  };
  const green: ProgramKeyFramePeripheral = {...red, color: '#00ff00'};
  const blue: ProgramKeyFramePeripheral = {...red, color: '#0000ff'};
  const keyframes: ProgramKeyFrame[] = ids.map((_id, keyframeIndex) => {
    const arr = Array(ids.length).fill(red).map((p, i) => {
        switch (i % 3) {
          case 0:
            return red;
          case 1:
            return green;
          case 2:
            return blue;
          default:
            return red;
        }
    })

    switch (keyframeIndex % 3) {
      case 0:
        arr[0] = {...arr[0], brightness: 80};
        break;
      case 1:
        arr[1] = {...arr[1], brightness: 80};
        break;
      case 2:
        arr[2] = {...arr[2], brightness: 80};
        break;
      default:
        break;
    }

    return {
      peripherals: new Map(arr.map((p, i) => [ids[i], p])),
    };
  });
  return {
    keyframeDuration: 250,
    keyFrames: keyframes,
  };
}

const rgbUnison = (ids: string[]): Program => {
  const red: ProgramKeyFramePeripheral = {
    power: true,
    // lightMode: lightMode.STATIC_COLOR,
    brightness: 40,
    color: '#ff0000',
  };
  const green: ProgramKeyFramePeripheral = {...red, color: '#00ff00'};
  const blue: ProgramKeyFramePeripheral = {...red, color: '#0000ff'};

  const keyframes: ProgramKeyFrame[] = [0, 1, 2].map((_num, keyframeIndex) => {
    const arr: ProgramKeyFramePeripheral[] = Array(ids.length).map((p, i) => {
      switch (keyframeIndex % 3) {
        case 0:
          return red;
        case 1:
          return green;
        case 2:
          return blue;
        default:
          return red;
      }
    });
    return {
      peripherals: new Map(arr.map((p, i) => [ids[i], p])),
    };
  })
  return {
    keyframeDuration: 250,
    keyFrames: keyframes,
  };
}

const rgbChase = (ids: string[]): Program => {
  const red: ProgramKeyFramePeripheral = {
    power: true,
    // lightMode: lightMode.STATIC_COLOR,
    brightness: 40,
    color: '#ff0000',
  };
  const green: ProgramKeyFramePeripheral = {...red, color: '#00ff00'};
  const blue: ProgramKeyFramePeripheral = {...red, color: '#0000ff'};

  const keyframes: ProgramKeyFrame[] = [0, 1, 2].map((_num, keyframeIndex) => {
    const arr: ProgramKeyFramePeripheral[] = Array(ids.length).map((p, i) => {
      switch ((i + keyframeIndex) % 3) {
        case 0:
          return red;
        case 1:
          return green;
        case 2:
          return blue;
        default:
          return red;
      }
    });
    return {
      peripherals: new Map(arr.map((p, i) => [ids[i], p])),
    };
  })
  return {
    keyframeDuration: 250,
    keyFrames: keyframes,
  };
}

const neon = (ids: string[]): Program => {
  // define neon colors
  const neonRed: ProgramKeyFramePeripheral = {
    power: true,
    // lightMode: lightMode.STATIC_COLOR,
    brightness: 40,
    color: '#ff0000',
  };
  const neonOrange: ProgramKeyFramePeripheral = {...neonRed, color: '#ff8000'};
  const neonYellow: ProgramKeyFramePeripheral = {...neonRed, color: '#ffff00'};
  const neonGreen: ProgramKeyFramePeripheral = {...neonRed, color: '#00ff00'};
  const neonBlue: ProgramKeyFramePeripheral = {...neonRed, color: '#0000ff'};
  const neonPurple: ProgramKeyFramePeripheral = {...neonRed, color: '#ff00ff'};
  const neonPink: ProgramKeyFramePeripheral = {...neonRed, color: '#ff0080'};

  // define keyframes
  const keyframes: ProgramKeyFrame[] = [0, 1, 2].map((_num, keyframeIndex) => {
    const arr: ProgramKeyFramePeripheral[] = Array(ids.length).map((p, i) => {
      switch ((i + keyframeIndex) % 7) {
        case 0:
          return neonRed;
        case 1:
          return neonOrange;
        case 2:
          return neonYellow;
        case 3:
          return neonGreen;
        case 4:
          return neonBlue;
        case 5:
          return neonPurple;
        case 6:
          return neonPink;
        default:
          return neonRed;
      }
    });
    return {
      peripherals: new Map(arr.map((p, i) => [ids[i], p])),
    };
  })
  return {
    keyframeDuration: 250,
    keyFrames: keyframes,
  };
}

const neon2 = (ids: string[]): Program => {
  // define neon colors
  const neonRed: ProgramKeyFramePeripheral = {
    power: true,
    // lightMode: lightMode.STATIC_COLOR,
    brightness: 40,
    color: '#ff0000',
  };
  const neonOrange: ProgramKeyFramePeripheral = {...neonRed, color: '#ff8000'};
  const neonYellow: ProgramKeyFramePeripheral = {...neonRed, color: '#ffff00'};
  const neonGreen: ProgramKeyFramePeripheral = {...neonRed, color: '#00ff00'};
  const neonBlue: ProgramKeyFramePeripheral = {...neonRed, color: '#0000ff'};
  const neonPurple: ProgramKeyFramePeripheral = {...neonRed, color: '#ff00ff'};
  const neonPink: ProgramKeyFramePeripheral = {...neonRed, color: '#ff0080'};

  // define keyframes
  const keyframes: ProgramKeyFrame[] = [0, 1, 2, 4, 5, 6].map((_num, keyframeIndex) => {
    let fillColor: ProgramKeyFramePeripheral;

    switch (keyframeIndex) {
      case 0:
        fillColor = neonRed;
        break;
      case 1:
        fillColor = neonOrange;
        break;
      case 2:
        fillColor = neonYellow;
        break;
      case 3:
        fillColor = neonGreen;
        break;
      case 4:
        fillColor = neonBlue;
        break;
      case 5:
        fillColor = neonPurple;
        break;
      case 6:
        fillColor = neonPink;
        break;
      default:
        fillColor = neonRed;
        break;
    }

    const arr: ProgramKeyFramePeripheral[] = Array(ids.length).fill(fillColor)

    return {
      peripherals: new Map(arr.map((p, i) => [ids[i], p])),
    };
  })

  return {
    keyframeDuration: 250,
    keyFrames: keyframes,
  };
}

export const programs = {
  chasingLight,
  everyOtherLight,
  christmasLights,
  christmasLights2,
  fade,
  rgb,
  rgbUnison,
  rgbChase,
  neon,
  neon2,
};

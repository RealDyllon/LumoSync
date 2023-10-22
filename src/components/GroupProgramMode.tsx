import {programModes, usePeripheralStore} from '../state';
import {useMemo, useState} from 'react';
import {ProgramKeyFramePeripheral, programs} from '../utils/programs';
import {setProperty} from '../utils/mzds01';
import {useInterval} from '../utils/useInterval';

const GroupProgramMode = () => {
  // const peripherals = usePeripheralStore(state => state.peripherals);
  const groupedPeripherals = usePeripheralStore(
    state => state.groupedPeripherals,
  );
  const connectedGroupedPeripherals = useMemo(
    () => Array.from(groupedPeripherals),
    // .filter(id => peripherals.get(id)?.connected)
    [groupedPeripherals],
  );

  const programMode = usePeripheralStore(
    state => state.groupedPeripheralProperties.programMode,
  );

  const [timer, setTimer] = useState(0);

  const program = useMemo(() => {
    switch (programMode.program) {
      case 'CHASING_LIGHT':
        return programs.chasingLight(connectedGroupedPeripherals);
      case 'EVERY_OTHER_LIGHT':
        return programs.everyOtherLight(connectedGroupedPeripherals);
      case programModes.CHRISTMAS_LIGHTS:
        return programs.christmasLights(connectedGroupedPeripherals);
      case 'FADE':
        return programs.fade(connectedGroupedPeripherals);
      default:
        console.warn('[GroupProgramMode] unknown program', programMode.program);
        return programs.chasingLight(connectedGroupedPeripherals);
    }
  }, [connectedGroupedPeripherals, programMode.program]);

  const setProgramStatus = usePeripheralStore(state => state.setProgramStatus);

  useInterval(
    () => {
      console.debug('[GroupProgramMode useEffect] timeout -> timer=', timer);

      const programCount = timer % groupedPeripherals.size;
      const keyframe = program.keyFrames[programCount];
      for (const id of connectedGroupedPeripherals) {
        const properties = keyframe?.peripherals?.get(id);
        if (!properties) {
          continue;
        }
        for (const [property, value] of Object.entries(properties)) {
          // todo: set light status to state
          setProgramStatus(keyframe);
          setProperty(id, property as keyof ProgramKeyFramePeripheral, value);
        }
      }

      setTimer(prevTime => prevTime + 1);
    },
    programMode.enabled
      ? program.keyframeDuration * connectedGroupedPeripherals.length
      : null,
  );

  return null;
};
export default GroupProgramMode;

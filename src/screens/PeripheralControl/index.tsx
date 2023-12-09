import {useEffect} from 'react';
import {ScrollView} from 'react-native';
import {Text} from 'react-native-paper';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {ScreenProps} from '../../navigation';
import {usePeripheralStore} from '../../state';
import {LightControls} from '../../components/LightControls';
import {PeripheralProperties} from '../../utils';
// import {DebugControl} from "./DebugControl";

const PeripheralControl = ({
  route,
  navigation,
}: ScreenProps<'PeripheralControl'>) => {
  const peripheralId = route.params.deviceId;
  const peripheral = usePeripheralStore(state =>
    state.peripherals.get(peripheralId),
  );
  const setPeripheralProperty = usePeripheralStore(
    state => state.setPeripheralProperty,
  );

  useEffect(() => {
    if (!peripheral?.properties.paired) {
      Notifier.showNotification({
        title: 'Bluetooth Device Disconnected',
        description: 'Please reconnect the device to control it',
        Component: NotifierComponents.Alert,
        duration: 8000,
        componentProps: {
          alertType: 'error',
        },
      });
      navigation.goBack();
    }
  }, [navigation, peripheral?.properties.paired]);

  if (!peripheral) {
    return <Text>Error: peripheral not found</Text>;
  }

  const setProperty = <K extends keyof PeripheralProperties>(
    key: K,
    value: PeripheralProperties[K],
  ) => {
    return setPeripheralProperty(peripheralId, key, value);
  };

  return (
    <ScrollView
      style={{
        paddingBottom: 20,
      }}>
      {/*<DebugControl dev={peripheral.device} />*/}
      <LightControls
        peripheralId={peripheralId}
        properties={peripheral.properties}
        setProperty={setProperty}
        disabled={!peripheral.properties.paired}
      />
    </ScrollView>
  );
};

export default PeripheralControl;

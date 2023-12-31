import React, {useMemo} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import SystemStatusBar from '../../components/SystemStatusBar';
import PeripheralCard from './PeripheralCard';
import {usePeripheralStore} from '../../state';
import {GroupedLightsCard} from './GroupedLightsCard';
import {Routes, ScreenProps} from '../../navigation';
import Warnings from "./Warnings";
import {MZDS01_NAME} from "../../utils/mzds01";


export const HomeScreen = ({navigation}: ScreenProps<'Home'>) => {
  const peripherals = usePeripheralStore(state => state.peripherals);
  const setPeripheralProperty = usePeripheralStore(
    state => state.setPeripheralProperty,
  );
  const toggleGroupedPeripheral = usePeripheralStore(
    state => state.toggleGroupedPeripheral,
  );
  const groupedPeripherals = usePeripheralStore(
    state => state.groupedPeripherals,
  );

  const onPeripheralCardPress = (id: string) => {
    console.log('onPeripheralCardPress', id);
    navigation.navigate(Routes.PeripheralControl, {deviceId: id});
  };

  const handleGroupToggle = async (id: string) => {
    console.log('handleGroupToggle', id);
    await toggleGroupedPeripheral(id);
  };

  const handlePowerToggle = (id: string) => {
    console.debug('handlePowerToggle', id);
    console.debug('peripherals.get(id)', peripherals.get(id));
    setPeripheralProperty(id, 'power', !peripherals.get(id)?.properties!.power);
  };

  const sections = useMemo(()=> [
    {
      title: "5050LEDs",
      data: Array.from(peripherals.values()).filter(peripheral => peripheral.model === MZDS01_NAME)
    },
    {
      title: "Unsupported Devices",
      data: Array.from(peripherals.values()).filter(peripheral => peripheral.model !== MZDS01_NAME)
    }
  ], [peripherals]);

  return (
    <View>
      <SystemStatusBar barStyle="light-content" />
      <Warnings />
      <SectionList
        sections={sections}
        style={styles.list}
        renderItem={({item}) => (
          <PeripheralCard
            onPress={onPeripheralCardPress}
            peripheral={item}
            isGrouped={groupedPeripherals.has(item.device.id)}
            handleGroupToggle={handleGroupToggle}
            handlePowerToggle={handlePowerToggle}
          />
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={{fontWeight: 'bold'}}>{title}</Text>
        )}
        keyExtractor={item => item.device.id}
        ListHeaderComponent={GroupedLightsCard}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};

const ListEmptyComponent = () => {
  const isScanning = usePeripheralStore(state => state.isScanning);
  return (
    <View style={styles.listEmpty}>
      <Text>
        {isScanning ? 'Scanning for BLE Peripherals' : 'No peripherals found'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 12,
  },
  listEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  }
});

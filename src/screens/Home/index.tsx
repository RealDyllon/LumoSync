import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import SystemStatusBar from '../../components/SystemStatusBar';
import PeripheralCard from './PeripheralCard';
import {usePeripheralStore, useStartupStore} from '../../state';
import {GroupedLightsCard} from './GroupedLightsCard';
import {Routes, ScreenProps} from '../../navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export const HomeScreen = ({navigation}: ScreenProps<'Home'>) => {

  const isPermissionGranted = useStartupStore(state => state.isPermissionGranted);
  const isBluetoothEnabled = useStartupStore(state => state.isBluetoothEnabled);

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

  return (
    <View>
      <SystemStatusBar barStyle="light-content" />
      {!isPermissionGranted ? null : (
        <View style={styles.warningContainer}>
          <Icon name="bluetooth-off" size={18} color="black" />
          <Text>Bluetooth permission has not been granted. It's required to use this app</Text>
        </View>
      )}
      {!isBluetoothEnabled ? null : (
        <View style={styles.warningContainer}>
          <Icon name="bluetooth-off" size={18} color="black" />
          <Text>Bluetooth is not enabled</Text>
        </View>
      )}
      <FlatList
        data={Array.from(peripherals.values())}
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
    <Text>
      {isScanning ? 'Scanning for BLE Peripherals' : 'No peripherals found'}
    </Text>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 12,
  },
  warningContainer: {
    backgroundColor: 'orange',
    padding: 12,
    paddingRight: 24,
    marginBottom: 12,
    flexDirection: 'row',
  }
});

import {
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {usePeripheralStore, useStartupStore} from '../../state';
import {Peripheral} from '../../utils/ble';
import React from 'react';

export const PeripheralsScreen = () => {
  const isBluetoothEnabled = useStartupStore(state => state.isBluetoothEnabled);
  const isPermissionGranted = useStartupStore(
    state => state.isPermissionGranted,
  );

  const isScanning = usePeripheralStore(state => state.isScanning);
  const peripherals = usePeripheralStore(state => state.peripherals);

  // const startScan = () => {};

  const retrieveConnected = () => {};
  const renderItem = ({item}: {item: Peripheral}) => {
    const backgroundColor = item.connected ? '#069400' : '#ffffff';
    return (
      <TouchableHighlight underlayColor="#0082FC">
        <View style={[styles.row, {backgroundColor}]}>
          <Text style={styles.peripheralName}>
            {/* completeLocalName (item.name) & shortAdvertisingName (advertising.localName) may not always be the same */}
            {item.device.name} -{item?.device?.localName}
            {item.connecting && ' - Connecting...'}
          </Text>
          <Text style={styles.rssi}>RSSI: {item.device.rssi}</Text>
          <Text style={styles.peripheralId}>{item.device.id}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.body}>
        {Platform.OS === 'android' && (
          <>
            <Text>
              Bluetooth status: {isBluetoothEnabled ? 'enabled' : 'disabled'}
            </Text>
            <Text>
              Permission Status: {isPermissionGranted ? 'enabled' : 'disabled'}
            </Text>
            <Text>
              Num connected devices: {Array.from(peripherals.entries()).length}
            </Text>
          </>
        )}
        {/*<Pressable*/}
        {/*  style={styles.scanButton}*/}
        {/*  onPress={startScan}*/}
        {/*  disabled={isScanning}>*/}
        {/*  <Text style={styles.scanButtonText}>*/}
        {/*    {isScanning ? 'Scanning...' : 'Scan Bluetooth'}*/}
        {/*  </Text>*/}
        {/*</Pressable>*/}

        {/*<Pressable style={styles.scanButton} onPress={retrieveConnected}>*/}
        {/*  <Text style={styles.scanButtonText}>*/}
        {/*    {'Retrieve connected peripherals'}*/}
        {/*  </Text>*/}
        {/*</Pressable>*/}

        {Array.from(peripherals.values()).length === 0 && (
          <View style={styles.row}>
            <Text style={styles.noPeripherals}>
              No Peripherals, press "Scan Bluetooth" above.
            </Text>
          </View>
        )}

        <FlatList
          data={Array.from(peripherals.values())}
          contentContainerStyle={{rowGap: 12}}
          renderItem={renderItem}
          keyExtractor={item => item.device.id}
        />

      </SafeAreaView>
    </>
  );
};

const boxShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    color: Colors.black,
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#0a398a',
    margin: 10,
    borderRadius: 12,
    ...boxShadow,
  },
  scanButtonText: {
    fontSize: 20,
    letterSpacing: 0.25,
    color: Colors.white,
  },
  body: {
    backgroundColor: '#0082FC',
    flex: 1,
    paddingBottom: 12,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  peripheralName: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    color: Colors.black,
  },
  rssi: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
    color: Colors.black,
  },
  peripheralId: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
    paddingBottom: 20,
    color: Colors.black,
  },
  row: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    // ...boxShadow,
  },
  noPeripherals: {
    margin: 10,
    textAlign: 'center',
    color: Colors.white,
  },
});

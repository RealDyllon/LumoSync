import {StyleSheet, Text, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import {useStartupStore} from "../../state";

const Warnings = () => {

  const isPermissionGranted = useStartupStore(state => state.isPermissionGranted);
  const isPermissionDenied = useStartupStore(state => state.isPermissionDenied);
  const isBluetoothEnabled = useStartupStore(state => state.isBluetoothEnabled);

  return (
    <>
      {!isPermissionGranted && (
        <View style={styles.warningContainer}>
          <Icon name="bluetooth-off" size={18} color="black"/>
          <Text>Bluetooth permission has not been granted. It's required to use this app</Text>
        </View>
      )}
      {isPermissionDenied && (
        <View style={styles.warningContainer}>
          <Icon name="bluetooth-off" size={18} color="black"/>
          <Text>Bluetooth permission has been denied. It's required to use this app</Text>
        </View>
      )}
      {!isBluetoothEnabled && (
        <View style={styles.warningContainer}>
          <Icon name="bluetooth-off" size={18} color="black"/>
          <Text>Bluetooth is not enabled</Text>
        </View>
      )}
    </>
  )
}

export default Warnings;

const styles = StyleSheet.create({
  warningContainer: {
    backgroundColor: 'orange',
    padding: 12,
    paddingRight: 24,
    marginBottom: 12,
    flexDirection: 'row',
  }
});

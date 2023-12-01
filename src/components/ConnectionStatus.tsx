import {useMemo} from 'react';
import {Peripheral} from '../utils/ble';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet, Text, View} from 'react-native';

interface Props {
  peripheral: Peripheral;
}

const ConnectionStatus = ({peripheral}: Props) => {
  const isPaired = peripheral.properties.paired || false;

  const connectionStatusText = useMemo(() => {
    if (isPaired) {
      return 'Paired';
    }
    if (peripheral.connected) {
      return 'Pairing';
    }
    if (peripheral.connecting) {
      return 'Connecting';
    }
    return 'Disconnected';
  }, [isPaired, peripheral.connected, peripheral.connecting]);

  const connectionStatusIcon = useMemo(() => {
    switch (connectionStatusText) {
      case 'Paired':
        return 'check-circle';
      case 'Pairing':
        return 'incomplete-circle';
      case 'Connecting':
        return 'incomplete-circle';
      case 'Disconnected':
        return 'close-circle';
      default:
        return 'question-mark-circle';
    }
  }, [connectionStatusText]);

  return (
    <View style={styles.container}>
      <Icon color="#555555" name={connectionStatusIcon} size={24} />
      <Text style={styles.connectionStatusText}>{connectionStatusText}</Text>
    </View>
  );
};

export default ConnectionStatus;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  connectionStatusIcon: {
    color: ""
  },
  connectionStatusText: {
    color: '#555555'
  }
});

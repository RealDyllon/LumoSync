import {Button, Card, Switch} from 'react-native-paper';
import {Peripheral} from '../../utils/ble';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useMemo} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ConnectionStatus from '../../components/ConnectionStatus';

interface PeripheralCardProps {
  onPress: (id: string) => void;
  peripheral: Peripheral;
  isGrouped: boolean;
  handleGroupToggle: (id: string) => void;
  handlePowerToggle: (id: string) => void;
}

const PeripheralCard = ({
  onPress,
  peripheral,
  isGrouped,
  handleGroupToggle,
  handlePowerToggle,
}: PeripheralCardProps) => {
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
    }
  }, [connectionStatusText]);

  return (
    <Card
      onPress={() => onPress(peripheral.device.id)}
      style={[styles.card, {
        backgroundColor: isPaired ? '#e7c8f7' : '#ccc',
      }]}
      disabled={isGrouped || !isPaired}>
      <Card.Title title={peripheral.name} />
      <Card.Actions>
        <ConnectionStatus peripheral={peripheral} />
        <View style={styles.spacer} />
        <Button
          icon={isGrouped ? 'lightbulb-group' : 'plus'}
          // iconColor={light.grouped ? "white" : DefaultTheme.colors.primary}
          mode={isGrouped ? 'contained' : 'contained-tonal'}
          // containerColor={light.grouped ? DefaultTheme.colors.primary : "white"}
          // @ts-ignore
          size={28}
          onPress={() => handleGroupToggle(peripheral.device.id)}
          disabled={!isPaired}>
          {isGrouped ? 'Grouped' : 'Add to Group'}
        </Button>
        <Switch
          value={peripheral.properties?.power}
          disabled={isGrouped || !isPaired}
          onValueChange={() => handlePowerToggle(peripheral.device.id)}
          style={styles.switch}
          // color="#FDF4DC"
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        />
      </Card.Actions>
    </Card>
  );
};

export default PeripheralCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  switch: {
    // marginRight: 20,
    marginLeft: 8,
  },
  spacer: {
    flex: 1,
  },
});

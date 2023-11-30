import {Card, Switch} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {usePeripheralStore} from '../../state';
import {useNavigation} from '@react-navigation/native';
import {Routes, ScreenProps} from '../../navigation';

export const GroupedLightsCard = () => {
  const navigation = useNavigation<ScreenProps<'Home'>['navigation']>();
  const groupedPeripherals = usePeripheralStore(
    state => state.groupedPeripherals,
  );
  const groupedPeripheralProperties = usePeripheralStore(
    state => state.groupedPeripheralProperties,
  );
  const {power} = groupedPeripheralProperties;
  const setGroupedPeripheralProperty = usePeripheralStore(
    state => state.setGroupedPeripheralProperty,
  );

  const handlePowerStateChange = () => {
    setGroupedPeripheralProperty('power', !power);
  };

  // render nothing if no grouped peripherals
  if (!Array.from(groupedPeripherals.values()).length) {
    return null;
  }

  return (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate(Routes.GroupControl)}>
      <View
        style={{
          marginTop: 8,
          marginLeft: 16,
          marginBottom: 20,
        }}>
        <Text variant="titleMedium">Grouped Lights</Text>
        <View style={{flex: 1}} />
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}>
          <Text variant="bodyMedium">Tap to Edit Group</Text>
          <View style={{flex: 1}} />
          <Switch
            value={power}
            onValueChange={handlePowerStateChange}
            style={{marginRight: 10, marginTop: 20}}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: '#dfb5f5',
  },
});

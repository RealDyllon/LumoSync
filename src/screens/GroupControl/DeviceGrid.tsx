import {StyleSheet, Text, View} from 'react-native';
import {DraggableGrid} from 'react-native-draggable-grid';
import {usePeripheralStore} from '../../state';
import {Peripheral} from '../../utils/ble';
import {useMemo} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  groupedPeripheralIds: Set<string>;
}

interface GridItemData extends Peripheral {
  key: string;
}

const DeviceGrid = (props: Props) => {
  const peripherals = usePeripheralStore(state => state.peripherals);
  const groupedPeripherals = useMemo(
    () =>
      Array.from(props.groupedPeripheralIds)
        .map(id => peripherals.get(id))
        .filter(peripheral => peripheral !== undefined)
        .map(peripheral => ({
          ...peripheral,
          key: peripheral!.device.id,
        })) as GridItemData[],
    [props.groupedPeripheralIds, peripherals],
  );

  const setGroupedPeripherals = usePeripheralStore(
    state => state.setGroupedPeripherals,
  );

  const handleDragRelease = (data: GridItemData[]) => {
    setGroupedPeripherals(data.map(item => item.device.id));
  };

  const programStatus = usePeripheralStore(state => state.programStatus);
  const groupedPeripheralProperties = usePeripheralStore(
    state => state.groupedPeripheralProperties,
  );

  const renderGridItem = (item: GridItemData) => {
    const peripheralProperties = (groupedPeripheralProperties.programMode.enabled) ?
      (programStatus.peripherals.get(item.device.id) ?? groupedPeripheralProperties) :
      groupedPeripheralProperties;

    const isUnavailable = !peripherals.get(item.device.id)?.properties.paired;

    const getColor = (): string => {
      if (isUnavailable) {
        return 'black';
      }
      if (peripheralProperties.lightMode === 'WARM_WHITE') {
        if (peripheralProperties.power) {
          return 'orange';
        } else {
          return 'gray';
        }
      }
      if (peripheralProperties.lightMode === 'STATIC_COLOR' || peripheralProperties.color) {
        if (peripheralProperties.power) {
          return peripheralProperties.color ?? 'black';
        } else {
          return 'gray';
        }
      }
      if (peripheralProperties.lightMode === 'RAINBOW') {
        if (peripheralProperties.power) {
          return 'purple'; // todo: display icon with rainbow fill
        } else {
          return 'gray';
        }
      }
      return 'black';
    };

    const color = getColor();

    return (
      <View style={styles.item} key={item.device.id}>
        <Icon
          name={isUnavailable ? 'lightbulb-off' : 'lightbulb'}
          size={32}
          color={color}
        />
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <DraggableGrid
        numColumns={4}
        renderItem={renderGridItem}
        data={groupedPeripherals}
        onDragRelease={handleDragRelease}
      />
    </View>
  );
};

export default DeviceGrid;

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 100,
    backgroundColor: 'blue',
  },
  wrapper: {
    // paddingTop: 100,
    width: '100%',
    // height: '100%',
    paddingHorizontal: 12,
    marginBottom: 12,
    justifyContent: 'center',
  },
  item: {
    width: 100,
    height: 75,
    borderRadius: 8,
    // backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: 'gray',
  },
});

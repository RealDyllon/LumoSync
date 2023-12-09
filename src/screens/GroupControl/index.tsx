import {ScrollView, StyleSheet, View} from 'react-native';
import {
  LightControls,
  lightControlsStyles,
} from '../../components/LightControls';
import {
  GroupedPeripheralProperties,
  ProgramMode,
  programModes,
  usePeripheralStore,
} from '../../state';
import {Divider, Switch, Text} from 'react-native-paper';
import DropDownPicker, {ValueType} from 'react-native-dropdown-picker';
import {useState} from 'react';
import DeviceGrid from './DeviceGrid';

// const programs = [
//   {key: '1', label: 'Chasing Light'},
//   {key: '2', label: 'Every Other Light'},
//   {key: '3', label: 'Christmas Lights'},
//   {key: '4', label: 'Fade'},
// ];

interface ProgramOption {
  label: string;
  value: ProgramMode;
}

const programsOptions: ProgramOption[] = [
  {label: 'Chasing Light', value: programModes.CHASING_LIGHT},
  {label: 'Every Other Light', value: programModes.EVERY_OTHER_LIGHT},
  {label: 'Christmas Lights', value: programModes.CHRISTMAS_LIGHTS},
  // {label: 'Fade', value: programModes.FADE},
];

const GroupControl = () => {
  const groupedPeripheralProperties = usePeripheralStore(
    state => state.groupedPeripheralProperties,
  );

  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ValueType | null>(
    groupedPeripheralProperties.programMode.program,
  );
  console.debug('[GroupControl] selectedProgram', selectedProgram);

  const setGroupedPeripheralProperty = usePeripheralStore(
    state => state.setGroupedPeripheralProperty,
  );

  const handleSelectedProgram = (val: ValueType | null) => {
    console.debug('[GroupControl] setSelectedProgram -> val', val);
    if (!val) {
      return;
    }
    setGroupedPeripheralProperty('programMode', {
      ...groupedPeripheralProperties.programMode,
      program: val as GroupedPeripheralProperties['programMode']['program'],
    });
  };

  const groupedPeripherals = usePeripheralStore(
    state => state.groupedPeripherals,
  );

  const handleProgramSwitchChange = () => {
    setGroupedPeripheralProperty('programMode', {
      ...groupedPeripheralProperties.programMode,
      enabled: !groupedPeripheralProperties.programMode.enabled,
    });
    // if program is disabled, force all peripherals back to group state
    // todo: move this block to state handler in zustand
    // setGroupedPeripheralProperty('power', groupedPeripheralProperties.power)
    // todo: remaining attributes
    // todo: do smth similar when removing from group
  };

  return (
    <ScrollView>
      <View style={lightControlsStyles.sectionHeader}>
        <Text
          style={[
            lightControlsStyles.sectionHeaderTitle,
            lightControlsStyles.lightModeHeaderTitle,
          ]}>
          Device Order
        </Text>
        <View style={lightControlsStyles.spacer} />
        <Text
          style={{
            color: 'rgba(0,0,0,0.5)',
            marginRight: 20,
          }}>
          Drag icons to reorder
        </Text>
      </View>
      <DeviceGrid groupedPeripheralIds={groupedPeripherals} />

      <Divider style={styles.divider} />

      <View style={lightControlsStyles.sectionHeader}>
        <Text style={lightControlsStyles.sectionHeaderTitle}>Program Mode</Text>
        <View style={lightControlsStyles.spacer} />
        <Switch
          value={groupedPeripheralProperties.programMode.enabled}
          onChange={handleProgramSwitchChange}
          style={lightControlsStyles.switch}
        />
      </View>

      {groupedPeripheralProperties.programMode.enabled && (
        <View
          style={{
            marginHorizontal: 20,
          }}>
          <DropDownPicker
            open={isProgramDropdownOpen}
            // value={groupedPeripheralProperties.programMode.program}
            value={selectedProgram}
            items={programsOptions}
            multiple={false}
            setOpen={setIsProgramDropdownOpen}
            onChangeValue={handleSelectedProgram}
            setValue={setSelectedProgram}
          />
        </View>
      )}
      <Divider style={styles.divider} />
      <LightControls
        peripheralId={Array.from(groupedPeripherals.values())}
        properties={groupedPeripheralProperties}
        setProperty={setGroupedPeripheralProperty as any}
        disabled={groupedPeripheralProperties.programMode.enabled}
      />
      <View
        style={{
          paddingBottom: 80,
        }}
      />
    </ScrollView>
  );
};

export default GroupControl;

const styles = StyleSheet.create({
  divider: {
    marginHorizontal: 20,
  },
});

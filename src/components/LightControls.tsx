import {StyleSheet, View} from 'react-native';
import {Divider, SegmentedButtons, Switch, Text} from 'react-native-paper';
import {LightMode, lightMode} from '../utils/mzds01';
import BrightnessSlider from './BrightnessSlider';
import StrobeSlider from './StrobeSlider';
import ColorWheel from './ColorWheel';
import {PeripheralProperties} from '../utils';
import {Optional} from '../types/utilityTypes';

interface Props {
  peripheralId: string | string[];
  properties: Optional<PeripheralProperties, 'paired'>;
  setProperty: <K extends keyof PeripheralProperties>(
    property: K,
    value: PeripheralProperties[K],
  ) => void;
  disabled?: boolean;
}

export const LightControls = ({
  peripheralId,
  properties,
  setProperty,
  disabled = false,
}: Props) => {
  const handlePowerStateChange = () => {
    setProperty('power', !properties.power);
  };

  const handleLightModeChange = (newLightMode: string) => {
    setProperty('lightMode', newLightMode as LightMode);
  };

  const handleBrightnessChange = ([value]: number[]) => {
    setProperty('brightness', value);
  };

  const handleStrobeStateChange = () => {
    // todo
  };

  const handleStrobeFreqChange = () => {
    // todo
  };

  const handleColorChange = (color: string) => {
    setProperty('color', color);
  };
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionHeaderTitle, styles.lightModeHeaderTitle]}>
          Light Mode
        </Text>
        <View style={styles.spacer} />
        <Switch
          value={properties.power}
          onValueChange={handlePowerStateChange}
          style={styles.switch}
          disabled={disabled}
        />
      </View>
      <SegmentedButtons
        value={properties.lightMode}
        onValueChange={handleLightModeChange}
        // buttons={Object.keys(LightModes).map((key) => ({
        //   value: key,
        //   label: key,
        //   // showSelectedCheck: true,
        // }))}
        buttons={[
          {
            value: lightMode.WARM_WHITE,
            label: 'Warm White',
            disabled: disabled || !properties.power,
          },
          {
            value: lightMode.RAINBOW,
            label: 'Rainbow',
            disabled: disabled || !properties.power,
          },
          {
            value: lightMode.STATIC_COLOR,
            label: 'Custom Color',
            disabled: disabled || !properties.power,
          },
        ]}
        style={styles.segmentedButtons}
      />
      <Divider style={styles.divider} />
      <Text style={styles.sectionHeaderTitle}>Brightness</Text>
      <BrightnessSlider
        brightness={properties.brightness}
        handleBrightnessChange={handleBrightnessChange}
        disabled={disabled || !properties.power}
      />
      <Divider style={styles.divider} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderTitle}>Strobe</Text>
        <View style={styles.spacer} />
        <Switch
          value={properties.strobe}
          onValueChange={handleStrobeStateChange}
          style={styles.switch}
          disabled={disabled || !properties.power}
        />
      </View>
      <Divider style={styles.divider} />

      {properties.strobe && (
        <StrobeSlider
          frequency={properties.strobeFreq}
          handleFrequencyChange={handleStrobeFreqChange}
        />
      )}
      {properties.lightMode === lightMode.STATIC_COLOR && (
        <>
          <Text style={styles.sectionHeaderTitle}>Color</Text>
          <ColorWheel
            peripheralId={peripheralId}
            handleColorChange={handleColorChange}
          />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderTitle: {
    padding: 20,
    // marginTop: 20,
    fontWeight: 'bold',
    fontSize: 20,
  },
  lightModeHeaderTitle: {marginTop: 0},
  spacer: {flex: 1},
  switch: {marginRight: 20, marginTop: 0},
  segmentedButtons: {
    paddingHorizontal: 20,
  },
  divider: {
    marginTop: 8,
    marginHorizontal: 20,
  },
});

export {styles as lightControlsStyles};

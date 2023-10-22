import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import ColorPicker, {
  Panel3,
  BrightnessSlider,
  returnedResults as ColorPickerReturnedResults,
  Panel3Props,
} from 'reanimated-color-picker';
import {usePeripheralStore} from '../state';

interface Props extends Panel3Props {
  peripheralId: string | string[];
  handleColorChange: (value: string) => void;
}

const ColorWheel = ({peripheralId, handleColorChange}: Props) => {
  const onSelectColor = async ({hex}: ColorPickerReturnedResults) => {
    handleColorChange(hex);
  };

  // WARNING: this does not update on color change!!
  const color = useMemo(() => {
    if (typeof peripheralId === 'string') {
      return usePeripheralStore.getState().peripherals.get(peripheralId)
        ?.properties.color;
    } else {
      return usePeripheralStore.getState().groupedPeripheralProperties.color;
    }
  }, [peripheralId]);

  return (
    <View style={styles.container}>
      <ColorPicker
        style={styles.colorPicker}
        value={color}
        onComplete={onSelectColor}
        boundedThumb={true}>
        <Panel3 />
        <BrightnessSlider
          style={{
            marginTop: 12,
          }}
        />
      </ColorPicker>
    </View>
  );
};

export default ColorWheel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPicker: {width: '70%'},
});

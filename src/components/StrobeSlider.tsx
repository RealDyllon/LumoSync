import { Slider } from "@miblanchard/react-native-slider";
import { Text, View } from "react-native";
import React from "react";

interface StrobeSliderProps {
  frequency: number;
  handleFrequencyChange: (value: number[]) => void;
}

const StrobeSlider = ({
  frequency,
  handleFrequencyChange,
}: StrobeSliderProps) => {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Slider
        value={frequency}
        minimumValue={0}
        maximumValue={5}
        step={0.1}
        onSlidingComplete={handleFrequencyChange}
        // onValueChange={handleBrightnessChange}
        trackStyle={{
          height: 20,
          borderRadius: 99,
        }}
        minimumTrackStyle={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          backgroundColor: "#cccccc",
        }}
        renderThumbComponent={() => (
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 99,
              backgroundColor: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              {frequency}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default StrobeSlider;

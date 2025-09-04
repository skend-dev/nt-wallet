import React from "react";
import { View } from "react-native";
import Svg, { Path, Defs, Pattern, Image } from "react-native-svg";

interface WalletIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function WalletIcon({
  width = 24,
  height = 24,
  color = "white",
}: WalletIconProps) {
  return (
    <View>
      <Svg width={width} height={height} viewBox="0 0 51 50" fill="none">
        <Path d="M0.5 50H50.5V0H0.5V50Z" fill={color} />
        <Path
          d="M10 15H41C42.1046 15 43 15.8954 43 17V33C43 34.1046 42.1046 35 41 35H10C8.89543 35 8 34.1046 8 33V17C8 15.8954 8.89543 15 10 15Z"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M43 20H48C49.1046 20 50 20.8954 50 22V28C50 29.1046 49.1046 30 48 30H43"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M15 25H25"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M15 30H20"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

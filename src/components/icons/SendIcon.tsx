import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface SendIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function SendIcon({
  width = 24,
  height = 24,
  color = "white",
}: SendIconProps) {
  return (
    <View>
      <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path
          d="M20.1576 10.825L4.89185 4.63004C4.31655 4.35773 3.6899 4.54251 3.36116 4.91207C2.98106 5.31081 2.89887 5.90405 3.14543 6.39032L6.25816 11.9921L3.14543 17.6327C2.8886 18.119 2.98106 18.7123 3.35089 19.0624C3.59744 19.3347 3.97754 19.5 4.36792 19.5C4.54256 19.5 4.7172 19.4611 4.88157 19.3833L20.1576 13.1883C20.661 12.9938 21 12.5075 21 11.9726C20.9589 11.4669 20.6302 11.0196 20.1576 10.8348V10.825ZM17.0757 12.7507L4.89185 17.73L7.62448 12.7507H17.0757ZM17.0962 11.2238H7.62448L4.89185 6.31251L17.086 11.2335L17.0962 11.2238Z"
          fill={color}
        />
      </Svg>
    </View>
  );
}

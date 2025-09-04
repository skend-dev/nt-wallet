import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function Logo({
  width = 32,
  height = 32,
  color = "#FF2C55",
}: LogoProps) {
  return (
    <View>
      <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
        <Path
          d="M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z"
          fill="#1A1A1D"
        />
        <Path
          d="M20.7547 15.1971C22.9952 15.1971 24.8115 13.3569 24.8115 11.0868C24.8115 8.81675 22.9952 6.9765 20.7547 6.9765C18.5142 6.9765 16.6979 8.81675 16.6979 11.0868C16.6979 13.3569 18.5142 15.1971 20.7547 15.1971Z"
          fill={color}
        />
        <Path
          d="M24.5861 22.5868L9.63499 7.43843C8.66277 6.45338 6.99976 7.15166 6.99976 8.54336V23.5961C6.99976 24.3851 7.63138 25.0235 8.40852 25.0235H10.4009C11.1797 25.0235 11.8097 24.3835 11.8097 23.5961V20.1501L16.2071 24.6055C16.4709 24.8728 16.8291 25.0235 17.2033 25.0235H23.5883C24.8436 25.0235 25.472 23.486 24.5845 22.5868H24.5861Z"
          fill={color}
        />
      </Svg>
    </View>
  );
}

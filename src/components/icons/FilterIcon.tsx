import React from "react";
import Svg, { Path } from "react-native-svg";

interface FilterIconProps {
  size?: number;
  color?: string;
}

export default function FilterIcon({
  size = 24,
  color = "white",
}: FilterIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 6.75C3 6.33579 3.33579 6 3.75 6H20.25C20.6642 6 21 6.33579 21 6.75C21 7.16421 20.6642 7.5 20.25 7.5H3.75C3.33579 7.5 3 7.16421 3 6.75ZM6.25 12C6.25 11.5858 6.58579 11.25 7 11.25H17C17.4142 11.25 17.75 11.5858 17.75 12C17.75 12.4142 17.4142 12.75 17 12.75H7C6.58579 12.75 6.25 12.4142 6.25 12ZM8.25 17.25C8.25 16.8358 8.58579 16.5 9 16.5H15C15.4142 16.5 15.75 16.8358 15.75 17.25C15.75 17.6642 15.4142 18 15 18H9C8.58579 18 8.25 17.6642 8.25 17.25Z"
        fill={color}
      />
    </Svg>
  );
}

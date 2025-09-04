import React from "react";
import Svg, { Path } from "react-native-svg";

interface LeftArrowIconProps {
  size?: number;
  color?: string;
}

const LeftArrowIcon: React.FC<LeftArrowIconProps> = ({
  size = 20,
  color = "white",
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5669 3.30806C13.811 3.55214 13.811 3.94786 13.5669 4.19194L7.75888 10L13.5669 15.8081C13.811 16.0521 13.811 16.4479 13.5669 16.6919C13.3229 16.936 12.9271 16.936 12.6831 16.6919L6.43306 10.4419C6.18898 10.1979 6.18898 9.80214 6.43306 9.55806L12.6831 3.30806C12.9271 3.06398 13.3229 3.06398 13.5669 3.30806Z"
        fill={color}
      />
    </Svg>
  );
};

export default LeftArrowIcon;

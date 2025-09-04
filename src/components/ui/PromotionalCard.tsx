import React, { memo } from "react";
import { Image, TouchableOpacity } from "react-native";

interface PromotionalCardProps {
  onPress?: () => void;
}

const PromotionalCard = memo(function PromotionalCard({
  onPress,
}: PromotionalCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel="Order card banner"
      accessibilityRole="button"
      activeOpacity={0.8}
    >
      <Image
        source={require("../../../assets/card-banner.png")}
        style={{
          width: "100%",
          height: 200,
          resizeMode: "cover",
        }}
        accessibilityLabel="Get your card and use it anywhere"
        fadeDuration={200}
        resizeMethod="resize"
      />
    </TouchableOpacity>
  );
});

export default PromotionalCard;

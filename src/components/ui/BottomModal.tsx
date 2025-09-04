import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

const { height: screenHeight } = Dimensions.get("window");

export default function BottomModal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
}: BottomModalProps) {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight - 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, backdropOpacity]);

  const handleBackdropPress = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            opacity: backdropOpacity,
          }}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#2E2E31",
          height: screenHeight,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View className="items-end px-[18px] py-4 pt-16">
          {showCloseButton && (
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        <Text className="text-white text-[24px] font-bold px-[18px] mb-3">
          {title}
        </Text>

        <View className="flex-1 px-6 py-4">{children}</View>
      </Animated.View>
    </Modal>
  );
}

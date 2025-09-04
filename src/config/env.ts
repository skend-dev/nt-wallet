import { Platform } from "react-native";

const getDefaultApiUrl = () => {
  const url =
    Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : "http://localhost:3000";
  return url;
};

export const ENV = {
  API_BASE_URL: getDefaultApiUrl(),
};

export default ENV;

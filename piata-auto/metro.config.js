import { withNativeWind } from "nativewind/dist/metro/index.js";
import { getDefaultConfig } from "expo/metro-config.js";

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });

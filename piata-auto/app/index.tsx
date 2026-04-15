import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppGate } from "./_layout";

export default function IndexPage() {
  return (
    <SafeAreaProvider>
      <AppGate />
    </SafeAreaProvider>
  );
}

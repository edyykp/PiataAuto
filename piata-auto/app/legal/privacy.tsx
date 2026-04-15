import { ScrollView, Text, View } from "react-native";

export default function PrivacyScreen() {
  return (
    <ScrollView className="flex-1 bg-slateBg px-4 py-6">
      <View className="rounded-3xl bg-white p-5 shadow-sm">
        <Text className="text-2xl font-bold text-slate-900">
          Politica de confidențialitate
        </Text>
        <Text className="mt-4 text-base leading-7 text-slate-600">
          PiataAuto colectează date necesare pentru autentificare, comunicare
          între utilizatori și funcționarea corectă a serviciului.
        </Text>
        <Text className="mt-4 text-base leading-7 text-slate-600">
          Datele tale nu sunt vândute către terți. Informațiile de profil și
          anunțurile sunt afișate doar în contextul utilizării aplicației.
        </Text>
        <Text className="mt-4 text-base leading-7 text-slate-600">
          Poți solicita actualizarea sau ștergerea datelor tale prin secțiunea
          de profil sau contactând suportul tehnic.
        </Text>
      </View>
    </ScrollView>
  );
}

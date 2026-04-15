import { ScrollView, Text, View } from "react-native";

export default function TermsScreen() {
  return (
    <ScrollView className="flex-1 bg-slateBg px-4 py-6">
      <View className="rounded-3xl bg-white p-5 shadow-sm">
        <Text className="text-2xl font-bold text-slate-900">
          Termeni și condiții
        </Text>
        <Text className="mt-4 text-base leading-7 text-slate-600">
          Prin utilizarea aplicației PiataAuto, accepți publicarea și consultarea
          anunțurilor auto în conformitate cu legislația aplicabilă și regulile
          platformei.
        </Text>
        <Text className="mt-4 text-base leading-7 text-slate-600">
          Utilizatorii sunt responsabili pentru acuratețea informațiilor din
          anunțuri, respectiv pentru deținerea drepturilor asupra fotografiilor
          și conținutului încărcat.
        </Text>
        <Text className="mt-4 text-base leading-7 text-slate-600">
          PiataAuto poate modera, suspenda sau elimina conținut care încalcă
          regulile comunității sau normele legale.
        </Text>
      </View>
    </ScrollView>
  );
}

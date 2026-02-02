import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function Homepage({ route }) {
  const { theme } = route.params || {}; // Receive theme from Login

  const themeColor = theme === "green" ? "#1DB954" :
                     theme === "blue" ? "#3B82F6" :
                     theme === "purple" ? "#b4760bff" :
                     theme === "light" ? "#e24747ff" : "#1DB954";

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.logo, { color: themeColor }]}>♪</Text>
        <Text style={[styles.title, { color: themeColor }]}>Listify</Text>
        <Text style={[styles.bell, { color: themeColor }]}>🔔</Text>
      </View>

      {/* Featured Album Card */}
      <View style={styles.featureCard}>
        <Image source={require("../assets/abbey.png")} style={styles.featureImage} />
        <View style={styles.featureContent}>
          <Text style={styles.featureLabel}>FEATURED ALBUM</Text>
          <Text style={styles.featureTitle}>Abbey Road</Text>
          <Text style={styles.featureArtist}>The Beatles</Text>
          <TouchableOpacity style={[styles.rateButton, { backgroundColor: themeColor }]}>
            <Text style={styles.rateButtonText}>Rate Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <Text style={[styles.navActive, { color: themeColor }]}>🏠 Home</Text>
        <Text style={styles.navText}>🔍 Search</Text>
        <Text style={styles.navText}>📋 Lists</Text>
        <Text style={styles.navText}>👤 Profile</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  logo: { fontSize: 20 },
  title: { fontSize: 20, fontWeight: "600" },
  bell: { fontSize: 20 },
  featureCard: { backgroundColor: "#222", borderRadius: 20, overflow: "hidden", marginBottom: 20 },
  featureImage: { width: "100%", height: 200 },
  featureContent: { padding: 15 },
  featureLabel: { color: "#ccc", fontSize: 12 },
  featureTitle: { color: "#fff", fontSize: 26, fontWeight: "700" },
  featureArtist: { color: "#ccc", fontSize: 16 },
  rateButton: { marginTop: 10, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, alignSelf: "flex-start" },
  rateButtonText: { color: "#fff", fontWeight: "600" },
  bottomNav: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 20, borderTopWidth: 1, borderTopColor: "#333", marginTop: 10 },
  navActive: { fontWeight: "600" },
  navText: { color: "#888" },
});

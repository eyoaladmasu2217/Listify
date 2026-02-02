import { Image, StyleSheet, Text, View } from "react-native";

export default function LogoTitle({ fontSize = 34, color = "white", style }) {
    // Adjust image size relative to font size
    const imageSize = fontSize * 1.2;

    return (
        <View style={[styles.container, style]}>
            <Image
                source={require("../../assets/L.png")}
                style={{ width: imageSize * 0.8, height: imageSize, resizeMode: "contain", marginRight: -2 }}
            />
            <Text style={[styles.text, { fontSize, color }]}>istify</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontWeight: "700",
        marginLeft: 0,
    }
});

import { Image, StyleSheet, Text, View } from "react-native";

export default function LogoTitle({ fontSize = 34, color = "white", style }) {
    // Adjust image size relative to font size
    const imageHeight = fontSize * 1.4;
    const imageWidth = imageHeight * 0.8;

    return (
        <View style={[styles.container, style]}>
            <Image
                source={require("../../assets/L.png")}
                style={{
                    width: imageWidth,
                    height: imageHeight,
                    resizeMode: "contain",
                    // Fine tune positioning to match text baseline visually
                }}
            />
            <Text style={[
                styles.text,
                {
                    fontSize,
                    color,
                    marginLeft: -2, // Just a tiny overlap
                    // Removing vertical shifts to let flexbox handle alignment
                }
            ]}>istify</Text>
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
        fontSize: 34, // Default fallback
        fontWeight: "600",
        fontFamily: "serif", // More elegant than default sans
        fontStyle: "italic", // Matches the 'flow' of a cursive L
        marginLeft: -4, // Tighter lockup
        includeFontPadding: false,
        textAlignVertical: 'center'
    }
});

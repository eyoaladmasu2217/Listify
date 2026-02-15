import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import { useTheme } from "./context/ThemeContext";

import CollectionsTab from "./tabs/Collections";
import ExploreTab from "./tabs/Explore";
import HomeTab from "./tabs/Home";
import ProfileTab from "./tabs/Profile";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.surface,
                    borderTopColor: "#333",
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: "#888",
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === "Lists") {
                        return (
                            <Image
                                source={require("../assets/L.png")}
                                style={{
                                    width: size,
                                    height: size,
                                    tintColor: color,
                                    resizeMode: "contain"
                                }}
                            />
                        );
                    }

                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Explore") {
                        iconName = focused ? "search" : "search-outline";
                    } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeTab} />
            <Tab.Screen name="Explore" component={ExploreTab} />
            <Tab.Screen name="Lists" component={CollectionsTab} />
            <Tab.Screen name="Profile" component={ProfileTab} />
        </Tab.Navigator>
    );
}

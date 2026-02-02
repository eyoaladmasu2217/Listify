import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Homepage from "./Homepage";
import LoginScreen from "./Login";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Homepage" component={Homepage} />
    </Stack.Navigator>
  );
}

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import AppTabs from "./AppTabs";
import CreateReview from "./CreateReview";
import EditProfileScreen from "./EditProfile";
import ForgotPasswordScreen from "./ForgotPassword";
import LoginScreen from "./Login";
import RegisterScreen from "./Register";
import ReviewDetail from "./ReviewDetail";
import SongDetail from "./SongDetail";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" }}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="AppTabs" component={AppTabs} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="SongDetail" component={SongDetail} options={{ presentation: 'modal' }} />
          <Stack.Screen name="ReviewDetail" component={ReviewDetail} options={{ presentation: 'modal' }} />
          <Stack.Screen name="CreateReview" component={CreateReview} options={{ presentation: 'modal' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}

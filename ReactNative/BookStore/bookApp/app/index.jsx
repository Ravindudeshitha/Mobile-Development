import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export default function Index() {
  const {user, token, checkAuth, logout} = useAuthStore();

  useEffect(() =>{
    checkAuth();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello</Text>
      <TouchableOpacity onPress={logout}><Text>Logout</Text></TouchableOpacity>
      <Link href="/(auth)/signup">SignUp</Link>
      <Link href="/(auth)">Login</Link>
    </View>
  );
}

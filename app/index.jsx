import { useUser } from "@clerk/clerk-expo";
import { Link, Redirect } from "expo-router";
import { Pressable, Text, View, ActivityIndicator } from "react-native";

export default function Index() {
  const { user } = useUser();

  // Có thể xác định rõ các trạng thái
  const isLoading = user === undefined;
  const isAuthenticated = !!user;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isLoading ? (
        // Thay thế Loading bằng một ActivityIndicator
        <ActivityIndicator size="large" color="#0000ff" />
      ) : isAuthenticated ? (
        <Redirect href={'/(tabs)/home'} />
      ) : (
        <Redirect href={'/login'} />
      )}
    </View>
  );
}

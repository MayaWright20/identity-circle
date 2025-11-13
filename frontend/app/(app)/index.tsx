import useProfile from '@/hooks/useProfile';
import { Text, View } from 'react-native';

export default function Index() {
  const { logOut } = useProfile();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          logOut();
        }}>
        Sign Out
      </Text>
    </View>
  );
}

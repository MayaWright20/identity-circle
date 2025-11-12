import { StoreState, usePersistStore, useStore } from '@/store/store';
import { AuthRoutes } from '@/types';
import { Text, View } from 'react-native';

export default function Index() {
  const setSessionToken = usePersistStore((state: any) => state.setSessionToken);
  const setIsAuthBgCol = useStore((state: StoreState) => state.setIsAuthBgCol);
  const setAuthCTATitle = useStore((state: StoreState) => state.setAuthCTATitle);

  const signOut = () => {
    setIsAuthBgCol(false);
    setAuthCTATitle(AuthRoutes.SING_UP);
    setSessionToken(null);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          signOut();
        }}>
        Sign Out
      </Text>
    </View>
  );
}

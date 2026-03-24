import { Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';

import { AppText as Text } from '../components/AppTypography';
import { AppStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import { FONTS } from '../theme/fonts';

const avatarAsset = 'https://www.figma.com/api/mcp/asset/828fb075-2e7f-4951-8506-36038bace5a9';

type Props = NativeStackScreenProps<AppStackParamList, 'Menu'>;

export function MenuScreen({ navigation }: Props) {
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
        <Pressable
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color="#111" />
        </Pressable>
      </View>

      <View style={styles.profileWrap}>
        <Image source={{ uri: avatarAsset }} style={styles.avatar} />
        <Text style={styles.name}>Aline Cavalcante</Text>
        <Text style={styles.email}>aline@gmail.com</Text>
      </View>

      <View style={styles.menuList}>
        <Pressable style={styles.menuItem} onPress={() => navigation.navigate('ProfileInfo')}>
          <Ionicons name="person" size={28} color="#111" />
          <Text style={styles.menuItemText}>Informações do Perfil</Text>
          <SimpleLineIcons name="arrow-right" size={20} color="#111" />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={() => navigation.navigate('ChangePassword')}>
          <MaterialCommunityIcons name="form-textbox-password" size={28} color="#111" />
          <Text style={styles.menuItemText}>Mudar Senha</Text>
          <SimpleLineIcons name="arrow-right" size={20} color="#111" />
        </Pressable>

        <Pressable style={styles.menuItem} onPress={signOut}>
          <SimpleLineIcons name="logout" size={24} color="#111" />
          <Text style={styles.menuItemText}>Sair</Text>
          <SimpleLineIcons name="arrow-right" size={20} color="#111" />
        </Pressable>
      </View>

      <View style={styles.bottomBar}>
        <Pressable style={styles.bottomItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color="#111" />
          <Text style={styles.bottomText}>Home</Text>
        </Pressable>

        <Pressable style={styles.bottomItem} onPress={() => navigation.navigate('NewClient')}>
          <Ionicons name="add-circle-outline" size={24} color="#111" />
          <Text style={styles.bottomText}>Nova Cliente</Text>
        </Pressable>

        <View style={styles.bottomItem}>
          <Ionicons name="menu" size={24} color="#111" />
          <Text style={styles.bottomText}>Menu</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  header: {
    height: 66,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationButton: {
    position: 'absolute',
    right: 24,
  },
  title: {
    fontSize: 12,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  profileWrap: {
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 26,
  },
  avatar: {
    width: 166,
    height: 155,
    marginBottom: 20,
  },
  name: {
    fontSize: 15,
    color: '#111',
    fontFamily: FONTS.regular,
    marginBottom: 2,
  },
  email: {
    fontSize: 10,
    color: '#676563',
    fontFamily: FONTS.regular,
  },
  menuList: {
    gap: 8,
  },
  menuItem: {
    height: 65,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 15,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  bottomBar: {
    marginTop: 'auto',
    height: 59,
    borderTopWidth: 1,
    borderTopColor: '#ececec',
    backgroundColor: '#f3f3f3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  bottomItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  bottomText: {
    fontSize: 9,
    color: '#111',
    marginTop: -2,
    fontFamily: FONTS.regular,
  },
});

import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { AppText as Text } from '../components/AppTypography';
import { useNotificationStore } from '../store/notificationStore';
import { AppStackParamList } from '../navigation/types';
import { FONTS } from '../theme/fonts';

const imgHero = 'https://www.figma.com/api/mcp/asset/4e4603c4-eff7-482e-bd0d-02d7c0a889a1';
const imgAction = 'https://www.figma.com/api/mcp/asset/c6c1f356-5ca1-4766-bc39-8a38fdadefa2';
const imgClient1 = 'https://www.figma.com/api/mcp/asset/8ba17190-068f-4725-853a-1fa7f9100bb3';
const imgClient2 = 'https://www.figma.com/api/mcp/asset/d6918e12-7417-47d4-9976-c7851acc6d6f';
const imgClient3 = 'https://www.figma.com/api/mcp/asset/7dc257b5-8d38-455c-af70-f9a9c91144cc';
const imgClient4 = 'https://www.figma.com/api/mcp/asset/55492c67-d7ce-42aa-a120-fa42c999c60b';
const imgClient5 = 'https://www.figma.com/api/mcp/asset/c0ca702e-76bf-465c-9a70-72dab969dd87';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const unreadCount = useNotificationStore(
    (state) => state.notifications.filter((item) => !item.isRead).length,
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <Pressable
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.searchBox} onPress={() => navigation.navigate('ClientSearch')}>
          <Ionicons name="search-outline" size={24} color="black" />
          <Text style={styles.searchPlaceholder}>Pesquisar....</Text>
        </Pressable>

        <View style={styles.welcomeCard}>
          <View style={styles.welcomeLeft}>
            <Text style={styles.welcomeTitle}>Bem-vinda!</Text>
            <Text style={styles.welcomeSubtitle}>Aqui você encontra todas as suas clientes</Text>
          </View>
          <Image source={{ uri: imgHero }} style={styles.welcomeImage} />
        </View>

        <Text style={styles.sectionTitle}>Clientes</Text>

        <View style={styles.filtersRow}>
          <View style={styles.filterActive}>
            <Text style={styles.filterText}>Todos</Text>
          </View>
          <View style={styles.filterItem}>
            <Text style={styles.filterText}>Serviços Completos</Text>
          </View>
          <View style={styles.filterItem}>
            <Text style={styles.filterText}>Serviços Incompletos</Text>
          </View>
        </View>

        <View style={styles.clientCard}>
          <Image source={{ uri: imgClient1 }} style={styles.clientAvatar} />
          <Text style={styles.clientName}>Barbara Soares</Text>
          <Image source={{ uri: imgAction }} style={styles.actionSingle} />
        </View>

        <View style={styles.clientCard}>
          <Image source={{ uri: imgClient2 }} style={styles.clientAvatar} />
          <Text style={styles.clientName}>Amanda Pires</Text>
          <Image source={{ uri: imgAction }} style={styles.actionSingle} />
        </View>

        <View style={styles.clientCard}>
          <Image source={{ uri: imgClient3 }} style={styles.clientAvatar} />
          <Text style={styles.clientName}>Barbara Soares</Text>
          <Image source={{ uri: imgAction }} style={styles.actionSingle} />
        </View>

        <View style={styles.clientCard}>
          <Image source={{ uri: imgClient4 }} style={styles.clientAvatar} />
          <View style={styles.clientProgressWrap}>
            <Text style={styles.clientName}>Barbara Soares</Text>
            <Text style={styles.progressText}>Ainda falta 1 Serviço</Text>
            <View style={styles.progressTrack}>
              <View style={styles.progressFillLong} />
            </View>
          </View>
          <Image source={{ uri: imgAction }} style={styles.actionSingle} />
        </View>

        <View style={styles.clientCard}>
          <Image source={{ uri: imgClient5 }} style={styles.clientAvatar} />
          <View style={styles.clientProgressWrap}>
            <Text style={styles.clientName}>Barbara Soares</Text>
            <Text style={styles.progressText}>Ainda falta 2 Serviço</Text>
            <View style={styles.progressTrack}>
              <View style={styles.progressFillShort} />
            </View>
          </View>
          <Image source={{ uri: imgAction }} style={styles.actionSingle} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomItem}>
          <Ionicons name="home" size={24} color="#111" />
          <Text style={styles.bottomText}>Home</Text>
        </View>

        <Pressable style={styles.bottomItem} onPress={() => navigation.navigate('NewClient')}>
          <Ionicons name="add-circle-outline" size={24} color="#111" />
          <Text style={styles.bottomText}>Nova Cliente</Text>
        </Pressable>

        <Pressable style={styles.bottomItem} onPress={() => navigation.navigate('Menu')}>
          <Ionicons name="menu" size={24} color="#111" />
          <Text style={styles.bottomText}>Menu</Text>
        </Pressable>
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
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  notificationButton: {
    width: 40,
    height: 40,
    position: 'absolute',
    right: 22,
    top: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D2AF8E',
    position: 'absolute',
    top: -4,
    right: -6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    color: '#111',
    fontFamily: FONTS.semibold,
  },
  headerTitle: {
    fontSize: 14,
    color: '#111',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 92,
  },
  searchBox: {
    height: 45,
    backgroundColor: '#ededed',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 30,
    paddingHorizontal: 12,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#cfcfcf',
    marginLeft: 8,
  },
  welcomeCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    height: 117,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
  },
  welcomeLeft: {
    flex: 1,
    paddingLeft: 18,
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 16,
    color: '#111',
    marginBottom: 2,
  },
  welcomeSubtitle: {
    fontSize: 12,
    color: '#111',
    width: 165,
    lineHeight: 20,
  },
  welcomeImage: {
    width: 179,
    height: 117,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#111',
    marginBottom: 10,
  },
  filtersRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 6,
  },
  filterActive: {
    height: 18,
    backgroundColor: '#DCB999',
    borderRadius: 20,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterItem: {
    height: 18,
    borderWidth: 1,
    borderColor: '#DCB999',
    borderRadius: 20,
    paddingHorizontal: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 8,
    color: '#111',
  },
  clientCard: {
    height: 85,
    backgroundColor: '#ededed',
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  clientAvatar: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 30,
  },
  clientName: {
    fontSize: 15,
    color: '#111',
  },
  actionSingle: {
    width: 34,
    height: 34,
    marginLeft: 'auto',
    resizeMode: 'contain',
  },
  clientProgressWrap: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  progressText: {
    fontSize: 8,
    color: '#111',
    marginTop: 2,
    marginBottom: 3,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#d9d9d9',
    borderRadius: 20,
    overflow: 'hidden',
  },
  progressFillLong: {
    width: '76%',
    height: 6,
    backgroundColor: '#DCB999',
    borderRadius: 20,
  },
  progressFillShort: {
    width: '52%',
    height: 6,
    backgroundColor: '#DCB999',
    borderRadius: 20,
  },
  bottomBar: {
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

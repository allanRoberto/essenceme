import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { AppText as Text } from '../components/AppTypography';
import { AppStackParamList } from '../navigation/types';
import { useNotificationStore } from '../store/notificationStore';
import { FONTS } from '../theme/fonts';

type Props = NativeStackScreenProps<AppStackParamList, 'Notifications'>;

export function NotificationsScreen({ navigation }: Props) {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>

        <Text style={styles.title}>Notificações</Text>

        <Pressable style={styles.markAllButton} onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Ler tudo</Text>
        </Pressable>
      </View>

      <View style={styles.summaryCard}>
        <Ionicons name="notifications-outline" size={24} color="black" />
        <Text style={styles.summaryText}>
          {unreadCount === 0 ? 'Sem notificações pendentes' : `${unreadCount} não lida(s)`}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.card, !item.isRead && styles.cardUnread]}
            onPress={() => markAsRead(item.id)}
          >
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {!item.isRead && <View style={styles.unreadDot} />}
            </View>

            <Text style={styles.cardMessage}>{item.message}</Text>
            <Text style={styles.cardDate}>{item.createdAtLabel}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
  },
  backButton: {
    minWidth: 70,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 13,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  title: {
    fontSize: 14,
    color: '#111',
    fontFamily: FONTS.semibold,
  },
  markAllButton: {
    minWidth: 70,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDBA99',
    paddingHorizontal: 10,
  },
  markAllText: {
    fontSize: 12,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dfdfdf',
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
  },
  summaryText: {
    fontSize: 14,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    padding: 14,
    backgroundColor: '#fff',
  },
  cardUnread: {
    borderColor: '#D2AF8E',
    backgroundColor: '#fdf8f3',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    color: '#111',
    fontFamily: FONTS.semibold,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D2AF8E',
  },
  cardMessage: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    marginBottom: 6,
    fontFamily: FONTS.regular,
  },
  cardDate: {
    fontSize: 11,
    color: '#666',
    fontFamily: FONTS.regular,
  },
});

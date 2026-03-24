import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { AppText as Text } from '../components/AppTypography';
import { AppStackParamList } from '../navigation/types';
import { FONTS } from '../theme/fonts';

type Props = NativeStackScreenProps<AppStackParamList, 'ClientProfile'>;

export function ClientProfileScreen({ navigation, route }: Props) {
  const firstName = route.params.firstName ?? route.params.clientName.split(' ')[0] ?? '';
  const lastName =
    route.params.lastName ??
    route.params.clientName
      .split(' ')
      .slice(1)
      .join(' ') ??
    '';
  const email = route.params.email ?? 'cliente@email.com';
  const phone = route.params.phone ?? '(11) 99999-9999';
  const hasClothingMatch = route.params.hasClothingMatch ?? false;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>

        <Text style={styles.title}>Cliente</Text>

        <Pressable
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={22} color="#111" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.clientName}>{route.params.clientName}</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nome</Text>
            <Text style={styles.infoValue}>{firstName}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sobrenome</Text>
            <Text style={styles.infoValue}>{lastName || '-'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>E-mail</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Telefone</Text>
            <Text style={styles.infoValue}>{phone}</Text>
          </View>

          <View style={styles.matchWrap}>
            <Text style={styles.matchTitle}>Match de Roupas</Text>

            {hasClothingMatch && (
              <Pressable
                style={styles.secondaryButton}
                onPress={() =>
                  Alert.alert('Match de Roupas', 'Visualização do match será exibida aqui.')
                }
              >
                <Text style={styles.secondaryButtonText}>Visualizar Match de Roupas</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.primaryButton}
              onPress={() =>
                Alert.alert('Rascunho salvo', 'Você pode continuar o atendimento mais tarde.')
              }
            >
              <Text style={styles.primaryButtonText}>Salvar e continuar mais tarde</Text>
            </Pressable>
          </View>
        </View>
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
    height: 66,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 18,
    height: 36,
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 12,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  notificationButton: {
    position: 'absolute',
    right: 22,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e9e9e9',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  title: {
    fontSize: 12,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  clientName: {
    fontSize: 16,
    color: '#111',
    fontFamily: FONTS.semibold,
    marginBottom: 12,
  },
  infoItem: {
    borderWidth: 1,
    borderColor: '#d8d8d8',
    borderRadius: 6,
    minHeight: 54,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 11,
    color: '#6E4025',
    fontFamily: FONTS.regular,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  matchWrap: {
    marginTop: 6,
  },
  matchTitle: {
    fontSize: 13,
    color: '#111',
    fontFamily: FONTS.semibold,
    marginBottom: 8,
  },
  secondaryButton: {
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D2AF8E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  secondaryButtonText: {
    fontSize: 13,
    color: '#6E4025',
    fontFamily: FONTS.regular,
  },
  primaryButton: {
    marginTop: 10,
    height: 45,
    borderRadius: 5,
    backgroundColor: '#D2AF8E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  primaryButtonText: {
    fontSize: 12,
    color: '#111',
    fontFamily: FONTS.regular,
  },
});

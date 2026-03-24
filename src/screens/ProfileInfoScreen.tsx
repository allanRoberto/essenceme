import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AppText as Text } from '../components/AppTypography';
import { FloatingLabelInput } from '../components/FloatingLabelInput';
import { AppStackParamList } from '../navigation/types';
import { FONTS } from '../theme/fonts';

type Props = NativeStackScreenProps<AppStackParamList, 'ProfileInfo'>;

export function ProfileInfoScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('Aline Cavalcante');
  const [email, setEmail] = useState('aline@gmail.com');
  const [phone, setPhone] = useState('(11) 99999-9999');
  const [instagram, setInstagram] = useState('@alinecavalcante');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>

          <Text style={styles.title}>Informações do Perfil</Text>

          <Pressable
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color="#111" />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <FloatingLabelInput
              label="Nome completo"
              value={fullName}
              onChangeText={setFullName}
              containerStyle={styles.inputWrap}
              labelBackgroundColor="#fff"
            />

            <FloatingLabelInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.inputWrap}
              labelBackgroundColor="#fff"
            />

            <FloatingLabelInput
              label="Telefone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              containerStyle={styles.inputWrap}
              labelBackgroundColor="#fff"
            />

            <FloatingLabelInput
              label="Instagram"
              value={instagram}
              onChangeText={setInstagram}
              autoCapitalize="none"
              containerStyle={styles.inputWrap}
              labelBackgroundColor="#fff"
            />

            <Pressable style={styles.primaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.primaryButtonText}>Salvar alterações</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  title: {
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
  formCard: {
    borderWidth: 1,
    borderColor: '#e9e9e9',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 14,
  },
  inputWrap: {
    backgroundColor: '#fff',
    borderColor: '#d8d8d8',
  },
  primaryButton: {
    marginTop: 8,
    height: 45,
    borderRadius: 5,
    backgroundColor: '#D2AF8E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 12,
    color: '#111',
    fontFamily: FONTS.regular,
  },
});

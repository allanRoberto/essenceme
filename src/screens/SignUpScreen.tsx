import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Image,
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
import { AuthStackParamList } from '../navigation/types';
import { FONTS } from '../theme/fonts';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const avatarAsset =
  'https://www.figma.com/api/mcp/asset/e687922f-64e3-40a6-8065-112039264a6a';
const eyeAsset =
  'https://www.figma.com/api/mcp/asset/368cf35b-0e95-4931-828d-bf9c349ac8a7';

export function SignUpScreen({ navigation, route }: Props) {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const avatarUri = route.params?.avatarUri ?? avatarAsset;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBackground} />

          <View style={styles.sheet}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            </View>

            <View style={styles.form}>
              <Pressable
                style={styles.changeAvatarButton}
                onPress={() => navigation.navigate('AvatarSelection')}
              >
                <Text style={styles.changeAvatarButtonText}>Trocar o avatar</Text>
              </Pressable>

              <FloatingLabelInput
                label="Nome"
                value={name}
                onChangeText={setName}
                containerStyle={styles.inputWrap}
                inputStyle={styles.input}
              />

              <FloatingLabelInput
                label="Sobrenome"
                value={lastName}
                onChangeText={setLastName}
                containerStyle={styles.inputWrap}
                inputStyle={styles.input}
              />

              <FloatingLabelInput
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                containerStyle={styles.inputWrap}
                inputStyle={styles.input}
              />

              <FloatingLabelInput
                label="CPF"
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
                containerStyle={styles.inputWrap}
                inputStyle={styles.input}
              />

              <FloatingLabelInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                containerStyle={styles.inputWrap}
                inputStyle={styles.inputWithIcon}
                rightAdornment={<Image source={{ uri: eyeAsset }} style={styles.eyeIcon} />}
              />

              <FloatingLabelInput
                label="Confirmar Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                containerStyle={styles.inputWrap}
                inputStyle={styles.inputWithIcon}
                rightAdornment={<Image source={{ uri: eyeAsset }} style={styles.eyeIcon} />}
              />

              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Cadastrar</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCB999',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  topBackground: {
    height: 198,
    backgroundColor: '#DCB999',
  },
  sheet: {
    flex: 1,
    minHeight: 760,
    backgroundColor: '#f3f3f3',
    borderTopLeftRadius: 43,
    borderTopRightRadius: 43,
    marginTop: -1,
    alignItems: 'center',
    paddingTop: 62,
    paddingHorizontal: 24,
    paddingBottom: 34,
  },
  avatarContainer: {
    width: 166,
    height: 155,
    borderRadius: 83,
    overflow: 'hidden',
    position: 'absolute',
    top: -136,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  form: {
    width: '100%',
    marginTop: 30,
    gap: 24,
  },
  changeAvatarButton: {
    height: 36,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeAvatarButtonText: {
    fontSize: 12,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  inputWrap: {
    height: 45,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  input: {
    paddingHorizontal: 12,
    color: '#111',
    fontSize: 14,
  },
  inputWithIcon: {
    paddingHorizontal: 12,
    paddingRight: 50,
    color: '#111',
    fontSize: 14,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: 14,
    top: 10,
    resizeMode: 'contain',
  },
  primaryButton: {
    height: 45,
    borderRadius: 5,
    backgroundColor: '#D2AF8E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  primaryButtonText: {
    fontSize: 12,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  secondaryButton: {
    height: 38,
    borderRadius: 5,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#111',
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
});

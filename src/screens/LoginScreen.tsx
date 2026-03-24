import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import { AppText as Text } from '../components/AppTypography';
import { FloatingLabelInput } from '../components/FloatingLabelInput';
import { useAuthStore } from '../store/authStore';
import { AuthStackParamList } from '../navigation/types';
import { FONTS } from '../theme/fonts';

const logoAsset =
  'https://www.figma.com/api/mcp/asset/4025cc2f-aed3-4ac2-acd6-43ed65eb8d38';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen({ navigation }: Props) {
  const signIn = useAuthStore((state) => state.signIn);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!emailRegex.test(email.trim())) {
      Alert.alert('E-mail inválido', 'Informe um e-mail válido para continuar.');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Senha obrigatória', 'Informe sua senha para entrar.');
      return;
    }

    signIn(email, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <Image source={{ uri: logoAsset }} style={styles.logoImage} resizeMode="contain" />
        </View>

        <View style={styles.fieldGroup}>
          <FloatingLabelInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={styles.inputWrapHighlighted}
            inputStyle={styles.input}
            labelBackgroundColor="#fff"
          />

          <FloatingLabelInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            containerStyle={styles.inputWrapMuted}
            inputStyle={[styles.input, styles.inputWithIcon]}
            labelBackgroundColor="#fff"
            rightAdornment={
              <Pressable
                style={styles.passwordToggle}
                onPress={() => setShowPassword((prev) => !prev)}
                hitSlop={8}
              >
                {showPassword ? (
                  <AntDesign name="eye" size={24} color="black" />
                ) : (
                  <AntDesign name="eye-invisible" size={24} color="black" />
                )}
              </Pressable>
            }
          />
        </View>

        <Pressable style={styles.primaryButton} onPress={handleLogin}>
          <View style={styles.primaryButtonContent}>
            <Text style={styles.primaryButtonText}>Entrar</Text>
            <SimpleLineIcons name="login" size={24} color="black" />
          </View>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.secondaryButtonText}>Não tem cadastro? Inscreva-se aqui</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Esqueceu a Senha?</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 210,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 34,
  },
  logoImage: {
    width: 329,
    height: 66,
  },
  fieldGroup: {
    gap: 24,
    marginBottom: 20,
  },
  inputWrapHighlighted: {
    height: 45,
    borderWidth: 1,
    borderColor: '#D2A679',
    borderRadius: 5,
    position: 'relative',
  },
  inputWrapMuted: {
    height: 45,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    position: 'relative',
  },
  input: {
    paddingHorizontal: 12,
    color: '#111',
    fontSize: 14,
  },
  inputWithIcon: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: 10,
  },
  primaryButton: {
    height: 45,
    borderRadius: 5,
    backgroundColor: '#DDBA99',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#111',
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  secondaryButton: {
    height: 38,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#111',
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  forgotPassword: {
    textAlign: 'center',
    color: '#111',
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
});

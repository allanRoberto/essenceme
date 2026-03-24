import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
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

const avatarAsset = 'https://www.figma.com/api/mcp/asset/53ba45f1-e46a-477b-bf6f-3cbc59913832';

type Props = NativeStackScreenProps<AppStackParamList, 'NewClient'>;
type SelectorType = 'gender' | 'source' | null;

const genderOptions = ['Masculino', 'Feminino'];
const sourceOptions = ['Instagram', 'Google', 'Site', 'Indicação', 'Feiras'];

function formatBirthDate(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function NewClientScreen({ navigation, route }: Props) {
  const avatarUri = route.params?.avatarUri ?? avatarAsset;
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [source, setSource] = useState('');
  const [openSelector, setOpenSelector] = useState<SelectorType>(null);

  const activeOptions = openSelector === 'gender' ? genderOptions : sourceOptions;

  const handleSelectOption = (option: string) => {
    if (openSelector === 'gender') {
      setGender(option);
    }

    if (openSelector === 'source') {
      setSource(option);
    }

    setOpenSelector(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBackground} />

          <View style={styles.sheet}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            </View>

            <View style={styles.form}>
              <Pressable
                style={styles.avatarButton}
                onPress={() => navigation.navigate('NewClientAvatarSelection')}
              >
                <Text style={styles.avatarButtonText}>Trocar o avatar</Text>
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
                label="Data de Nascimento"
                value={birthDate}
                onChangeText={(text) => setBirthDate(formatBirthDate(text))}
                keyboardType="numeric"
                containerStyle={styles.inputWrap}
                inputStyle={styles.input}
              />

              <Pressable style={styles.selectWrap} onPress={() => setOpenSelector('gender')}>
                <Text style={styles.selectLabel}>Gênero</Text>
                <Text style={gender ? styles.selectValue : styles.selectPlaceholder}>
                  {gender || 'Selecione'}
                </Text>
              </Pressable>

              <Pressable style={styles.selectWrap} onPress={() => setOpenSelector('source')}>
                <Text style={styles.selectLabel}>Como descobriu nossos serviços</Text>
                <Text style={source ? styles.selectValue : styles.selectPlaceholder}>
                  {source || 'Selecione'}
                </Text>
              </Pressable>

              <Pressable
                style={styles.primaryButton}
                onPress={() => navigation.push('NewClientStep2')}
              >
                <Text style={styles.primaryButtonText}>Próximo</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <Pressable style={styles.bottomItem} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home-outline" size={24} color="#111" />
            <Text style={styles.bottomText}>Home</Text>
          </Pressable>

          <View style={styles.bottomItem}>
            <Ionicons name="add-circle" size={24} color="#111" />
            <Text style={styles.bottomText}>Nova Cliente</Text>
          </View>

          <Pressable style={styles.bottomItem} onPress={() => navigation.navigate('Menu')}>
            <Ionicons name="menu-outline" size={24} color="#111" />
            <Text style={styles.bottomText}>Menu</Text>
          </Pressable>
        </View>

        <Modal
          visible={openSelector !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setOpenSelector(null)}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={styles.modalBackdrop} onPress={() => setOpenSelector(null)} />
            <View style={styles.modalCard}>
              {activeOptions.map((option) => (
                <Pressable
                  key={option}
                  style={styles.modalOption}
                  onPress={() => handleSelectOption(option)}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Modal>
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
    minHeight: '100%',
    paddingBottom: 80,
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
    paddingBottom: 30,
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
    marginTop: 0,
    gap: 24,
  },
  avatarButton: {
    height: 36,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButtonText: {
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
  selectWrap: {
    height: 45,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    paddingHorizontal: 12,
    justifyContent: 'center',
    gap: 2,
  },
  selectLabel: {
    fontSize: 11,
    color: '#6E4025',
    fontFamily: FONTS.regular,
  },
  selectPlaceholder: {
    fontSize: 14,
    color: '#777',
    fontFamily: FONTS.regular,
  },
  selectValue: {
    fontSize: 14,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  primaryButton: {
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    position: 'relative',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
  },
  modalOption: {
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  modalOptionText: {
    fontSize: 14,
    color: '#111',
    fontFamily: FONTS.regular,
  },
});

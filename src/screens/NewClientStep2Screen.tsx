import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Image,
  Modal,
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

type Props = NativeStackScreenProps<AppStackParamList, 'NewClientStep2'>;
type SelectorMode = 'priority' | 'objective';

const priorityOptions = [
  'Elegância',
  'Conforto',
  'Praticidade',
  'Versatilidade',
  'Sofisticação',
  'Autenticidade',
  'Modernidade',
  'Discrição',
  'Impacto',
  'Feminilidade',
  'Minimalismo',
  'Criatividade',
  'Refinamento',
  'Casual Chic',
  'Presença',
];

const objectiveOptions = [
  'Credibilidade',
  'Autoridade',
  'Acolhimento',
  'Profissionalismo',
  'Confiança',
  'Aproximação',
  'Posicionamento',
  'Delicadeza',
  'Força',
  'Leveza',
  'Originalidade',
  'Clareza',
  'Simplicidade',
  'Memorabilidade',
  'Consistência',
];

export function NewClientStep2Screen({ navigation }: Props) {
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(['Elegância', 'Conforto']);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>(['Credibilidade', 'Confiança']);
  const [notes, setNotes] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectorMode, setSelectorMode] = useState<SelectorMode>('priority');
  const [draftSelection, setDraftSelection] = useState<string[]>([]);

  const selectedPrioritySet = useMemo(() => new Set(selectedPriorities), [selectedPriorities]);
  const selectedObjectiveSet = useMemo(() => new Set(selectedObjectives), [selectedObjectives]);
  const draftSet = useMemo(() => new Set(draftSelection), [draftSelection]);

  const openSelector = (mode: SelectorMode) => {
    setSelectorMode(mode);
    setDraftSelection(mode === 'priority' ? selectedPriorities : selectedObjectives);
    setModalVisible(true);
  };

  const toggleDraft = (value: string) => {
    setDraftSelection((current) => {
      if (current.includes(value)) {
        return current.filter((item) => item !== value);
      }

      return [...current, value];
    });
  };

  const confirmSelection = () => {
    if (selectorMode === 'priority') {
      setSelectedPriorities(draftSelection);
    } else {
      setSelectedObjectives(draftSelection);
    }

    setModalVisible(false);
  };

  const currentOptions = selectorMode === 'priority' ? priorityOptions : objectiveOptions;
  const modalTitle =
    selectorMode === 'priority' ? 'Selecione suas prioridades' : 'Selecione seus objetivos';

  const renderSelectedChip = (label: string, keyPrefix: string) => (
    <Pressable
      key={`${keyPrefix}-${label}`}
      style={styles.selectedChip}
      onPress={() => openSelector(keyPrefix === 'priority' ? 'priority' : 'objective')}
    >
      <Text style={styles.selectedChipText}>{label}</Text>
      <Text style={styles.selectedChipX}>×</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Características da Cliente</Text>

        <Pressable style={styles.block} onPress={() => openSelector('priority')}>
          <Text style={styles.blockLabel}>Quais são suas prioridades ao se vestir?</Text>
          <View style={styles.chipsWrap}>
            {selectedPriorities.map((item) => renderSelectedChip(item, 'priority'))}
          </View>
        </Pressable>

        <Pressable style={[styles.block, styles.blockTall]} onPress={() => openSelector('objective')}>
          <Text style={styles.blockLabel}>Prioridades e Objetivos</Text>
          <View style={styles.chipsWrap}>
            {selectedObjectives.map((item) => renderSelectedChip(item, 'objective'))}
          </View>
        </Pressable>

        <FloatingLabelInput
          label="Observações Gerais"
          multiline
          value={notes}
          onChangeText={setNotes}
          containerStyle={[styles.block, styles.notesBlock, styles.notesInputWrap]}
          inputStyle={styles.notesInput}
          textAlignVertical="top"
        />

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate('NewClientStep3', {
              selectedPriorities,
              selectedObjectives,
            })
          }
        >
          <Text style={styles.primaryButtonText}>Próximo</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.bottomItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color="#111" />
          <Text style={styles.bottomText}>Home</Text>
        </Pressable>

        <Pressable style={styles.bottomItem} onPress={() => navigation.navigate('NewClient')}>
          <Ionicons name="add-circle" size={24} color="#111" />
          <Text style={styles.bottomText}>Nova Cliente</Text>
        </Pressable>

        <Pressable style={styles.bottomItem} onPress={() => navigation.navigate('Menu')}>
          <Ionicons name="menu-outline" size={24} color="#111" />
          <Text style={styles.bottomText}>Menu</Text>
        </Pressable>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setModalVisible(false)} />

          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>

            <View style={styles.modalChipsWrap}>
              {currentOptions.map((option) => {
                const selected = draftSet.has(option);

                return (
                  <Pressable
                    key={`modal-${selectorMode}-${option}`}
                    style={[styles.modalChip, selected ? styles.modalChipSelected : styles.modalChipOutline]}
                    onPress={() => toggleDraft(option)}
                  >
                    <Text style={styles.modalChipText}>{option}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable style={styles.confirmButton} onPress={confirmSelection}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 46,
    paddingBottom: 90,
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    color: '#111',
    marginBottom: 22,
  },
  block: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    minHeight: 177,
    marginBottom: 22,
    paddingTop: 20,
    paddingHorizontal: 14,
  },
  blockTall: {
    minHeight: 183,
  },
  notesBlock: {
    minHeight: 169,
    paddingBottom: 12,
  },
  notesInputWrap: {
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  blockLabel: {
    position: 'absolute',
    top: -15,
    left: 10,
    color: '#6E4025',
    fontSize: 12,
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 4,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    paddingTop: 2,
  },
  selectedChip: {
    minWidth: 113,
    height: 21,
    borderRadius: 20,
    backgroundColor: '#DCB999',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  selectedChipText: {
    fontSize: 10,
    color: '#111',
  },
  selectedChipX: {
    fontSize: 12,
    color: '#111',
    lineHeight: 14,
  },
  notesInput: {
    flex: 1,
    minHeight: 130,
    color: '#111',
    fontSize: 13,
    paddingTop: 16,
    paddingHorizontal: 14,
  },
  primaryButton: {
    height: 45,
    borderRadius: 5,
    backgroundColor: '#D2AF8E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
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
    backgroundColor: 'rgba(0,0,0,0.74)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: 353,
    borderRadius: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingTop: 46,
    paddingBottom: 28,
  },
  modalTitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#111',
    marginBottom: 22,
  },
  modalChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  modalChip: {
    width: 96,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  modalChipSelected: {
    backgroundColor: '#DCB999',
  },
  modalChipOutline: {
    borderWidth: 1,
    borderColor: '#DCB999',
    backgroundColor: '#fff',
  },
  modalChipText: {
    fontSize: 8,
    color: '#111',
  },
  confirmButton: {
    width: 295,
    height: 32,
    borderRadius: 5,
    backgroundColor: '#DCB999',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 12,
    color: '#111',
    fontFamily: FONTS.regular,
  },
});

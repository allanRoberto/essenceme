import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Alert, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';

import { AppText as Text } from '../components/AppTypography';
import { FloatingLabelInput } from '../components/FloatingLabelInput';
import { AppStackParamList } from '../navigation/types';
import { useClientStore } from '../store/clientStore';
import { FONTS } from '../theme/fonts';

type Props = NativeStackScreenProps<AppStackParamList, 'NewClientFinalize'>;

type DraftService = {
  serviceName: string;
  notes: string;
  serviceDate: string;
};

const avatarAsset = 'https://www.figma.com/api/mcp/asset/e3b9a1d4-74d9-47e9-ab5b-a2867e6dfa7b';

const serviceOptions = [
  'Coloração Pessoal',
  'Diagnóstico e Estratégia de Estilo',
  'Consultoria de Estilo',
  'Personal Shopper',
  'Mala Inteligente',
];

const matchTabs = [
  { id: 'geral', label: 'Geral' },
  { id: 'pecas_unicas', label: 'Peças Únicas' },
  { id: 'pecas_cima', label: 'Peças de Cima' },
  { id: 'pecas_baixo', label: 'Peças de Baixo' },
  { id: 'calcados', label: 'Calçados' },
] as const;

const defaultStyleScores = [
  { label: 'Clássico', value: 51 },
  { label: 'Romântico', value: 27 },
  { label: 'Magnético', value: 12 },
  { label: 'Esportivo', value: 10 },
  { label: 'Criativo', value: 2 },
  { label: 'Elegante', value: 0 },
  { label: 'Moderno', value: 0 },
];

const detailImagesByTab: Record<string, string[]> = {
  geral: [
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
  ],
  pecas_unicas: ['https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=800&q=80'],
  pecas_cima: ['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80'],
  pecas_baixo: ['https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=800&q=80'],
  calcados: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
};

function formatDate(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function NewClientFinalizeScreen({ navigation, route }: Props) {
  const addClient = useClientStore((state) => state.addClient);
  const selectedPriorities = route.params?.selectedPriorities ?? ['Elegância', 'Conforto'];
  const selectedObjectives = route.params?.selectedObjectives ?? ['Credibilidade', 'Confiança'];

  const [style, setStyle] = useState('');
  const [palette, setPalette] = useState('');
  const [shirtSize, setShirtSize] = useState('');
  const [pantsSize, setPantsSize] = useState('');
  const [shoeSize, setShoeSize] = useState('');

  const [services, setServices] = useState<DraftService[]>([]);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [activeMatchTab, setActiveMatchTab] = useState<(typeof matchTabs)[number]['id']>('geral');
  const [showDetails, setShowDetails] = useState(false);
  const [draftService, setDraftService] = useState<DraftService>({
    serviceName: '',
    notes: '',
    serviceDate: '',
  });

  const saveService = () => {
    if (!draftService.serviceName) {
      Alert.alert('Serviço obrigatório', 'Selecione um serviço para continuar.');
      return;
    }

    if (!draftService.serviceDate) {
      Alert.alert('Data obrigatória', 'Informe a data do serviço.');
      return;
    }

    setServices((current) => [...current, draftService]);
    setDraftService({ serviceName: '', notes: '', serviceDate: '' });
    setServiceModalOpen(false);
  };

  const saveClient = () => {
    addClient({
      style: style.trim(),
      palette: palette.trim(),
      shirtSize: shirtSize.trim(),
      pantsSize: pantsSize.trim(),
      shoeSize: shoeSize.trim(),
      services: services.map((service, index) => ({
        id: `${Date.now()}-${index}`,
        name: service.serviceName,
        notes: service.notes.trim(),
        serviceDate: service.serviceDate.trim(),
      })),
    });

    Alert.alert('Cadastro salvo', 'Cliente cadastrado com sucesso.');
    navigation.navigate('Home');
  };

  const detailImages = useMemo(() => {
    return detailImagesByTab[activeMatchTab] ?? [];
  }, [activeMatchTab]);
  const styleScores = useMemo(() => {
    if (route.params?.styleScores && route.params.styleScores.length > 0) {
      return route.params.styleScores;
    }

    return defaultStyleScores;
  }, [route.params?.styleScores]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.matchTop}>
          <Image source={{ uri: avatarAsset }} style={styles.matchAvatar} />

          <Text style={styles.matchGroupTitle}>Prioridades</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.matchChipsRow}>
            {selectedPriorities.map((item, index) => (
              <View key={`priority-${item}-${index}`} style={styles.matchChip}>
                <Text style={styles.matchChipText}>{item}</Text>
              </View>
            ))}
          </ScrollView>

          <Text style={styles.matchGroupTitle}>Objetivos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.matchChipsRow}>
            {selectedObjectives.map((item, index) => (
              <View key={`objective-${item}-${index}`} style={styles.matchChip}>
                <Text style={styles.matchChipText}>{item}</Text>
              </View>
            ))}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
            {matchTabs.map((tab) => {
              const isActive = tab.id === activeMatchTab;
              return (
                <Pressable
                  key={tab.id}
                  style={[styles.tab, isActive && styles.tabActive]}
                  onPress={() => setActiveMatchTab(tab.id)}
                >
                  <Text style={styles.tabText}>{tab.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.styleSummaryHeader}>
            <Text style={styles.styleSummaryText}>
              Gabriela Santos é predominantemente{'\n'}
              <Text style={styles.styleSummaryStrong}>Clássica</Text>
            </Text>
            <Pressable onPress={() => setShowDetails((prev) => !prev)}>
              <Text style={styles.detailsLink}>Ver Detalhes</Text>
            </Pressable>
          </View>

          <View style={styles.barsWrap}>
            {styleScores.map((score) => (
              <View key={score.label} style={styles.barRow}>
                <Text style={styles.barLabel}>{score.label}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${score.value}%` }]} />
                </View>
                <Text style={styles.barPercent}>{score.value}%</Text>
              </View>
            ))}
          </View>

          {showDetails && (
            <View style={styles.detailsWrap}>
              {detailImages.map((uri) => (
                <Image key={uri} source={{ uri }} style={styles.detailImage} />
              ))}
            </View>
          )}

        </View>

        <Text style={styles.sectionTitle}>Perfil da Cliente</Text>

        <FloatingLabelInput
          label="Estilo"
          value={style}
          onChangeText={setStyle}
          containerStyle={styles.inputWrap}
          inputStyle={styles.input}
        />

        <FloatingLabelInput
          label="Paleta"
          value={palette}
          onChangeText={setPalette}
          containerStyle={styles.inputWrap}
          inputStyle={styles.input}
        />

        <Text style={styles.sectionTitle}>Tamanho e Medidas</Text>

        <FloatingLabelInput
          label="Numeração de Camisa"
          value={shirtSize}
          onChangeText={setShirtSize}
          containerStyle={styles.inputWrap}
          inputStyle={styles.input}
        />

        <FloatingLabelInput
          label="Numeração de Calça"
          value={pantsSize}
          onChangeText={setPantsSize}
          containerStyle={styles.inputWrap}
          inputStyle={styles.input}
        />

        <FloatingLabelInput
          label="Numeração de Calçado"
          value={shoeSize}
          onChangeText={setShoeSize}
          containerStyle={styles.inputWrap}
          inputStyle={styles.input}
        />

        <View style={styles.servicesHeader}>
          <Text style={styles.sectionTitle}>Serviços contratados</Text>
          <Pressable style={styles.addServiceButton} onPress={() => setServiceModalOpen(true)}>
            <Text style={styles.addServiceButtonText}>Adicionar serviço</Text>
          </Pressable>
        </View>

        {services.length > 0 ? (
          <View style={styles.servicesList}>
            {services.map((service, index) => (
              <View key={`${service.serviceName}-${index}`} style={styles.serviceItem}>
                <View>
                  <Text style={styles.serviceName}>{service.serviceName}</Text>
                  <Text style={styles.serviceMeta}>Data: {service.serviceDate}</Text>
                </View>
                <SimpleLineIcons name="check" size={16} color="#111" />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyServices}>
            <Text style={styles.emptyServicesText}>Nenhum serviço adicionado.</Text>
          </View>
        )}

        <Pressable style={styles.primaryButton} onPress={saveClient}>
          <Text style={styles.primaryButtonText}>Cadastrar cliente</Text>
        </Pressable>
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
        visible={serviceModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setServiceModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setServiceModalOpen(false)} />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Adicionar serviço</Text>

            <View style={styles.optionList}>
              {serviceOptions.map((option) => {
                const selected = draftService.serviceName === option;
                return (
                  <Pressable
                    key={option}
                    style={[styles.optionItem, selected && styles.optionItemSelected]}
                    onPress={() => setDraftService((current) => ({ ...current, serviceName: option }))}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </Pressable>
                );
              })}
            </View>

            <FloatingLabelInput
              label="Observações Gerais"
              value={draftService.notes}
              onChangeText={(text) => setDraftService((current) => ({ ...current, notes: text }))}
              containerStyle={[styles.inputWrap, styles.modalInputWrap, styles.notesWrap]}
              inputStyle={styles.modalInput}
              multiline
            />

            <FloatingLabelInput
              label="Data do serviço"
              value={draftService.serviceDate}
              onChangeText={(text) =>
                setDraftService((current) => ({ ...current, serviceDate: formatDate(text) }))
              }
              containerStyle={[styles.inputWrap, styles.modalInputWrap]}
              inputStyle={styles.modalInput}
              keyboardType="numeric"
            />

            <Pressable style={styles.primaryButton} onPress={saveService}>
              <Text style={styles.primaryButtonText}>Salvar serviço</Text>
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
    backgroundColor: '#F3F3F3',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 90,
    gap: 14,
  },
  matchTop: {
    gap: 10,
    marginBottom: 6,
  },
  matchAvatar: {
    width: 160,
    height: 150,
    borderRadius: 80,
    alignSelf: 'center',
    marginBottom: 4,
  },
  matchGroupTitle: {
    fontSize: 12,
    color: '#111',
    fontFamily: FONTS.bold,
  },
  matchChipsRow: {
    gap: 8,
    paddingBottom: 2,
  },
  matchChip: {
    minWidth: 72,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#D2AF8E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  matchChipText: {
    fontSize: 10,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  tabsRow: {
    gap: 8,
    marginTop: 4,
  },
  tab: {
    height: 30,
    borderRadius: 16,
    backgroundColor: '#ece9e3',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#D2AF8E',
  },
  tabText: {
    fontSize: 10,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  styleSummaryHeader: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  styleSummaryText: {
    flex: 1,
    fontSize: 10,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  styleSummaryStrong: {
    fontFamily: FONTS.bold,
  },
  detailsLink: {
    color: '#6E4025',
    fontSize: 10,
    fontFamily: FONTS.regular,
    marginLeft: 10,
  },
  barsWrap: {
    gap: 7,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barLabel: {
    width: 56,
    fontSize: 10,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#D2AF8E',
  },
  barPercent: {
    width: 30,
    textAlign: 'right',
    fontSize: 10,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  detailsWrap: {
    gap: 8,
    marginTop: 4,
  },
  detailImage: {
    width: '100%',
    height: 140,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#111',
    fontFamily: FONTS.bold,
  },
  inputWrap: {
    height: 45,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  input: {
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111',
  },
  servicesHeader: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addServiceButton: {
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCC',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addServiceButtonText: {
    fontSize: 11,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  servicesList: {
    gap: 8,
  },
  serviceItem: {
    minHeight: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceName: {
    fontSize: 12,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  serviceMeta: {
    fontSize: 10,
    color: '#666',
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  emptyServices: {
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyServicesText: {
    fontSize: 11,
    color: '#666',
    fontFamily: FONTS.regular,
  },
  primaryButton: {
    height: 45,
    borderRadius: 5,
    backgroundColor: '#D2AF8E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#fff',
    padding: 16,
    gap: 12,
  },
  modalTitle: {
    textAlign: 'center',
    color: '#111',
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  optionList: {
    gap: 8,
  },
  optionItem: {
    minHeight: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  optionItemSelected: {
    backgroundColor: '#F1E4D6',
    borderColor: '#D2AF8E',
  },
  optionText: {
    fontSize: 12,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  modalInputWrap: {
    backgroundColor: '#fff',
  },
  modalInput: {
    paddingHorizontal: 12,
    color: '#111',
    fontSize: 14,
  },
  notesWrap: {
    minHeight: 80,
    height: 80,
  },
});

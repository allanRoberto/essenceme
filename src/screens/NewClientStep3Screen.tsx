import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AppText as Text } from '../components/AppTypography';
import { AppStackParamList } from '../navigation/types';
import { FONTS } from '../theme/fonts';

const imgLooks = 'https://www.figma.com/api/mcp/asset/7272670a-9471-4577-b882-a8918deec2a5';

type Props = NativeStackScreenProps<AppStackParamList, 'NewClientStep3'>;

type Step3Phase = 'intro' | 'vote' | 'review' | 'results';
type VoteValue = 'like' | 'dislike' | null;
type ResultItem = {
  categoryId: string;
  itemIndex: number;
  imageUri: string;
  vote: VoteValue;
};
type DynamicStyleScore = {
  label: string;
  value: number;
};

type StyleCategory = {
  id: string;
  label: string;
  items: string[];
};

const styleCategories: StyleCategory[] = [
  {
    id: 'pecas_unicas',
    label: 'Peças únicas',
    items: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1467632499275-7a693a761056?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?auto=format&fit=crop&w=1000&q=80',
    ],
  },
  {
    id: 'pecas_cima',
    label: 'Peças de cima',
    items: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
    ],
  },
  {
    id: 'pecas_baixo',
    label: 'Peças de baixo',
    items: [
      'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551854838-212c6aa299d1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1467632499275-7a693a761056?auto=format&fit=crop&w=1000&q=80',
    ],
  },
  {
    id: 'calcados',
    label: 'Calçados',
    items: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1000&q=80',
    ],
  },
];

const initialVotes: Record<string, VoteValue[]> = styleCategories.reduce(
  (acc, category) => ({ ...acc, [category.id]: new Array(category.items.length).fill(null) }),
  {} as Record<string, VoteValue[]>,
);

const styleLabels = [
  'Clássico',
  'Romântico',
  'Magnético',
  'Esportivo',
  'Criativo',
  'Elegante',
  'Moderno',
];

const MATCH_DRAFT_STORAGE_KEY = 'new-client-step3-match-draft';

type Step3Draft = {
  phase: Step3Phase;
  categoryIndex: number;
  itemIndex: number;
  votesByCategory: Record<string, VoteValue[]>;
  activeResultCategory: string;
};

function toLikeCount(votes: VoteValue[] | undefined) {
  return (votes ?? []).filter((vote) => vote === 'like').length;
}

function toDynamicScores(votesByCategory: Record<string, VoteValue[]>): DynamicStyleScore[] {
  const likesUnicas = toLikeCount(votesByCategory.pecas_unicas);
  const likesCima = toLikeCount(votesByCategory.pecas_cima);
  const likesBaixo = toLikeCount(votesByCategory.pecas_baixo);
  const likesCalcados = toLikeCount(votesByCategory.calcados);

  const raw = [
    likesUnicas * 2 + likesCima,
    likesUnicas + likesBaixo,
    likesBaixo * 2 + likesCalcados,
    likesCalcados * 2 + likesBaixo,
    likesCalcados + likesCima,
    likesUnicas + likesCima * 2,
    likesCima + likesCalcados,
  ];

  const total = raw.reduce((sum, value) => sum + value, 0);
  if (total === 0) {
    return styleLabels.map((label) => ({ label, value: 0 }));
  }

  const percentages = raw.map((value) => Math.round((value / total) * 100));
  const diff = 100 - percentages.reduce((sum, value) => sum + value, 0);
  percentages[0] = Math.max(0, percentages[0] + diff);

  return styleLabels.map((label, index) => ({
    label,
    value: percentages[index],
  }));
}

export function NewClientStep3Screen({ navigation, route }: Props) {
  const selectedPriorities = route.params?.selectedPriorities ?? ['Elegância', 'Conforto'];
  const selectedObjectives = route.params?.selectedObjectives ?? ['Credibilidade', 'Confiança'];
  const [phase, setPhase] = useState<Step3Phase>('intro');
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [votesByCategory, setVotesByCategory] = useState<Record<string, VoteValue[]>>(initialVotes);
  const [activeResultCategory, setActiveResultCategory] = useState('geral');

  const [isReviewEditorOpen, setIsReviewEditorOpen] = useState(false);
  const [reviewEditorIndex, setReviewEditorIndex] = useState(0);
  const [resultEditorItem, setResultEditorItem] = useState<ResultItem | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const swipeTranslateX = useRef(new Animated.Value(0)).current;

  const currentCategory = styleCategories[categoryIndex];
  const currentItem = currentCategory.items[itemIndex];

  const categoryTabs = useMemo(
    () => [{ id: 'geral', label: 'Geral' }, ...styleCategories.map(({ id, label }) => ({ id, label }))],
    [],
  );

  const reviewVotes = votesByCategory[currentCategory.id] ?? [];

  const resultItems = useMemo(() => {
    if (activeResultCategory === 'geral') {
      return styleCategories.flatMap((category) => {
        const categoryVotes = votesByCategory[category.id] ?? [];
        return category.items.map((imageUri, index) => ({
          categoryId: category.id,
          itemIndex: index,
          imageUri,
          vote: categoryVotes[index] ?? null,
        }));
      });
    }

    const activeCategory = styleCategories.find((category) => category.id === activeResultCategory);
    if (!activeCategory) {
      return [];
    }

    const categoryVotes = votesByCategory[activeCategory.id] ?? [];
    return activeCategory.items.map((imageUri, index) => ({
      categoryId: activeCategory.id,
      itemIndex: index,
      imageUri,
      vote: categoryVotes[index] ?? null,
    }));
  }, [activeResultCategory, votesByCategory]);

  const cardRotation = swipeTranslateX.interpolate({
    inputRange: [-380, 0, 380],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const cardOpacity = swipeTranslateX.interpolate({
    inputRange: [-380, 0, 380],
    outputRange: [0.2, 1, 0.2],
  });

  useEffect(() => {
    let isMounted = true;

    const restoreDraft = async () => {
      try {
        const rawDraft = await AsyncStorage.getItem(MATCH_DRAFT_STORAGE_KEY);
        if (!rawDraft || !isMounted) {
          return;
        }

        const parsedDraft = JSON.parse(rawDraft) as Partial<Step3Draft>;

        const safePhase: Step3Phase =
          parsedDraft.phase === 'intro' ||
          parsedDraft.phase === 'vote' ||
          parsedDraft.phase === 'review' ||
          parsedDraft.phase === 'results'
            ? parsedDraft.phase
            : 'vote';

        const safeCategoryIndex =
          typeof parsedDraft.categoryIndex === 'number' &&
          parsedDraft.categoryIndex >= 0 &&
          parsedDraft.categoryIndex < styleCategories.length
            ? parsedDraft.categoryIndex
            : 0;

        const maxItemIndex = styleCategories[safeCategoryIndex].items.length - 1;
        const safeItemIndex =
          typeof parsedDraft.itemIndex === 'number' &&
          parsedDraft.itemIndex >= 0 &&
          parsedDraft.itemIndex <= maxItemIndex
            ? parsedDraft.itemIndex
            : 0;

        const safeVotesByCategory = styleCategories.reduce(
          (acc, category) => {
            const incomingVotes = parsedDraft.votesByCategory?.[category.id];
            acc[category.id] = category.items.map((_, index) => {
              const value = incomingVotes?.[index];
              return value === 'like' || value === 'dislike' ? value : null;
            });
            return acc;
          },
          {} as Record<string, VoteValue[]>,
        );

        const validCategoryIds = new Set(['geral', ...styleCategories.map((category) => category.id)]);
        const safeActiveResultCategory =
          typeof parsedDraft.activeResultCategory === 'string' &&
          validCategoryIds.has(parsedDraft.activeResultCategory)
            ? parsedDraft.activeResultCategory
            : 'geral';

        setPhase(safePhase);
        setCategoryIndex(safeCategoryIndex);
        setItemIndex(safeItemIndex);
        setVotesByCategory(safeVotesByCategory);
        setActiveResultCategory(safeActiveResultCategory);
      } catch (error) {
        console.warn('Erro ao restaurar rascunho de match:', error);
      }
    };

    void restoreDraft();

    return () => {
      isMounted = false;
    };
  }, []);

  async function persistDraft() {
    const draft: Step3Draft = {
      phase,
      categoryIndex,
      itemIndex,
      votesByCategory,
      activeResultCategory,
    };

    try {
      await AsyncStorage.setItem(MATCH_DRAFT_STORAGE_KEY, JSON.stringify(draft));
      Alert.alert('Rascunho salvo', 'Você pode continuar o match de roupas mais tarde.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o progresso agora.');
      console.warn('Erro ao salvar rascunho de match:', error);
    }
  }

  async function clearDraft() {
    try {
      await AsyncStorage.removeItem(MATCH_DRAFT_STORAGE_KEY);
    } catch (error) {
      console.warn('Erro ao limpar rascunho de match:', error);
    }
  }

  function applyVote(vote: Exclude<VoteValue, null>) {
    setVotesByCategory((prev) => {
      const categoryVotes = [...(prev[currentCategory.id] ?? [])];
      categoryVotes[itemIndex] = vote;

      return {
        ...prev,
        [currentCategory.id]: categoryVotes,
      };
    });

    if (itemIndex < currentCategory.items.length - 1) {
      setItemIndex((prev) => prev + 1);
      return;
    }

    setPhase('review');
  }

  function handleVote(vote: Exclude<VoteValue, null>) {
    if (isVoting) {
      return;
    }

    setIsVoting(true);
    Animated.timing(swipeTranslateX, {
      toValue: vote === 'like' ? 380 : -380,
      duration: 240,
      useNativeDriver: true,
    }).start(() => {
      swipeTranslateX.setValue(0);
      setIsVoting(false);
      applyVote(vote);
    });
  }

  function handleBackFromVote() {
    if (itemIndex > 0) {
      setItemIndex((prev) => prev - 1);
      return;
    }

    if (categoryIndex > 0) {
      setCategoryIndex((prev) => prev - 1);
      setPhase('review');
      return;
    }

    setPhase('intro');
  }

  function goToNextCategoryOrResults() {
    if (categoryIndex < styleCategories.length - 1) {
      setCategoryIndex((prev) => prev + 1);
      setItemIndex(0);
      setPhase('vote');
      return;
    }

    setActiveResultCategory('geral');
    setPhase('results');
  }

  function handleBackFromResults() {
    setCategoryIndex(styleCategories.length - 1);
    setPhase('review');
  }

  function openReviewEditor(index: number) {
    setReviewEditorIndex(index);
    setIsReviewEditorOpen(true);
  }

  function updateReviewVote(vote: Exclude<VoteValue, null>) {
    setVotesByCategory((prev) => {
      const categoryVotes = [...(prev[currentCategory.id] ?? [])];
      categoryVotes[reviewEditorIndex] = vote;
      return {
        ...prev,
        [currentCategory.id]: categoryVotes,
      };
    });
    setIsReviewEditorOpen(false);
  }

  function openResultEditor(item: ResultItem) {
    setResultEditorItem(item);
  }

  function updateResultVote(vote: Exclude<VoteValue, null>) {
    if (!resultEditorItem) {
      return;
    }

    setVotesByCategory((prev) => {
      const categoryVotes = [...(prev[resultEditorItem.categoryId] ?? [])];
      categoryVotes[resultEditorItem.itemIndex] = vote;
      return {
        ...prev,
        [resultEditorItem.categoryId]: categoryVotes,
      };
    });
    setResultEditorItem(null);
  }

  return (
    <SafeAreaView style={styles.container}>
      {phase === 'intro' && (
        <View style={styles.introContent}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>

          <Image source={{ uri: imgLooks }} style={styles.introImage} />

          <Text style={styles.introTitle}>Match de Roupas</Text>
          <Text style={styles.introSubtitle}>
            Escolha as peças que melhor refletem seu estilo e personalidade
          </Text>

          <Pressable style={styles.primaryButton} onPress={() => setPhase('vote')}>
            <Text style={styles.primaryButtonText}>Próximo</Text>
          </Pressable>
        </View>
      )}

      {phase === 'vote' && (
        <View style={styles.matchContent}>
          <View style={styles.headerRow}>
            <Pressable style={styles.backButtonCompact} onPress={handleBackFromVote}>
              <Text style={styles.backButtonText}>Voltar</Text>
            </Pressable>
            <Text style={styles.categoryLabel}>{currentCategory.label}</Text>
            <View style={styles.headerSpacer} />
          </View>

          <Animated.View
            style={[
              styles.matchCard,
              { transform: [{ translateX: swipeTranslateX }, { rotate: cardRotation }], opacity: cardOpacity },
            ]}
          >
            <Image source={{ uri: currentItem }} style={styles.matchImage} />
          </Animated.View>

          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.dislikeButton, isVoting && styles.actionDisabled]}
              onPress={() => handleVote('dislike')}
              disabled={isVoting}
            >
              <SimpleLineIcons name="dislike" size={24} color="black" />
            </Pressable>

            <Pressable
              style={[styles.likeButton, isVoting && styles.actionDisabled]}
              onPress={() => handleVote('like')}
              disabled={isVoting}
            >
              <FontAwesome5 name="heart" size={24} color="black" />
            </Pressable>
          </View>

          <Pressable style={styles.saveLaterButton} onPress={() => void persistDraft()}>
            <Text style={styles.saveLaterButtonText}>Salvar e continuar mais tarde</Text>
          </Pressable>
        </View>
      )}

      {phase === 'review' && (
        <View style={styles.resultsWrapper}>
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backButtonCompact}
              onPress={() => {
                setItemIndex(currentCategory.items.length - 1);
                setPhase('vote');
              }}
            >
              <Text style={styles.backButtonText}>Voltar</Text>
            </Pressable>
            <Text style={styles.reviewTitle}>Revisão: {currentCategory.label}</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {currentCategory.items.map((imageUri, index) => (
                <Pressable
                  key={`${currentCategory.id}-${index}`}
                  style={styles.gridCard}
                  onPress={() => openReviewEditor(index)}
                >
                  <Image source={{ uri: imageUri }} style={styles.gridImage} />
                  <View style={styles.reviewVoteBadge}>
                    {reviewVotes[index] === 'like' ? (
                      <FontAwesome5 name="heart" size={14} color="black" />
                    ) : (
                      <SimpleLineIcons name="dislike" size={14} color="black" />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Pressable style={styles.primaryButton} onPress={goToNextCategoryOrResults}>
            <Text style={styles.primaryButtonText}>
              {categoryIndex < styleCategories.length - 1 ? 'Próxima categoria' : 'Ver resultado'}
            </Text>
          </Pressable>
        </View>
      )}

      {phase === 'results' && (
        <View style={styles.resultsWrapper}>
          <View style={styles.headerRow}>
            <Pressable style={styles.backButtonCompact} onPress={handleBackFromResults}>
              <Text style={styles.backButtonText}>Voltar</Text>
            </Pressable>
            <Text style={styles.resultTitle}>Peças Únicas escolhidas</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {categoryTabs.map((tab) => {
              const isActive = activeResultCategory === tab.id;

              return (
                <Pressable
                  key={tab.id}
                  style={[styles.tab, isActive && styles.tabActive]}
                  onPress={() => setActiveResultCategory(tab.id)}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {resultItems.length > 0 ? (
            <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.grid}>
                {resultItems.map((item) => (
                  <Pressable
                    key={`${item.categoryId}-${item.itemIndex}`}
                    style={styles.gridCard}
                    onPress={() => openResultEditor(item)}
                  >
                    <Image source={{ uri: item.imageUri }} style={styles.gridImage} />
                    <View style={styles.reviewVoteBadge}>
                      {item.vote === 'like' ? (
                        <FontAwesome5 name="heart" size={14} color="black" />
                      ) : (
                        <SimpleLineIcons name="dislike" size={14} color="black" />
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhuma peça disponível nesta categoria.</Text>
            </View>
          )}

          <Pressable
            style={styles.primaryButton}
            onPress={async () => {
              await clearDraft();
              navigation.replace('NewClientFinalize', {
                selectedPriorities,
                selectedObjectives,
                styleScores: toDynamicScores(votesByCategory),
              });
            }}
          >
            <Text style={styles.primaryButtonText}>Próximo</Text>
          </Pressable>
        </View>
      )}

      <Modal
        visible={resultEditorItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setResultEditorItem(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setResultEditorItem(null)}>
          <Pressable style={styles.reviewModalCard} onPress={(event) => event.stopPropagation()}>
            <Image source={{ uri: resultEditorItem?.imageUri ?? '' }} style={styles.reviewModalImage} />

            <View style={styles.reviewModalActions}>
              <Pressable
                style={[
                  styles.reviewVoteButton,
                  styles.reviewVoteButtonMuted,
                  resultEditorItem?.vote === 'dislike' && styles.reviewVoteButtonSelected,
                ]}
                onPress={() => updateResultVote('dislike')}
              >
                <SimpleLineIcons name="dislike" size={24} color="black" />
              </Pressable>

              <Pressable
                style={[
                  styles.reviewVoteButton,
                  styles.reviewVoteButtonLike,
                  resultEditorItem?.vote === 'like' && styles.reviewVoteButtonSelected,
                ]}
                onPress={() => updateResultVote('like')}
              >
                <FontAwesome5 name="heart" size={24} color="black" />
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={isReviewEditorOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsReviewEditorOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setIsReviewEditorOpen(false)}>
          <Pressable style={styles.reviewModalCard} onPress={(event) => event.stopPropagation()}>
            <Image
              source={{ uri: currentCategory.items[reviewEditorIndex] ?? '' }}
              style={styles.reviewModalImage}
            />

            <View style={styles.reviewModalActions}>
              <Pressable
                style={[
                  styles.reviewVoteButton,
                  styles.reviewVoteButtonMuted,
                  reviewVotes[reviewEditorIndex] === 'dislike' && styles.reviewVoteButtonSelected,
                ]}
                onPress={() => updateReviewVote('dislike')}
              >
                <SimpleLineIcons name="dislike" size={24} color="black" />
              </Pressable>

              <Pressable
                style={[
                  styles.reviewVoteButton,
                  styles.reviewVoteButtonLike,
                  reviewVotes[reviewEditorIndex] === 'like' && styles.reviewVoteButtonSelected,
                ]}
                onPress={() => updateReviewVote('like')}
              >
                <FontAwesome5 name="heart" size={24} color="black" />
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  introContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 22,
    backgroundColor: '#fff',
  },
  introImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 18,
  },
  introTitle: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: '#111',
    marginBottom: 8,
  },
  introSubtitle: {
    fontSize: 15,
    color: '#111',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    width: '90%',
  },
  matchContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  resultsWrapper: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  headerRow: {
    width: '100%',
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  headerSpacer: {
    width: 70,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#ece9e3',
  },
  backButtonCompact: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#ece9e3',
    minWidth: 70,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 13,
    color: '#111',
    fontFamily: FONTS.semibold,
  },
  categoryLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#151515',
  },
  reviewTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#111',
  },
  resultTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#111',
  },
  matchImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  matchCard: {
    width: '100%',
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 14,
  },
  actionsRow: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dislikeButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#ece9e3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#a77a50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionDisabled: {
    opacity: 0.6,
  },
  saveLaterButton: {
    marginTop: 4,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveLaterButtonText: {
    fontSize: 12,
    color: '#6E4025',
    fontFamily: FONTS.regular,
    textDecorationLine: 'underline',
  },
  tabsContainer: {
    paddingBottom: 14,
    gap: 10,
    alignItems: 'center',
  },
  tab: {
    height: 36,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#ebe5dd',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  tabActive: {
    backgroundColor: '#d2af8e',
  },
  tabText: {
    fontSize: 13,
    color: '#222',
    fontFamily: FONTS.medium,
  },
  tabTextActive: {
    fontFamily: FONTS.bold,
  },
  gridContainer: {
    paddingBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  gridCard: {
    width: '31.8%',
    aspectRatio: 0.68,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  reviewVoteBadge: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#494949',
  },
  primaryButton: {
    width: '100%',
    height: 45,
    borderRadius: 5,
    backgroundColor: '#D2AF8E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 13,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#dfd6c6',
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 12,
    alignItems: 'center',
    position: 'relative',
  },
  modalTitle: {
    fontSize: 36,
    fontFamily: FONTS.bold,
    color: '#111',
    marginBottom: 14,
  },
  modalImage: {
    width: '100%',
    height: 620,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  modalArrowLeft: {
    position: 'absolute',
    left: 12,
    top: '56%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  modalArrowRight: {
    position: 'absolute',
    right: 12,
    top: '56%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  modalArrowText: {
    fontSize: 34,
    color: '#111',
    lineHeight: 34,
  },
  reviewModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  reviewModalImage: {
    width: '100%',
    height: 520,
    borderRadius: 12,
  },
  reviewModalActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  reviewVoteButton: {
    width: '48%',
    height: 45,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  reviewVoteButtonMuted: {
    backgroundColor: '#ece9e3',
  },
  reviewVoteButtonLike: {
    backgroundColor: '#a77a50',
  },
  reviewVoteButtonSelected: {
    borderColor: '#6E4025',
    borderWidth: 2,
  },
  bottomBar: {
    height: 59,
    borderTopWidth: 1,
    borderTopColor: '#ececec',
    backgroundColor: '#fff',
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

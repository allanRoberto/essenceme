import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLayoutEffect, useMemo, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { AppText as Text, AppTextInput } from '../components/AppTypography';
import { AppStackParamList } from '../navigation/types';
import { FONTS } from '../theme/fonts';

type Props = NativeStackScreenProps<AppStackParamList, 'ClientSearch'>;

type ClientSearchItem = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  hasClothingMatch: boolean;
  servicesCount: number;
  avatarUri: string;
};

const mockClients: ClientSearchItem[] = [
  {
    id: 'c1',
    firstName: 'Barbara',
    lastName: 'Soares',
    name: 'Barbara Soares',
    email: 'barbara.soares@gmail.com',
    phone: '(11) 99876-1122',
    hasClothingMatch: true,
    servicesCount: 2,
    avatarUri: 'https://i.pravatar.cc/160?img=47',
  },
  {
    id: 'c2',
    firstName: 'Amanda',
    lastName: 'Pires',
    name: 'Amanda Pires',
    email: 'amanda.pires@gmail.com',
    phone: '(11) 99700-4500',
    hasClothingMatch: false,
    servicesCount: 1,
    avatarUri: 'https://i.pravatar.cc/160?img=5',
  },
  {
    id: 'c3',
    firstName: 'Marina',
    lastName: 'Lopes',
    name: 'Marina Lopes',
    email: 'marina.lopes@gmail.com',
    phone: '(11) 99610-7732',
    hasClothingMatch: true,
    servicesCount: 3,
    avatarUri: 'https://i.pravatar.cc/160?img=32',
  },
  {
    id: 'c4',
    firstName: 'Fernanda',
    lastName: 'Costa',
    name: 'Fernanda Costa',
    email: 'fernanda.costa@gmail.com',
    phone: '(11) 99511-8842',
    hasClothingMatch: false,
    servicesCount: 1,
    avatarUri: 'https://i.pravatar.cc/160?img=26',
  },
  {
    id: 'c5',
    firstName: 'Juliana',
    lastName: 'Alves',
    name: 'Juliana Alves',
    email: 'juliana.alves@gmail.com',
    phone: '(11) 99402-6641',
    hasClothingMatch: true,
    servicesCount: 2,
    avatarUri: 'https://i.pravatar.cc/160?img=15',
  },
  {
    id: 'c6',
    firstName: 'Camila',
    lastName: 'Rocha',
    name: 'Camila Rocha',
    email: 'camila.rocha@gmail.com',
    phone: '(11) 99388-2001',
    hasClothingMatch: false,
    servicesCount: 4,
    avatarUri: 'https://i.pravatar.cc/160?img=44',
  },
  {
    id: 'c7',
    firstName: 'Beatriz',
    lastName: 'Souza',
    name: 'Beatriz Souza',
    email: 'beatriz.souza@gmail.com',
    phone: '(11) 99223-5521',
    hasClothingMatch: true,
    servicesCount: 1,
    avatarUri: 'https://i.pravatar.cc/160?img=29',
  },
  {
    id: 'c8',
    firstName: 'Ana Paula',
    lastName: 'Mendes',
    name: 'Ana Paula Mendes',
    email: 'ana.mendes@gmail.com',
    phone: '(11) 99145-7710',
    hasClothingMatch: false,
    servicesCount: 2,
    avatarUri: 'https://i.pravatar.cc/160?img=10',
  },
];

export function ClientSearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Pesquisar',
      headerBackVisible: false,
      headerRight: () => (
        <Pressable style={styles.headerCloseButton} onPress={() => navigation.goBack()}>
          <Text style={styles.headerCloseText}>Fechar</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  const filteredClients = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return mockClients;
    }

    return mockClients.filter((client) => client.name.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchInputWrap}>
        <Ionicons name="search-outline" size={24} color="black" />
        <AppTextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Digite o nome da cliente"
          placeholderTextColor="#999"
          autoCapitalize="words"
          style={styles.searchInput}
        />
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Pressable
              key={client.id}
              style={styles.clientItem}
              onPress={() =>
                navigation.replace('ClientProfile', {
                  clientName: client.name,
                  firstName: client.firstName,
                  lastName: client.lastName,
                  email: client.email,
                  phone: client.phone,
                  hasClothingMatch: client.hasClothingMatch,
                })
              }
            >
              <Image source={{ uri: client.avatarUri }} style={styles.clientAvatar} />
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientServices}>
                  {client.servicesCount} {client.servicesCount === 1 ? 'serviço' : 'serviços'}
                </Text>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>Nenhuma cliente encontrada.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  headerCloseButton: {
    paddingHorizontal: 8,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCloseText: {
    fontSize: 12,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  searchInputWrap: {
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d8d8d8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 14,
    marginBottom: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#111',
    fontSize: 14,
    paddingVertical: 0,
  },
  listContent: {
    paddingTop: 6,
    paddingHorizontal: 4,
    gap: 8,
    paddingBottom: 10,
  },
  clientItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    color: '#111',
    fontFamily: FONTS.regular,
  },
  clientServices: {
    marginTop: 2,
    fontSize: 12,
    color: '#666',
    fontFamily: FONTS.regular,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 13,
    color: '#666',
    fontFamily: FONTS.regular,
  },
});

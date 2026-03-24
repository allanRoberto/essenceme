import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { AppText as Text } from '../components/AppTypography';
import { AppStackParamList } from '../navigation/types';
import { FONTS } from '../theme/fonts';

type Props = NativeStackScreenProps<AppStackParamList, 'NewClientAvatarSelection'>;

const avatarOptions = [
  'https://www.figma.com/api/mcp/asset/e3b9a1d4-74d9-47e9-ab5b-a2867e6dfa7b',
  'https://www.figma.com/api/mcp/asset/9e1baecf-5e26-4b82-ba6d-8905183de066',
  'https://www.figma.com/api/mcp/asset/af250ee4-eddc-4e1e-86e9-00b856018030',
  'https://www.figma.com/api/mcp/asset/3cdbba00-2c76-43c2-866d-ccdac42bf31b',
  'https://www.figma.com/api/mcp/asset/1087a19b-3ea2-45e9-acd8-64331ea1952a',
  'https://www.figma.com/api/mcp/asset/ae5e194e-020c-40a2-99a1-ba8968c8a5ba',
  'https://www.figma.com/api/mcp/asset/4c26ef0a-f449-4509-b151-8a404391c768',
  'https://www.figma.com/api/mcp/asset/d37bc375-d02a-48c2-b23b-f6b02359cac6',
  'https://www.figma.com/api/mcp/asset/c0fdf352-f973-4155-a991-3d5e906dadad',
  'https://www.figma.com/api/mcp/asset/1c2ceb09-b5ce-4b6b-93ac-4c56c60894cf',
];

export function NewClientAvatarSelectionScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Escolha um avatar</Text>

        <View style={styles.grid}>
          {avatarOptions.map((avatarUri) => (
            <Pressable
              key={avatarUri}
              style={styles.avatarItem}
              onPress={() => navigation.replace('NewClient', { avatarUri })}
            >
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3F3',
  },
  content: {
    paddingTop: 28,
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  title: {
    textAlign: 'center',
    color: '#6E4025',
    fontSize: 15,
    fontFamily: FONTS.regular,
    marginBottom: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 24,
  },
  avatarItem: {
    width: '48%',
    alignItems: 'center',
  },
  avatarImage: {
    width: 166,
    height: 155,
    borderRadius: 83,
    resizeMode: 'cover',
  },
});

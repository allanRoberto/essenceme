import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

import { RootNavigator } from './src/navigation/RootNavigator';
import { FONTS } from './src/theme/fonts';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          [FONTS.regular]: {
            uri: 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf',
          },
          [FONTS.medium]: {
            uri: 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Medium.ttf',
          },
          [FONTS.semibold]: {
            uri: 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-SemiBold.ttf',
          },
          [FONTS.bold]: {
            uri: 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf',
          },
          [FONTS.extrabold]: {
            uri: 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-ExtraBold.ttf',
          },
        });
      } catch (error) {
        console.warn('Erro ao carregar fontes Poppins:', error);
      } finally {
        if (isMounted) {
          setFontsLoaded(true);
        }
      }
    };

    loadFonts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <RootNavigator />
    </NavigationContainer>
  );
}

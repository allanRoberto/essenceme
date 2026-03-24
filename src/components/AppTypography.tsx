import { Text as RNText, TextInput as RNTextInput, TextInputProps, TextProps } from 'react-native';

import { FONTS } from '../theme/fonts';

export function AppText({ style, ...props }: TextProps) {
  return <RNText {...props} style={[{ fontFamily: FONTS.regular }, style]} />;
}

export function AppTextInput({ style, ...props }: TextInputProps) {
  return <RNTextInput {...props} style={[{ fontFamily: FONTS.regular }, style]} />;
}

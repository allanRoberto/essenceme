import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { AppTextInput } from './AppTypography';
import { FONTS } from '../theme/fonts';

type Props = TextInputProps & {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelBackgroundColor?: string;
  rightAdornment?: React.ReactNode;
};

const AnimatedText = Animated.createAnimatedComponent(Animated.Text);

export function FloatingLabelInput({
  label,
  value,
  onFocus,
  onBlur,
  containerStyle,
  inputStyle,
  labelBackgroundColor = '#f3f3f3',
  rightAdornment,
  ...props
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = typeof value === 'string' && value.length > 0;
  const progress = useRef(new Animated.Value(hasValue ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: isFocused || hasValue ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [hasValue, isFocused, progress]);

  const labelStyle = {
    top: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [12, -11],
    }),
    fontSize: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 12],
    }),
    color: progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['#777777', '#6E4025'],
    }),
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <AnimatedText
        pointerEvents="none"
        style={[styles.label, { backgroundColor: labelBackgroundColor }, labelStyle]}
      >
        {label}
      </AnimatedText>

      <AppTextInput
        {...props}
        value={value}
        style={[styles.input, inputStyle]}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
      />

      {rightAdornment}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 45,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 10,
    paddingHorizontal: 4,
    zIndex: 1,
    fontFamily: FONTS.regular,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    color: '#111',
    fontSize: 14,
  },
});

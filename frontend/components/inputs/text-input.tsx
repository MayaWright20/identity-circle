import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Octicons from '@expo/vector-icons/Octicons';

import { COLORS } from '@/constants/colors';
import { PADDING } from '@/constants/styles';
import { useCallback, useState } from 'react';
import { AutoCapitalize } from '@/types';
import { stringToCapitalize } from '@/utils/stringHelpers';

interface Props {
  backgroundColor?: string;
  color?: string;
  label: string;
  value?: string;
  onChangeText: (input: string) => void;
  autoCapitalize?: AutoCapitalize;
  secureTextEntry?: boolean;
  errorMessage?: string;
  showErrorMessage?: boolean;
}

export default function TextInputComponent({
  backgroundColor = COLORS.PINK_0,
  color = 'white',
  label,
  value,
  onChangeText,
  autoCapitalize,
  secureTextEntry,
  errorMessage,
  showErrorMessage,
}: Props) {
  const [showSecureText, setShowSecureText] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const onChangeTextHandler = (input: string) => {
    onChangeText(input.trim());
  };

  const toggleSecureText = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (!showSecureText) {
      setShowSecureText(true);
      const newTimer = setTimeout(() => {
        setShowSecureText(false);
        setTimer(null);
      }, 5000);
      setTimer(newTimer);
    } else {
      if (timer) {
        clearTimeout(timer);
        setTimer(null);
      }
      setShowSecureText(false);
    }
  }, [showSecureText, timer]);

  return (
    <>
      <View style={[styles.container, { borderColor: backgroundColor }]}>
        <Pressable
          onPress={secureTextEntry ? toggleSecureText : undefined}
          style={[styles.labelWrapper, { backgroundColor }]}>
          <Text style={[styles.label, { color }]}>{label}</Text>
          {secureTextEntry && (
            <Octicons
              style={styles.icon}
              name={showSecureText ? 'eye' : 'eye-closed'}
              size={20}
              color={color}
            />
          )}
        </Pressable>
        <TextInput
          value={value}
          onChangeText={onChangeTextHandler}
          style={[styles.textInput, { color }]}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry && !showSecureText}
          cursorColor={backgroundColor}
        />
      </View>
      {showErrorMessage && (
        <Text style={[styles.errorLabel, { color }]}>{stringToCapitalize(`${errorMessage}`)}</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    paddingVertical: 4,
    margin: 5,
    borderWidth: 1,
    backgroundColor: 'white',
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'row',
    marginBottom: 1,
  },
  labelWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginHorizontal: 5,
    borderRadius: 50,
    paddingHorizontal: PADDING.SMALL_PADDING,
    padding: 10,
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorLabel: {
    fontSize: 12,
    textAlign: 'right',
    marginRight: 20,
    marginBottom: 2,
  },
  textInput: {
    flex: 1,
    alignSelf: 'stretch',
    textAlign: 'right',
    marginRight: 20,
  },
  icon: {
    marginLeft: 5,
  },
});

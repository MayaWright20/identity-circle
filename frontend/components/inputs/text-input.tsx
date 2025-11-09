import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Octicons from '@expo/vector-icons/Octicons';

import { COLORS } from "@/costants/colors";
import { PADDING, SHADOW, SHADOW_PINK_0 } from "@/costants/styles";
import { useState } from "react";

export enum AutoCapitalize {
  none = 'none', 
  sentences = 'sentences', 
  words = 'words', 
  characters = 'characters',
}

interface Props {
  backgroundColor?: string;
  color?: string;
  label: string;
  onChangeText: (input: string) => void;
  autoCapitalize?: AutoCapitalize;
  secureTextEntry?: boolean
}

export default function TextInputComponent({
  backgroundColor = COLORS.PINK_0,
  color = "white",
  label,
  onChangeText,
  autoCapitalize,
  secureTextEntry
}: Props) {
  const [showSecureText, setShowSecureText] = useState(true);

  const onChangeTextHandler = (input: string) => {
    onChangeText(input);
  };

  const toggleSecureText = () => {
    setShowSecureText(prev => !prev);
  }

  return (
    <View style={[styles.container, { borderColor: backgroundColor }]}>
      <Pressable onPress={secureTextEntry ? toggleSecureText : undefined} style={[styles.labelWrapper, { backgroundColor }]}>
        <Text style={[styles.label, { color }]}>{label}</Text>
        {secureTextEntry && <Octicons style={styles.icon} name={showSecureText ? "eye-closed" : "eye"} size={20} color={color} />}
      </Pressable>
      <TextInput
        onChangeText={onChangeTextHandler}
        style={[styles.textInput, { color: backgroundColor }]}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry && showSecureText}
        cursorColor={backgroundColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    paddingVertical: 4,
    margin: 5,
    borderWidth: 1,
    // borderColor: 'rgba(250, 125, 125, 1)',
    // borderBottomWidth: 2,
    // borderTopWidth: 1,
    // borderBottomColor: 'rgba(158, 23, 23, 1)',
    backgroundColor: "white",
    overflow: "hidden",
    position: "relative",
    flexDirection: "row",
    ...SHADOW,
  },
  labelWrapper: {
    position: "relative",
    alignSelf: "flex-start",
    marginHorizontal: 5,
    borderRadius: 50,
    paddingHorizontal: PADDING.SMALL_PADDING,
    padding: 10,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: 'rgba(250, 125, 125, 1)',
    borderBottomWidth: 2,
    borderTopWidth: 1,
    borderBottomColor: 'rgba(158, 23, 23, 1)',
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  textInput: {
    flex: 1,
    alignSelf: "stretch",
    textAlign: "right",
    marginRight: 20
  },
  icon: {
    marginLeft: 5
  }
});

import { StyleSheet, Text, TextInput, View } from "react-native";

import { COLORS } from "@/costants/colors";
import { PADDING } from "@/costants/styles";

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
}

export default function TextInputComponent({
  backgroundColor = COLORS.PINK_0,
  color = "white",
  label,
  onChangeText,
  autoCapitalize
}: Props) {
  const onChangeTextHandler = (input: string) => {
    // if(isLowerCase){
    //   onChangeText(input.toLowerCase());
    //   console.log("input -  ", input.toLowerCase())
    // }else{
      onChangeText(input);
    // }
    
  };

  return (
    <View style={[styles.container, { borderColor: backgroundColor }]}>
      <View style={[styles.labelWrapper, { backgroundColor }]}>
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>
      <TextInput
        onChangeText={onChangeTextHandler}
        style={[styles.textInput, { color: backgroundColor }]}
        autoCapitalize={autoCapitalize}
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
    backgroundColor: "white",
    overflow: "hidden",
    position: "relative",
    flexDirection: "row",
  },
  labelWrapper: {
    position: "relative",
    alignSelf: "flex-start",
    marginHorizontal: 5,
    borderRadius: 50,
    paddingHorizontal: PADDING.SMALL_PADDING,
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  textInput: {
    maxWidth: "45%",
    flex: 1,
  },
});

import { StyleSheet, Text, TextInput, View } from "react-native";

import { COLORS } from "@/costants/colors";
import { PADDING } from "@/costants/styles";

interface Props {
  backgroundColor?: string;
  color?: string;
  label: string;
  onChangeText: (input: string) => void;
  isLowerCase: boolean;
}

export default function TextInputComponent({
  backgroundColor = COLORS.PINK_0,
  color = "white",
  label,
  onChangeText,
  isLowerCase
}: Props) {
  const onChangeTextHandler = (input: string) => {
    if(isLowerCase){
      onChangeText(input.toLowerCase());
    }else{
      onChangeText(input);
    }
    
  };

  return (
    <View style={[styles.container, { borderColor: backgroundColor }]}>
      <View style={[styles.labelWrapper, { backgroundColor }]}>
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>
      <TextInput
        onChangeText={onChangeTextHandler}
        style={[styles.textInput, { color: backgroundColor }]}
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

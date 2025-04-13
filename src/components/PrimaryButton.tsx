import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { FontFamily } from "../styles/GlobalStyles";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress }) => {
  return (
    <View style={styles.primaryButtonContainer}>
      <Pressable style={styles.primarybutton} onPress={onPress}>
        <LinearGradient
          style={styles.primarybuttonChild}
          locations={[0, 1]}
          colors={["#aedc81", "#6cc51d"]}
        >
          <Text style={styles.thmVoGi}>
            {title}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  primaryButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 16, // Adjust padding as needed
  },
  primarybutton: {
    width: "100%",
    height: 50,
    borderRadius: 5,
    overflow: 'hidden',
  },
  primarybuttonChild: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thmVoGi: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: FontFamily.poppinsMedium,
    color: "#fff",
    textAlign: "center",
  },
});

export default PrimaryButton;
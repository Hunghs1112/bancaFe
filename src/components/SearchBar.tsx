import * as React from "react";
import { StyleSheet, View, Pressable, Text, Image } from "react-native";
import { Color, FontFamily } from "../styles/GlobalStyles";

const SearchBar = () => {
  return (
    <View style={styles.searchbar}>
      <Pressable style={styles.searchbarChild} onPress={() => {}} />
      <Image 
        source={require('../assets/group-21.png')} // Đường dẫn đến ảnh kính lúp
        style={styles.searchbarItem} 
      />
      <Text style={styles.tmKimSn}>Tìm kiếm sản phẩm..</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  searchbarChild: {
    height: "100%",
    top: "0%",
    right: "0%",
    bottom: "0%",
    left: "0%",
    borderRadius: 5,
    backgroundColor: Color.backgroundWhite,
    position: "absolute",
    width: "100%"
  },
  searchbarItem: {
    top: 15,
    left: 21,
    position: "absolute",
    width: 20,  // Điều chỉnh kích thước ảnh nếu cần
    height: 20, // Điều chỉnh kích thước ảnh nếu cần
  },
  tmKimSn: {
    top: 14,
    left: 60,
    fontSize: 15,
    fontWeight: "500",
    fontFamily: FontFamily.poppinsMedium,
    color: Color.text,
    textAlign: "left",
    position: "absolute"
  },
  searchbar: {
    flex: 1,
    height: 50,
    width: "100%"
  }
});

export default SearchBar;

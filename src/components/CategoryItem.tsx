import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Color, FontFamily, FontSize } from "../styles/GlobalStyles";

type CategoryItemProps = {
  name: string;
  icon: any;  // Để icon có thể là ảnh PNG
};

const CategoryItem = ({ name, icon }: CategoryItemProps) => {
  return (
    <View style={styles.categoryItem}>
      <View style={styles.iconWrapper}>
        <Image source={icon} style={styles.icon} /> 
      </View>
      <Text style={styles.categoryName}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 10,
    justifyContent: "center",
    marginBottom: 20,
    width: 70,  // Thêm một kích thước cố định cho mỗi item
  },
  iconWrapper: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.backgroundWhite,
    borderRadius: 26,  // Để ảnh có dạng hình tròn
    marginBottom: 10,
  },
  icon: {
    width: 26,   // Cân chỉnh kích thước ảnh PNG
    height: 26,
    resizeMode: 'contain', // Đảm bảo ảnh không bị méo
  },
  categoryName: {
    fontSize: FontSize.paragraph4_size,
    color: Color.text,
    textAlign: "center",
    fontFamily: FontFamily.paragraph4,
    fontWeight: "500",
  }
});

export default CategoryItem;

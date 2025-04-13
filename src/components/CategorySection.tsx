import * as React from "react";
import { View, Text, StyleSheet, Pressable, FlatList, Image } from "react-native";
import { Color, FontFamily, FontSize } from "../styles/GlobalStyles";
import Group from "../assets/group.svg"
// Cập nhật danh mục với ảnh PNG
const categories = [
  { name: "Rau", icon: require("../assets/rau.png") },
  { name: "Quả", icon: require("../assets/qua.png") },
  { name: "Cá", icon: require("../assets/ca.png") },
  { name: "Mắm", icon: require("../assets/mam.png") },
  { name: "Gia vị", icon: require("../assets/giavi.png") },
  { name: "Thịt", icon: require("../assets/thit.png") },
];

const CategoryItem = ({ name, icon }: { name: string; icon: any }) => (
  <View style={styles.categoryItem}>
    <View style={styles.iconWrapper}>
      <Image source={icon} style={styles.icon} />
    </View>
    <Text style={styles.categoryName}>{name}</Text>
  </View>
);

const CategorySection = () => (
  <View style={styles.categorysection}>
    <Pressable style={styles.cattitle}>
      <Text style={styles.danhMc}>Danh mục</Text>
      <Group style={styles.groupIcon} />
    </Pressable>
    <FlatList
      data={categories}
      renderItem={({ item }) => <CategoryItem name={item.name} icon={item.icon} />}
      keyExtractor={(item) => item.name}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.catitems}
    />
  </View>
);

const styles = StyleSheet.create({
  categorysection: {
    top: 10,
    flex: 1,
    width: "100%",
    height: 122,
  },
  cattitle: {
    width: "100%",
    height: 27,
    position: "absolute"
    },
  groupIcon: {
    height: "66.67%",
    width: "2.75%",
    top: "7.41%",
    right: 18,
    bottom: "25.93%",
    left: "97.25%",
    maxWidth: "100%",
    overflow: "hidden",
    maxHeight: "100%",
    position: "absolute"
    },
  danhMc: {
    fontSize: 18,
    fontWeight: "800",
    fontFamily: FontFamily.poppinsMedium,
    color: "#000",
    textAlign: "left",
    left: 0,
    position: "absolute",
  },
  catitems: {
    top: 44,
    left: 4,
    width: 411,
    height: 78,
    position: "absolute",
    flexDirection: "row",
    flexWrap: "nowrap", // To prevent wrapping
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 10,
    justifyContent: "center",
    marginBottom: 20,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.backgroundWhite,
    borderRadius: 26, // Để ảnh hoặc icon có dạng hình tròn
    marginBottom: 10,
  },
  icon: {
    width: 20, // Icon size adjustment
    height: 20, // Icon size adjustment
  },
  categoryName: {
    fontSize: FontSize.paragraph4_size,
    color: Color.text,
    textAlign: "center",
    fontFamily: FontFamily.paragraph4,
    fontWeight: "500",
  },
});

export default CategorySection;

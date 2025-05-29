import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { Color, FontFamily, FontSize } from '../styles/GlobalStyles';

// Map danh mục với icon và màu
const categoryStyles = {
  Rau: { icon: 'leaf-outline', color: '#4CAF50' },
  Quả: { icon: 'nutrition-outline', color: '#FF5722' },
  Cá: { icon: 'fish-outline', color: '#2196F3' },
  Mắm: { icon: 'water-outline', color: '#9C27B0' },
  'Gia vị': { icon: 'flame-outline', color: '#F44336' },
  Thịt: { icon: 'restaurant-outline', color: '#795548' },
};

const CategoryItem = ({ name, id }: { name: keyof typeof categoryStyles; id: number }) => {
  const navigation = useNavigation<any>();
  const { icon, color } = categoryStyles[name] || { icon: 'help-outline', color: '#000' };

  return (
    <Pressable
      style={styles.categoryItem}
      onPress={() => navigation.navigate('CategoryProducts', { categoryId: id, categoryName: name })}
    >
      <View style={styles.iconWrapper}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text style={styles.categoryName}>{name}</Text>
    </Pressable>
  );
};

const CategorySection = () => {
  const [categories, setCategories] = useState<{ id: number; name: keyof typeof categoryStyles }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/categories');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <View style={styles.categorysection}>
      <Pressable style={styles.featuredtitle} onPress={() => {}}>
        <Text style={styles.snPhmNi}>Danh mục</Text>
        <Icon name="arrow-forward" style={styles.groupIcon} />
      </Pressable>
      {loading ? (
        <Text style={styles.loadingText}>Đang tải danh mục...</Text>
      ) : categories.length === 0 ? (
        <Text style={styles.emptyText}>Không có danh mục</Text>
      ) : (
        <FlatList
          data={categories}
          renderItem={({ item }: { item: { id: number; name: keyof typeof categoryStyles } }) => (
            <CategoryItem name={item.name} id={item.id} />
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catitems}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  categorysection: {
    top: 10,
    flex: 1,
    width: '100%',
    height: 122,
  },
  featuredtitle: {
    width: '100%',
    height: 27,
    marginBottom: 15,
  },
  groupIcon: {
    fontSize: 20,
    color: Color.textPrimary,
    top: '7.41%',
    right: 0,
    position: 'absolute',
  },
  snPhmNi: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: FontFamily.poppinsMedium,
    color: '#000',
    textAlign: 'left',
    left: 0,
    position: 'absolute',
  },
  catitems: {
    top: 14,
    left: 4,
    width: 411,
    height: 70,
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.backgroundWhite,
    borderRadius: 26,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: FontSize.paragraph4_size,
    color: Color.text,
    textAlign: 'center',
    fontFamily: FontFamily.paragraph4,
    fontWeight: '500',
  },
  loadingText: {
    fontSize: FontSize.paragraph4_size,
    color: Color.text,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: FontSize.paragraph4_size,
    color: Color.text,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CategorySection;
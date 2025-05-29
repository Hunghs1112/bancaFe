import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Image, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import CategorySection from '../components/CategorySection';
import Itemsection from '../components/ItemSection';
import { Color } from '../styles/GlobalStyles';

// Danh sách ảnh cho slideshow
const slides = [
  require('../assets/mask-group.png'),
  require('../assets/mask-group.png'),
  require('../assets/mask-group.png'),
];

const Home: React.FC = () => {
  const navigation = useNavigation<any>();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Tự động chuyển slide mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval); // Dọn dẹp khi component unmount
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <SearchBar />
          <Image
            style={styles.maskGroupIcon}
            resizeMode="cover"
            source={slides[currentSlide]}
          />
          <CategorySection />
          <Itemsection />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    paddingBottom: 30,
  },
  maskGroupIcon: {
    width: '100%',
    aspectRatio: 378 / 283,
    height: undefined,
    marginTop: 14,
    borderRadius: 8,
  },
});

export default Home;
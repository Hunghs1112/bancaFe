import React from 'react';
import { StyleSheet, View, ScrollView, Text, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import CategorySection from '../components/CategorySection';
import Itemsection from '../components/ItemSection';
import { Color } from '../styles/GlobalStyles';

const Home: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <SearchBar />
          <Image
            style={styles.maskGroupIcon}
            resizeMode="cover"
            source={require('../assets/mask-group.png')}
          />
          <CategorySection />
          <Itemsection />
        </View>
      </ScrollView>

    </View>
  );
}

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
    width: "100%",
    aspectRatio: 378 / 283,
    height: undefined,
    marginTop: 14,
    borderRadius: 8,
  },
});

export default Home;
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWishlist, Product } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { Color, FontFamily, FontSize, Border } from '../styles/GlobalStyles';

const WishlistScreen: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  // Redirect to Login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigation.navigate('Auth', { screen: 'Login' });
    }
  }, [user, navigation]);

  const handleNavigateToDetail = (productId: string | number) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleGoShopping = () => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  const renderWishlistItem = ({ item }: { item: Product }) => (
    <Pressable
      style={styles.itemContainer}
      onPress={() => handleNavigateToDetail(item.id)}
      accessibilityLabel={`Xem chi tiết sản phẩm ${item.name}`}
    >
      <Image
        source={
          item.image ? { uri: item.image } : require('../assets/heart.png')
        }
        style={styles.itemImage}
        resizeMode="contain"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>
          {Number(item.price).toLocaleString('vi-VN')} VND
        </Text>
      </View>
      <Pressable
        onPress={() => removeFromWishlist(item.id)}
        style={styles.removeButton}
        hitSlop={10}
        accessibilityLabel={`Xóa ${item.name} khỏi danh sách yêu thích`}
      >
        <Icon name="trash-outline" size={22} color={Color.textSecondary} />
      </Pressable>
    </Pressable>
  );

  // Return null while redirecting
  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Quay lại"
        >
          <Icon name="arrow-back" size={24} color={Color.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Danh sách yêu thích</Text>
      </View>
      <View style={styles.divider} />

      {/* Main Content */}
      <View style={styles.content}>
        {wishlist.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon
              name="heart-outline"
              size={120}
              color={Color.primary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTextMain}>Danh sách yêu thích trống!</Text>
            <Text style={styles.emptyTextSub}>
              Thêm sản phẩm bạn yêu thích vào đây nhé.
            </Text>
            <Pressable
              style={styles.goShoppingButton}
              onPress={handleGoShopping}
              accessibilityLabel="Đi mua sắm"
            >
              <Text style={styles.goShoppingText}>Đi mua sắm</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={wishlist}
            renderItem={renderWishlistItem}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundWhite,
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16, // Increased for better spacing
    backgroundColor: Color.colorWhite,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSize.size_xl,
    fontFamily: FontFamily.poppinsBold,
    color: Color.textPrimary,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Color.border,
    marginHorizontal: 16,
  },
  // Content Styles
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20, // Added to ensure content is above home indicator
  },
  listContainer: {
    paddingBottom: 100,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: Color.colorWhite,
    borderRadius: Border.br_sm,
    shadowColor: Color.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: Border.br_xs,
    marginRight: 15,
    backgroundColor: Color.backgroundLight,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: FontSize.defaultBoldSubheadline_size,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.textPrimary,
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.primaryDark,
  },
  removeButton: {
    padding: 10,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyIcon: {
    marginBottom: 30,
  },
  emptyTextMain: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: FontSize.size_lg,
    color: Color.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyTextSub: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: FontSize.defaultBoldSubheadline_size,
    color: Color.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  goShoppingButton: {
    backgroundColor: Color.primary,
    borderRadius: Border.br_sm,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Color.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  goShoppingText: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.poppinsBold,
    color: Color.colorWhite,
  },
});

export default WishlistScreen;
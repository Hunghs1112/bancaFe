import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import api from '../services/api';
import { Color, FontFamily, FontSize } from '../styles/GlobalStyles';
import { useWishlist, Product as WishlistProduct } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: string | number;
  name: string;
  description: string;
  category_id: number;
  image: string | undefined;
  createdAt: string;
  updatedAt: string;
  Variants?: Variant[];
  Category?: { id: number; name: string };
}

interface Variant {
  id: number;
  sku: string;
  price: number | string;
  stock: number;
}

interface RouteParams {
  categoryId: number;
  categoryName: string;
}

type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
};

const CategoryProducts: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { categoryId, categoryName } = route.params as RouteParams;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  const BACKEND_BASE_URL = 'http://10.0.2.2:5000';

  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${BACKEND_BASE_URL}${imagePath}`;
    return imagePath;
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/products?category_id=${categoryId}`);
      const productData = Array.isArray(response.data.products)
        ? response.data.products
        : [];
      setProducts(productData);
    } catch (err: any) {
      console.error('Fetch products error:', err);
      let errorMessage = 'Không thể tải sản phẩm';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.response) {
        errorMessage = `Lỗi server (mã: ${err.response.status})`;
      } else {
        errorMessage = 'Không thể kết nối đến server';
      }
      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
      return () => {};
    }, [fetchProducts])
  );

  const handleProductPress = (productId: string | number) => {
    navigation.navigate('ProductDetail', { productId });
  };

  const handleWishlistToggle = (product: Product) => {
    const productForWishlist: WishlistProduct = {
      id: product.id,
      name: product.name,
      price:
        product.Variants && product.Variants.length > 0
          ? parseFloat(product.Variants[0].price as string) || 0
          : 0,
      image: product.image,
      description: product.description,
    };

    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(productForWishlist);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
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
      
      {/* Loading state */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Color.primary} />
          <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>Lỗi: {error}</Text>
      ) : !Array.isArray(products) || products.length === 0 ? (
        <Text style={styles.emptyText}>Không có sản phẩm trong danh mục này</Text>
      ) : (
        <View style={styles.productsGrid}>
          {products.map((product) => {
            const liked = isWishlisted(product.id);
            const price =
              product.Variants && product.Variants.length > 0
                ? parseFloat(product.Variants[0].price as string) || 0
                : 0;
            const imageUrl = getImageUrl(product.image);
            
            return (
              <View key={product.id.toString()} style={styles.productWrapper}>
                <Pressable
                  style={styles.productItem}
                  onPress={() => handleProductPress(product.id)}
                >
                  {/* Background */}
                  <View style={styles.productItemBackground} />
                  
                  {/* Image container */}
                  <View style={styles.imageContainer}>
                    <View style={styles.imageBgCircle} />
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : null}
                  </View>
                  
                  {/* Product info */}
                  <Text style={styles.priceText}>
                    {Number(price).toLocaleString('vi-VN')} VND
                  </Text>
                  <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={styles.productDescription} numberOfLines={1}>
                    {product.description}
                  </Text>
                  
                  {/* Divider */}
                  <View style={styles.divider} />
                  
                  {/* Heart icon */}
                  <Pressable
                    style={styles.wishlistButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleWishlistToggle(product);
                    }}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <Icon
                      name={liked ? 'heart' : 'heart-outline'}
                      size={20}
                      color={liked ? '#FFC0CB' : Color.textPrimary}
                      style={styles.heartIconStyle}
                    />
                  </Pressable>
                  
                  {/* View detail */}
                  <View style={styles.detailsContainer}>
                    <Icon
                      name="eye-outline"
                      size={18}
                      color={Color.textPrimary}
                      style={styles.eyeIcon}
                    />
                    <Text style={styles.detailsText}>
                      Xem chi tiết
                    </Text>
                  </View>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Color.colorWhite,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
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
  title: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: FontFamily.poppinsMedium,
    color: '#000',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.textPrimary,
    marginTop: 10,
  },
  errorText: {
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.error,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.textPrimary,
    textAlign: 'center',
    marginTop: 20,
  },
  productsGrid: {
    paddingTop: 8,
    paddingLeft: 6,
    paddingRight: 6,
    height: 260,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productWrapper: {
    width: '48%',
    marginBottom: 15,
  },
  productItem: {
    flex: 1,
    height: 234,
    borderRadius: 5,
    position: 'relative',
  },
  productItemBackground: {
    backgroundColor: Color.backgroundWhite,
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: '0%',
    top: '0%',
    borderRadius: 5,
  },
  imageContainer: {
    height: '40.17%',
    width: '50.28%',
    top: '8.97%',
    right: '26.52%',
    bottom: '50.85%',
    left: '23.2%',
    position: 'absolute',
  },
  imageBgCircle: {
    height: '89.36%',
    width: '92.31%',
    bottom: '10.64%',
    left: '7.69%',
    right: '0%',
    top: '0%',
    backgroundColor: Color.backgroundLight,
    borderRadius: 50,
    position: 'absolute',
  },
  productImage: {
    top: 22,
    left: 0,
    width: 91,
    height: 72,
    position: 'absolute',
  },
  priceText: {
    top: '52.56%',
    left: '40.88%',
    color: '#6cc51d',
    fontFamily: FontFamily.paragraph3,
    fontWeight: '500',
    fontSize: FontSize.paragraph3_size,
    textAlign: 'center',
    position: 'absolute',
  },
  productName: {
    top: '59.83%',
    left: '41.99%',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: FontFamily.poppinsSemiBold,
    color: '#000',
    textAlign: 'center',
    position: 'absolute',
  },
  productDescription: {
    top: '70.09%',
    left: '37.04%',
    color: '#868889',
    fontFamily: FontFamily.paragraph3,
    fontWeight: '500',
    fontSize: FontSize.paragraph3_size,
    textAlign: 'center',
    position: 'absolute',
  },
  divider: {
    height: '100%',
    width: '100%',
    top: '82.26%',
    right: '-0.28%',
    bottom: '17.31%',
    left: '-0.28%',
    borderStyle: 'solid',
    borderColor: Color.border,
    borderTopWidth: 1,
    position: 'absolute',
  },
  wishlistButton: {
    height: '8.84%',
    width: '10.84%',
    top: '3.85%',
    right: '4.97%',
    bottom: '89.32%',
    left: '86.19%',
    position: 'absolute',
  },
  heartIconStyle: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 20,
  },
  detailsContainer: {
    height: '7.69%',
    width: '57.46%',
    top: '87.61%',
    right: '17.13%',
    bottom: '4.7%',
    left: '25.41%',
    position: 'absolute',
  },
  eyeIcon: {
    fontSize: 18,
    color: Color.textPrimary,
    right: '87.5%',
    bottom: '16.67%',
    left: '0%',
    top: '0%',
    width: '20%',
    position: 'absolute',
  },
  detailsText: {
    color: '#010101',
    textAlign: 'left',
    left: '21.15%',
    top: '0%',
    position: 'absolute',
    fontFamily: FontFamily.paragraph3,
    fontWeight: '500',
    fontSize: FontSize.paragraph3_size,
  },
});

export default CategoryProducts;
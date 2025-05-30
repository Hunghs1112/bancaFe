import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../services/api';
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

type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
};

const ItemSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  const BACKEND_BASE_URL = 'http://10.0.2.2:5000'; // Adjust if backend runs elsewhere

  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return ''; // Handle undefined or empty image
    if (imagePath.startsWith('http')) return imagePath; // External URLs
    if (imagePath.startsWith('/uploads')) return `${BACKEND_BASE_URL}${imagePath}`; // Local uploads
    return imagePath; // Fallback
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/products');
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
  }, []);

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
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Sản phẩm nổi bật</Text>
        <Icon name="arrow-forward" size={20} color="#000" style={styles.headerIcon} />
      </View>

      {/* Loading state */}
      {loading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#6cc51d" />
          <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>Lỗi: {error}</Text>
      ) : !Array.isArray(products) || products.length === 0 ? (
        <Text style={styles.emptyText}>Hiện không có sản phẩm nào</Text>
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
                      color={liked ? '#FFC0CB' : '#000'}
                    />
                  </Pressable>
                  
                  {/* View detail */}
                  <View style={styles.detailsContainer}>
                    <Icon
                      name="eye-outline"
                      size={18}
                      color="#000"
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingBottom: 36,
  },
  headerSection: {
    width: '100%',
    height: 27,
    marginBottom: 15,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    textAlign: 'left',
    position: 'absolute',
    left: 0,
  },
  headerIcon: {
    position: 'absolute',
    right: 0,
    top: 3,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
  },
  productsGrid: {
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
    backgroundColor: '#fff',
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  imageContainer: {
    position: 'absolute',
    width: '50%',
    height: '40%',
    top: '9%',
    left: '23%',
  },
  imageBgCircle: {
    position: 'absolute',
    width: '92%',
    height: '89%',
    bottom: '10%',
    left: '8%',
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
  },
  productImage: {
    position: 'absolute',
    top: 22,
    left: 0,
    width: 91,
    height: 72,
  },
  priceText: {
    position: 'absolute',
    top: '52.5%',
    left: '40%',
    color: '#6cc51d',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
  },
  productName: {
    position: 'absolute',
    top: '59.8%',
    left: '40%',
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  productDescription: {
    position: 'absolute',
    top: '70%',
    left: '35%',
    color: '#868889',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
  },
  divider: {
    position: 'absolute',
    top: '82%',
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  wishlistButton: {
    position: 'absolute',
    top: '4%',
    right: '5%',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    position: 'absolute',
    left: '25%',
    bottom: '5%',
    width: '58%',
    height: '8%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    left: 0,
  },
  detailsText: {
    position: 'absolute',
    left: '21%',
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});

export default ItemSection;
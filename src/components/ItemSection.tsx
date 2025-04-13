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
import { FontFamily, Color, FontSize } from '../styles/GlobalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../services/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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

const Itemsection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<any>();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  const BACKEND_BASE_URL = 'http://10.0.2.2:5000'; // Adjust if backend runs elsewhere

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return ''; // Handle undefined or empty image
    if (imagePath.startsWith('http')) return imagePath; // External URLs
    if (imagePath.startsWith('/uploads')) return `${BACKEND_BASE_URL}${imagePath}`; // Local uploads
    return imagePath; // Fallback (unlikely)
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/products');
      console.log('API response.data:', response.data);
      const productData = Array.isArray(response.data.products)
        ? response.data.products
        : [];
      setProducts(productData);
      setLoading(false);
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
    <View style={styles.itemsection}>
      <Pressable style={styles.featuredtitle} onPress={() => {}}>
        <Text style={styles.snPhmNi}>Sản phẩm nổi bật</Text>
        <Icon name="arrow-forward" style={styles.groupIcon} />
      </Pressable>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Color.primary} />
          <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>Lỗi: {error}</Text>
      ) : !Array.isArray(products) || products.length === 0 ? (
        <Text style={styles.emptyText}>Hiện không có sản phẩm nào</Text>
      ) : (
        <View style={styles.items}>
          {products.map((product) => {
            const liked = isWishlisted(product.id);
            const price =
              product.Variants && product.Variants.length > 0
                ? parseFloat(product.Variants[0].price as string) || 0
                : 0;
            const imageUrl = getImageUrl(product.image);
            return (
              <View key={product.id} style={styles.productWrapper}>
                <Pressable
                  style={styles.productitem}
                  onPress={() => handleProductPress(product.id)}
                >
                  <View style={[styles.productitemChild, styles.AddPosition]} />
                  <View style={styles.ellipseParent}>
                    <View style={[styles.groupChild, styles.iconLayout]} />
                    {imageUrl && (
                      <Image
                        style={styles.peach241Icon}
                        resizeMode="cover"
                        source={{ uri: imageUrl }}
                      />
                    )}
                  </View>
                  <Text style={[styles.text, styles.oFlexBox]}>
                    {Number(price).toLocaleString('vi-VN')} VND
                  </Text>
                  <Text style={[styles.weight, styles.oFlexBox]} numberOfLines={1}>
                    {product.description}
                  </Text>
                  <Text style={[styles.o, styles.oFlexBox]} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <View style={styles.productitemItem} />

                  <Pressable
                    style={[styles.heartIcon, styles.iconLayout]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleWishlistToggle(product);
                    }}
                    hitSlop={10}
                  >
                    <Icon
                      name={liked ? 'heart' : 'heart-outline'}
                      style={styles.iconInsidePressable}
                      color={liked ? '#FFC0CB' : Color.textPrimary}
                    />
                  </Pressable>

                  <View style={styles.groupParent}>
                    <Pressable
                      style={[styles.AddWrapper, styles.AddWrapperPosition]}
                      onPress={() => handleProductPress(product.id)}
                    >
                      <Text style={[styles.Add, styles.textTypo]}>
                        Xem chi tiết
                      </Text>
                    </Pressable>
                    <Icon name="eye-outline" style={[styles.vectorIcon, styles.iconLayout]} />
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
  itemsection: {
    flex: 1,
    paddingTop: 48,
    paddingBottom: 36,
  },
  groupIcon: {
    fontSize: 20,
    color: Color.textPrimary,
    top: '7.41%',
    right: 0,
    position: 'absolute',
  },
  iconInsidePressable: {
    fontSize: 20,
    width: '100%',
    height: '100%',
    textAlign: 'center',
  },
  featuredtitle: {
    width: '100%',
    height: 27,
    marginBottom: 15,
  },
  items: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productWrapper: {
    width: '48%',
    marginBottom: 15,
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
  errorText: {
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.error,
    textAlign: 'center',
    marginTop: 20,
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
  emptyText: {
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.textPrimary,
    textAlign: 'center',
    marginTop: 20,
  },
  AddPosition: {
    left: '0%',
    top: '0%',
  },
  iconLayout: {
    position: 'absolute',
  },
  oFlexBox: {
    textAlign: 'center',
    position: 'absolute',
  },
  AddWrapperPosition: {
    bottom: '0%',
    height: '100%',
    right: '0%',
    position: 'absolute',
  },
  textTypo: {
    fontFamily: FontFamily.paragraph3,
    fontWeight: '500',
    fontSize: FontSize.paragraph3_size,
  },
  productitem: {
    flex: 1,
    height: 234,
    width: 181,
    borderRadius: 5,
  },
  productitemChild: {
    backgroundColor: Color.backgroundWhite,
    bottom: '0%',
    height: '100%',
    right: '0%',
    position: 'absolute',
    left: '0%',
    width: '100%',
  },
  groupChild: {
    height: '89.36%',
    width: '92.31%',
    bottom: '10.64%',
    left: '7.69%',
    right: '0%',
    top: '0%',
    backgroundColor: Color.backgroundLight,
    borderRadius: 50,
  },
  peach241Icon: {
    top: 22,
    left: 0,
    width: 91,
    height: 72,
    position: 'absolute',
  },
  ellipseParent: {
    height: '40.17%',
    width: '50.28%',
    top: '8.97%',
    right: '26.52%',
    bottom: '50.85%',
    left: '23.2%',
    position: 'absolute',
  },
  text: {
    top: '52.56%',
    left: '40.88%',
    color: '#6cc51d',
    fontFamily: FontFamily.paragraph3,
    fontWeight: '500',
    fontSize: FontSize.paragraph3_size,
  },
  weight: {
    top: '70.09%',
    left: '37.04%',
    color: '#868889',
    fontFamily: FontFamily.paragraph3,
    fontWeight: '500',
    fontSize: FontSize.paragraph3_size,
  },
  o: {
    top: '59.83%',
    left: '41.99%',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: FontFamily.poppinsSemiBold,
    color: '#000',
  },
  productitemItem: {
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
  heartIcon: {
    height: '8.84%',
    width: '10.84%',
    top: '3.85%',
    right: '4.97%',
    bottom: '89.32%',
    left: '86.19%',
  },
  Add: {
    color: '#010101',
    textAlign: 'left',
    left: '0%',
    top: '0%',
    position: 'absolute',
  },
  AddWrapper: {
    width: '78.85%',
    left: '21.15%',
    top: '0%',
  },
  vectorIcon: {
    fontSize: 18,
    color: Color.textPrimary,
    right: '87.5%',
    bottom: '16.67%',
    left: '0%',
    top: '0%',
    width: '20%',
  },
  groupParent: {
    height: '7.69%',
    width: '57.46%',
    top: '87.61%',
    right: '17.13%',
    bottom: '4.7%',
    left: '25.41%',
    position: 'absolute',
  },
});

export default Itemsection;
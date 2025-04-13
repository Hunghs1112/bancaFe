import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../services/api';
import { FontFamily, FontSize, Color, Border } from '../styles/GlobalStyles';
import LinearGradient from 'react-native-linear-gradient';
import { useWishlist, Product as WishlistProduct } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
}

interface Variant {
  id: number;
  sku: string;
  price: number;
  stock: number;
}

const ProductDetail: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { productId } = route.params;
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const [isLiked, setIsLiked] = useState(false);

  const BACKEND_BASE_URL = 'http://10.0.2.2:5000'; // Use 'http://10.0.2.2:5000' for Android emulator if needed

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.toLowerCase().startsWith('/uploads')) {
      return `${BACKEND_BASE_URL}/uploads${imagePath.substring(8)}`;
    }
    return imagePath;
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setError(null);
        setLoading(true);

        console.log(`Fetching product ${productId}`);
        const productResponse = await api.get(`/products/${productId}`);
        const fetchedProduct: Product = productResponse.data;
        setProduct(fetchedProduct);

        console.log(`Fetching variants for product ${productId}`);
        const variantsResponse = await api.get(`/products/${productId}/variants`);
        const fetchedVariants: Variant[] = variantsResponse.data;
        setVariants(fetchedVariants);
        if (fetchedVariants.length > 0) {
          const defaultVariant =
            fetchedVariants.find((v: Variant) => v.stock > 0) || fetchedVariants[0];
          setSelectedVariant(defaultVariant);
        }

        if (fetchedProduct) {
          setIsLiked(isWishlisted(fetchedProduct.id));
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        let errorMessage = 'Không thể tải chi tiết sản phẩm';
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
          errorMessage =
            typeof err.response.data === 'string' && err.response.data.includes('<!DOCTYPE')
              ? 'Lỗi server: Nhận HTML thay vì JSON'
              : err.response.data?.message || `Lỗi server (mã: ${err.response.status})`;
        } else {
          errorMessage = 'Không thể kết nối server';
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId, isWishlisted]);

  const handleWishlistToggle = () => {
    if (!product) return;
    const productForWishlist: WishlistProduct = {
      id: product.id,
      name: product.name,
      price: selectedVariant?.price || 0,
      image: product.image || '',
      description: product.description || '',
    };
    if (isLiked) {
      removeFromWishlist(product.id);
      setIsLiked(false);
    } else {
      addToWishlist(productForWishlist);
      setIsLiked(true);
    }
  };

  const handleVariantSelect = (variant: Variant) => {
    if (variant.stock > 0) {
      setSelectedVariant(variant);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) {
      setError('Vui lòng chọn sản phẩm và biến thể');
      return;
    }
    if (!user || !user.id) {
      setError('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigation.navigate('Auth', { screen: 'Login' });
      return;
    }
    try {
      setError(null);
      console.log('Adding to cart:', {
        userId: user.id,
        productId: product.id,
        variantId: selectedVariant.id,
        quantity: 1,
      });

      const response = await api.post('/cart-items/add', {
        userId: user.id,
        productId: product.id,
        variantId: selectedVariant.id,
        quantity: 1,
      });
      console.log('Cart item added:', response.data);

      navigation.navigate('MainTabs', { screen: 'Cart' });
    } catch (err: any) {
      console.error('Add to cart error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      let errorMessage = 'Không thể thêm vào giỏ hàng';
      if (err.response) {
        console.error('Response data:', err.response.data);
        errorMessage =
          typeof err.response.data === 'string' && err.response.data.includes('<!DOCTYPE')
            ? 'Lỗi server: Nhận HTML thay vì JSON'
            : err.response.data?.message || `Lỗi server (mã: ${err.response.status})`;
      } else {
        errorMessage = 'Không thể kết nối server';
      }
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Color.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error && !product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={22} color={Color.colorWhite} />
        </Pressable>
        <View style={styles.loaderContainer}>
          <Text style={styles.errorText}>Không tìm thấy sản phẩm</Text>
        </View>
      </SafeAreaView>
    );
  }

  const imageUrl = getImageUrl(product.image);

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Quay lại"
      >
        <Icon name="arrow-back" size={22} color={Color.colorWhite} />
      </Pressable>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <LinearGradient
            colors={[Color.primary, Color.colorWhite]}
            style={styles.imageBackground}
          />
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="contain"
              onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
            />
          ) : (
            <Icon
              name="image-outline"
              size={100}
              color={Color.textSecondary}
              style={styles.imagePlaceholder}
            />
          )}
        </View>

        <View style={styles.body}>
          {error && <Text style={styles.errorTextInline}>{error}</Text>}
          <View style={styles.titlePriceContainer}>
            <View style={styles.namePriceBlock}>
              <Text style={styles.name} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={styles.price}>
                {selectedVariant?.price.toLocaleString('vi-VN')} VND
              </Text>
            </View>
            <Pressable
              style={styles.heartButton}
              onPress={handleWishlistToggle}
              accessibilityLabel={isLiked ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
            >
              <Icon
                name={isLiked ? 'heart' : 'heart-outline'}
                size={28}
                color={isLiked ? Color.primary : Color.textPrimary}
              />
            </Pressable>
          </View>

          {variants.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionLabel}>Biến thể</Text>
              <View style={styles.variantContainer}>
                {variants.map((variant) => (
                  <Pressable
                    key={variant.id}
                    style={[
                      styles.variantButton,
                      selectedVariant?.id === variant.id && styles.variantButtonSelected,
                      variant.stock === 0 && styles.variantButtonDisabled,
                    ]}
                    onPress={() => handleVariantSelect(variant)}
                    disabled={variant.stock === 0}
                    accessibilityLabel={`Chọn biến thể ${variant.sku}`}
                  >
                    <Text
                      style={[
                        styles.variantText,
                        selectedVariant?.id === variant.id && styles.variantTextSelected,
                        variant.stock === 0 && styles.variantTextDisabled,
                      ]}
                    >
                      {variant.sku}
                    </Text>
                    <Text
                      style={[
                        styles.variantStock,
                        variant.stock === 0 && styles.variantStockOut,
                      ]}
                    >
                      {variant.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>Miêu tả</Text>
            <Text style={styles.descriptionText}>
              {product.description || 'Không có mô tả'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <Pressable
          style={[
            styles.addToCartButton,
            (!selectedVariant || selectedVariant.stock === 0) && styles.addToCartButtonDisabled,
          ]}
          onPress={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock === 0}
          accessibilityLabel="Thêm vào giỏ hàng"
        >
          <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundWhite,
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: Border.br_8xs,
    shadowColor: Color.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  imagePlaceholder: {
    opacity: 0.5,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  errorTextInline: {
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  titlePriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  namePriceBlock: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: FontSize.size_xl,
    fontFamily: FontFamily.poppinsBold,
    color: Color.textPrimary,
    marginBottom: 8,
    lineHeight: 32,
  },
  price: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.primaryDark,
  },
  heartButton: {
    padding: 8,
    marginTop: 4,
  },
  sectionContainer: {
    paddingBottom: 24,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderColor: Color.border,
  },
  sectionLabel: {
    fontSize: FontSize.defaultBoldSubheadline_size,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.textPrimary,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.text,
    lineHeight: FontSize.paragraph3_size * 1.6,
  },
  variantContainer: {
    flexDirection: 'column',
  },
  variantButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Border.br_sm,
    marginBottom: 8,
    backgroundColor: Color.colorWhite,
  },
  variantButtonSelected: {
    borderColor: Color.primary,
    backgroundColor: Color.primaryLight,
  },
  variantButtonDisabled: {
    borderColor: Color.colorWhitesmoke,
    backgroundColor: Color.backgroundGray,
  },
  variantText: {
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.textPrimary,
  },
  variantTextSelected: {
    color: Color.primaryDark,
    fontFamily: FontFamily.poppinsSemiBold,
  },
  variantTextDisabled: {
    color: Color.textSecondary,
  },
  variantStock: {
    fontSize: FontSize.size_3xs,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.textSecondary,
    marginTop: 4,
  },
  variantStockOut: {
    color: Color.error,
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Color.backgroundWhite,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  addToCartButton: {
    backgroundColor: Color.primary,
    borderRadius: Border.br_sm,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addToCartButtonDisabled: {
    backgroundColor: Color.colorGray,
  },
  addToCartText: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.poppinsBold,
    color: Color.colorWhite,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.error,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProductDetail;
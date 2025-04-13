import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../services/api';
import { FontFamily, FontSize, Color, Border } from '../styles/GlobalStyles';
import { useAuth } from '../contexts/AuthContext';

type RootStackParamList = {
  Auth: { screen: string };
  MainTabs: { screen: string };
  Checkout: { cartItems: CartItem[]; cartId?: number };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Product {
  name: string;
  image: string | null;
}

interface Variant {
  sku: string;
  price: number;
  stock: number;
}

interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  variantId: number;
  sku: string;
  quantity: number;
  price: number;
  Product?: Product;
  Variant?: Variant;
}

interface Cart {
  id: number;
  userId: number;
  status: string;
}

interface AuthContextType {
  user: { id: number } | null;
}

const CartScreen: React.FC = () => {
  const { user } = useAuth() as AuthContextType;
  const navigation = useNavigation<NavigationProp>();
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    if (!user || !user.id) {
      console.log('No user or user.id, redirecting to login');
      setError('Vui lòng đăng nhập');
      navigation.navigate('Auth', { screen: 'Login' });
      setLoading(false);
      return;
    }

    const fetchCartAndItems = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching cart for userId: ${user.id}`);
        const cartResponse = await api.get<Cart>('/carts', {
          params: { userId: user.id },
        });
        console.log('Cart response:', JSON.stringify(cartResponse.data, null, 2));
        setCart(cartResponse.data || null);

        console.log(`Fetching cart items for userId: ${user.id}`);
        const itemsResponse = await api.get<CartItem[]>('/cart-items', {
          params: { userId: user.id },
        });
        console.log('Cart items response:', JSON.stringify(itemsResponse.data, null, 2));
        setCartItems(Array.isArray(itemsResponse.data) ? itemsResponse.data : []);
      } catch (err: any) {
        console.error('Fetch error:', err);
        let errorMessage = 'Không thể tải giỏ hàng';
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

    fetchCartAndItems();
  }, [user, navigation]);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    try {
      setError(null);
      if (newQuantity === 0) {
        await api.delete(`/cart-items/${itemId}`);
        setCartItems(cartItems.filter((item) => item.id !== itemId));
      } else {
        const response = await api.put<CartItem>(`/cart-items/${itemId}`, {
          quantity: newQuantity,
        });
        setCartItems(
          cartItems.map((item) =>
            item.id === itemId ? { ...item, quantity: response.data.quantity } : item
          )
        );
      }
    } catch (err: any) {
      console.error('Update quantity error:', err);
      let errorMessage = 'Không thể cập nhật số lượng';
      if (err.response) {
        errorMessage =
          typeof err.response.data === 'string' && err.response.data.includes('<!DOCTYPE')
            ? 'Lỗi server: Nhận HTML thay vì JSON'
            : err.response.data?.message || `Lỗi server (mã: ${err.response.status})`;
      }
      setError(errorMessage);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      setError(null);
      await api.delete(`/cart-items/${itemId}`);
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } catch (err: any) {
      console.error('Remove item error:', err);
      let errorMessage = 'Không thể xóa sản phẩm';
      if (err.response) {
        errorMessage =
          typeof err.response.data === 'string' && err.response.data.includes('<!DOCTYPE')
            ? 'Lỗi server: Nhận HTML thay vì JSON'
            : err.response.data?.message || `Lỗi server (mã: ${err.response.status})`;
      }
      setError(errorMessage);
    }
  };

  const goToCheckout = () => {
    if (!cartItems.length) {
      setError('Giỏ hàng trống');
      return;
    }
    navigation.navigate('Checkout', {
      cartItems,
      cartId: cart?.id,
    });
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const imageUrl = getImageUrl(item.Product?.image ?? null);
    console.log('Cart item imageUrl:', imageUrl);
    return (
      <View style={styles.itemContainer}>
        <Image
          source={imageUrl ? { uri: imageUrl } : require('../assets/heart.png')}
          style={styles.itemImage}
          resizeMode="contain"
          onError={(e) => console.log('Cart image load error:', e.nativeEvent.error)}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.Product?.name || 'Sản phẩm không xác định'}
          </Text>
          <Text style={styles.itemText}>
            SKU: {item.Variant?.sku || item.sku || 'N/A'}
          </Text>
          <Text style={styles.itemText}>
            {(item.price * item.quantity).toLocaleString('vi-VN')} VND
          </Text>
          <View style={styles.quantityContainer}>
            <Pressable
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
              style={styles.quantityButton}
              disabled={item.quantity <= 1}
            >
              <Text style={styles.quantityText}>-</Text>
            </Pressable>
            <Text style={styles.quantityValue}>{item.quantity}</Text>
            <Pressable
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
              style={styles.quantityButton}
              disabled={item.quantity >= (item.Variant?.stock ?? Infinity)}
            >
              <Text style={styles.quantityText}>+</Text>
            </Pressable>
          </View>
        </View>
        <Pressable onPress={() => removeItem(item.id)} style={styles.removeButton}>
          <Icon name="trash-outline" size={20} color={Color.textSecondary} />
        </Pressable>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Color.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Quay lại"
        >
          <Icon name="arrow-back" size={24} color={Color.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Giỏ hàng</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.content}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {cartItems.length > 0 ? (
          <>
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.list}
            />
            <View style={styles.checkoutContainer}>
              <Text style={styles.totalText}>
                Tổng cộng:{' '}
                {cartItems
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toLocaleString('vi-VN')}{' '}
                VND
              </Text>
              <Pressable style={styles.checkoutButton} onPress={goToCheckout}>
                <Text style={styles.buttonText}>Thanh toán</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="cart-outline" size={100} color={Color.textSecondary} />
            <Text style={styles.emptyText}>Giỏ hàng trống</Text>
            <Pressable
              style={styles.shopButton}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
            >
              <Text style={styles.buttonText}>Mua sắm ngay</Text>
            </Pressable>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  errorText: {
    color: Color.error,
    fontSize: FontSize.paragraph3_size,
    textAlign: 'center',
    marginBottom: 8,
  },
  list: {
    paddingBottom: 120,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: Color.colorWhite,
    borderRadius: Border.br_sm,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: Border.br_xs,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.textPrimary,
    marginBottom: 4,
  },
  itemText: {
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.textSecondary,
    marginBottom: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: Color.backgroundLight,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: FontSize.paragraph3_size,
    color: Color.textPrimary,
  },
  quantityValue: {
    fontSize: FontSize.paragraph3_size,
    color: Color.textPrimary,
    marginHorizontal: 12,
  },
  removeButton: {
    padding: 8,
    alignSelf: 'center',
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 86,
    left: 16,
    right: 16,
    backgroundColor: Color.colorWhite,
    padding: 12,
    borderRadius: Border.br_sm,
    elevation: 3,
  },
  totalText: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.textPrimary,
    marginBottom: 8,
  },
  checkoutButton: {
    backgroundColor: Color.primary,
    borderRadius: Border.br_sm,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: Color.colorWhite,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.poppinsMedium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.textSecondary,
  },
  shopButton: {
    backgroundColor: Color.primary,
    borderRadius: Border.br_sm,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
});

export default CartScreen;
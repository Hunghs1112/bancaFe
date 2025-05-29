import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../contexts/AuthContext';
import { Color, FontFamily, FontSize, Border } from '../styles/GlobalStyles';

const Profile: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSignOut = async () => {
    const success = await logout();
    if (success) {
      navigation.navigate('MainTabs', { screen: 'Home' });
    }
  };

  const handleLogin = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const menuItems = [
    { name: 'Thông tin cá nhân', icon: 'person-outline', screen: 'AboutMe' },
    { name: 'Đăng sản phẩm', icon: 'add-circle-outline', screen: 'PostProduct' },
    { name: 'Đơn hàng của tôi', icon: 'cart-outline', screen: 'MyOrders' },
    { name: 'Yêu thích', icon: 'heart-outline', screen: 'Wishlist' },
    { name: 'Địa chỉ của tôi', icon: 'location-outline', screen: 'Address' },
  ];

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={styles.unauthenticatedContainer}>
        <Icon name="lock-closed-outline" size={48} color={Color.colorGray} />
        <Text style={styles.unauthenticatedText}>
          Vui lòng đăng nhập để xem hồ sơ
        </Text>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Đăng Nhập</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          style={styles.avatar}
          source={require('../assets/avatar.png')}
          resizeMode="cover"
        />
        <Text style={styles.userName}>{user.name || 'Người dùng'}</Text>
        <Text style={styles.userEmail}>{user.email || 'user@example.com'}</Text>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Icon name={item.icon} size={20} color={Color.colorBlack} />
            <Text style={styles.menuText}>{item.name}</Text>
            <Icon name="chevron-forward-outline" size={20} color={Color.colorBlack} />
          </Pressable>
        ))}
        <Pressable style={styles.menuItem} onPress={handleSignOut}>
          <Icon name="log-out-outline" size={20} color={Color.colorBlack} />
          <Text style={styles.menuText}>Đăng Xuất</Text>
          <Icon name="chevron-forward-outline" size={20} color={Color.colorBlack} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  unauthenticatedContainer: {
    flex: 1,
    backgroundColor: Color.colorWhite,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  unauthenticatedText: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: FontSize.size_lg,
    color: Color.colorBlack,
    textAlign: 'center',
    marginVertical: 16,
  },
  loginButton: {
    backgroundColor: Color.primary,
    borderRadius: Border.br_8xs,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  loginButtonText: {
    color: Color.colorWhite,
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsSemiBold,
    textAlign: 'center',
  },
  userInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: Border.br_8xs,
    backgroundColor: Color.backgroundLight,
  },
  userName: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: FontSize.size_lg,
    color: Color.colorBlack,
    fontWeight: '600',
    marginTop: 16,
  },
  userEmail: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: FontSize.paragraph3_size,
    color: Color.colorGray,
    marginTop: 4,
  },
  menu: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },
  menuText: {
    flex: 1,
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: FontSize.paragraph3_size,
    color: Color.colorBlack,
    fontWeight: '600',
    marginLeft: 16,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: Color.colorWhite,
    borderTopWidth: 1,
    borderTopColor: Color.border,
  },
  navItem: {
    alignItems: 'center',
  },
});

export default Profile;
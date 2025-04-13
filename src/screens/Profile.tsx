import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../contexts/AuthContext';
import { Color, FontFamily, FontSize, Border } from '../styles/GlobalStyles';

const Profile: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    const success = await logout();
    if (success) {
      navigation.navigate('Auth', { screen: 'Login' });
    }
  };

  const menuItems = [
    { name: 'About Me', icon: 'person-outline', screen: 'AboutMe' },
    { name: 'Đăng sản phẩm', icon: 'location-outline', screen: 'PostProduct' },
    { name: 'My Orders', icon: 'cart-outline', screen: 'MyOrders' },
    { name: 'My Favorites', icon: 'heart-outline', screen: 'Wishlist' },
    { name: 'My Address', icon: 'location-outline', screen: 'Address' },
  ];

  return (
    <View style={styles.container}>
  

      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          style={styles.avatar}
          source={require('../assets/avatar.png')}
          resizeMode="cover"
        />
        <Text style={styles.userName}>{user?.username || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
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
          <Text style={styles.menuText}>Sign Out</Text>
          <Icon name="chevron-forward-outline" size={20} color={Color.colorBlack} />
        </Pressable>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navigation}>
        <Pressable style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Icon name="home-outline" size={24} color={Color.colorBlack} />
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => navigation.navigate('Cart')}>
          <Icon name="cart-outline" size={24} color={Color.colorBlack} />
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => navigation.navigate('Wishlist')}>
          <Icon name="heart-outline" size={24} color={Color.colorBlack} />
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Icon name="person" size={24} color={Color.primary} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: FontSize.paragraph3_size,
    color: Color.colorBlack,
    fontWeight: '600',
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconMargin: {
    marginHorizontal: 8,
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
});

export default Profile;
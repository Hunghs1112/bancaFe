import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './src/screens/Home';
import ProductDetail from './src/screens/ProductDetail';
import ProfileScreen from './src/screens/Profile';
import CartScreen from './src/screens/Cart';
import WishlistScreen from './src/screens/Wishlist';
import LoginScreen from './src/screens/Login';
import SignupScreen from './src/screens/Signup';
import AddressScreen from './src/screens/Address';
import PostProduct from './src/screens/PostProduct';
import CategoryProducts from './src/screens/CategoryProducts';

import NavigationBar from './src/components/NavigationBar';

import { WishlistProvider } from './src/contexts/WishlistContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <NavigationBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
  }, [isAuthenticated, loading]);

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? 'MainTabs' : 'Auth'}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Address"
        component={AddressScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PostProduct"
        component={PostProduct}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryProducts"
        component={CategoryProducts}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </WishlistProvider>
    </AuthProvider>
  );
};

export default App;
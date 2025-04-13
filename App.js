import React from 'react';
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
import AddressScreen from './src/screens/Address'; // Thêm AddressScreen

import NavigationBar from './src/components/NavigationBar';

import { WishlistProvider } from './src/contexts/WishlistContext';
import { AuthProvider } from './src/contexts/AuthContext';
import PostProduct from './src/screens/PostProduct';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

// Authentication stack for login/signup screens
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

// Main tab navigator - Home is always accessible, other screens check auth
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

const App = () => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="MainTabs">
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
          </Stack.Navigator>
        </NavigationContainer>
      </WishlistProvider>
    </AuthProvider>
  );
};

export default App;
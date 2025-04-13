import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../services/api';
import { Color, FontFamily, FontSize, Border } from '../styles/GlobalStyles';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigation = useNavigation<any>();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const response = await api.post('/users/login', { email, password });
      const { user } = response.data;

      // Gọi login từ AuthContext, truyền user
      const success = await login(user);
      if (success) {
        navigation.navigate('MainTabs', { screen: 'Home' });
      } else {
        setError('Failed to log in. Please try again.');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message;
      if (errorMessage === 'Không tìm thấy người dùng với email này') {
        setError('No account found with this email');
      } else if (errorMessage === 'Mật khẩu không chính xác') {
        setError('Incorrect password');
      } else {
        setError(errorMessage || 'Network error. Please try again.');
      }
      console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.gradient}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.inputContainer}>
            <Icon name="mail-outline" size={24} color={Color.colorGray} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Color.colorGray}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={24} color={Color.colorGray} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Color.colorGray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color={Color.colorGray}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Auth', { screen: 'Signup' })}
            style={styles.signupLink}
          >
            <Text style={styles.signupText}>
              Don't have an account? <Text style={styles.signupLinkText}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundGray,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.primaryLight,
  },
  formContainer: {
    width: '90%',
    backgroundColor: Color.colorWhite,
    borderRadius: Border.br_3xs,
    padding: 20,
    shadowColor: Color.colorBlack,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: FontSize.heading1_size,
    color: Color.colorBlack,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: FontSize.paragraph3_size,
    color: Color.colorGray,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.backgroundLight,
    borderRadius: Border.br_8xs,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Color.border,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.colorBlack,
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    backgroundColor: Color.primary,
    borderRadius: Border.br_8xs,
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 16,
  },
  loginButtonText: {
    color: Color.colorWhite,
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsSemiBold,
    textAlign: 'center',
  },
  signupLink: {
    alignItems: 'center',
  },
  signupText: {
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.colorGray,
  },
  signupLinkText: {
    color: Color.link,
    fontFamily: FontFamily.poppinsSemiBold,
  },
  error: {
    color: Color.colorBlack,
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsMedium,
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default LoginScreen;
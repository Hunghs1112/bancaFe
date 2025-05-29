import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
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
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      const response = await api.post('/users/login', { email, password });
      const { user } = response.data;

      // Map backend response to AuthContext's User interface
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      // Call login from AuthContext
      const success = await login(userData);
      if (success) {
        navigation.navigate('MainTabs', { screen: 'Home' });
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message;
      if (errorMessage === 'Không tìm thấy người dùng với email này') {
        setError('Không tìm thấy tài khoản với email này');
      } else if (errorMessage === 'Mật khẩu không chính xác') {
        setError('Mật khẩu không chính xác');
      } else {
        setError(errorMessage || 'Lỗi mạng. Vui lòng thử lại.');
      }
      console.error('Login error:', err.response?.data || err);
    }
  };

  const handleBack = () => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.gradient}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back-outline" size={24} color={Color.colorWhite} />
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Chào Mừng Trở Lại</Text>
            <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>

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
                placeholder="Mật khẩu"
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
              <Text style={styles.loginButtonText}>Đăng Nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Auth', { screen: 'Signup' })}
              style={styles.signupLink}
            >
              <Text style={styles.signupText}>
                Chưa có tài khoản? <Text style={styles.signupLinkText}>Đăng ký</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundGray,
  },
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    backgroundColor: Color.primaryLight,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.primary,
    borderRadius: Border.br_8xs,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 1,
  },
  backButtonText: {
    color: Color.colorWhite,
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsSemiBold,
    marginLeft: 8,
  },
  formContainer: {
    width: '90%',
    backgroundColor: Color.colorWhite,
    borderRadius: Border.br_3xs,
    padding: 20,
    marginTop: '50%',
    shadowColor: Color.colorBlack,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    alignSelf: 'center',
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
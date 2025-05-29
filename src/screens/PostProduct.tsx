import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../services/api';
import { Color, FontFamily, FontSize, Border } from '../styles/GlobalStyles';
import { launchCamera, launchImageLibrary, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';

type RootStackParamList = {
  Auth: { screen: string };
  Home: undefined;
  Cart: undefined;
  Wishlist: undefined;
  Profile: undefined;
  AboutMe: undefined;
  MyOrders: undefined;
  Address: undefined;
  PostProduct: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Category {
  id: number;
  name: string;
}

const PostProduct: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<any>(null);
  const [price, setPrice] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [sku, setSku] = useState<string>('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await api.get('/categories');
        const fetchedCategories = Array.isArray(response.data) ? response.data : response.data?.categories || [];
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setCategoryId(fetchedCategories[0].id);
        }
      } catch (err: any) {
        console.error('Fetch categories error:', err);
        setError('Không thể tải danh mục sản phẩm');
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectImageSource = () => {
    Alert.alert(
      'Chọn nguồn hình ảnh',
      'Bạn muốn chụp ảnh mới hay chọn ảnh từ thư viện?',
      [
        { text: 'Chụp ảnh', onPress: handleTakePhoto },
        { text: 'Chọn từ thư viện', onPress: handleSelectFromGallery },
        { text: 'Hủy', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleTakePhoto = () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 1 as 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1,
      maxWidth: 500,
      maxHeight: 500,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.error('Camera Error:', response.errorMessage);
        setError(`Không thể sử dụng camera: ${response.errorMessage}`);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  const handleSelectFromGallery = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1 as 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1,
      maxWidth: 500,
      maxHeight: 500,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
        setError(`Không thể chọn hình ảnh: ${response.errorMessage}`);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    if (!name) {
      setError('Tên sản phẩm là bắt buộc');
      setLoading(false);
      return;
    }
    if (!description) {
      setError('Mô tả sản phẩm là bắt buộc');
      setLoading(false);
      return;
    }
    if (!categoryId) {
      setError('Danh mục sản phẩm là bắt buộc');
      setLoading(false);
      return;
    }

    if (sku || price || stock) {
      if (!sku || !price || !stock) {
        setError('SKU, giá và tồn kho phải được cung cấp cùng nhau');
        setLoading(false);
        return;
      }
      if (sku.length < 3) {
        setError('SKU phải có ít nhất 3 ký tự');
        setLoading(false);
        return;
      }
      const priceNum = parseFloat(price);
      const stockNum = parseInt(stock, 10);
      if (isNaN(priceNum) || priceNum <= 0) {
        setError('Giá phải là số lớn hơn 0');
        setLoading(false);
        return;
      }
      if (isNaN(stockNum) || stockNum < 0) {
        setError('Tồn kho phải là số không âm');
        setLoading(false);
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category_id', categoryId.toString());
      if (image) {
        formData.append('image', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.fileName || `product_image_${Date.now()}.jpg`,
        });
      }
      if (sku) formData.append('sku', sku);
      if (price) formData.append('price', price);
      if (stock) formData.append('stock', stock);

      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Thành công', 'Sản phẩm đã được đăng thành công!');
    } catch (err: any) {
      console.error('Post product error:', err);
      let errorMessage = 'Không thể đăng sản phẩm';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.response) {
        errorMessage = `Lỗi server (mã: ${err.response.status})`;
      } else {
        errorMessage = 'Không thể kết nối đến server';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (categoriesLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Color.primary} />
      </SafeAreaView>
    );
  }

  if (categories.length === 0) {
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
          <Text style={styles.headerTitle}>Đăng sản phẩm</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.errorText}>Không có danh mục nào khả dụng</Text>
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
        <Text style={styles.headerTitle}>Đăng sản phẩm</Text>
      </View>
      <View style={styles.divider} />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Text style={styles.label}>Danh mục</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoryId}
              onValueChange={(itemValue) => setCategoryId(itemValue)}
              style={styles.picker}
              enabled={!loading}
            >
              {categories.map((category) => (
                <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.id}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Hình ảnh sản phẩm (Tùy chọn)</Text>
          <Pressable
            style={[styles.imagePickerButton, loading && styles.submitButtonDisabled]}
            onPress={handleSelectImageSource}
            disabled={loading}
            accessibilityLabel="Chọn nguồn hình ảnh sản phẩm"
          >
            <Text style={styles.imagePickerText}>
              {image ? 'Thay đổi hình ảnh' : 'Chọn hình ảnh'}
            </Text>
          </Pressable>
          {image && (
            <Image
              source={{ uri: image.uri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}
          <Text style={styles.label}>Tên sản phẩm</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nhập tên sản phẩm"
            placeholderTextColor={Color.textSecondary}
            autoCapitalize="words"
            editable={!loading}
          />
          <Text style={styles.label}>Mô tả</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Nhập mô tả sản phẩm"
            placeholderTextColor={Color.textSecondary}
            multiline
            numberOfLines={4}
            editable={!loading}
          />
          <Text style={styles.label}>Mã SKU (Tùy chọn)</Text>
          <TextInput
            style={styles.input}
            value={sku}
            onChangeText={setSku}
            placeholder="Nhập mã SKU (ví dụ: ABC123)"
            placeholderTextColor={Color.textSecondary}
            autoCapitalize="characters"
            editable={!loading}
          />
          <Text style={styles.label}>Giá (VND, Tùy chọn)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Nhập giá sản phẩm"
            placeholderTextColor={Color.textSecondary}
            keyboardType="numeric"
            editable={!loading}
          />
          <Text style={styles.label}>Số lượng tồn kho (Tùy chọn)</Text>
          <TextInput
            style={styles.input}
            value={stock}
            onChangeText={setStock}
            placeholder="Nhập số lượng tồn kho"
            placeholderTextColor={Color.textSecondary}
            keyboardType="numeric"
            editable={!loading}
          />
          <Pressable
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Đang đăng...' : 'Đăng sản phẩm'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  formContainer: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  label: {
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Border.br_sm,
    padding: 12,
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.textPrimary,
    marginBottom: 16,
    backgroundColor: Color.colorWhite,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Color.border,
    borderRadius: Border.br_sm,
    marginBottom: 16,
    backgroundColor: Color.colorWhite,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  imagePickerButton: {
    backgroundColor: Color.backgroundLight,
    borderRadius: Border.br_sm,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePickerText: {
    fontSize: FontSize.paragraph3_size,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.textPrimary,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: Border.br_sm,
    marginBottom: 16,
    alignSelf: 'center',
  },
  errorText: {
    color: Color.error,
    fontSize: FontSize.paragraph3_size,
    textAlign: 'center',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: Color.primary,
    borderRadius: Border.br_sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: Color.colorGray,
  },
  submitButtonText: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.poppinsBold,
    color: Color.colorWhite,
  },
});

export default PostProduct;
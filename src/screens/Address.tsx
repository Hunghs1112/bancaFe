import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FontFamily, Color, Border, FontSize } from '../styles/GlobalStyles';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Address {
  id: number;
  recipientName: string;
  addressLine: string;
  zipCode: string;
  city: string;
  country: string;
  phoneNumber: string;
  isDefault: boolean;
}

interface Form {
  recipientName: string;
  addressLine: string;
  zipCode: string;
  city: string;
  country: string;
  phoneNumber: string;
  isDefault: boolean;
}

interface Props {
  navigation: any;
}

const AddressScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<Form>({
    recipientName: '',
    addressLine: '',
    zipCode: '',
    city: '',
    country: '',
    phoneNumber: '',
    isDefault: false,
  });
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const BACKEND_BASE_URL = 'http://10.0.2.2:5000';

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.toLowerCase().startsWith('/uploads')) {
      return `${BACKEND_BASE_URL}/uploads${imagePath.substring(8)}`;
    }
    return imagePath;
  };

  const fetchAddresses = useCallback(async () => {
    console.log('User:', user);
    if (!user?.id) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để xem địa chỉ');
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.get(`/addresses/user/${user.id}`);
      setAddresses(response.data.addresses || []);
    } catch (error: any) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể tải danh sách địa chỉ');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const validateForm = (): boolean => {
    return !!(
      form.recipientName.trim() &&
      form.addressLine.trim() &&
      form.zipCode.trim() &&
      form.city.trim() &&
      form.country.trim() &&
      form.phoneNumber.trim()
    );
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (!user?.id) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để lưu địa chỉ');
      return;
    }
    setIsLoading(true);
    try {
      if (editingAddress) {
        const response = await api.put(`/addresses/${editingAddress.id}`, form);
        setAddresses(addresses.map(addr =>
          addr.id === editingAddress.id ? response.data.address : addr
        ));
        Alert.alert('Thành công', 'Địa chỉ đã được cập nhật');
      } else {
        const response = await api.post('/addresses', {
          userId: user.id,
          ...form,
        });
        setAddresses([...addresses, response.data.address]);
        Alert.alert('Thành công', 'Địa chỉ đã được thêm');
      }
      setEditingAddress(null);
    } catch (error: any) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể lưu địa chỉ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingAddress(null);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setForm({
      recipientName: address.recipientName,
      addressLine: address.addressLine,
      zipCode: address.zipCode,
      city: address.city,
      country: address.country,
      phoneNumber: address.phoneNumber,
      isDefault: address.isDefault,
    });
  };

  const handleDeleteAddress = async (id: number) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa địa chỉ này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await api.delete(`/addresses/${id}`);
              setAddresses(addresses.filter(addr => addr.id !== id));
              if (editingAddress?.id === id) {
                setEditingAddress(null);
              }
              Alert.alert('Thành công', 'Địa chỉ đã được xóa');
            } catch (error: any) {
              Alert.alert('Lỗi', error.response?.data?.message || 'Không thể xóa địa chỉ');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (id: number) => {
    setIsLoading(true);
    try {
      await api.patch(`/addresses/${id}/default`);
      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      })));
      Alert.alert('Thành công', 'Đã đặt làm địa chỉ mặc định');
    } catch (error: any) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể đặt địa chỉ mặc định');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.addressScreen}>
      {/* Title Bar */}
      <View style={styles.titlebar}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={23} color={Color.labelColorLightPrimary} />
        </Pressable>
        <Text style={styles.titleText}>Địa chỉ của tôi</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => {
            setEditingAddress(null);
            setForm({
              recipientName: '',
              addressLine: '',
              zipCode: '',
              city: '',
              country: '',
              phoneNumber: '',
              isDefault: false,
            });
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="add" size={23} color={Color.labelColorLightPrimary} />
        </Pressable>
      </View>

      {/* Body */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {isLoading && (
          <ActivityIndicator size="large" color={Color.labelColorLightPrimary} style={styles.loading} />
        )}
        {!isLoading && addresses.length === 0 && (
          <Text style={styles.noAddressesText}>Chưa có địa chỉ mặc định</Text>
        )}
        {addresses.map(address => (
          <View
            key={address.id}
            style={[styles.addressCard, address.isDefault && styles.defaultAddressCard]}
          >
            <Icon name="person" size={50} color={Color.colorGray} style={styles.avatarIcon} />
            <View style={styles.addressInfo}>
              <Text style={styles.nameText}>{address.recipientName}</Text>
              <Text style={styles.addressText}>
                {address.addressLine}, {address.city}, {address.zipCode}, {address.country}
              </Text>
              <Text style={styles.phoneText}>{address.phoneNumber}</Text>
            </View>
            <View style={styles.actionButtons}>
              <Pressable style={styles.editButton} onPress={() => handleEdit(address)} disabled={isLoading}>
                <Icon name="edit" size={18} color={Color.labelColorLightPrimary} />
              </Pressable>
              <Pressable style={styles.deleteButton} onPress={() => handleDeleteAddress(address.id)} disabled={isLoading}>
                <Icon name="delete" size={18} color={Color.labelColorLightPrimary} />
              </Pressable>
              {!address.isDefault && (
                <Pressable style={styles.defaultButton} onPress={() => handleSetDefault(address.id)} disabled={isLoading}>
                  <Icon name="star" size={18} color={Color.colorGray} />
                </Pressable>
              )}
            </View>
            {address.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>MẶC ĐỊNH</Text>
              </View>
            )}
          </View>
        ))}

        <View style={styles.defaultAddress}>
          <View style={styles.inputContainer}>
            <View style={styles.inputField}>
              <Icon name="person-outline" size={20} color={Color.colorGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Tên người nhận"
                value={form.recipientName}
                onChangeText={text => setForm({ ...form, recipientName: text })}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.inputField}>
              <Icon name="location-on" size={20} color={Color.colorGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Địa chỉ"
                value={form.addressLine}
                onChangeText={text => setForm({ ...form, addressLine: text })}
              />
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputField, styles.inputHalf]}>
                <Icon name="pin" size={20} color={Color.colorGray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mã bưu điện"
                  value={form.zipCode}
                  onChangeText={text => setForm({ ...form, zipCode: text })}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputField, styles.inputHalf]}>
                <Icon name="location-city" size={20} color={Color.colorGray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Thành phố"
                  value={form.city}
                  onChangeText={text => setForm({ ...form, city: text })}
                />
              </View>
            </View>
            <View style={styles.inputField}>
              <Icon name="public" size={20} color={Color.colorGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Quốc gia"
                value={form.country}
                onChangeText={text => setForm({ ...form, country: text })}
                autoCapitalize="words"
              />
              <Icon name="arrow-drop-down" size={20} color={Color.colorGray} style={styles.dropdownIcon} />
            </View>
            <View style={styles.inputField}>
              <Icon name="phone" size={20} color={Color.colorGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={form.phoneNumber}
                onChangeText={text => setForm({ ...form, phoneNumber: text })}
                keyboardType="phone-pad"
              />
            </View>
            <Pressable
              style={styles.makeDefault}
              onPress={() => setForm({ ...form, isDefault: !form.isDefault })}
            >
              <Icon
                name="check-circle"
                size={20}
                color={form.isDefault ? Color.labelColorLightPrimary : Color.colorGray}
              />
              <Text style={styles.makeDefaultText}>Đặt làm mặc định</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.buttonPressed,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleSaveAddress}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {editingAddress ? 'Cập nhật thông tin' : 'Lưu thông tin'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  addressScreen: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  titlebar: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: Color.colorWhite,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
  },
  backButton: {
    width: 23,
    height: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    color: Color.labelColorLightPrimary,
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Border.br_8xs,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bodyContent: {
    paddingBottom: 80,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: Color.colorWhite,
    borderRadius: Border.br_8xs,
    padding: 16,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  defaultAddressCard: {
    position: 'relative',
  },
  avatarIcon: {
    marginRight: 16,
  },
  addressInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: FontSize.defaultBoldSubheadline_size,
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: '600',
    color: Color.labelColorLightPrimary,
  },
  addressText: {
    fontSize: FontSize.size_3xs,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.colorGray,
    marginTop: 4,
  },
  phoneText: {
    fontSize: FontSize.size_3xs,
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: '600',
    color: Color.labelColorLightPrimary,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
  },
  defaultButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
  },
  defaultAddress: {
    marginTop: 16,
  },
  defaultBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#ebffd7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Border.br_8xs,
  },
  defaultBadgeText: {
    fontSize: FontSize.size_3xs,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    color: '#6cc51d',
  },
  inputContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.colorGhostwhite,
    borderRadius: Border.br_8xs,
    padding: 12,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.colorGray,
  },
  dropdownIcon: {
    position: 'absolute',
    right: 12,
  },
  makeDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  makeDefaultText: {
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    color: Color.labelColorLightPrimary,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Color.colorWhite,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Color.primaryDark,
    borderRadius: Border.br_8xs,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Color.colorGray,
    borderRadius: Border.br_8xs,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  buttonText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.colorWhite,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  noAddressesText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.colorGray,
    textAlign: 'center',
    marginVertical: 20,
  },
  loading: {
    marginVertical: 20,
  },
});

export default AddressScreen;
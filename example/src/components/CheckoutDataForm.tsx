import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  Switch,
} from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useFormContext } from '../utils/FormContext';
import { Picker } from '@react-native-picker/picker';
import SavedCardList from './SavedCardList';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type RootStackParamList = {
  ShippingDetailsForm: undefined;
  PaymentDataForm: undefined;
  RemoveCardScreen: undefined;
  Payment: undefined;
};

type CheckoutDataFormNavigationProp = NavigationProp<
  RootStackParamList,
  'ShippingDetailsForm',
  'RemoveCardScreen'
>;

const CheckoutDataForm: React.FC = () => {
  const navigation = useNavigation<CheckoutDataFormNavigationProp>();
  const { formData, setFormData } = useFormContext();
  const [amount, setAmount] = useState(formData.amount || '');
  const [currency, setCurrency] = useState(formData.currency || 'LKR');
  const [orderDescription, setOrderDescription] = useState(formData.orderDescription);
  const [custom1, setCustom1] = useState(formData.custom1 || '');
  const [custom2, setCustom2] = useState(formData.custom2 || '');
  const [customerId, setCustomerId] = useState(formData.customerId || '');
  const [merchantId, setMerchantId] = useState(formData.merchantId || '');
  const [tokenId, setTokenId] = useState(formData.tokenId || '');
  // const [webhookUrl, setWebhookUrl] = useState('');

  const [shipToDeferentAddress, setShipToDeferentAddress] = useState(false);

  // const fetchWebhookUrl = async () => {
  //   try {
  //     const webhook = await AsyncStorage.getItem('notificationUrl');
  //     if (webhook !== null) {
  //       setWebhookUrl(webhook);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch webhook url:', error);
  //   }
  // };

  const resetForm = () => {
    setAmount('');
    setOrderDescription(undefined);
    setCustom1('');
    setCustom2('');
  };

  useEffect(() => {
    resetForm();
    // fetchWebhookUrl();
    setTokenId('');
    setCustomerId('');
    setMerchantId('');
  }, []);

  const handleCardSelection = (
    customerId: string,
    merchantId: string,
    tokenId: string
  ) => {
    setCustomerId(customerId);
    setMerchantId(merchantId);
    setTokenId(tokenId);
  };

  const handleNext = () => {
    if (!amount || !currency) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      amount,
      currency,
      orderDescription,
      custom1,
      custom2,
      customerId,
      merchantId,
      tokenId,
    }));
    if (shipToDeferentAddress) {
      navigation.navigate('ShippingDetailsForm');
    } else {
      navigation.navigate('PaymentDataForm');
    }
  };

  // const handleSave = () => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     amount: '0.00',
  //     paymentType: '3',
  //     doFirstPayment: '0',
  //     currency: currency,
  //     isCardSaved: '1',
  //     webhookUrl: webhookUrl,
  //     orderDescription: 'Card Saving',
  //   }));

  //   navigation.navigate('Payment');
  // };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid
      extraScrollHeight={100}
    >
      <View style={styles.container}>
        <Text style={styles.label}>Amount (required)</Text>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
        />
        <Text style={styles.label}>Currency (required)</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={currency}
            onValueChange={(itemValue) => setCurrency(itemValue)}
          >
            <Picker.Item label="LKR" value="LKR" />
            <Picker.Item label="USD" value="USD" />
            <Picker.Item label="EUR" value="EUR" />
            <Picker.Item label="GBP" value="GBP" />
          </Picker>
        </View>
        <Text style={styles.label}>Order Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Order Description"
          value={orderDescription}
          onChangeText={(text) => setOrderDescription(text)}
        />
        <Text style={styles.label}>Custom 1</Text>
        <TextInput
          style={styles.input}
          placeholder="Custom 1"
          value={custom1}
          onChangeText={setCustom1}
        />
        <Text style={styles.label}>Custom 2</Text>
        <TextInput
          style={styles.input}
          placeholder="Custom 2"
          value={custom2}
          onChangeText={setCustom2}
        />
        <View style={styles.checkboxContainer}>
          <Text style={styles.label}>Ship to Different Address</Text>
          <Switch
            value={shipToDeferentAddress}
            onValueChange={setShipToDeferentAddress}
          />
        </View>
        <SavedCardList onCardSelect={handleCardSelection} />
        <Button title={tokenId ? 'Continue' : 'Continue with New Card'} onPress={handleNext} />
        {/* <View style={{ height: 15 }} />
        <Button title="Add New Card" onPress={handleSave} /> */}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default CheckoutDataForm;

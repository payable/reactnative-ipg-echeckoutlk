import React, { useEffect, useState } from 'react';
import {
  View,
  Button,
  StyleSheet,
  Alert,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useFormContext } from '../utils/FormContext';
import { Picker } from '@react-native-picker/picker';
import DatePicker from '@react-native-community/datetimepicker';
import { tokenPay } from '../api/api';
import { getCheckValueForTokenPay } from '../utils/TokenPayment';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Payment: undefined;
  Landing: undefined;
};

type PaymentDataFormNavigationProp = NavigationProp<
  RootStackParamList,
  'Payment',
  'Landing'
>;

const PaymentDataForm: React.FC = () => {
  const navigation = useNavigation<PaymentDataFormNavigationProp>();
  const [isCardSaved, setIsCardSaved] = useState(false);

  const { formData, setFormData } = useFormContext();

  const [paymentType, setPaymentType] = useState(
    formData.paymentType?.toString() || '1'
  );

  const [startDate, setStartDate] = useState<Date | undefined>(
    parseDate(formData.startDate)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    parseDate(formData.endDate)
  );
  const [recurringAmount, setRecurringAmount] = useState(
    formData.recurringAmount || ''
  );
  const [interval, setInterval] = useState(formData.interval || 'DAILY');
  const [isRetry, setIsRetry] = useState(formData.isRetry || '0');
  const [retryAttempts, setRetryAttempts] = useState(
    formData.retryAttempts || '0'
  );
  const [doFirstPayment, setDoFirstPayment] = useState(
    formData.doFirstPayment || '0'
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [merchantToken, setMerchantToken] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [invId, setInvId] = useState('');

  function parseDate(date: string | Date | undefined): Date | undefined {
    if (!date) return undefined;
    if (typeof date === 'string') return new Date(date);
    return date;
  }

  const convertDate = (date: Date = new Date()): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleStartDateChange = (
    _event: any,
    selectedDate: Date | undefined
  ) => {
    setShowStartDatePicker(false);
    setStartDate(selectedDate);
  };

  const handleEndDateChange = (_event: any, selectedDate: Date | undefined) => {
    if (_event.type === 'dismissed') {
      setShowEndDatePicker(false);
      return;
    }
    setShowEndDatePicker(false);
    setEndDate(selectedDate);
  };

  const _isValue01 = (value: string) => {
    if (!value) {
      return 'Required';
    } else if (value === '1' || value === '0') {
      return null;
    } else {
      return 'Invalid';
    }
  };

  const getInvoiceId = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const fetchMerchantToken = async () => {
    try {
      const token = await AsyncStorage.getItem('merchantToken');
      if (token !== null) {
        setMerchantToken(token);
      }
    } catch (error) {
      console.error('Failed to fetch merchant token:', error);
    }
  };

  const fetchWebhookUrl = async () => {
    try {
      const webhook = await AsyncStorage.getItem('notificationUrl');
      if (webhook !== null) {
        setWebhookUrl(webhook);
      }
    } catch (error) {
      console.error('Failed to fetch webhook url:', error);
    }
  };

  const resetForm = () => {
    setPaymentType('1');
    setStartDate(undefined);
    setEndDate(undefined);
    setRecurringAmount('0');
    setInterval('DAILY');
    setIsRetry('0');
    setRetryAttempts('0');
    setDoFirstPayment('0');
    setIsCardSaved(false);
  };

  useEffect(() => {
    setInvId(getInvoiceId());
    resetForm();
    fetchMerchantToken();
    fetchWebhookUrl();
  }, []);

  const formatToTwoDecimals = (value: string) => {
    const decimalIndex = value.indexOf('.');

    if (decimalIndex === -1) {
      // If there's no decimal point, add ".00"
      return `${value}.00`;
    }

    // If there are more than two decimals, truncate to two
    if (value.length > decimalIndex + 3) {
      return value.slice(0, decimalIndex + 3);
    }

    // If there are fewer than two decimals, pad with "0"s
    return `${value}${'0'.repeat(decimalIndex + 3 - value.length)}`;
  };

  const amountWithDecimal = formatToTwoDecimals(
    parseFloat(formData.amount).toString()
  );

  const payWithToken = async () => {
    // const invoiceId = getInvoiceId();

    setIsLoading(true);
    const paymentDetails = {
      merchantId: formData.merchantId ?? '',
      customerId: formData.customerId ?? '',
      webhookUrl: webhookUrl,
      tokenId: formData.tokenId ?? '',
      invoiceId: invId,
      currencyCode: formData.currency,
      amount: amountWithDecimal.toString(),
      orderDescription: formData.orderDescription,
      custom1: formData.custom1,
      custom2: formData.custom2,
      checkValue: getCheckValueForTokenPay(
        formData.merchantId ?? '',
        invId,
        amountWithDecimal.toString(),
        formData.currency,
        formData.customerId ?? '',
        formData.tokenId ?? '',
        merchantToken
      ),
    };

    try {
      console.log('***Payment Details', paymentDetails);
      const response = await tokenPay(paymentDetails);
      console.log('Payment Successful', response);

      // Show success alert
      navigation.reset({
        index: 0,
        routes: [{ name: 'Landing' }],
      });
      Alert.alert(
        'Payment Successful',
        'Your payment was processed successfully.'
      );
    } catch (error) {
      console.error('Payment failed:', error);

      // Show error alert
      Alert.alert(
        'Payment Failed',
        'An error occurred while processing your payment. Please try again.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!paymentType) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (paymentType === '2') {
      if (!startDate || !recurringAmount || !interval) {
        Alert.alert(
          'Error',
          'Please fill in all required fields for recurring payments.'
        );
        return;
      }

      if (parseFloat(recurringAmount) < 2.0) {
        Alert.alert(
          'Error',
          'Recurring amount should be greater than or equal to 2.00'
        );
        return;
      }
    }

    const isRetryValidation = _isValue01(isRetry);
    if (isRetryValidation) {
      Alert.alert('Error', isRetryValidation);
      return;
    }

    const doFirstPaymentValidation = _isValue01(doFirstPayment);
    if (doFirstPaymentValidation) {
      Alert.alert('Error', doFirstPaymentValidation);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      paymentType,
      startDate: startDate ? convertDate(startDate) : undefined,
      endDate: endDate ? convertDate(endDate) : 'FOREVER',
      recurringAmount,
      interval,
      isRetry,
      retryAttempts,
      doFirstPayment,
      isCardSaved: isCardSaved ? '1' : '0',
    }));

    navigation.navigate('Payment');
  };

  if (formData.tokenId) {
    return (
      <ScrollView style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.container}>
            <Text style={styles.labelToken}>Payment Summary</Text>
            <View>
              <Text style={styles.values}>Amount: {formData.amount}</Text>
              <Text style={styles.values}>Currency: {formData.currency}</Text>
              <Text style={styles.values}>Invoice ID: {invId}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Pay with Token" onPress={payWithToken} />
            </View>
          </View>
        )}
      </ScrollView>
    );
  } else {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.label}>Payment Type (required)</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={paymentType}
              onValueChange={(itemValue) => setPaymentType(itemValue)}
            >
              <Picker.Item label="One Time" value="1" />
              <Picker.Item label="Recurring" value="2" />
            </Picker>
          </View>

          {paymentType === '2' && (
            <>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity
                style={styles.datePickerContainer}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text>
                  {startDate ? startDate.toDateString() : 'Select Start Date'}
                </Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DatePicker
                  value={startDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleStartDateChange}
                />
              )}

              <Text style={styles.label}>End Date</Text>
              <TouchableOpacity
                style={styles.datePickerContainer}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text>{endDate ? endDate.toDateString() : 'FOREVER'}</Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DatePicker
                  value={endDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                />
              )}

              <Text style={styles.label}>Recurring Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Recurring Amount"
                value={recurringAmount}
                onChangeText={setRecurringAmount}
              />

              <Text style={styles.label}>Interval</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={interval}
                  onValueChange={(itemValue) => setInterval(itemValue)}
                >
                  <Picker.Item label="Daily" value="DAILY" />
                  <Picker.Item label="Weekly" value="WEEKLY" />
                  <Picker.Item label="Monthly" value="MONTHLY" />
                  <Picker.Item label="Quarterly" value="QUARTERLY" />
                  <Picker.Item label="Annually" value="ANNUALLY" />
                </Picker>
              </View>

              <Text style={styles.label}>Is Retry</Text>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={isRetry}
                  onValueChange={(itemValue) => setIsRetry(itemValue)}
                >
                  <Picker.Item label="0" value="0" />

                  <Picker.Item label="1" value="1" />
                </Picker>
              </View>

              <Text style={styles.label}>Retry Attempts</Text>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={retryAttempts}
                  onValueChange={(itemValue) => setRetryAttempts(itemValue)}
                >
                  <Picker.Item label="0" value="0" />
                  <Picker.Item label="1" value="1" />
                  <Picker.Item label="2" value="2" />
                  <Picker.Item label="3" value="3" />
                  <Picker.Item label="4" value="4" />
                  <Picker.Item label="5" value="5" />
                </Picker>
              </View>

              <Text style={styles.label}>Do First Payment</Text>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={doFirstPayment}
                  onValueChange={(itemValue) => setDoFirstPayment(itemValue)}
                >
                  <Picker.Item label="0" value="0" />

                  <Picker.Item label="1" value="1" />
                </Picker>
              </View>
            </>
          )}

          {isCardSaved && (
            <View>
              <Text style={styles.label}>Do First Payment</Text>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={doFirstPayment}
                  onValueChange={(itemValue) => setDoFirstPayment(itemValue)}
                >
                  <Picker.Item label="0" value="0" />

                  <Picker.Item label="1" value="1" />
                </Picker>
              </View>
            </View>
          )}

          {/* Toggle for saving card */}

          {paymentType === '1' && (
            <View style={styles.toggleContainer}>
              <Text style={styles.label}>Save Card</Text>
              <Switch
                value={isCardSaved}
                onValueChange={() =>
                  setIsCardSaved((previousState) => !previousState)
                }
              />
            </View>
          )}

          <Button title="Checkout" onPress={handleSave} />
        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    height: 40,
    justifyContent: 'center',
  },
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  labelToken: {
    marginBottom: 4,
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  values: {
    marginBottom: 12,
    fontSize: 18,
  },
});

export default PaymentDataForm;

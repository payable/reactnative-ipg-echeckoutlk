import React, { useState, useEffect } from 'react';
import PayableIPG from 'ipg-reactnative-sdk-sandbox';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useFormContext } from '../utils/FormContext';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import types from the SDK
import type { PaymentData, ReturnData } from 'ipg-reactnative-sdk-sandbox';
import { getCheckValue } from '../utils/OneTimePayment';
import type { UserData } from '../utils/UserData';

type RootStackParamList = {
  Landing: undefined;
  Payment: undefined;
  Error: { errors: string[] };
};

type PaymentScreenNavigationProp = NavigationProp<
  RootStackParamList,
  'Landing'
>;

type ErrorsScreenNavigationProp = NavigationProp<RootStackParamList, 'Error'>;

const PaymentScreen: React.FC = () => {
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const errorsNavigation = useNavigation<ErrorsScreenNavigationProp>();
  const { formData } = useFormContext();
  const [merchantKey, setMerchantKey] = useState('');
  const [merchantToken, setMerchantToken] = useState('');
  const [packageName, setPackageName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [notificationUrl, setNotificationUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null); // Change the type to UserData

  const getUserData = async () => {
    try {
      const uData = await AsyncStorage.getItem('userData');
      console.log('User data from storage:', uData); // Add this log
      if (uData !== null) {
        const user: UserData = JSON.parse(uData);
        setUserData(user);
      } else {
        console.log('No user data found in storage.');
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedMerchantKey = await AsyncStorage.getItem('merchantKey');
        const storedMerchantToken = await AsyncStorage.getItem('merchantToken');
        const storedPackageName = await AsyncStorage.getItem('packageName');
        const storedLogoUrl = await AsyncStorage.getItem('logoUrl');
        const storedNotificationUrl =
          await AsyncStorage.getItem('notificationUrl');
        getUserData();
        if (storedMerchantKey) setMerchantKey(storedMerchantKey);
        if (storedMerchantToken) setMerchantToken(storedMerchantToken);
        if (storedPackageName) setPackageName(storedPackageName);
        if (storedLogoUrl) setLogoUrl(storedLogoUrl);
        if (storedNotificationUrl) setNotificationUrl(storedNotificationUrl);

        // After setting state, stop loading
        setLoading(false);
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };

    loadSettings();
  }, []);

  const getInvoiceId = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const getCustomerReferenceNo = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const data = {
    // environment: 'qa',
    // environment: 'dev',
    environment: 'sandbox',
    logoUrl: logoUrl,
    returnUrl: 'https://host.exp.exponent',
    webhookUrl: notificationUrl,
    merchantKey: merchantKey,
    merchantToken: merchantToken,
  };

  const saveCustomerData = async (Customerid: string, merchantId: string) => {
    try {
      await AsyncStorage.setItem('customerID', Customerid);
      await AsyncStorage.setItem('merchantId', merchantId);
    } catch (error) {
      console.error('Failed to save customer data', error);
    }
  };

  const handlePaymentStarted = (data: PaymentData) => {
    console.log('Payment started:', data);
  };

  const handlePaymentCompleted = (data: ReturnData) => {
    if (data.customerId && data.merchantId) {
      saveCustomerData(data.customerId, data.merchantId);
    }
    console.log('Payment completed:', data);
    navigation.navigate('Landing');
  };

  const handlePaymentError = (error: string) => {
    try {
      const errorData = JSON.parse(error);

      if (errorData.status === 3009) {
        const errorMessages = Object.values(errorData.error).flat() as string[];

        errorsNavigation.navigate('Error', { errors: errorMessages });
        return;
      }
    } catch (parseError) {
      console.error('Payment error:', error);
    }

    console.error('Payment error:', error);
  };

  const formatToTwoDecimals = (value: string) => {
    const decimalIndex = value.indexOf(".");
    
    if (decimalIndex === -1) {
      // If there's no decimal point, add ".00"
      return `${value}.00`;
    }
    
    // If there are more than two decimals, truncate to two
    if (value.length > decimalIndex + 3) {
      return value.slice(0, decimalIndex + 3);
    }
    
    // If there are fewer than two decimals, pad with "0"s
    return `${value}${"0".repeat(decimalIndex + 3 - value.length)}`;
  };

  const amountWithDecimal = formatToTwoDecimals(parseFloat(formData.amount).toString());
  
  const recurringAmountWithDecimal = parseFloat(
    formData.recurringAmount
  ).toFixed(2);

  const checkValue = getCheckValue(
    formData.isCardSaved ?? '0',
    merchantKey,
    merchantToken,
    getInvoiceId(),
    amountWithDecimal.toString(),
    formData.currency,
    getCustomerReferenceNo()
  );

  return (
    <>
      {loading ? (
        <Text>Loading...</Text>
      ) : userData ? (
        <PayableIPG
          PAYableIPGClient={data}
          packageName={packageName}
          paymentType={formData.paymentType}
          invoiceId={getInvoiceId()}
          amount={amountWithDecimal.toString()}
          currencyCode={formData.currency}
          orderDescription={formData.orderDescription}
          custom1={formData.custom1}
          custom2={formData.custom2}
          customerFirstName={userData.firstName}
          customerLastName={userData.lastName}
          customerMobilePhone={userData.mobile}
          customerEmail={userData.email}
          customerPhone={userData.phone}
          checkValue={checkValue}
          billingAddressStreet={userData.streetAddress1}
          billingAddressCity={userData.townCity}
          billingAddressCountry={userData.country}
          billingAddressPostcodeZip={userData.postcode}
          billingCompanyName={userData.companyName}
          billingAddressStateProvince={userData.province}
          shippingContactFirstName={formData.shippingFirstName}
          shippingContactLastName={formData.shippingLastName}
          shippingContactMobilePhone={formData.shippingMobile}
          shippingContactPhone={formData.shippingPhone}
          shippingContactEmail={formData.shippingEmail}
          shippingCompanyName={formData.shippingCompanyName}
          shippingAddressStreet={formData.shippingStreetAddress1}
          shippingAddressStreet2={formData.shippingStreetAddress2}
          shippingAddressCity={formData.shippingTownCity}
          shippingAddressStateProvince={formData.shippingProvince}
          shippingAddressCountry={formData.shippingCountry}
          shippingAddressPostcodeZip={formData.shippingPostcode}
          startDate={formData.startDate}
          endDate={formData.endDate}
          recurringAmount={recurringAmountWithDecimal.toString()}
          interval={formData.interval}
          isRetry={formData.isRetry}
          retryAttempts={formData.retryAttempts}
          isCardSaved={formData.isCardSaved}
          customerRefNo={userData.refNo}
          doFirstPayment={formData.doFirstPayment}
          onPaymentStarted={handlePaymentStarted}
          onPaymentCompleted={handlePaymentCompleted}
          onPaymentError={handlePaymentError}
          onPaymentCancelled={() => {
            navigation.goBack();
          }}
        />
      ) : (
        <Text>No user data available.</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentScreen;

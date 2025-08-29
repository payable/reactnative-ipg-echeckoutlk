import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import WebView from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { getCheckValue, getReturnData } from './utils/utils';
import { getEndpoint } from './utils/environment';
import ErrorComponent from './components/ErrorComponent';
import type { PaymentRequest } from './models/PaymentRequest';
import type { PaymentData } from './models/PaymentData';
import type { ReturnData } from './models/ReturnData';

const PayableIPG: React.FC<PaymentRequest> = (props) => {
  const [responseUrl, setResponseUrl] = useState<string | null>(null);
  const [errorOccurred, setErrorOccurred] = useState<boolean>(false);
  const [validationErrorOccurred, setValidationErrorOccurred] =
    useState<boolean>(false);

  function onError(res: any) {
    const responseData = res.response;
    const errordata = {
      status: 400,
      error: 'Something went wrong. Please contact your merchant.',
    };

    if (responseData.status === 403) {
      setErrorOccurred(true);
      errordata.error = responseData.data.error || errordata.error;
    } else if (responseData.status === 400) {
      if (responseData.data.errors) {
        errordata.status = 3009;
        errordata.error = responseData.data.errors;
        setValidationErrorOccurred(true);
        console.error(errordata.error);
      } else {
        setErrorOccurred(true);
        errordata.error = 'Something went wrong. Please contact your merchant.';
        console.error(errordata.error);
      }
    } else if (responseData.status === 500) {
      setErrorOccurred(true);
      errordata.status = 500;
      errordata.error =
        responseData.data.error ||
        'Something went wrong. Please contact your merchant.';
      console.error(errordata.error);
    }

    return errordata;
  }

  useEffect(() => {
    const fetchResponseUrl = async () => {
      try {
        const environment = props.PAYableIPGClient.environment;

        const checkValue = getCheckValue(
          props.isCardSaved ?? '0',
          props.PAYableIPGClient.merchantKey,
          props.PAYableIPGClient.merchantToken,
          props.invoiceId,
          props.amount,
          props.currencyCode,
          props.customerRefNo ?? ''
        );

        const requestData: { [key: string]: any } = {
          logoUrl: props.PAYableIPGClient.logoUrl,
          returnUrl: props.PAYableIPGClient.returnUrl,
          webhookUrl: props.PAYableIPGClient.webhookUrl, // Ensure this is your backend's URL
          merchantKey: props.PAYableIPGClient.merchantKey,
          paymentType: props.isCardSaved == '1' ? '3' : props.paymentType,
          isMobilePayment: 1,
          integrationType: 'React Native SDK',
          integrationVersion: '2.1.2',
          statusReturnUrl: `${getEndpoint(environment)}/status-view`,
          isSaveCard: props.isCardSaved ?? '0',
          customerRefNo: props.customerRefNo,
          doFirstPayment: props.doFirstPayment,
          packageName: props.packageName,
          checkValue,
          orderDescription: props.orderDescription ?? 'Order from E-Checkout LK',
          invoiceId: props.invoiceId,
          customerFirstName: props.customerFirstName,
          customerLastName: props.customerLastName,
          customerMobilePhone: props.customerMobilePhone,
          customerEmail: props.customerEmail,
          billingAddressStreet: props.billingAddressStreet,
          billingAddressCity: props.billingAddressCity,
          billingAddressCountry: props.billingAddressCountry,
          billingAddressPostcodeZip: props.billingAddressPostcodeZip,
          amount: props.amount.toString(),
          currencyCode: props.currencyCode,
        };

        if (props.paymentType === '2') {
          Object.assign(requestData, {
            startDate: props.startDate,
            endDate: props.endDate ?? 'FOREVER',
            recurringAmount: props.recurringAmount,
            interval: props.interval,
            isRetry: props.isRetry,
            retryAttempts: props.retryAttempts,
          });
        }

        Object.assign(requestData, {
          custom1: props.custom1,
          custom2: props.custom2,
          customerPhone: props.customerPhone,
          billingAddressStreet2: props.billingAddressStreet2,
          billingCompanyName: props.billingCompanyName,
          billingAddressStateProvince: props.billingAddressStateProvince,
          shippingContactFirstName: props.shippingContactFirstName,
          shippingContactLastName: props.shippingContactLastName,
          shippingContactMobilePhone: props.shippingContactMobilePhone,
          shippingContactPhone: props.shippingContactPhone,
          shippingContactEmail: props.shippingContactEmail,
          shippingCompanyName: props.shippingCompanyName,
          shippingAddressStreet: props.shippingAddressStreet,
          shippingAddressStreet2: props.shippingAddressStreet2,
          shippingAddressCity: props.shippingAddressCity,
          shippingAddressStateProvince: props.shippingAddressStateProvince,
          shippingAddressCountry: props.shippingAddressCountry,
          shippingAddressPostcodeZip: props.shippingAddressPostcodeZip,
        });

        // Logging the payload before the Axios request
        console.log('Request Payload:', requestData);

        const endpoint = getEndpoint(environment);
        const response = await axios.post(endpoint, requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Logging the response after receiving it
        console.log('Response:', response.data);

        if (response.status === 200) {
          const paymentData: PaymentData = response.data;
          props.onPaymentStarted && props.onPaymentStarted(paymentData);
          setResponseUrl(paymentData.paymentPage);
        } else {
          throw new Error(response.data);
        }
      } catch (error) {
        props.onPaymentError &&
          props.onPaymentError(JSON.stringify(onError(error)));
      }
    };

    fetchResponseUrl();
  }, [props]);

  if (errorOccurred) {
    return (
      <ErrorComponent
        goBack={() => {
          console.log('Payment Cancelled!');
          props.onPaymentCancelled && props.onPaymentCancelled();
        }}
      />
    );
  }

  if (!responseUrl) {
    if (validationErrorOccurred) {
      props.onPaymentCancelled && props.onPaymentCancelled();
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          source={{ uri: responseUrl }}
          onNavigationStateChange={(event) => {
            if (event.url.includes(props.PAYableIPGClient.returnUrl)) {
              const returnData: ReturnData = getReturnData(event.url);
              props.onPaymentCompleted && props.onPaymentCompleted(returnData);
            }
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default PayableIPG;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchReceiptStatusWithRetry } from '../api/receiptApi';

type RootStackParamList = {
  Landing: undefined;
  Invoice: undefined;
  InvoiceLoading: {
    uid: string;
    statusIndicator: string;
  };
};

type InvoiceLoadingScreenNavigationProp = NavigationProp<RootStackParamList, 'Landing' | 'Invoice'>;
type InvoiceLoadingScreenRouteProp = RouteProp<RootStackParamList, 'InvoiceLoading'>;

const InvoiceLoadingScreen: React.FC = () => {
  const navigation = useNavigation<InvoiceLoadingScreenNavigationProp>();
  const route = useRoute<InvoiceLoadingScreenRouteProp>();
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [maxAttempts] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Retrieving your invoice...');

  const { uid, statusIndicator } = route.params;

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setIsLoading(true);
        
        const invoiceData = await fetchReceiptStatusWithRetry(
          uid,
          statusIndicator,
          maxAttempts,
          2000, // 2 second delay between attempts
          (attempt, maxRetries) => {
            setCurrentAttempt(attempt);
            if (attempt === 1) {
              setLoadingMessage('Retrieving your invoice...');
            } else {
              setLoadingMessage(`Retrieving invoice... (${attempt}/${maxRetries})`);
            }
          }
        );

        if (invoiceData) {
          // Store invoice data and navigate to invoice screen
          try {
            const dataToStore = Array.isArray(invoiceData) ? invoiceData[0] : invoiceData;
            await AsyncStorage.setItem('latestInvoiceData', JSON.stringify(dataToStore));
            console.log('🧾 Invoice data saved successfully from loading screen', dataToStore);
            
            setLoadingMessage('Invoice retrieved successfully!');
            
            // Small delay to show success message
            setTimeout(() => {
              navigation.replace('Invoice');
            }, 500);
            
          } catch (error) {
            console.error('Failed to save invoice data:', error);
            showErrorAndGoHome('Failed to save invoice data');
          }
        } else {
          showErrorAndGoHome('Unable to retrieve invoice after multiple attempts');
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        showErrorAndGoHome('An error occurred while retrieving the invoice');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceData();
  }, [uid, statusIndicator, navigation, maxAttempts]);

  const showErrorAndGoHome = (message: string) => {
    setIsLoading(false);
    Alert.alert(
      'Invoice Retrieval Failed',
      message,
      [
        {
          text: 'Go to Home',
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'Landing' }],
          }),
        },
      ]
    );
  };

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Landing' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isLoading ? (
          <>
            <ActivityIndicator size="large" color="#3498db" style={styles.spinner} />
            <Text style={styles.title}>Processing Payment</Text>
            <Text style={styles.message}>{loadingMessage}</Text>
            
            {currentAttempt > 1 && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  Attempt {currentAttempt} of {maxAttempts}
                </Text>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${(currentAttempt / maxAttempts) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
            )}
            
            <Text style={styles.subMessage}>
              Please wait while we retrieve your payment invoice...
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>✅ Success!</Text>
            <Text style={styles.message}>Invoice retrieved successfully</Text>
          </>
        )}
      </View>
      
      {!isLoading && (
        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={handleGoHome}
            style={styles.button}
          >
            Go to Home
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spinner: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2c3e50',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    color: '#34495e',
  },
  subMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  progressBarContainer: {
    width: '80%',
    height: 4,
    backgroundColor: '#ecf0f1',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 2,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    borderColor: '#3498db',
  },
});

export default InvoiceLoadingScreen;



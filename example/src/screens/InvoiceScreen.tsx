import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { InvoiceData } from '../api/receiptApi';

type RootStackParamList = {
  Landing: undefined;
  Invoice: undefined;
};

type InvoiceScreenNavigationProp = NavigationProp<RootStackParamList, 'Landing'>;

const InvoiceScreen: React.FC = () => {
  const navigation = useNavigation<InvoiceScreenNavigationProp>();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoiceData = async () => {
      try {
        console.log('🧾 Loading invoice data...');
        const invoiceDataString = await AsyncStorage.getItem('latestInvoiceData');
        
        if (invoiceDataString) {
          const parsedInvoiceData = JSON.parse(invoiceDataString);
          console.log('🧾 Invoice data loaded:', parsedInvoiceData);
          setInvoiceData(parsedInvoiceData);
          
          // Clear the data after loading it
          await AsyncStorage.removeItem('latestInvoiceData');
        } else {
          console.log('🧾 No invoice data found');
          Alert.alert('Error', 'No invoice data found');
          navigation.navigate('Landing');
        }
      } catch (error) {
        console.error('Error loading invoice data:', error);
        Alert.alert('Error', 'Failed to load invoice data');
        navigation.navigate('Landing');
      } finally {
        setLoading(false);
      }
    };

    loadInvoiceData();
  }, [navigation]);

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Landing' }],
    });
  };

  const formatFieldName = (key: string): string => {
    // Convert camelCase and specific field names to readable format
    const fieldMappings: { [key: string]: string } = {
      'echeckoutAmount': 'Amount',
      'echeckoutCurrency': 'Currency',
      'echeckoutOrderId': 'Order ID',
      'echeckoutTransactionId': 'Transaction ID',
      'invoiceNo': 'Invoice Number',
      'statusCode': 'Status Code',
      'statusMessage': 'Status',
      'paymentType': 'Payment Type',
      'paymentMethod': 'Payment Method',
      'paymentScheme': 'Card Type',
      'cardHolderName': 'Cardholder Name',
      'cardNumber': 'Card Number',
      'merchantKey': 'Merchant Key',
      'uid': 'Payment UID',
      'statusIndicator': 'Status Indicator',
      'createdAt': 'Transaction Date',
      'updatedAt': 'Last Updated',
    };

    return fieldMappings[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const formatFieldValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    
    // Format specific fields
    if (key === 'echeckoutAmount' && invoiceData?.echeckoutCurrency) {
      return `${value} ${invoiceData.echeckoutCurrency}`;
    }
    
    if (key === 'createdAt' || key === 'updatedAt') {
      return new Date(value).toLocaleString();
    }
    
    if (key === 'statusMessage' && value === 'SUCCESS') {
      return '✅ SUCCESS';
    }
    
    return value.toString();
  };

  const isDisplayField = (key: string): boolean => {
    // Hide internal MongoDB fields and less important fields
    const hiddenFields = ['_id', '__v', 'merchantKey', 'uid', 'statusIndicator'];
    return !hiddenFields.includes(key);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading invoice...</Text>
      </View>
    );
  }

  if (!invoiceData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No invoice data available</Text>
        <Button mode="contained" onPress={handleGoHome} style={styles.button}>
          Go to Home
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>🧾 Payment Invoice</Text>
        <Text style={styles.subtitle}>Transaction completed successfully</Text>
        
        <View style={styles.tableContainer}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={styles.headerCell}>Field</DataTable.Title>
              <DataTable.Title style={styles.headerCell}>Value</DataTable.Title>
            </DataTable.Header>
            
            {Object.entries(invoiceData)
              .filter(([key]) => isDisplayField(key))
              .map(([key, value]) => (
                <DataTable.Row key={key}>
                  <DataTable.Cell style={styles.fieldCell}>
                    {formatFieldName(key)}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.valueCell}>
                    {formatFieldValue(key, value)}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
          </DataTable>
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={handleGoHome}
          style={styles.homeButton}
          contentStyle={styles.buttonContent}
        >
          Go to Home
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#27ae60',
    fontWeight: '500',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerCell: {
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
  },
  fieldCell: {
    // fontWeight: '600', // Commented out due to type conflict
    color: '#2c3e50',
  },
  valueCell: {
    // color: '#34495e', // Commented out due to type conflict  
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  homeButton: {
    backgroundColor: '#3498db',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  button: {
    marginTop: 16,
  },
});

export default InvoiceScreen;

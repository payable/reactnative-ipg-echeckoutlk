import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import packageJson from '../../package.json';
import Modal from 'react-native-modal';
import { DataTable } from 'react-native-paper';
import { getLatestPaymentData } from '../api/merchantApi';

type RootStackParamList = {
  CheckoutDataForm: undefined;
  LoginScreen: undefined;
};

type LandingScreenNavigationProp = NavigationProp<
  RootStackParamList,
  'CheckoutDataForm' | 'LoginScreen'
>;

const LandingScreen: React.FC = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const selectedFields = [
    "paymentId",
    "refNo",
    "statusCode",
    "transactionId",
    "paymentMethod",
    "orderId",
    "invoiceNo",
    "amount",
    "currency",
    "status",
    "paymentType",
    "paymentScheme",
    "cardholderName",
    "cardNumber",
    "custom1",
    "custom2",
    "checkValue",
  ];

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        setIsLoggedIn(!!userData);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, [refreshFlag]);

  const handlePaymentPress = () => {
    navigation.navigate('CheckoutDataForm');
  };

  const handleLoginPress = () => {
    navigation.navigate('LoginScreen');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      console.log('User data cleared from AsyncStorage');
      Alert.alert('Success', 'You have successfully logged out.');
      setRefreshFlag((prev) => !prev);
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      Alert.alert('Error', 'There was a problem logging out.');
    }
  };

  const handleViewLastTransaction = async () => {
    try {
      const data = await getLatestPaymentData();
      if (data) {
        const filteredData = selectedFields.reduce((acc, key) => {
          if (data[key]) acc[key] = data[key];
          return acc;
        }, {} as Record<string, string>);
        setTransactionData(filteredData);
        setIsModalVisible(true);
      } else {
        Alert.alert('Error', 'Failed to fetch transaction data');
      }
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      Alert.alert('Error', 'There was a problem fetching transaction data');
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          <Button title="Checkout" onPress={handlePaymentPress} />
          <View style={{ height: 20 }} />
          <Button title="Logout" onPress={handleLogout} />
          <View style={{ height: 20 }} />
          <Button title="View Last Transaction" onPress={handleViewLastTransaction} />
        </>
      ) : (
        <Button title="Login" onPress={handleLoginPress} />
      )}
      <Text style={styles.version}>Version: {packageJson.version}</Text>

      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Last Transaction Details</Text>
          {transactionData ? (
            <ScrollView>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Field</DataTable.Title>
                  <DataTable.Title>Value</DataTable.Title>
                </DataTable.Header>
                {Object.entries(transactionData).map(([key, value]) => (
                  <DataTable.Row key={key}>
                    <DataTable.Cell>{key}</DataTable.Cell>
                    <DataTable.Cell style={styles.cellValue}>{value?.toString()}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </ScrollView>
          ) : (
            <Text>No transaction data available</Text>
          )}
          <Button title="Close" onPress={closeModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  version: {
    position: 'absolute',
    bottom: 20,
    fontSize: 16,
    color: 'gray',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  cellValue: {
    flexWrap: 'wrap', // Allows text to wrap within the cell
  },
});

export default LandingScreen;

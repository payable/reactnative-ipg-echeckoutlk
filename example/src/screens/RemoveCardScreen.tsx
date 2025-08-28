import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import SavedCardList from '../components/SavedCardList';
import { deleteCard } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCheckValueForDeleteCard } from '../utils/TokenPayment';
import { useNavigation, type NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Landing: undefined;
};

type RemoveCardScreenNavigationProp = NavigationProp<
  RootStackParamList,
  'Landing'
>;

const RemoveCardScreen = () => {
  const [customerId, setCustomerId] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [merchantToken, setMerchantToken] = useState('');
  const navigation = useNavigation<RemoveCardScreenNavigationProp>();

  useEffect(() => {
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

    fetchMerchantToken();
  }, []);

  const handleCardSelection = (
    customerId: string,
    merchantId: string,
    tokenId: string
  ) => {
    setCustomerId(customerId);
    setMerchantId(merchantId);
    setTokenId(tokenId);
    console.log('Selected Card Info Remove Card:', {
      customerId,
      merchantId,
      tokenId,
    });
  };

  const confirmDeleteCard = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to remove this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: handleDeleteCard },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteCard = async () => {
    if (!tokenId) {
      Alert.alert('Error', 'Please select a card to remove');
      return;
    }

    const requestBody = {
      merchantId,
      customerId,
      tokenId,
      checkValue: getCheckValueForDeleteCard(
        merchantId,
        customerId,
        tokenId,
        merchantToken
      ),
    };

    try {
      const response = await deleteCard(requestBody);
      Alert.alert('Success', 'Card deleted successfully!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Landing' }],
      });

      console.log('Delete card response:', response);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete card. Please try again.');
      console.error('Delete card error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Remove Card</Text>
      <SavedCardList onCardSelect={handleCardSelection} />

      <View style={styles.row}>
        {tokenId ? (
          <Button
            color={'red'}
            title="Remove Selected Card"
            onPress={confirmDeleteCard}
          />
        ) : (
          <Text style={{ color: 'red', fontSize: 18 }}>
            Please select a card to remove
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RemoveCardScreen;

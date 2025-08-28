import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { fetchTokenizedCards } from '../api/api'; // Adjust the import path as necessary
import { getCheckValueForListCardAPI } from '../utils/TokenPayment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMerchantAndCustomerIds } from '../api/merchantApi';
import {
  useNavigation,
  useRoute,
  type NavigationProp,
} from '@react-navigation/native';

interface SavedCardListProps {
  onCardSelect: (
    customerId: string,
    merchantId: string,
    tokenId: string
  ) => void;
}

type RootStackParamList = {
  RemoveCardScreen: undefined;
};

type SavedCardListNavigationProp = NavigationProp<
  RootStackParamList,
  'RemoveCardScreen'
>;

const SavedCardList: React.FC<SavedCardListProps> = ({ onCardSelect }) => {
  const navigation = useNavigation<SavedCardListNavigationProp>();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [tokenizedCardList, setTokenizedCardList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [merchantId, setMerchantId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [merchantToken, setMerchantToken] = useState('');
  const route = useRoute();

  useEffect(() => {
    fetchRefNoAndData();
  }, []);

  useEffect(() => {
    if (merchantId && customerId) {
      loadTokenizedCards();
    }
  }, [merchantId, customerId]);

  const fetchRefNoAndData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const mToken = await AsyncStorage.getItem('merchantToken');

      if (mToken) {
        setMerchantToken(mToken);
      }

      if (userData) {
        const parsedData = JSON.parse(userData);
        const refNoFromStorage = parsedData.refNo;

        const data = await getMerchantAndCustomerIds(refNoFromStorage);
        if (data.merchantId && data.customerId) {
          setMerchantId(data.merchantId);
          setCustomerId(data.customerId);
        } else {
          setLoading(false);
        }
      } else {
        console.error('No user data found');
      }
    } catch (error) {
      console.error('Error fetching refNo:', error);
    }
  };

  const loadTokenizedCards = async () => {
    const requestBody = {
      merchantId,
      customerId,
      checkValue: getCheckValueForListCardAPI(
        merchantId,
        customerId,
        merchantToken
      ),
    };

    try {
      setLoading(true);
      const response = await fetchTokenizedCards(requestBody);
      setTokenizedCardList(response.tokenizedCardList);
    } catch (error) {
      console.error('Failed to load tokenized cards:', error);
      // Handle 404 error for "No saved cards"
      if ((error as any).response && (error as any).response.status === 404) {
        setError('404');
      } else {
        setError('Failed to load saved cards. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleCardSelection = (tokenId: string) => {
    setSelectedCard((prevSelectedCard) =>
      prevSelectedCard === tokenId ? null : tokenId
    );
  };

  const handleCardSelection = (tokenId: string) => {
    toggleCardSelection(tokenId);
    const newTokenId = selectedCard === tokenId ? '' : tokenId;
    onCardSelect(customerId, merchantId, newTokenId);
  };

  const renderCardItem = (item: any) => {
    const expireDate = item.exp.slice(0, 2) + '/' + item.exp.slice(2);
    const isSelected = selectedCard === item.tokenId;

    return (
      <TouchableOpacity
        key={item.tokenId}
        style={[styles.cardItem, isSelected && styles.selectedCard]}
        onPress={() => handleCardSelection(item.tokenId)}
      >
        <Image
          source={
            item.cardScheme === 'MASTERCARD'
              ? require('../assets/master.png')
              : require('../assets/visa.png')
          }
          style={styles.cardLogo}
        />
        <Text style={styles.cardNumber}>{item.maskedCardNo}</Text>
        <Text style={styles.expireDate}>Expires: {expireDate}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        error === '404' ? (
          <Text style={{ fontSize: 20, marginBottom: 20 }}>
            You don't have saved cards.
          </Text>
        ) : (
          <Text style={styles.error}>{error}</Text>
        )
      ) : tokenizedCardList.length > 0 ? (
        <View>
          {route.name !== 'RemoveCardScreen' && (
            <View style={styles.carLableRow}>
              <Text style={styles.label}>Card Selection</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('RemoveCardScreen');
                }}
              >
                <Text style={{ color: 'blue' }}>Edit Cards</Text>
              </TouchableOpacity>
            </View>
          )}
          {tokenizedCardList.map(renderCardItem)}
        </View>
      ) : (
        <Text style={{ fontSize: 20, marginBottom: 20 }}>
          You don't have saved cards.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedCard: {
    backgroundColor: '#d1e7dd',
  },
  cardLogo: {
    width: 40,
    objectFit: 'contain',
    height: 40,
    marginRight: 10,
  },
  cardNumber: {
    fontSize: 18,
    flex: 1,
  },
  expireDate: {
    fontSize: 16,
    color: 'gray',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  carLableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginBottom: 12,
  },
});

export default SavedCardList;

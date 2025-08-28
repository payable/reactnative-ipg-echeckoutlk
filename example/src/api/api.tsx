import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode as btoa } from 'base-64'; // Use this for Base64 encoding


const rootUrl = 'https://sandboxipgpayment.payable.lk';
// const rootUrl = 'https://payable-ipg-dev.web.app';
// const rootUrl = 'https://qaipgpayment.payable.lk';


interface TokenizeCardRequest {
  merchantId: string;
  customerId: string;
  checkValue: string;
}

interface TokenizedCard {
  tokenId: string;
  maskedCardNo: string;
  exp: string;
  reference: string;
  nickname: string;
  cardScheme: string;
  tokenStatus: string;
}

interface TokenizeCardResponse {
  customerId: string;
  customerRefNo: string;
  tokenizedCardCount: number;
  tokenizedCardList: TokenizedCard[];
  checkValue: string;
}

interface AuthTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

interface TokenPayRequest {
  merchantId: string;
  customerId: string;
  webhookUrl: string;
  tokenId: string;
  invoiceId: string;
  currencyCode: string;
  amount: string;
  custom1?: string;
  custom2?: string;
  checkValue: string;
}

interface TokenDeleteRequest {
  merchantId: string;
  customerId: string;
  tokenId: string;
  checkValue: string;
}

interface TokenDeleteResponse {
  customerRefNo: string;
  customerId: string;
  tokenId: string;
  tokenStatus: string;
  checkValue: string;
}

interface TokenPayResponse {
  // Define the structure of the response you expect
  success: boolean;
  message: string;
  data?: any; // Modify this according to the expected data structure
}

// Method to fetch tokenized cards
export const fetchTokenizedCards = async (requestBody: TokenizeCardRequest): Promise<TokenizeCardResponse> => {
  console.log(requestBody);

  try {
    const response = await axios.post<TokenizeCardResponse>(`${rootUrl}/ipg/v2/tokenize/listCard`, requestBody);
    console.log('Tokenized cards:', response);

    return response.data;

  } catch (error) {
    console.error('Error fetching tokenized cards:', error);
    throw error; 
  }
};

// Method to get auth token
export const getAuthToken = async (): Promise<AuthTokenResponse> => {
  try {
    // Retrieve Business Key and Business Token from AsyncStorage
    const businessKey = await AsyncStorage.getItem('businessKey');
    const businessToken = await AsyncStorage.getItem('businessToken');

    if (!businessKey || !businessToken) {
      throw new Error('Business Key and Business Token must be set in AsyncStorage');
    }

    // Create the Authorization code using btoa
    const authCode = btoa(`${businessKey}:${businessToken}`);

    // Request body for the tokenization request
    const requestBody = {
      grant_type: 'client_credentials',
    };

    // Sending POST request to get the authorization token
    const response = await axios.post<any>(
      `${rootUrl}/ipg/v2/auth/tokenize`,
      requestBody,
      {
        headers: {
          Authorization: authCode, 
        },
      }
    );
    return response.data.accessToken;
  } catch (error) {
    console.error('Error fetching auth token:', error);
    throw error; 
  }
};


// Method to process payment using tokenized card
export const tokenPay = async (requestBody: TokenPayRequest): Promise<TokenPayResponse> => {

  try {
    // Retrieve the auth token
    const authTokenResponse = await getAuthToken();
    
    // Sending POST request to process payment
    const response = await axios.post<TokenPayResponse>(
      `${rootUrl}/ipg/v2/tokenize/pay`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${authTokenResponse}`, // Use Bearer token
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error; 
  }
};


// Method to delete a card
export const deleteCard = async (requestBody: TokenDeleteRequest): Promise<TokenDeleteResponse> => {
  try {
    const response = await axios.post<TokenDeleteResponse>(`${rootUrl}/ipg/v2/tokenize/deleteCard`, requestBody);
    console.log('Card deleted successfully:', response.data);
    return response.data; // Return the response for further processing if needed
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
};
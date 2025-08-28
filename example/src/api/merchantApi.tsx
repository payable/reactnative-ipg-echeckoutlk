import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://ipgsamplemerchantserver.payable.lk'; // Replace with your server URL

export const getMerchantAndCustomerIds = async (refNo: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/${refNo}`);
    if (response.status === 200) {
      return response.data; // Contains merchantId and customerId
    } else {
      console.error('Failed to fetch data:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching merchant and customer IDs:', error);
    return null;
  }
};

export const signup = async (signupData: any) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupData),
    });

    const result = await response.json();

    if (response.ok) {
      return result; // Return result on successful signup
    } else {
      console.error('Signup error:', result.message || 'Signup failed');
      throw new Error(result.message || 'Signup failed');
    }
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      // Login successful
      const userData = {
        refNo: result.user.refNo,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        mobile: result.user.mobile,
        email: result.user.email,
        streetAddress1: result.user.streetAddress1,
        companyName: result.user.companyName,
        townCity: result.user.townCity,
        province: result.user.province,
        country: result.user.country,
        postcode: result.user.postcode,
        phone: result.user.phone,
        customerId: result.user.customerId,
        merchantId: result.user.merchantId,
      };

      // Save user data in AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('User data saved in AsyncStorage');
      return userData; // Return user data if login successful
    } else {
      console.error('Login error:', result.message || 'Login failed');
      throw new Error(result.message || 'Login failed');
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const getLatestPaymentData = async () => {
  try {
    const response = await axios.get(`${API_URL}/webhook/payment`);
    if (response.status === 200) {
      console.log('Latest payment data:', response.data);
      return response.data; // Returns the latest payment data
    } else {
      console.error('Failed to fetch latest payment data:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching latest payment data:', error);
    return null;
  }
};

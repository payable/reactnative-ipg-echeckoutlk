import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  ScrollView,
} from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useFormContext } from '../utils/FormContext';
import { Picker } from '@react-native-picker/picker';
import { signup } from '../api/merchantApi';

type RootStackParamList = {
  ShippingDetailsForm: undefined;
  Landing: undefined;
};

type BillingDataFormNavigationProp = NavigationProp<
  RootStackParamList,
  'Landing'
>;

const cities = ['Colombo', 'Gampaha', 'Kadawatha'];

const countries = [
  { label: 'Sri Lanka', value: 'LK' },
  { label: 'United States', value: 'USA' },
  { label: 'Australia', value: 'AUS' },
  { label: 'Canada', value: 'CAN' },
  { label: 'United Kingdom', value: 'UK' },
];

const BillingDataForm: React.FC = () => {
  const navigation = useNavigation<BillingDataFormNavigationProp>();

  const { formData } = useFormContext();
  const [billingFirstName, setBillingFirstName] = useState(
    formData.billingFirstName || ''
  );
  const [billingLastName, setBillingLastName] = useState(
    formData.billingLastName || ''
  );
  const [billingMobile, setBillingMobile] = useState(
    formData.billingMobile || ''
  );
  const [billingEmail, setBillingEmail] = useState(formData.billingEmail || '');
  const [billingStreetAddress1, setBillingStreetAddress1] = useState(
    formData.billingStreetAddress1 || ''
  );
  const [billingStreetAddress2, setBillingStreetAddress2] = useState(
    formData.billingStreetAddress2 || ''
  );
  const [billingCompanyName, setBillingCompanyName] = useState(
    formData.billingCompanyName || ''
  );
  const [billingTownCity, setBillingTownCity] = useState(
    formData.billingTownCity || cities[0]
  );
  const [billingProvince, setBillingProvince] = useState(
    formData.billingProvince || ''
  );
  const [billingCountry, setBillingCountry] = useState(
    formData.billingCountry || 'LK'
  );
  const [billingPostcode, setBillingPostcode] = useState(
    formData.billingPostcode || ''
  );
  const [password, setPassword] = useState('');
  const [billingPhone, setBillingPhone] = useState(formData.billingPhone || '');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const generateRefNo = (environment: string) => {
    const dateTime = new Date();
    const formattedDateTime = dateTime
      .toISOString()
      .replace(/[-:T]/g, '')
      .slice(0, 14); // Format as YYYYMMDDHHMMSS
    const refNo = `${environment}${formattedDateTime}`; // Combine environment prefix with datetime
    return refNo;
  };

  const handleNext = async () => {
    if (
      !billingFirstName ||
      !billingLastName ||
      !billingMobile ||
      !billingEmail ||
      !billingStreetAddress1 ||
      !billingTownCity ||
      !billingProvince || // Ensure province is filled
      !billingCountry ||
      !password ||
      !billingPostcode
    ) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
  
    if (billingMobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid mobile number.');
      return;
    }
  
    if (!validateEmail(billingEmail)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
  
    try {
      const signupData = {
        refNo: generateRefNo('dev'),
        firstName: billingFirstName,
        lastName: billingLastName,
        mobile: billingMobile,
        email: billingEmail,
        streetAddress1: billingStreetAddress1,
        streetAddress2: billingStreetAddress2,
        companyName: billingCompanyName,
        townCity: billingTownCity,
        province: billingProvince,
        country: billingCountry,
        postcode: billingPostcode,
        phone: billingPhone,
        password: password,
      };
  
      const result = await signup(signupData);
  
      if (result) {
        // Handle successful signup
        Alert.alert('Success', 'Signup successful');
        // Optionally navigate to the next form (e.g., PaymentDataForm)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Landing' }],
        });
      }
    } catch (error) {
      Alert.alert('Error', 'There was a problem with the signup process.');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.label}>First Name (required)</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={billingFirstName}
          onChangeText={setBillingFirstName}
        />
        <Text style={styles.label}>Last Name (required)</Text>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={billingLastName}
          onChangeText={setBillingLastName}
        />
        <Text style={styles.label}>Mobile (required)</Text>
        <TextInput
          style={styles.input}
          placeholder="Mobile"
          value={billingMobile}
          onChangeText={setBillingMobile}
        />
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={billingPhone}
          onChangeText={setBillingPhone}
        />
        <Text style={styles.label}>Email (required)</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={billingEmail}
          onChangeText={setBillingEmail}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Password (required)</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          keyboardType="email-address"
        />
        <Text style={styles.label}>Street Address 1 (required)</Text>
        <TextInput
          style={styles.input}
          placeholder="Street Address 1"
          value={billingStreetAddress1}
          onChangeText={setBillingStreetAddress1}
        />
        <Text style={styles.label}>Street Address 2</Text>
        <TextInput
          style={styles.input}
          placeholder="Street Address 2"
          value={billingStreetAddress2}
          onChangeText={setBillingStreetAddress2}
        />
        <Text style={styles.label}>Company Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Company Name"
          value={billingCompanyName}
          onChangeText={setBillingCompanyName}
        />
        <Text style={styles.label}>Town/City (required)</Text>
        <TextInput
          style={styles.input}
          placeholder="Tonw/City"
          value={billingTownCity}
          onChangeText={setBillingTownCity}
        />
        <Text style={styles.label}>Province (required)</Text>
        <TextInput
          style={styles.input}
          placeholder="Province"
          value={billingProvince}
          onChangeText={setBillingProvince}
        />
        <Text style={styles.label}>Country (required)</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={billingCountry}
            onValueChange={(itemValue) => setBillingCountry(itemValue)}
            style={styles.picker}
          >
            {countries.map((country) => (
              <Picker.Item
                key={country.value}
                label={country.label}
                value={country.value}
              />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Postcode (required)</Text>
        <TextInput
          style={styles.input}
          placeholder="Postcode"
          value={billingPostcode}
          onChangeText={setBillingPostcode}
        />
        <Button title="Signup" onPress={handleNext} />
      </View>
    </ScrollView>
  );
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
  pickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
  },
  picker: {},
  label: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BillingDataForm;

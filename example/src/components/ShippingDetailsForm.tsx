import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useFormContext } from '../utils/FormContext';
import { Picker } from '@react-native-picker/picker';

type RootStackParamList = {
  PaymentDataForm: undefined;
};

type ShippingDetailsFormNavigationProp = NavigationProp<
  RootStackParamList,
  'PaymentDataForm'
>;

const countries = [
  { label: 'Sri Lanka', value: 'LK' },
  { label: 'United States', value: 'USA' },
  { label: 'Australia', value: 'AUS' },
  { label: 'Canada', value: 'CAN' },
  { label: 'United Kingdom', value: 'UK' },
];

const ShippingDetailsForm: React.FC = () => {
  const navigation = useNavigation<ShippingDetailsFormNavigationProp>();
  const { formData, setFormData } = useFormContext();
  const [shippingFirstName, setShippingFirstName] = useState(
    formData.shippingFirstName || ''
  );
  const [shippingLastName, setShippingLastName] = useState(
    formData.shippingLastName || ''
  );
  const [shippingMobile, setShippingMobile] = useState(
    formData.shippingMobile || ''
  );
  const [shippingPhone, setShippingPhone] = useState(
    formData.shippingPhone || ''
  );
  const [shippingEmail, setShippingEmail] = useState(
    formData.shippingEmail || ''
  );
  const [shippingStreetAddress1, setShippingStreetAddress1] = useState(
    formData.shippingStreetAddress1 || ''
  );
  const [shippingStreetAddress2, setShippingStreetAddress2] = useState(
    formData.shippingStreetAddress2 || ''
  );
  const [shippingCompanyName, setShippingCompanyName] = useState(
    formData.shippingCompanyName || ''
  );
  const [shippingTownCity, setShippingTownCity] = useState(
    formData.shippingTownCity || ''
  );
  const [shippingProvince, setShippingProvince] = useState(
    formData.shippingProvince || ''
  );
  const [shippingCountry, setShippingCountry] = useState(
    formData.shippingCountry || 'LK'
  );
  const [shippingPostcode, setShippingPostcode] = useState(
    formData.shippingPostcode || ''
  );

  const handleNext = () => {
    setFormData((prev) => ({
      ...prev,
      shippingFirstName,
      shippingLastName,
      shippingMobile,
      shippingPhone,
      shippingEmail,
      shippingStreetAddress1,
      shippingStreetAddress2,
      shippingCompanyName,
      shippingTownCity,
      shippingProvince,
      shippingCountry,
      shippingPostcode,
    }));
    navigation.navigate('PaymentDataForm');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.label}>Shipping First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={shippingFirstName}
          onChangeText={setShippingFirstName}
        />
        <Text style={styles.label}>Shipping Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={shippingLastName}
          onChangeText={setShippingLastName}
        />
        <Text style={styles.label}>Shipping Mobile</Text>
        <TextInput
          style={styles.input}
          placeholder="Mobile"
          value={shippingMobile}
          onChangeText={setShippingMobile}
        />
        <Text style={styles.label}>Shipping Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={shippingPhone}
          onChangeText={setShippingPhone}
        />
        <Text style={styles.label}>Shipping Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={shippingEmail}
          onChangeText={setShippingEmail}
        />
        <Text style={styles.label}>Shipping Street Address 1</Text>
        <TextInput
          style={styles.input}
          placeholder="Street Address 1"
          value={shippingStreetAddress1}
          onChangeText={setShippingStreetAddress1}
        />
        <Text style={styles.label}>Shipping Street Address 2</Text>
        <TextInput
          style={styles.input}
          placeholder="Street Address 2"
          value={shippingStreetAddress2}
          onChangeText={setShippingStreetAddress2}
        />
        <Text style={styles.label}>Shipping Company Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Company Name"
          value={shippingCompanyName}
          onChangeText={setShippingCompanyName}
        />
        <Text style={styles.label}>Shipping Town/City</Text>
        <TextInput
          style={styles.input}
          placeholder="Shipping Town/City"
          value={shippingTownCity}
          onChangeText={setShippingTownCity}
        />
        <Text style={styles.label}>Shipping Province</Text>
        <TextInput
          style={styles.input}
          placeholder="Shipping Province"
          value={shippingProvince}
          onChangeText={setShippingProvince}
        />
        <Text style={styles.label}>Shipping Country</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={shippingCountry}
            onValueChange={(itemValue) => setShippingCountry(itemValue)}
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
        <Text style={styles.label}>Shipping Postcode</Text>
        <TextInput
          style={styles.input}
          placeholder="Postcode"
          value={shippingPostcode}
          onChangeText={setShippingPostcode}
        />
        <Button title="Next" onPress={handleNext} />
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

export default ShippingDetailsForm;

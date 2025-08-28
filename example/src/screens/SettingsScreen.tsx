import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SettingsScreen: React.FC = () => {
  const [merchantKey, setMerchantKey] = useState('');
  const [merchantToken, setMerchantToken] = useState('');
  const [packageName, setPackageName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [notificationUrl, setNotificationUrl] = useState('');
  const [businessKey, setBusinessKey] = useState('');
  const [businessToken, setBusinessToken] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedMerchantKey = await AsyncStorage.getItem('merchantKey');
        const storedMerchantToken = await AsyncStorage.getItem('merchantToken');
        const storedPackageName = await AsyncStorage.getItem('packageName');
        const storedLogoUrl = await AsyncStorage.getItem('logoUrl');
        const storedNotificationUrl = await AsyncStorage.getItem('notificationUrl');
        const storedBusinessKey = await AsyncStorage.getItem('businessKey');
        const storedBusinessToken = await AsyncStorage.getItem('businessToken');

        if (storedMerchantKey) setMerchantKey(storedMerchantKey);
        if (storedMerchantToken) setMerchantToken(storedMerchantToken);
        if (storedPackageName) setPackageName(storedPackageName);
        if (storedLogoUrl) setLogoUrl(storedLogoUrl);
        if (storedNotificationUrl) setNotificationUrl(storedNotificationUrl);
        if (storedBusinessKey) setBusinessKey(storedBusinessKey);
        if (storedBusinessToken) setBusinessToken(storedBusinessToken);
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    if (
      !merchantKey ||
      !merchantToken ||
      !packageName ||
      !logoUrl ||
      !businessKey ||
      !businessToken ||
      !notificationUrl
    ) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      await AsyncStorage.setItem('merchantKey', merchantKey);
      await AsyncStorage.setItem('merchantToken', merchantToken);
      await AsyncStorage.setItem('packageName', packageName);
      await AsyncStorage.setItem('logoUrl', logoUrl);
      await AsyncStorage.setItem('notificationUrl', notificationUrl);
      await AsyncStorage.setItem('businessKey', businessKey);
      await AsyncStorage.setItem('businessToken', businessToken);
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleCancel = () => {
    setMerchantKey('');
    setMerchantToken('');
    setPackageName('');
    setLogoUrl('');
    setNotificationUrl('');
    setBusinessKey('');
    setBusinessToken('');
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid
      extraScrollHeight={100}
    >
      <Text style={styles.label}>Merchant Key *</Text>
      <TextInput
        style={styles.input}
        placeholder="Merchant Key"
        value={merchantKey}
        onChangeText={setMerchantKey}
      />
      <Text style={styles.label}>Merchant Token *</Text>
      <TextInput
        style={styles.input}
        placeholder="Merchant Token"
        value={merchantToken}
        onChangeText={setMerchantToken}
      />
      <Text style={styles.label}>Business Key *</Text>
      <TextInput
        style={styles.input}
        placeholder="Business Key"
        value={businessKey}
        onChangeText={setBusinessKey}
      />
      <Text style={styles.label}>Business Token *</Text>
      <TextInput
        style={styles.input}
        placeholder="Business Token"
        value={businessToken}
        onChangeText={setBusinessToken}
      />
      <Text style={styles.label}>Package Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Package Name"
        value={packageName}
        onChangeText={setPackageName}
      />
      <Text style={styles.label}>Logo URL *</Text>
      <TextInput
        style={styles.input}
        placeholder="Logo URL"
        value={logoUrl}
        onChangeText={setLogoUrl}
      />
      <Text style={styles.label}>Notification URL *</Text>
      <TextInput
        style={styles.input}
        placeholder="Notification URL"
        value={notificationUrl}
        onChangeText={setNotificationUrl}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.btn} onPress={handleCancel}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default SettingsScreen;

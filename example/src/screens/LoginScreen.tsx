import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { login } from '../api/merchantApi';

type RootStackParamList = {
    Landing: undefined;
    BillingDataForm: undefined;
  };
  
  type LoginScreenNavigationProp = NavigationProp<
    RootStackParamList,
    'Landing' | 'BillingDataForm'
  >;
  

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }
  
    try {
      const userData = await login(email, password);
  
      if (userData) {
        // Navigate to another screen (optional)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Landing' }],
        });
  
        Alert.alert('Success', 'Login successful!');
      }
    } catch (error) {
      Alert.alert('Error', 'There was a problem with the login process.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
      />

      <Button title="Login" onPress={handleLogin} />

        <TouchableOpacity 
            onPress={() => navigation.navigate('BillingDataForm')}
        >
           <Text style={{marginTop: 30, textAlign: 'center'}}>Don't have an account? Sign up here</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default LoginScreen;

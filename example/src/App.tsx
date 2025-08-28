import React from 'react';
import PaymentScreen from './screens/PaymentScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LandingScreen from './screens/LandingScreen';
import SettingsScreen from './screens/SettingsScreen';
import { Button } from 'react-native';
import { FormProvider } from './utils/FormContext';
import CheckoutDataForm from './components/CheckoutDataForm';
import BillingDataForm from './components/BillingDataForm';
import PaymentDataForm from './components/PaymentDataForm';
import ShippingDetailsForm from './components/ShippingDetailsForm';
import ErrorsScreen from './screens/ErrorsScreen';
import LoginScreen from './screens/LoginScreen';
import RemoveCardScreen from './screens/RemoveCardScreen';

const Stack = createNativeStackNavigator();

const SettingsButton = ({ navigation }: { navigation: any }) => (
  <Button onPress={() => navigation.navigate('Settings')} title="Settings" />
);

const AppContent = () => {
  return (
    <FormProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={({ navigation }) => ({
              headerRight: () => <SettingsButton navigation={navigation} />,
              title: 'Welcome',
            })}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RemoveCardScreen" component={RemoveCardScreen} />
          <Stack.Screen
            name="CheckoutDataForm"
            component={CheckoutDataForm}
            options={{ title: 'Checkout Data' }}
          />
          <Stack.Screen
            name="BillingDataForm"
            component={BillingDataForm}
            options={{ title: 'Signup' }}
          />
          <Stack.Screen
            name="ShippingDetailsForm"
            component={ShippingDetailsForm}
            options={{ title: 'Shipping Data' }}
          />
          <Stack.Screen
            name="PaymentDataForm"
            component={PaymentDataForm}
            options={{ title: 'Payment Data' }}
          />

          <Stack.Screen
            name="Error"
            component={ErrorsScreen}
            options={{ title: 'Error Data' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FormProvider>
  );
};

const App = () => <AppContent />;

export default App;

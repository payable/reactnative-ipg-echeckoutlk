import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import {
  useRoute,
} from '@react-navigation/native';

interface ErrorsScreenProps {
  errors?: string[];
}



const ErrorsScreen: React.FC<ErrorsScreenProps> = () => {

  const route = useRoute();
  const { errors } = route.params as { errors: string[] };

  return (
    <View style={styles.container}>
      <View style={styles.errorList}>
        {errors?.map((error, index) => (
          <Text key={index} style={styles.errorItem}>
            {error}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 26,
  },
  errorList: {
    width: '80%',
  },
  errorItem: {
    fontSize: 16,
    marginBottom: 8,
    color: 'red',
  },
});

export default ErrorsScreen;

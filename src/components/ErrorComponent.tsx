import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

type Props = {
  goBack?: () => void;
};

function ErrorComponent({ goBack }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View>
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: 'https://www.payable.lk/my-content/uploads/2022/11/footerlogo.png',
              }}
              style={styles.logo}
            />
          </View>

          <View style={styles.horizontalLine} />

          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error!</Text>
            <Text style={styles.errorDesc}>
              Something went wrong. Please contact your merchant.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.btn} onPress={goBack}>
                <AntDesign name="arrowleft" size={20} color="white" />
                <Text style={styles.btnText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.horizontalLine} />

          <View style={styles.errorFooter}>
            <Text style={styles.footerText}>
              The payment will be processed through PAYable Private Limited. For
              inquiries, call Customer Support at +9411 777 6777
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4f79b7',
  },
  card: {
    backgroundColor: 'white',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  logo: {
    resizeMode: 'contain',
    width: 120,
    height: 50,
  },
  errorTitle: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    color: 'red',
  },
  errorDesc: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  errorContainer: {
    marginTop: 20,
  },
  horizontalLine: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginTop: 20,
  },
  errorFooter: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#4988b3',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    width: '50%',
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    marginLeft: 5,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'gray',
    lineHeight: 20,
  },
});

export default ErrorComponent;

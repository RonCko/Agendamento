import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

const LoginScreen = () => {
  const [ra, setRa] = React.useState('');
  const handleRaChange = (text) => {
    // lógica para formatar o R.A com 'a' no início e aceitar apenas números
    const numbers = text.replace(/[^0-9]/g, '');
    if (numbers.length > 0) {
      setRa('a' + numbers);
    } else {
      setRa('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/images/logo_utfpr.png')}
          style={styles.logo}
        />
        <TextInput
          style={styles.input}
          placeholder="R.A"
          placeholderTextColor="#888"
          keyboardType='numeric'
          value={ra}
          onChangeText={handleRaChange}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry
          autoCapitalize='none'
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.forgotButton}>
        <Text style={styles.forgotButtonText}>Esqueceu a senha?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 300,
    height: 150,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#fecc00ff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotButton: {
    alignSelf: 'center',
    marginBottom: 10,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#cfcfcfff',
    width: '100%',
    alignItems: 'center',
  },
  forgotButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default LoginScreen;
import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import styles from './styles';

const LoginScreen = ({ navigation }) => {
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
          source={require('../../../assets/images/logo_utfpr.png')}
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Tabs')} // Ajustado: agora 'Tabs' é a rota correta do Stack
        >
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.forgotButton}>
        <Text style={styles.forgotButtonText}>Esqueceu a senha?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
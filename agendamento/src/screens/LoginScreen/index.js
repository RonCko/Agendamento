import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import styles from './styles';

const LoginScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [ra, setRa] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleRaChange = (text) => {
    // lógica para formatar o R.A com 'a' no início e aceitar apenas números
    const numbers = text.replace(/[^0-9]/g, '');
    if (numbers.length > 0) {
      setRa('a' + numbers);
    } else {
      setRa('');
    }
  };

  const handleLogin = async () => {
    if (!ra || !password) {
      Alert.alert('Erro', 'Por favor, preencha R.A e senha');
      return;
    }

    setLoading(true);

    try {
      // Extrair apenas números do RA (remover o 'a')
      const raNumber = ra.replace(/[^0-9]/g, '');

      // Buscar o email associado ao RA na tabela aluno
      const { data: aluno, error: alunoError } = await supabase
        .from('aluno')
        .select('email')
        .eq('RA', raNumber)
        .single();

      if (alunoError || !aluno) {
        throw new Error('R.A não encontrado. Verifique suas credenciais ou cadastre-se primeiro.');
      }

      // Autenticar usando o email encontrado
      const { data, error } = await supabase.auth.signInWithPassword({
        email: aluno.email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        // Login bem-sucedido
        navigation.replace('Tabs');
      }
    } catch (error) {
      Alert.alert(
        'Erro ao fazer login',
        error.message || 'Verifique suas credenciais e tente novamente'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right','bottom']}>
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
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Acessar</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.footerContainer}>
        <TouchableOpacity 
          style={styles.signupButton}
          onPress={() => navigation.navigate('SignUp')}
          disabled={loading}
        >
          <Text style={styles.signupButtonText}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.forgotButton, { paddingBottom: Math.max(insets.bottom, 8) }]}>
          <Text style={styles.forgotButtonText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
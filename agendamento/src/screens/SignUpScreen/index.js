import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import styles from './styles';

const SignUpScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [ra, setRa] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleRaChange = (text) => {
    const numbers = text.replace(/[^0-9]/g, '');
    if (numbers.length > 0) {
      setRa('a' + numbers);
    } else {
      setRa('');
    }
  };

  const handleSignUp = async () => {
    // Validações
    if (!ra || !name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Validar formato do email institucional
    if (!email.endsWith('@alunos.utfpr.edu.br')) {
      Alert.alert('Erro', 'Por favor, use seu email institucional (@alunos.utfpr.edu.br)');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Extrair apenas números do RA (remover o 'a')
      const raNumber = ra.replace(/[^0-9]/g, '');

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ra: ra, // Guarda com 'a' para exibição
            ra_number: raNumber, // Guarda só números para o banco
            name: name,
            email_institucional: email,
            curso: 'Engenharia de Software', // Curso padrão fixo
          },
        },
      });

      if (error) {
        throw error;
      }

      Alert.alert(
        'Cadastro realizado!',
        'Sua conta foi criada com sucesso. Faça login para continuar.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Erro ao criar conta',
        error.message || 'Tente novamente mais tarde'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top','left','right','bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Image
              source={require('../../../assets/images/logo_utfpr.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Preencha seus dados para se cadastrar</Text>

            <TextInput
              style={styles.input}
              placeholder="R.A"
              placeholderTextColor="#888"
              keyboardType='numeric'
              value={ra}
              onChangeText={handleRaChange}
              editable={!loading}
              autoCapitalize='none'
            />

            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
              editable={!loading}
              autoCapitalize='words'
            />

            <TextInput
              style={styles.input}
              placeholder="Email institucional"
              placeholderTextColor="#888"
              keyboardType='email-address'
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              autoCapitalize='none'
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#888"
              secureTextEntry
              secureTextEntryTextColor="#000"
              autoCapitalize='none'
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor="#888"
              secureTextEntry
              secureTextEntryTextColor="#000"
              autoCapitalize='none'
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
              returnKeyType="go"
              onSubmitEditing={handleSignUp}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.taButton}
              onPress={() => navigation.navigate('SignUpTA')}
              disabled={loading}
            >
              <Text style={styles.taButtonText}>Cadastro para Técnico Administrativo</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

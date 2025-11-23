import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../lib/supabase';
import styles from './styles';

const SignUpTAScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setorId, setSetorId] = useState('');
  const [setores, setSetores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSetores();
  }, []);

  async function loadSetores() {
    try {
      const { data, error } = await supabase
        .from('setor')
        .select('id, nome')
        .order('nome');

      if (error) throw error;
      setSetores(data || []);
    } catch (error) {
      console.error('Erro ao carregar setores:', error);
    }
  }

  const handleSignUp = async () => {
    // Validações
    if (!name || !email || !password || !confirmPassword || !setorId) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Validar formato do email institucional
    if (!email.endsWith('@utfpr.edu.br')) {
      Alert.alert('Erro', 'Por favor, use seu email institucional (@utfpr.edu.br)');
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
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            user_type: 'tec_adm',
            setor_id: setorId,
          },
        },
      });

      if (authError) throw authError;

      // Criar registro na tabela tec_adm
      const { error: tecError } = await supabase
        .from('tec_adm')
        .insert([{
          nome: name,
          email: email,
          setor_id: setorId,
          auth_user_id: authData.user.id,
        }]);

      if (tecError) throw tecError;

      Alert.alert(
        'Cadastro realizado!',
        'Sua conta de Técnico Administrativo foi criada com sucesso.',
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
            <Text style={styles.title}>Cadastro TA</Text>
            <Text style={styles.subtitle}>Técnico Administrativo</Text>

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

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={setorId}
                onValueChange={(itemValue) => setSetorId(itemValue)}
                enabled={!loading}
                style={styles.picker}
              >
                <Picker.Item label="Selecione o setor" value="" />
                {setores.map((setor) => (
                  <Picker.Item key={setor.id} label={setor.nome} value={setor.id} />
                ))}
              </Picker>
            </View>

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

            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor="#888"
              secureTextEntry
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpTAScreen;

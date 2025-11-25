import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import styles from './styles';

const LoginScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [loginType, setLoginType] = useState('aluno'); // 'aluno' ou 'ta'
  const [ra, setRa] = useState('');
  const [email, setEmail] = useState('');
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
    if (loginType === 'aluno') {
      if (!ra || !password) {
        Alert.alert('Erro', 'Por favor, preencha R.A e senha');
        return;
      }
    } else {
      if (!email || !password) {
        Alert.alert('Erro', 'Por favor, preencha email e senha');
        return;
      }
    }

    setLoading(true);

    try {
      if (loginType === 'aluno') {
        // Login como aluno (usando RA)
        const raNumber = ra.replace(/[^0-9]/g, '');

        const { data: aluno, error: alunoError } = await supabase
          .from('aluno')
          .select('email')
          .eq('RA', raNumber)
          .single();

        if (alunoError || !aluno) {
          throw new Error('R.A não encontrado. Verifique suas credenciais ou cadastre-se primeiro.');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: aluno.email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          navigation.replace('Tabs');
        }
      } else {
        // Login como TA (usando email)
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Verificar se o usuário existe na tabela tec_adm e buscar role
        const { data: tecAdm, error: tecError } = await supabase
          .from('tec_adm')
          .select('id, role')
          .eq('email', email)
          .single();

        if (tecError || !tecAdm) {
          await supabase.auth.signOut();
          throw new Error('Usuário não encontrado como Técnico Administrativo.');
        }

        if (data.session) {
          // Redirecionar baseado no role
          if (tecAdm.role === 'admin') {
            navigation.replace('TabsAdmin');
          } else {
            navigation.replace('TabsTA');
          }
        }
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
        
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, loginType === 'aluno' && styles.toggleButtonActive]}
            onPress={() => setLoginType('aluno')}
            disabled={loading}
          >
            <Text style={[styles.toggleText, loginType === 'aluno' && styles.toggleTextActive]}>
              Aluno
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, loginType === 'ta' && styles.toggleButtonActive]}
            onPress={() => setLoginType('ta')}
            disabled={loading}
          >
            <Text style={[styles.toggleText, loginType === 'ta' && styles.toggleTextActive]}>
              Técnico Adm
            </Text>
          </TouchableOpacity>
        </View>

        {loginType === 'aluno' ? (
          <TextInput
            style={styles.input}
            placeholder="R.A"
            placeholderTextColor="#888"
            keyboardType='numeric'
            value={ra}
            onChangeText={handleRaChange}
            editable={!loading}
          />
        ) : (
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
        )}
        
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
          style={[styles.signupButton, { paddingBottom: Math.max(insets.bottom, 8) }]}
          onPress={() => navigation.navigate('SignUp')}
          disabled={loading}
        >
          <Text style={styles.signupButtonText}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
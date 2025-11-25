import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import Routes from './src/routes';
import colors from './colors/colors';
import { supabase } from './src/lib/supabase';

export default function App() {
  useEffect(() => {
    // Verificar e limpar sessão inválida ao iniciar
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.log('Erro na sessão, limpando:', error.message);
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.log('Erro ao verificar sessão:', error);
        await supabase.auth.signOut();
      }
    };
    
    checkSession();
  }, []);

  return (
    <>
      <StatusBar backgroundColor={colors.primary} barStyle="dark-content" />
      <Routes />
    </>
  );
}

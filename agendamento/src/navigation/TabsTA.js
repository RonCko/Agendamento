import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { supabase } from '../lib/supabase';
import HomeScreenTA from '../screens/HomeScreenTA';
import PerfilScreenTA from '../screens/PerfilScreenTA';

const Tab = createBottomTabNavigator();

export default function TabsTA() {
  const insets = useSafeAreaInsets();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    loadPendingCount();
    const interval = setInterval(loadPendingCount, 30000); // Atualiza a cada 30s
    return () => clearInterval(interval);
  }, []);

  async function loadPendingCount() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email) {
        const { data: tecAdm } = await supabase
          .from('tec_adm')
          .select('setor_id')
          .eq('email', session.user.email)
          .single();
        
        if (tecAdm) {
          const { count } = await supabase
            .from('agendamento')
            .select('*', { count: 'exact', head: true })
            .eq('setor_id', tecAdm.setor_id)
            .eq('status', 'pendente');
          
          setPendingCount(count || 0);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar contagem:', error);
    }
  }

  return (
    <Tab.Navigator
      initialRouteName="HomeScreenTA"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#777',
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          height: 56 + insets.bottom,
          paddingBottom: Math.max(6, insets.bottom),
          paddingTop: 6,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = 'ellipse';
          switch (route.name) {
            case 'HomeScreenTA':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'PerfilScreenTA':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen
        name="HomeScreenTA"
        component={HomeScreenTA}
        options={{ 
          title: 'Agendamentos', 
          tabBarLabel: ({ color }) => <Text style={{ color }}>Agendamentos</Text>,
          tabBarBadge: pendingCount > 0 ? pendingCount : null,
          tabBarBadgeStyle: { backgroundColor: '#f44336', color: '#fff' }
        }}
      />
      <Tab.Screen
        name="PerfilScreenTA"
        component={PerfilScreenTA}
        options={{ title: 'Perfil', tabBarLabel: ({ color }) => <Text style={{ color }}>Perfil</Text> }}
      />
    </Tab.Navigator>
  );
}

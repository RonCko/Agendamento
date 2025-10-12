import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import AgendamentoScreen from '../screens/AgendamentoScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
    // Define a tela inicial ao abrir a aplicação
      initialRouteName="HomeScreen"
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
          // define o icone padrão
          let iconName = 'ellipse';
          switch (route.name) { // Define os icones para quando o botão estiver ativo ou inativo
            case 'HomeScreen':
              iconName = focused ? 'home' : 'home-outline'; //ex se ativo mostra home se inativo home-outline
              break;
            case 'SearchScreen':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'AgendamentoScreen':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'PerfilScreen':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >

      {/*define as telas para navegação com Tab.Navigator, definindo a tabscreen com um nome e após isso o seu respectivo componente*/}

      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Início', tabBarLabel: ({ color }) => <Text style={{ color }}>Início</Text> }}
      />
      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ title: 'Buscar', tabBarLabel: ({ color }) => <Text style={{ color }}>Buscar</Text> }}
      />
      <Tab.Screen
        name="AgendamentoScreen"
        component={AgendamentoScreen}
        options={{ title: 'Agendamento', tabBarLabel: ({ color }) => <Text style={{ color }}>Agendamento</Text> }}
      />
      <Tab.Screen
        name="PerfilScreen"
        component={PerfilScreen}
        options={{ title: 'Perfil', tabBarLabel: ({ color }) => <Text style={{ color }}>Perfil</Text> }}
      />
      {/* title é o nome que aparece abaixo do icone */}
    </Tab.Navigator>
  );
}

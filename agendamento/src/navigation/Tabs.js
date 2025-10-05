import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import AgendamentoScreen from '../screens/AgendamentoScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#777',
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = 'ellipse';
          switch (route.name) { // Define os icones para quando o botão estiver ativo ou inativo
            case 'HomeScreen':
              iconName = focused ? 'home' : 'home-outline';
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
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="SearchScreen" component={SearchScreen} options={{ title: 'Buscar' }} />
      <Tab.Screen name="AgendamentoScreen" component={AgendamentoScreen} options={{ title: 'Agendar' }} />
      <Tab.Screen name="PerfilScreen" component={PerfilScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

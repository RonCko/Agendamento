import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import HomeScreenTA from '../screens/HomeScreenTA';
import PerfilScreenTA from '../screens/PerfilScreenTA';

const Tab = createBottomTabNavigator();

export default function TabsTA() {
  const insets = useSafeAreaInsets();
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
        options={{ title: 'Agendamentos', tabBarLabel: ({ color }) => <Text style={{ color }}>Agendamentos</Text> }}
      />
      <Tab.Screen
        name="PerfilScreenTA"
        component={PerfilScreenTA}
        options={{ title: 'Perfil', tabBarLabel: ({ color }) => <Text style={{ color }}>Perfil</Text> }}
      />
    </Tab.Navigator>
  );
}

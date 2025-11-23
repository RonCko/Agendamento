import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import HomeScreenAdmin from '../screens/HomeScreenAdmin';
import PerfilScreenTA from '../screens/PerfilScreenTA';

const Tab = createBottomTabNavigator();

export default function TabsAdmin() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      initialRouteName="HomeScreenAdmin"
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
            case 'HomeScreenAdmin':
              iconName = focused ? 'grid' : 'grid-outline';
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
        name="HomeScreenAdmin"
        component={HomeScreenAdmin}
        options={{ title: 'Todos', tabBarLabel: ({ color }) => <Text style={{ color }}>Todos</Text> }}
      />
      <Tab.Screen
        name="PerfilScreenTA"
        component={PerfilScreenTA}
        options={{ title: 'Perfil', tabBarLabel: ({ color }) => <Text style={{ color }}>Perfil</Text> }}
      />
    </Tab.Navigator>
  );
}

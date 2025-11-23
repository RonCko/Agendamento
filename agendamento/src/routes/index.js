import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignUpTAScreen from '../screens/SignUpTAScreen';
import Tabs from '../navigation/Tabs';
import TabsTA from '../navigation/TabsTA';
import ChatScreen from '../screens/ChatScreen';
import AgendamentoScreen from '../screens/AgendamentoScreen';

const Stack = createNativeStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="SignUpTA" component={SignUpTAScreen} />
                <Stack.Screen name="Tabs" component={Tabs} />
                <Stack.Screen name="TabsTA" component={TabsTA} />
                <Stack.Screen 
                    name="AgendamentoScreen" 
                    component={AgendamentoScreen} 
                    options={{ presentation: 'modal', headerShown: true, title: 'Agendamento' }}
                />
                <Stack.Screen 
                    name="Chat" 
                    component={ChatScreen} 
                    options={{ presentation: 'modal', headerShown: true, title: 'Ted' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
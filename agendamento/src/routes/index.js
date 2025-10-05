import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function Routes() {
    return (
        
        <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}
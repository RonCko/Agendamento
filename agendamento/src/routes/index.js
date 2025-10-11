import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import Tabs from '../navigation/Tabs';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function Routes() {
    return (
        //navigationContainer é o container principal que gerencia o estado da navegação
        <NavigationContainer>
                        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Tabs" component={Tabs} />
                <Stack.Screen name="Chat" component={ChatScreen} options={{presentation: 'modal',headerShown: true, title: 'Ted', }}/>
                {/* adicione outras telas aqui, se necessário */}
                {/* headerShown: false remove o header padrão do react navigation */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
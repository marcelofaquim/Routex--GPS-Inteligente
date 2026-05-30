// Configuração de totas

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';

//Importar telas
import HomeScreen from '../screens/HomeScreen';
import VehicleRegisterScreen from '../screens/VehicleRegisterScreen';
import VehicleListScreen from '../screens/VehicleListScreen';
import RouteDetailsScreen from '../screens/RouteDetailsScreen';
import MapScreen from '../screens/MapScreen';
import NavigationScreen from '../screens/NavigationScreen';

//Tipos das rotas

export type RootStackParamList = {
    
    Home: undefined;
    VehicleRegister: undefined;
    VehicleList: undefined;
};

    const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator () {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerTitleStyle: { fontWeight: 'bold'},
                contentStyle: { backgroundColor: colors.dark },
            }}
        >
            {/*As telas serão adicionadas aqui conforme suas criações */}

            <Stack.Screen
                name="VehicleList"
                component={VehicleListScreen}
                options={{ title: 'Meus Veiculos'}}
            />    

            <Stack.Screen
                name="VehicleRegister"
                component={VehicleRegisterScreen}
                options={{ title: ' Cadastrar Veículo'}}

            />

            <Stack.Screen
                name="Home"
                component={MapScreen}
                options={{ headerShown: false}}
                />    

             <Stack.Screen
                name="RouteDetails"
                component={RouteDetailsScreen}
                options={{ title: 'Detalhes da Rota'}}
                
             />   

             <Stack.Screen
                name="Navigation"
                component={NavigationScreen}
                options={{ headerShown: false}}

             />   

           </Stack.Navigator>     
    );

};
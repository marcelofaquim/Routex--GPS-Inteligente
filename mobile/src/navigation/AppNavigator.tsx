// Configuração de totas

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';

//Tipos das rotas

export type RootStackParamList = {
    Splash: undefined;
    Onboarding: undefined;
    Login: undefined;
    VehicleRegister: undefined;
    Home: undefined;
    RouteDetails: {
        origin: string;
        destinations: string;
        distance: number;
        durations: number;
    };
};

    const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator () {
    return (
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
                headerStyle: { backgroundColor: colors.dark },
                headerTintColor: colors.white,
                headerTitleStyle: { fontWeight: 'bold'},
                contentStyle: { backgroundColor: colors.dark },
            }}
        >
            {/*As telas serão adicionadas aqui conforme suas criações */}
           </Stack.Navigator>     
    )
}
// AppNavigator.tsx - Configuração das rotas do Routex

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Importar telas
import MapScreen from '../screens/MapScreen';
import VehicleListScreen from '../screens/VehicleListScreen';
import VehicleRegisterScreen from '../screens/VehicleRegisterScreen';
import RouteDetailsScreen from '../screens/RouteDetailsScreen';
import NavigationScreen from '../screens/NavigationScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FuelPriceScreen from '../screens/FuelPriceScreen';
import SplashScreen from '../screens/SplashScreen';

// Tipos das rotas
export type RootStackParamList = {
    Home: undefined;
    VehicleList: undefined;
    VehicleRegister: undefined;
    RouteDetails: {
        origem: any;
        destino: any;
        distancia: number;
        duracao: number;
        instrucoes?: string[];
        pontos?: any[];
    };
    Navigation: {
        origem: any;
        destino: any;
        distancia: number;
        duracao: number;
        rota?: any;
    };
    History: undefined;
    Settings: undefined;
    FuelPrice: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { colors, isDark, toggleTheme } = useTheme();

    return (
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerTitleStyle: { fontWeight: 'bold' },
                headerRight: () => (
                    <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                        <Text style={[styles.themeIcon, { color: colors.white }]}>
                            {isDark ? '☀️' : '🌙'}
                        </Text>
                    </TouchableOpacity>
                ),
                contentStyle: { backgroundColor: colors.dark },
            }}
        >
            {/* Tela principal - Mapa */}
            <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Home"
                component={MapScreen}
                options={{ headerShown: false }}
            />

            {/* Veículos */}
            <Stack.Screen
                name="VehicleList"
                component={VehicleListScreen}
                options={{ title: 'Meus Veículos' }}
            />

            <Stack.Screen
                name="VehicleRegister"
                component={VehicleRegisterScreen}
                options={{ title: 'Cadastrar Veículo' }}
            />

            {/* Rotas e navegação */}
            <Stack.Screen
                name="RouteDetails"
                component={RouteDetailsScreen}
                options={{ title: 'Detalhes da Rota' }}
            />

            <Stack.Screen
                name="Navigation"
                component={NavigationScreen}
                options={{ headerShown: false }}
            />

            {/* Histórico */}
            <Stack.Screen
                name="History"
                component={HistoryScreen}
                options={{ title: 'Histórico de Viagens' }}
            />

            {/* Configurações */}
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Configurações' }}
            />

            {/* Preço combustível */}
            <Stack.Screen
                name="FuelPrice"
                component={FuelPriceScreen}
                options={{ title: 'Preço do Combustível' }}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    themeButton: {
        marginRight: 16,
        padding: 8,
    },
    themeIcon: {
        fontSize: 20,
    },
});
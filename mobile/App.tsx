// App.tsx - Arquivo principal do Routex

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { VehicleProvider } from './src/screens/VehicleContext';
import { FuelPriceProvider } from './src/context/FuelPriceContext';

// Componente interno que usa o tema
function AppContent() {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.dark }]}>
            <StatusBar 
                barStyle={isDark ? 'light-content' : 'dark-content'} 
                backgroundColor={colors.dark} 
            />
            <NavigationContainer>
                <VehicleProvider>
                    <FuelPriceProvider>
                        <AppNavigator />
                    </FuelPriceProvider>
                </VehicleProvider>
            </NavigationContainer>
        </SafeAreaView>
    );
}

// Componente principal com os providers
export default function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
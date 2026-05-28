import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function HomeScreen() {

    return(
        <View style={styles.container}>
                    <Text style={styles.title}>🗺️ Routex</Text>
                    <Text style={styles.subtitle}>Mapa em breve...</Text>
                    <Text style={styles.text}>Aguardando integração com Google Maps/Mapbox</Text>
                </View>
           );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 24,
        color: colors.secondary,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        color: colors.white,
        textAlign: 'center',
    },
});
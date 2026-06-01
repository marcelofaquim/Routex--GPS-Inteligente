// SettingsScreen.tsx - Configurações do app

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useFuelPrice } from '../context/FuelPriceContext';

export default function SettingsScreen({ navigation }: any) {
    const { colors, isDark, toggleTheme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.dark }]}>
            <View style={[styles.section, { backgroundColor: colors.black }]}>
                <Text style={[styles.sectionTitle, { color: colors.white }]}>
                    Aparência
                </Text>
                <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: colors.white }]}>
                        {isDark ? '🌙 Modo escuro' : '☀️ Modo claro'}
                    </Text>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        thumbColor={colors.white}
                        trackColor={{ false: colors.gray, true: colors.secondary }}
                    />
                </View>
            </View>

            <View style={[styles.section, { backgroundColor: colors.black }]}>
                <Text style={[styles.sectionTitle, { color: colors.white }]}>
                    Combustível
                </Text>
                <TouchableOpacity
                    style={styles.settingRow}
                    onPress={() => navigation.navigate('FuelPrice')}
                >
                    <Text style={[styles.settingLabel, { color: colors.white }]}>
                        ⛽ Preço do combustível
                    </Text>
                    <Text style={{ color: colors.gray }}>→</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.section, { backgroundColor: colors.black }]}>
                <Text style={[styles.sectionTitle, { color: colors.white }]}>
                    Sobre
                </Text>
                <View style={styles.settingRow}>
                    <Text style={[styles.settingLabel, { color: colors.white }]}>
                        Versão do app
                    </Text>
                    <Text style={{ color: colors.gray }}>1.0.0</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    section: {
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        padding: 16,
        paddingBottom: 8,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    settingLabel: {
        fontSize: 16,
    },
});

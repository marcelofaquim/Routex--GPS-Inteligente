// SimpleChart.tsx - Gráfico leve e rápido

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface Props {
    dados: {
        mes: string;
        consumo: number;
        economia: number;
    }[];
}

export default function SimpleChart({ dados }: Props) {
    const { colors } = useTheme();
    const screenWidth = Dimensions.get('window').width - 40;

    if (!dados || dados.length === 0) {
        return null;
    }

    // Encontrar valores máximos para escala
    const maxConsumo = Math.max(...dados.map(d => d.consumo), 1);
    const maxEconomia = Math.max(...dados.map(d => d.economia), 1);

    return (
        <View style={[styles.container, { backgroundColor: colors.black }]}>
            <Text style={[styles.title, { color: colors.white }]}>
                📊 Consumo por mês
            </Text>
            
            {/* Cabeçalho do gráfico */}
            <View style={styles.headerLabels}>
                <Text style={[styles.labelLeft, { color: colors.gray }]}>Litros</Text>
                <Text style={[styles.labelRight, { color: colors.gray }]}>Economia (R$)</Text>
            </View>

            {/* Barras do gráfico */}
            {dados.map((item, index) => (
                <View key={index} style={styles.barRow}>
                    <Text style={[styles.monthLabel, { color: colors.white }]}>
                        {item.mes}
                    </Text>
                    
                    {/* Barra de consumo */}
                    <View style={styles.barsContainer}>
                        <View 
                            style={[
                                styles.consumoBar, 
                                { 
                                    width: (item.consumo / maxConsumo) * 150,
                                    backgroundColor: colors.primary 
                                }
                            ]} 
                        />
                        <Text style={[styles.consumoValue, { color: colors.white }]}>
                            {item.consumo}L
                        </Text>
                    </View>
                    
                    {/* Barra de economia */}
                    <View style={styles.barsContainer}>
                        <View 
                            style={[
                                styles.economiaBar, 
                                { 
                                    width: (item.economia / maxEconomia) * 150,
                                    backgroundColor: colors.success 
                                }
                            ]} 
                        />
                        <Text style={[styles.economiaValue, { color: colors.success }]}>
                            R${item.economia}
                        </Text>
                    </View>
                </View>
            ))}

            {/* Legenda */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
                    <Text style={[styles.legendText, { color: colors.gray }]}>Consumo (L)</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: colors.success }]} />
                    <Text style={[styles.legendText, { color: colors.gray }]}>Economia (R$)</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    headerLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingHorizontal: 10,
    },
    labelLeft: {
        fontSize: 11,
        flex: 1,
    },
    labelRight: {
        fontSize: 11,
        flex: 1,
        textAlign: 'right',
    },
    barRow: {
        marginBottom: 16,
    },
    monthLabel: {
        fontSize: 12,
        marginBottom: 6,
    },
    barsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    consumoBar: {
        height: 20,
        borderRadius: 4,
        marginRight: 8,
    },
    economiaBar: {
        height: 20,
        borderRadius: 4,
        marginRight: 8,
    },
    consumoValue: {
        fontSize: 11,
        width: 45,
    },
    economiaValue: {
        fontSize: 11,
        width: 55,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        gap: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 11,
    },
});
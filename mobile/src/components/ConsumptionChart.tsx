// grafico de consumo mensal

import React from "react";
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';

interface Props {
    dados: {
        mes: string;
        consumo: number;
        economia: number;
    }[];
}

export default function ConsumptionChart({ dados }: Props) {
    const { colors, isDark } = useTheme();
    const screenWidth = Dimensions.get('window').width - 40;

    //Preparar dadoas para o grafico
    const labels = dados.map(item => item.mes.substring(0, 3));
    const consumos = dados.map(item => item.consumo);
    const economias = dados.map(item => item.economia);

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: consumos,
                color: (opacity = 1) => `rgba(0, 71, 171, ${opacity})`,
                label: 'Consumo (L)',
            },
            {
                data: economias,
                color: (opacity = 1) => `rgba(0, 255, 136, ${opacity})`,
                label: 'Economia (R$)',
            },
        ],
        legend: ['Consumo (L)', 'Economia (R$)'],
    };

    const chartConfig = {
        backgroundColor: colors.black,
        backgroundGradientFrom: colors.black,
        backgroundGradientTo: colors.black,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => colors.gray,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: colors.secondary,
        },
        formatYLabel: (value: string) => {
            const num = parseFloat(value);
            return num >= 1000 ? `${(num / 1000).toFixed(0)}k` : value;
        },
    };

    if (dados.length === 0) {
        return (
            <View style={[styles.emptyContainer, { backgroundColor: colors.black }]}>
                <Text style={[styles.emptyText, { color: colors.gray }]}>
                    📊 Sem dados suficientes
                </Text>
                <Text style={[styles.emptySubText, { color: colors.gray }]}>
                    Complete mais viagens para ver os gráficos
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.white }]}>
                📊 Consumo x Economia
            </Text>
            <Text style={[styles.subtitle, { color: colors.gray }]}>
                Últimos {dados.length} meses
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                    data={chartData}
                    width={Math.max(screenWidth, dados.length * 100)}
                    height={220}
                    chartConfig={chartConfig}
                    verticalLabelRotation={30}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                    withInnerLines={false}
                    style={styles.chart}
                />
            </ScrollView>
        </View>
    );
}

import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        paddingHorizontal: 16,
    },
    subtitle: {
        fontSize: 12,
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    chart: {
        borderRadius: 16,
        marginLeft: 16,
        marginRight: 16,
    },
    emptyContainer: {
        padding: 32,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 16,
    },
    emptyText: {
        fontSize: 16,
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 12,
        textAlign: 'center',
    },
});


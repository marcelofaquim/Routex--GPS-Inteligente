// HistoryScreen.tsx - Versão completa com gráfico leve

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Share,
    Alert,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import SimpleChart from '../components/SimpleChart';

interface Viagem {
    id: string;
    destino: string;
    distancia: number;
    litros: number;
    valor: number;
    data: string;
    rota?: string;
}

export default function HistoryScreen({ navigation }: any) {
    const { colors } = useTheme();
    const [viagens, setViagens] = useState<Viagem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dadosGrafico, setDadosGrafico] = useState<{ mes: string; consumo: number; economia: number }[]>([]);
    const [resumo, setResumo] = useState({
        totalViagens: 0,
        totalKm: 0,
        totalLitros: 0,
        totalGasto: 0,
    });

    // Preparar dados para o gráfico (leve e rápido)
    const prepararDadosGrafico = (viagensList: Viagem[]) => {
        if (viagensList.length === 0) return [];
        
        const meses: { [key: string]: { consumo: number; economia: number; count: number } } = {};

        viagensList.forEach(viagem => {
            const data = new Date(viagem.data);
            const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;

            if (!meses[mesAno]) {
                meses[mesAno] = { consumo: 0, economia: 0, count: 0 };
            }
            meses[mesAno].consumo += viagem.litros;
            meses[mesAno].economia += viagem.valor * 0.15;
            meses[mesAno].count++;
        });

        return Object.entries(meses)
            .map(([mes, dados]) => ({
                mes: mes.split('/')[0] + '/' + mes.split('/')[1].slice(-2),
                consumo: Math.round(dados.consumo),
                economia: Math.round(dados.economia),
            }))
            .slice(-6);
    };

    // Carregar histórico
    const loadHistory = useCallback(async () => {
        try {
            const saved = await AsyncStorage.getItem('@Routex:history');
            
            if (saved) {
                const data = JSON.parse(saved);
                const sortedData = data.sort((a: Viagem, b: Viagem) => 
                    new Date(b.data).getTime() - new Date(a.data).getTime()
                );
                
                setViagens(sortedData);
                
                // Calcular resumo
                const totalViagens = sortedData.length;
                const totalKm = sortedData.reduce((acc, v) => acc + (v.distancia || 0), 0);
                const totalLitros = sortedData.reduce((acc, v) => acc + (v.litros || 0), 0);
                const totalGasto = sortedData.reduce((acc, v) => acc + (v.valor || 0), 0);
                
                setResumo({ totalViagens, totalKm, totalLitros, totalGasto });
                
                // Preparar gráfico
                const graficoData = prepararDadosGrafico(sortedData);
                setDadosGrafico(graficoData);
            }
        } catch (error) {
            console.error('Erro ao carregar:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadHistory();
    }, [loadHistory]);

    const exportarCSV = async () => {
        if (viagens.length === 0) {
            Alert.alert('Aviso', 'Nenhuma viagem para exportar');
            return;
        }

        try {
            const headers = ['Data', 'Destino', 'Distância(km)', 'Litros', 'Valor(R$)'];
            const linhas = viagens.map(v => [v.data, v.destino, v.distancia, v.litros, v.valor]);
            const csvContent = [headers, ...linhas].map(row => row.join(',')).join('\n');
            await Share.share({ message: csvContent, title: 'historico_routex.csv' });
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível exportar');
        }
    };

    const limparHistorico = () => {
        Alert.alert(
            'Limpar histórico',
            'Todas as viagens serão removidas.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Limpar',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('@Routex:history');
                        setViagens([]);
                        setDadosGrafico([]);
                        setResumo({ totalViagens: 0, totalKm: 0, totalLitros: 0, totalGasto: 0 });
                        Alert.alert('Sucesso', 'Histórico limpo!');
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: Viagem }) => (
        <View style={[styles.card, { backgroundColor: colors.black, borderColor: colors.gray }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.destino, { color: colors.white }]}>{item.destino}</Text>
                <Text style={[styles.data, { color: colors.gray }]}>{item.data}</Text>
            </View>
            <View style={styles.stats}>
                <Text style={[styles.distancia, { color: colors.white }]}>📏 {item.distancia} km</Text>
                <Text style={[styles.litros, { color: colors.white }]}>⛽ {item.litros} L</Text>
                <Text style={[styles.valor, { color: colors.success }]}>R$ {item.valor}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.dark }]}>
                <ActivityIndicator size="large" color={colors.secondary} />
                <Text style={[styles.loadingText, { color: colors.white }]}>Carregando...</Text>
            </View>
        );
    }

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: colors.dark }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.secondary} />}
        >
            {/* Resumo */}
            <View style={[styles.summaryContainer, { backgroundColor: colors.black }]}>
                <Text style={[styles.summaryTitle, { color: colors.white }]}>📊 Resumo</Text>
                <View style={styles.summaryGrid}>
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryValue, { color: colors.secondary }]}>{resumo.totalViagens}</Text>
                        <Text style={[styles.summaryLabel, { color: colors.gray }]}>Viagens</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryValue, { color: colors.secondary }]}>{resumo.totalKm} km</Text>
                        <Text style={[styles.summaryLabel, { color: colors.gray }]}>Total km</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryValue, { color: colors.secondary }]}>{resumo.totalLitros} L</Text>
                        <Text style={[styles.summaryLabel, { color: colors.gray }]}>Litros</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryValue, { color: colors.success }]}>R$ {resumo.totalGasto}</Text>
                        <Text style={[styles.summaryLabel, { color: colors.gray }]}>Gasto</Text>
                    </View>
                </View>
            </View>

            {/* Gráfico leve */}
            {dadosGrafico.length > 0 && <SimpleChart dados={dadosGrafico} />}

            {/* Botões */}
            <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]} onPress={exportarCSV}>
                    <Text style={styles.actionButtonText}>📤 Exportar CSV</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.error }]} onPress={limparHistorico}>
                    <Text style={styles.actionButtonText}>🗑️ Limpar</Text>
                </TouchableOpacity>
            </View>

            {/* Lista */}
            <Text style={[styles.sectionTitle, { color: colors.white }]}>🗺️ Últimas viagens</Text>

            {viagens.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.white }]}>🚗</Text>
                    <Text style={[styles.emptyText, { color: colors.white }]}>Nenhuma viagem</Text>
                    <Text style={[styles.emptySubText, { color: colors.gray }]}>Complete uma navegação</Text>
                </View>
            ) : (
                <FlatList data={viagens} renderItem={renderItem} keyExtractor={(item) => item.id} scrollEnabled={false} contentContainerStyle={styles.list} />
            )}
            
            <View style={{ height: 30 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 16 },
    summaryContainer: { margin: 16, padding: 16, borderRadius: 12, borderWidth: 1 },
    summaryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
    summaryGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    summaryItem: { alignItems: 'center', width: '23%' },
    summaryValue: { fontSize: 18, fontWeight: 'bold' },
    summaryLabel: { fontSize: 10, marginTop: 4 },
    actionButtons: { flexDirection: 'row', gap: 12, marginHorizontal: 16, marginBottom: 16 },
    actionButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    actionButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 16, marginBottom: 12 },
    list: { paddingHorizontal: 16 },
    card: { borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    destino: { fontSize: 16, fontWeight: 'bold', flex: 1 },
    data: { fontSize: 12 },
    stats: { flexDirection: 'row', justifyContent: 'space-between' },
    distancia: { fontSize: 14 },
    litros: { fontSize: 14 },
    valor: { fontSize: 14, fontWeight: 'bold' },
    emptyContainer: { alignItems: 'center', padding: 40 },
    emptyText: { fontSize: 18, marginBottom: 8 },
    emptySubText: { fontSize: 14, textAlign: 'center' },
});
// HistoryScreen.tsx - Histórico de viagens

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';

interface Viagem {
    id: string;
    destino: string;
    distancia: number;
    litros: number;
    valor: number;
    data: string;
}

export default function HistoryScreen({ navigation }: any) {
    const [viagens, setViagens] = useState<Viagem[]>([]);
    const [totalEconomizado, setTotalEconomizado] = useState(0);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const saved = await AsyncStorage.getItem('@Routex:history');
        if (saved) {
            const data = JSON.parse(saved);
            setViagens(data);
            
            const total = data.reduce((acc: number, v: Viagem) => acc + v.valor, 0);
            setTotalEconomizado(total);
        }
    };

    const saveViagem = async (viagem: Viagem) => {
        const newHistory = [viagem, ...viagens].slice(0, 50);
        await AsyncStorage.setItem('@Routex:history', JSON.stringify(newHistory));
        setViagens(newHistory);
    };

    const renderItem = ({ item }: { item: Viagem }) => (
        <View style={styles.card}>
            <Text style={styles.destino}>{item.destino}</Text>
            <Text style={styles.data}>{item.data}</Text>
            <View style={styles.stats}>
                <Text style={styles.distancia}>📏 {item.distancia} km</Text>
                <Text style={styles.valor}>💰 R$ {item.valor}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>📊 Histórico de Viagens</Text>
                <Text style={styles.total}>Total economizado: R$ {totalEconomizado}</Text>
            </View>

            {viagens.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>🚗</Text>
                    <Text style={styles.emptyText}>Nenhuma viagem registrada</Text>
                    <Text style={styles.emptySub}>
                        Complete uma navegação para aparecer aqui
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={viagens}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.dark },
    header: { padding: 20, backgroundColor: colors.primary, alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.white },
    total: { fontSize: 16, color: colors.secondary, marginTop: 8 },
    list: { padding: 16 },
    card: { backgroundColor: colors.black, borderRadius: 12, padding: 16, marginBottom: 12 },
    destino: { fontSize: 16, fontWeight: 'bold', color: colors.white },
    data: { fontSize: 12, color: colors.gray, marginTop: 4 },
    stats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    distancia: { fontSize: 14, color: colors.white },
    valor: { fontSize: 14, color: colors.success, fontWeight: 'bold' },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 18, color: colors.white, marginBottom: 8 },
    emptySub: { fontSize: 14, color: colors.gray },
});
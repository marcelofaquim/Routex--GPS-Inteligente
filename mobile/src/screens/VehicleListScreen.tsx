//  Lista os veículos cadastrados
// 

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { colors } from '../constants/colors';
import { veiculoService } from '../services/api';

interface Veiculo {
    id: number;
    placa: string;
    marca: string;
    modelo: string;
    ano: number;
    tipo: string;
    combustivel: string;
    consumo_medio: number;
}

interface Props {
    navigation: any;
}

export default function VehicleListScreen({ navigation }: Props) {
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Carregar veículos da API
    const carregarVeiculos = async () => {
        console.log('🔍 Iniciando carregamento...');
        setError(null);
        
        try {
            console.log('📡 Chamando API...');
            const response = await veiculoService.listar(1);
            console.log('📦 Resposta completa:', JSON.stringify(response, null, 2));
            
            if (response && response.success) {
                console.log('✅ success true, dados:', response.data);
                if (response.data && Array.isArray(response.data)) {
                    setVeiculos(response.data);
                    console.log(`📊 Total de veículos carregados: ${response.data.length}`);
                } else {
                    console.log('⚠️ response.data não é um array:', response.data);
                    setVeiculos([]);
                }
            } else {
                console.log('❌ response.success é false ou response inválido');
                setVeiculos([]);
                if (response && response.message) {
                    setError(response.message);
                }
            }
        } catch (error: any) {
            console.error('❌ Erro detalhado:', error);
            console.error('Mensagem:', error?.message);
            console.error('Código:', error?.code);
            
            let mensagemErro = 'Não foi possível carregar os veículos';
            if (error?.message?.includes('Network Error')) {
                mensagemErro = 'Erro de rede. Verifique se o backend está rodando em http://localhost:3000';
            } else if (error?.message?.includes('404')) {
                mensagemErro = 'API não encontrada. Verifique se o backend está rodando';
            } else if (error?.message?.includes('500')) {
                mensagemErro = 'Erro no servidor. Verifique o terminal do backend';
            }
            
            setError(mensagemErro);
            Alert.alert('Erro', mensagemErro);
        } finally {
            setLoading(false);
        }
    };

    // Carregar ao abrir a tela
    useEffect(() => {
        carregarVeiculos();
        
        // Recarregar quando voltar para esta tela (após cadastro)
        const unsubscribe = navigation.addListener('focus', () => {
            console.log('📱 Tela ganhou foco, recarregando...');
            setLoading(true);
            carregarVeiculos();
        });
        
        return unsubscribe;
    }, [navigation]);

    // Atualizar ao puxar a tela para baixo
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await carregarVeiculos();
        setRefreshing(false);
    }, []);

    // Deletar veículo
    const handleDelete = (id: number, placa: string) => {
        Alert.alert(
            'Remover veículo',
            `Deseja remover o veículo ${placa}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await veiculoService.deletar(id);
                            console.log('🗑️ Delete response:', response);
                            if (response && response.success) {
                                Alert.alert('Sucesso', 'Veículo removido!');
                                await carregarVeiculos();
                            } else {
                                Alert.alert('Erro', response?.message || 'Não foi possível remover');
                            }
                        } catch (error) {
                            console.error('Erro ao deletar:', error);
                            Alert.alert('Erro', 'Não foi possível remover o veículo');
                        }
                    },
                },
            ]
        );
    };

    // Renderizar cada item da lista
    const renderItem = ({ item }: { item: Veiculo }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.placa}>{item.placa}</Text>
                <Text style={styles.tipo}>
                    {item.tipo === 'carro' ? '🚗' : item.tipo === 'moto' ? '🏍️' : '🚚'}
                </Text>
            </View>
            <Text style={styles.modelo}>{item.marca} {item.modelo}</Text>
            <Text style={styles.ano}>Ano: {item.ano}</Text>
            <Text style={styles.combustivel}>
                ⛽ {item.combustivel === 'gasolina' ? 'Gasolina' : 
                   item.combustivel === 'etanol' ? 'Etanol' : 'Diesel'}
            </Text>
            <Text style={styles.consumo}>📊 {item.consumo_medio} km/l</Text>
            <View style={styles.buttonRow}>
                <TouchableOpacity 
                    style={[styles.button, styles.editButton]}
                    onPress={() => navigation.navigate('VehicleRegister', { veiculo: item })}
                >
                    <Text style={styles.buttonText}>✏️ Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => handleDelete(item.id, item.placa)}
                >
                    <Text style={styles.buttonText}>🗑️ Remover</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // Tela de loading
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.secondary} />
                <Text style={styles.loadingText}>Carregando veículos...</Text>
            </View>
        );
    }

    // Tela de erro
    if (error && veiculos.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={carregarVeiculos}>
                    <Text style={styles.retryButtonText}>Tentar novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('VehicleRegister')}
            >
                <Text style={styles.addButtonText}>+ Adicionar Veículo</Text>
            </TouchableOpacity>

            {veiculos.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>🚗</Text>
                    <Text style={styles.emptyTitle}>Nenhum veículo cadastrado</Text>
                    <Text style={styles.emptySubText}>
                        Clique em "Adicionar Veículo" para começar
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={veiculos}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl 
                            refreshing={refreshing} 
                            onRefresh={onRefresh}
                            tintColor={colors.secondary}
                            colors={[colors.secondary]}
                        />
                    }
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        color: colors.white,
        fontSize: 16,
        marginTop: 12,
    },
    list: {
        padding: 16,
        paddingBottom: 30,
    },
    card: {
        backgroundColor: colors.black,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.gray,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    placa: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.secondary,
    },
    tipo: {
        fontSize: 24,
    },
    modelo: {
        fontSize: 16,
        color: colors.white,
        marginBottom: 4,
    },
    ano: {
        fontSize: 14,
        color: colors.gray,
        marginBottom: 2,
    },
    combustivel: {
        fontSize: 14,
        color: colors.white,
        marginBottom: 2,
    },
    consumo: {
        fontSize: 14,
        color: colors.success,
        marginBottom: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: colors.primary,
    },
    deleteButton: {
        backgroundColor: colors.error || '#FF4444',
    },
    buttonText: {
        color: colors.white,
        fontWeight: '500',
    },
    addButton: {
        backgroundColor: colors.secondary,
        margin: 16,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyTitle: {
        color: colors.white,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubText: {
        color: colors.gray,
        fontSize: 14,
        textAlign: 'center',
    },
    errorIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorText: {
        color: colors.white,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
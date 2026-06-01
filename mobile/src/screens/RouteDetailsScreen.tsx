//  Detalhes da rota e cálculo de combustível
// Funcionalidades: Comparação de rotas, cálculo de consumo, navegação

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { colors } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Share } from 'react-native';

interface Props {
    navigation: any;
    route: any;
}

interface Veiculo {
    id: number;
    placa: string;
    marca: string;
    modelo: string;
    consumo_medio: number;
    tipo: string;
    combustivel: string;
}

interface Rota {
    id: string;
    nome: string;
    descricao: string;
    distancia: number;
    duracao: number;
    litros: number;
    valor: number;
    icon: string;
    cor: string;
}

export default function RouteDetailsScreen({ navigation, route }: Props) {
    const { origem, destino, distancia, duracao } = route.params || {};
    
    const [veiculoAtivo, setVeiculoAtivo] = useState<Veiculo | null>(null);
    const [loading, setLoading] = useState(true);
    const [rotaSelecionada, setRotaSelecionada] = useState<string>('rapida');
    
    // Preço do combustível (depois pode vir da API)
    const precoCombustivel = 5.60; // Diesel R$/litro

    // Definição das rotas disponíveis
    const rotas: Record<string, Rota> = {
        rapida: {
            id: 'rapida',
            nome: 'Rota Rápida',
            descricao: 'Menor tempo de viagem',
            distancia: distancia || 5.2,
            duracao: duracao || 12,
            litros: 0,
            valor: 0,
            icon: '🚀',
            cor: colors.primary,
        },
        economica: {
            id: 'economica',
            nome: 'Rota Econômica',
            descricao: 'Menor consumo de combustível',
            distancia: (distancia || 5.2) * 1.3, // 30% mais longa
            duracao: (duracao || 12) * 1.5, // 50% mais demorada
            litros: 0,
            valor: 0,
            icon: '💰',
            cor: colors.success,
        },
        segura: {
            id: 'segura',
            nome: 'Rota Segura',
            descricao: 'Evita áreas de risco',
            distancia: (distancia || 5.2) * 1.15, // 15% mais longa
            duracao: (duracao || 12) * 1.2, // 20% mais demorada
            litros: 0,
            valor: 0,
            icon: '🛡️',
            cor: colors.alert,
        },
    };

    // Carregar veículo ativo
    useEffect(() => {
        loadActiveVehicle();
    }, []);

    const loadActiveVehicle = async () => {
        try {
            const saved = await AsyncStorage.getItem('@Routex:activeVehicle');
            if (saved) {
                const vehicle = JSON.parse(saved);
                setVeiculoAtivo(vehicle);
            } else {
                // Veículo mock para teste
                setVeiculoAtivo({
                    id: 1,
                    placa: 'ABC1234',
                    marca: 'Fiat',
                    modelo: 'Toro',
                    consumo_medio: 10,
                    tipo: 'carro',
                    combustivel: 'diesel',
                });
            }
        } catch (error) {
            console.error('Erro ao carregar veículo:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calcular consumo para cada rota
    useEffect(() => {
        if (veiculoAtivo) {
            Object.keys(rotas).forEach(key => {
                const rota = rotas[key];
                const litrosCalculados = rota.distancia / veiculoAtivo.consumo_medio;
                const valorCalculado = litrosCalculados * precoCombustivel;
                rotas[key].litros = parseFloat(litrosCalculados.toFixed(2));
                rotas[key].valor = parseFloat(valorCalculado.toFixed(2));
            });
        }
    }, [veiculoAtivo]);

    const rotaAtual = rotas[rotaSelecionada];
    const economia = rotas.economica.valor - rotas.rapida.valor;

    const salvarViagem = async () => {
        const viagem = {
            id: Date.now().toString(),
            destino: destino?.nome || 'Destino',
            distancia: rotaAtual.distancia,
            duracao: rotaAtual.duracao,
            litros: rotaAtual.litros,
            valor: rotaAtual.valor,
            data: new Date().toLocaleString(),
            rota: rotaAtual.nome,
        };

        try {
            const saved = await AsyncStorage.getItem('@Routex:history');
            const history = saved ? JSON.parse(saved) : [];
            const newHistory = [viagem, ...history].slice(0, 50);
            await AsyncStorage.setItem('@Routex:history', JSON.stringify(newHistory));
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
    };

    const iniciarNavegacao = () => {
        salvarViagem();
        navigation.navigate('Navigation', {
            origem: origem,
            destino: destino,
            distancia: rotaAtual.distancia,
            duracao: rotaAtual.duracao,
            rota: rotaAtual,
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.secondary} />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    // Função para compartilhar
const compartilharRota = async () => {
    try {
        const mensagem = `🚗 ROUTEX - Rota calculada!\n\n` +
            `De: ${origem?.nome || 'Sua localização'}\n` +
            `Para: ${destino?.nome}\n` +
            `Distância: ${rotaAtual.distancia} km\n` +
            `Tempo: ${rotaAtual.duracao} min\n` +
            `Combustível: ${rotaAtual.litros} L\n` +
            `Custo: R$ ${rotaAtual.valor}\n\n` +
            `Baixe o Routex e economize! 🗺️`;

        await Share.share({ message: mensagem });
    } catch (error) {
        Alert.alert('Erro', 'Não foi possível compartilhar');
    }
};

        // Adicionar botão no JSX:
        <TouchableOpacity style={styles.shareButton} onPress={compartilharRota}>
            <Text style={styles.shareButtonText}>📤 Compartilhar rota</Text>
        </TouchableOpacity>

    return (
        <ScrollView style={styles.container}>
            {/* Cabeçalho */}
            <View style={styles.header}>
                <Text style={styles.title}>🗺️ Detalhes da Rota</Text>
                <Text style={styles.subtitle}>
                    {origem?.nome || 'Sua localização'} → {destino?.nome || 'Destino'}
                </Text>
            </View>

            {/* Comparação de rotas */}
            <View style={styles.comparacaoContainer}>
                <Text style={styles.sectionTitle}>Comparar rotas</Text>
                <View style={styles.rotaButtons}>
                    <TouchableOpacity
                        style={[
                            styles.rotaButton,
                            rotaSelecionada === 'rapida' && styles.rotaButtonActive,
                            { borderColor: colors.primary }
                        ]}
                        onPress={() => setRotaSelecionada('rapida')}
                    >
                        <Text style={styles.rotaIcon}>🚀</Text>
                        <Text style={styles.rotaNome}>Rápida</Text>
                        <Text style={styles.rotaTempo}>{rotas.rapida.duracao} min</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.rotaButton,
                            rotaSelecionada === 'economica' && styles.rotaButtonActive,
                            { borderColor: colors.success }
                        ]}
                        onPress={() => setRotaSelecionada('economica')}
                    >
                        <Text style={styles.rotaIcon}>💰</Text>
                        <Text style={styles.rotaNome}>Econômica</Text>
                        <Text style={styles.rotaValor}>
                            R$ {rotas.economica.valor}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.rotaButton,
                            rotaSelecionada === 'segura' && styles.rotaButtonActive,
                            { borderColor: colors.alert }
                        ]}
                        onPress={() => setRotaSelecionada('segura')}
                    >
                        <Text style={styles.rotaIcon}>🛡️</Text>
                        <Text style={styles.rotaNome}>Segura</Text>
                        <Text style={styles.rotaDesc}>Sem riscos</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Card da rota selecionada */}
            <View style={[styles.rotaCard, { borderLeftColor: rotaAtual.cor }]}>
                <Text style={styles.rotaCardTitle}>
                    {rotaAtual.icon} {rotaAtual.nome}
                </Text>
                <Text style={styles.rotaCardDesc}>{rotaAtual.descricao}</Text>

                <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>📏 Distância</Text>
                        <Text style={styles.infoValue}>{rotaAtual.distancia} km</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>⏱️ Tempo</Text>
                        <Text style={styles.infoValue}>{rotaAtual.duracao} min</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>⛽ Combustível</Text>
                        <Text style={styles.infoValue}>{rotaAtual.litros} L</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>💰 Custo</Text>
                        <Text style={[styles.infoValue, { color: colors.success }]}>
                            R$ {rotaAtual.valor}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Dica de economia */}
            {rotaSelecionada === 'rapida' && economia > 0 && (
                <View style={styles.dicaCard}>
                    <Text style={styles.dicaIcon}>💡</Text>
                    <Text style={styles.dicaText}>
                        A rota econômica economizaria R$ {economia.toFixed(2)}!
                    </Text>
                </View>
            )}

            {/* Veículo utilizado */}
            <View style={styles.vehicleCard}>
                <Text style={styles.sectionTitle}>🚗 Veículo utilizado</Text>
                {veiculoAtivo ? (
                    <>
                        <Text style={styles.vehicleText}>
                            {veiculoAtivo.marca} {veiculoAtivo.modelo}
                        </Text>
                        <Text style={styles.vehicleDetail}>
                            Placa: {veiculoAtivo.placa} • {veiculoAtivo.consumo_medio} km/l
                        </Text>
                        <Text style={styles.vehicleDetail}>
                            Combustível: {veiculoAtivo.combustivel === 'diesel' ? '🛢️ Diesel' : 
                                          veiculoAtivo.combustivel === 'gasolina' ? '⛽ Gasolina' : '🌽 Etanol'}
                        </Text>
                    </>
                ) : (
                    <Text style={styles.vehicleError}>
                        Nenhum veículo cadastrado. Cadastre um veículo para calcular o consumo.
                    </Text>
                )}
                <TouchableOpacity
                    style={styles.changeVehicleButton}
                    onPress={() => navigation.navigate('VehicleList')}
                >
                    <Text style={styles.changeVehicleButtonText}>Trocar veículo</Text>
                </TouchableOpacity>
            </View>

            {/* Botão iniciar navegação */}
            <TouchableOpacity style={styles.startButton} onPress={iniciarNavegacao}>
                <Text style={styles.startButtonText}>
                    🚗 INICIAR NAVEGAÇÃO ({rotaAtual.nome})
                </Text>
            </TouchableOpacity>

            {/* Preço do combustível */}
            <Text style={styles.fuelPrice}>
                * Preço do {veiculoAtivo?.combustivel === 'diesel' ? 'diesel' : 
                             veiculoAtivo?.combustivel === 'gasolina' ? 'gasolina' : 'etanol'}: 
                R$ {precoCombustivel}/L
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.dark,
    },
    loadingText: {
        color: colors.white,
        marginTop: 12,
        fontSize: 16,
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: colors.gray,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 12,
    },
    comparacaoContainer: {
        margin: 16,
        marginBottom: 8,
    },
    rotaButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    rotaButton: {
        flex: 1,
        backgroundColor: colors.black,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.gray,
    },
    rotaButtonActive: {
        backgroundColor: colors.primary + '20',
        borderWidth: 2,
    },
    rotaIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    rotaNome: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 4,
    },
    rotaTempo: {
        fontSize: 12,
        color: colors.gray,
    },
    rotaValor: {
        fontSize: 12,
        color: colors.success,
        fontWeight: 'bold',
    },
    rotaDesc: {
        fontSize: 10,
        color: colors.gray,
    },
    rotaCard: {
        backgroundColor: colors.black,
        margin: 16,
        marginTop: 8,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
    },
    rotaCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 4,
    },
    rotaCardDesc: {
        fontSize: 12,
        color: colors.gray,
        marginBottom: 16,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    infoItem: {
        flex: 1,
        minWidth: '40%',
    },
    infoLabel: {
        fontSize: 12,
        color: colors.gray,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
    },
    dicaCard: {
        flexDirection: 'row',
        backgroundColor: colors.primary + '20',
        margin: 16,
        marginTop: 0,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    dicaIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    dicaText: {
        flex: 1,
        fontSize: 12,
        color: colors.secondary,
    },
    vehicleCard: {
        backgroundColor: colors.black,
        margin: 16,
        marginTop: 8,
        padding: 16,
        borderRadius: 12,
    },
    vehicleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 4,
    },
    vehicleDetail: {
        fontSize: 12,
        color: colors.gray,
        marginBottom: 2,
    },
    vehicleError: {
        fontSize: 12,
        color: colors.error,
        marginBottom: 12,
    },
    changeVehicleButton: {
        marginTop: 12,
        paddingVertical: 8,
        alignItems: 'center',
        backgroundColor: colors.gray + '30',
        borderRadius: 8,
    },
    changeVehicleButtonText: {
        fontSize: 12,
        color: colors.white,
    },
    startButton: {
        backgroundColor: colors.secondary,
        margin: 16,
        marginTop: 8,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 40,
    },
    startButtonText: {
        color: colors.black,
        fontSize: 18,
        fontWeight: 'bold',
    },
    fuelPrice: {
        fontSize: 11,
        color: colors.gray,
        textAlign: 'center',
        marginBottom: 20,
    },
});
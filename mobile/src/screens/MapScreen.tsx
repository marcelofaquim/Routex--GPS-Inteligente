// MapScreen.tsx - Versão com tema dinâmico

import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { routeService } from '../services/routeService';

interface Props {
    navigation: any;
}

export default function MapScreen({ navigation }: Props) {
    const { colors, isDark } = useTheme(); // ← USAR O TEMA
    const [location, setLocation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [enderecoBusca, setEnderecoBusca] = useState('');
    const [buscando, setBuscando] = useState(false);

    // Pegar localização ao iniciar
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permissão de localização negada');
                    setLoading(false);
                    return;
                }

                const userLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                setLocation(userLocation);
            } catch (error) {
                console.error('Erro:', error);
                setErrorMsg('Erro ao obter localização');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Buscar destino real
    const buscarDestinoReal = async () => {
        if (!enderecoBusca.trim()) {
            Alert.alert('Atenção', 'Digite um destino');
            return;
        }

        if (!location) {
            Alert.alert('Erro', 'Localização não disponível');
            return;
        }

        setBuscando(true);

        try {
            const destinoCoords = await routeService.geocoding(enderecoBusca);
            
            if (!destinoCoords) {
                Alert.alert('Erro', 'Endereço não encontrado');
                setBuscando(false);
                return;
            }

            const rota = await routeService.calcularRota(
                { lat: location.coords.latitude, lng: location.coords.longitude },
                destinoCoords
            );

            navigation.navigate('RouteDetails', {
                origem: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    nome: 'Sua localização',
                },
                destino: {
                    nome: enderecoBusca,
                    latitude: destinoCoords.lat,
                    longitude: destinoCoords.lng,
                },
                distancia: rota.distancia,
                duracao: rota.duracao,
                instrucoes: rota.instrucoes || [],
                pontos: rota.pontos || [],
            });
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível calcular a rota');
        } finally {
            setBuscando(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.dark }]}>
                <ActivityIndicator size="large" color={colors.secondary} />
                <Text style={[styles.loadingText, { color: colors.white }]}>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.dark }]}>
            {/* Barra de busca */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchBox, { backgroundColor: colors.white }]}>
                    <TextInput
                        style={[styles.searchInput, { color: colors.black }]}
                        placeholder="Digite um endereço..."
                        placeholderTextColor={colors.gray}
                        value={enderecoBusca}
                        onChangeText={setEnderecoBusca}
                        onSubmitEditing={buscarDestinoReal}
                        editable={!buscando}
                    />
                    <TouchableOpacity onPress={buscarDestinoReal} style={styles.searchButton}>
                        <Text style={styles.searchIcon}>{buscando ? '⏳' : '🔍'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Conteúdo principal */}
            <View style={styles.content}>
                <Text style={[styles.logo, { color: colors.primary }]}>🗺️ ROUTEX</Text>
                <Text style={[styles.subtitle, { color: colors.gray }]}>Seu GPS inteligente</Text>

                {location ? (
                    <View style={[styles.locationCard, { backgroundColor: colors.black, borderColor: colors.gray }]}>
                        <Text style={[styles.locationTitle, { color: colors.secondary }]}>📍 Você está aqui</Text>
                        <Text style={[styles.locationText, { color: colors.white }]}>
                            Lat: {location.coords.latitude.toFixed(4)}
                        </Text>
                        <Text style={[styles.locationText, { color: colors.white }]}>
                            Lng: {location.coords.longitude.toFixed(4)}
                        </Text>
                    </View>
                ) : (
                    <Text style={[styles.errorText, { color: colors.error }]}>{errorMsg}</Text>
                )}

                <View style={[styles.infoCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                    <Text style={[styles.infoTitle, { color: colors.white }]}>🚗 Como usar:</Text>
                    <Text style={[styles.infoText, { color: colors.gray }]}>Digite um destino e calcule sua rota</Text>
                </View>
            </View>

            {/* Barra inferior */}
            <View style={[styles.bottomBar, { backgroundColor: colors.black, borderTopColor: colors.gray }]}>
                <TouchableOpacity style={styles.bottomItem}>
                    <Text style={[styles.bottomIcon, { color: colors.secondary }]}>🏠</Text>
                    <Text style={[styles.bottomText, { color: colors.secondary }]}>Início</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.bottomItem}
                    onPress={() => navigation.navigate('VehicleList')}
                >
                    <Text style={[styles.bottomIcon, { color: colors.gray }]}>🚗</Text>
                    <Text style={[styles.bottomText, { color: colors.gray }]}>Veículos</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.bottomItem}
                    onPress={() => navigation.navigate('History')}
                >
                    <Text style={[styles.bottomIcon, { color: colors.gray }]}>📊</Text>
                    <Text style={[styles.bottomText, { color: colors.gray }]}>Histórico</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.bottomItem}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Text style={[styles.bottomIcon, { color: colors.gray }]}>⚙️</Text>
                    <Text style={[styles.bottomText, { color: colors.gray }]}>Perfil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    searchContainer: {
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        zIndex: 10,
    },
    searchBox: {
        flexDirection: 'row',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    searchButton: {
        paddingLeft: 12,
    },
    searchIcon: {
        fontSize: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 80,
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 24,
    },
    locationCard: {
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
        borderWidth: 1,
    },
    locationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    locationText: {
        fontSize: 14,
        marginBottom: 4,
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    infoCard: {
        borderRadius: 12,
        padding: 16,
        width: '100%',
        borderWidth: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 12,
        marginBottom: 4,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingVertical: 12,
        paddingBottom: 20,
        borderTopWidth: 1,
    },
    bottomItem: {
        flex: 1,
        alignItems: 'center',
    },
    bottomIcon: {
        fontSize: 24,
    },
    bottomText: {
        fontSize: 10,
        marginTop: 4,
    },
});
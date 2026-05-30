// MapScreen.tsx - Tela principal com rotas reais 

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
import { colors } from '../constants/colors';
import { routeService } from '../services/routeService';

interface Props {
    navigation: any;
}

export default function MapScreen({ navigation }: Props) {
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
                    setErrorMsg('Permissão de localização negada. Ative no navegador.');
                    setLoading(false);
                    return;
                }

                const userLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                setLocation(userLocation);
                console.log('📍 Localização obtida:', userLocation.coords);
            } catch (error) {
                console.error('Erro ao pegar localização:', error);
                setErrorMsg('Erro ao obter localização');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Buscar destino REAL com rota real!
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
            console.log('🔍 Buscando destino:', enderecoBusca);
            console.log('📍 Localização origem:', location.coords.latitude, location.coords.longitude);

            // PASSO 1: Buscar coordenadas do endereço digitado (Geocoding)
            const destinoCoords = await routeService.geocoding(enderecoBusca);
            
            if (!destinoCoords) {
                Alert.alert('Erro', 'Não foi possível encontrar o endereço. Tente outro destino.');
                setBuscando(false);
                return;
            }

            console.log('📍 Coordenadas destino:', destinoCoords.lat, destinoCoords.lng);

            // PASSO 2: Calcular rota real entre origem e destino
            const rota = await routeService.calcularRota(
                { lat: location.coords.latitude, lng: location.coords.longitude },
                { lat: destinoCoords.lat, lng: destinoCoords.lng }
            );

            console.log('✅ Rota calculada:', rota);

            // PASSO 3: Navegar para tela de detalhes com dados reais
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
            console.error('❌ Erro ao buscar destino:', error);
            Alert.alert('Erro', 'Não foi possível calcular a rota. Tente novamente.');
        } finally {
            setBuscando(false);
        }
    };

    // Centralizar no usuário (placeholder)
    const centerOnUser = () => {
        if (location) {
            Alert.alert('Localização', `Lat: ${location.coords.latitude.toFixed(4)}\nLng: ${location.coords.longitude.toFixed(4)}`);
        } else {
            Alert.alert('Erro', 'Localização não disponível');
        }
    };

    // Tela de loading
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.secondary} />
                <Text style={styles.loadingText}>Carregando localização...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Barra de busca */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Digite um endereço ou lugar..."
                        placeholderTextColor={colors.gray}
                        value={enderecoBusca}
                        onChangeText={setEnderecoBusca}
                        onSubmitEditing={buscarDestinoReal}
                        editable={!buscando}
                    />
                    <TouchableOpacity 
                        onPress={buscarDestinoReal} 
                        style={styles.searchButton}
                        disabled={buscando}
                    >
                        <Text style={styles.searchIcon}>{buscando ? '⏳' : '🔍'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Indicador de busca */}
            {buscando && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={colors.secondary} />
                    <Text style={styles.loadingOverlayText}>Buscando endereço e calculando rota...</Text>
                    <Text style={styles.loadingOverlaySub}>Isso pode levar alguns segundos</Text>
                </View>
            )}

            {/* Área principal do mapa (placeholder) */}
            <View style={styles.content}>
                <Text style={styles.logo}>🗺️ ROUTEX</Text>
                <Text style={styles.subtitle}>Seu GPS inteligente</Text>

                {location ? (
                    <View style={styles.locationCard}>
                        <Text style={styles.locationTitle}>📍 Você está aqui</Text>
                        <Text style={styles.locationText}>
                            Latitude: {location.coords.latitude.toFixed(4)}
                        </Text>
                        <Text style={styles.locationText}>
                            Longitude: {location.coords.longitude.toFixed(4)}
                        </Text>
                        <Text style={styles.locationAccuracy}>
                            Precisão: ±{location.coords.accuracy?.toFixed(0)}m
                        </Text>
                    </View>
                ) : (
                    <View style={styles.locationCard}>
                        <Text style={styles.locationError}>
                            ⚠️ {errorMsg || 'Aguardando localização...'}
                        </Text>
                        <TouchableOpacity 
                            style={styles.retryButton}
                            onPress={() => window.location.reload()}
                        >
                            <Text style={styles.retryButtonText}>Tentar novamente</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>🚗 Como usar:</Text>
                    <Text style={styles.infoText}>1. Digite um destino (ex: "São Paulo", "Av. Paulista")</Text>
                    <Text style={styles.infoText}>2. O app buscará o endereço em tempo real</Text>
                    <Text style={styles.infoText}>3. Calculará a distância e tempo reais</Text>
                    <Text style={styles.infoText}>4. Compare rotas e veja o consumo</Text>
                </View>

                <Text style={styles.note}>
                    💡 Use endereços completos para melhor precisão
                </Text>
            </View>

            {/* Botão centralizar */}
            <TouchableOpacity style={styles.centerButton} onPress={centerOnUser}>
                <Text style={styles.centerButtonText}>📍</Text>
            </TouchableOpacity>

            {/* Barra inferior */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.bottomItem}>
                    <Text style={[styles.bottomIcon, styles.bottomIconActive]}>🏠</Text>
                    <Text style={[styles.bottomText, styles.bottomTextActive]}>Início</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.bottomItem}
                    onPress={() => navigation.navigate('VehicleList')}
                >
                    <Text style={styles.bottomIcon}>🚗</Text>
                    <Text style={styles.bottomText}>Veículos</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.bottomItem}
                    onPress={() => navigation.navigate('History')}
                >
                    <Text style={styles.bottomIcon}>📊</Text>
                    <Text style={styles.bottomText}>Histórico</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomItem}>
                    <Text style={styles.bottomIcon}>⚙️</Text>
                    <Text style={styles.bottomText}>Perfil</Text>
                </TouchableOpacity>
            </View>

            {/* Mensagem de erro permanente */}
            {errorMsg && !location && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
            )}
        </View>
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
    searchContainer: {
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        zIndex: 10,
    },
    searchBox: {
        flexDirection: 'row',
        backgroundColor: colors.white,
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
        color: colors.black,
    },
    searchButton: {
        paddingLeft: 12,
    },
    searchIcon: {
        fontSize: 20,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    loadingOverlayText: {
        color: colors.white,
        marginTop: 16,
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingOverlaySub: {
        color: colors.gray,
        marginTop: 8,
        fontSize: 12,
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
        color: colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.gray,
        marginBottom: 24,
    },
    locationCard: {
        backgroundColor: colors.black,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.gray,
    },
    locationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.secondary,
        marginBottom: 12,
    },
    locationText: {
        fontSize: 14,
        color: colors.white,
        marginBottom: 4,
    },
    locationAccuracy: {
        fontSize: 12,
        color: colors.gray,
        marginTop: 8,
    },
    locationError: {
        fontSize: 14,
        color: colors.error,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    infoCard: {
        backgroundColor: colors.primary + '15',
        borderRadius: 12,
        padding: 16,
        width: '100%',
        marginTop: 8,
        borderWidth: 1,
        borderColor: colors.primary + '30',
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 12,
        color: colors.gray,
        marginBottom: 4,
    },
    note: {
        marginTop: 16,
        fontSize: 11,
        color: colors.gray,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    centerButton: {
        position: 'absolute',
        bottom: 100,
        right: 16,
        backgroundColor: colors.white,
        borderRadius: 40,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    centerButtonText: {
        fontSize: 24,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: colors.black,
        paddingVertical: 12,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: colors.gray,
    },
    bottomItem: {
        flex: 1,
        alignItems: 'center',
    },
    bottomIcon: {
        fontSize: 24,
        color: colors.gray,
    },
    bottomIconActive: {
        color: colors.secondary,
    },
    bottomText: {
        fontSize: 10,
        color: colors.gray,
        marginTop: 4,
    },
    bottomTextActive: {
        color: colors.secondary,
    },
    errorContainer: {
        position: 'absolute',
        bottom: 100,
        left: 16,
        right: 16,
        backgroundColor: colors.error,
        borderRadius: 8,
        padding: 12,
    },
    errorText: {
        color: colors.white,
        textAlign: 'center',
    },
});
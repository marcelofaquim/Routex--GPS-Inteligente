// NavigationScreen.tsx - Tela de navegação passo a passo com voz
// Funcionalidades: Instruções de rota, voz, progresso, finalização

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import * as Speech from 'expo-speech';
import { colors } from '../constants/colors';

interface Props {
    navigation: any;
    route: any;
}

export default function NavigationScreen({ navigation, route }: Props) {
    const { origem, destino, distancia, duracao } = route.params || {};
    
    const [step, setStep] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [tempoRestante, setTempoRestante] = useState(duracao || 12);
    const [distanciaRestante, setDistanciaRestante] = useState(distancia || 5.2);
    const [alertas, setAlertas] = useState([
         { tipo: 'radar', mensagem: '⚠️ Radar a 300m - Limite 60km/h', distancia: 0.3 },
         { tipo: 'zonaAzul', mensagem: '🅿️ Zona Azul a 500m - R$ 5,00/h', distancia: 0.5 }
    ])
    
    // Instruções detalhadas da rota
    const instrucoes = [
        {
            texto: "Siga em frente por 500 metros",
            distancia: 0.5,
            tempo: 2,
        },
        {
            texto: "Vire à direita na próxima rua",
            distancia: 0.3,
            tempo: 1,
        },
        {
            texto: "Continue por 2 quilômetros",
            distancia: 2.0,
            tempo: 5,
        },
        {
            texto: "Vire à esquerda no semáforo",
            distancia: 0.2,
            tempo: 1,
        },
        {
            texto: "Você chegou ao destino!",
            distancia: 0,
            tempo: 0,
        },
    ];

    // Falar instrução atual
    const speakInstruction = async (text: string, isFinal: boolean = false) => {
        try {
            setIsSpeaking(true);
            const options = {
                language: 'pt-BR',
                pitch: isFinal ? 1.2 : 1.0,
                rate: isFinal ? 0.9 : 0.85,
            };
            
            await Speech.speak(text, options);
            setIsSpeaking(false);
        } catch (error) {
            console.error('Erro na voz:', error);
            setIsSpeaking(false);
        }
    };

    // Quando mudar de passo, falar a instrução
    useEffect(() => {
        if (instrucoes[step]) {
            speakInstruction(instrucoes[step].texto, step === instrucoes.length - 1);
            
            // Atualizar distância e tempo restante
            let distanciaRest = 0;
            let tempoRest = 0;
            for (let i = step; i < instrucoes.length; i++) {
                distanciaRest += instrucoes[i].distancia;
                tempoRest += instrucoes[i].tempo;
            }
            setDistanciaRestante(parseFloat(distanciaRest.toFixed(1)));
            setTempoRestante(tempoRest);
        }
    }, [step]);

    //Distancia for inferior irá alertar

        useEffect(() => {
    const alertaProximo = alertas.find(a => a.distancia >= distanciaRestante);
    if (alertaProximo && !alertasMostrados.current.includes(alertaProximo.tipo)) {
        alertasMostrados.current.push(alertaProximo.tipo);
        Alert.alert('Alerta', alertaProximo.mensagem);
        Speech.speak(alertaProximo.mensagem);
    }
    }, [distanciaRestante]);


    // Limpar voz ao sair da tela
    useEffect(() => {
        return () => {
            Speech.stop();
        };
    }, []);

    // Próxima instrução
    const nextStep = () => {
        if (step < instrucoes.length - 1) {
            setStep(step + 1);
        }
    };

    // Instrução anterior
    const prevStep = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    // Repetir instrução atual
    const repeatInstruction = () => {
        if (instrucoes[step]) {
            speakInstruction(instrucoes[step].texto);
        }
    };

    // Finalizar navegação
    const finishNavigation = () => {
        Speech.stop();
        Alert.alert(
            'Viagem finalizada',
            'Parabéns! Você chegou ao destino.',
            [
                {
                    text: 'Voltar ao mapa',
                    onPress: () => navigation.navigate('Home'),
                },
                {
                    text: 'Ver resumo',
                    onPress: () => navigation.navigate('RouteDetails', route.params),
                },
            ]
        );
    };

    // Pular navegação
    const skipNavigation = () => {
        Speech.stop();
        Alert.alert(
            'Encerrar navegação',
            'Deseja encerrar a navegação?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Encerrar',
                    onPress: () => navigation.navigate('Home'),
                },
            ]
        );
    };

    // Calcular progresso
    const progress = ((step + 1) / instrucoes.length) * 100;

    return (
        <View style={styles.container}>
            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity onPress={skipNavigation} style={styles.exitButton}>
                    <Text style={styles.exitButtonText}>✕ Sair</Text>
                </TouchableOpacity>
                <Text style={styles.destino}>{destino?.nome || 'Destino'}</Text>
                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{distanciaRestante} km</Text>
                        <Text style={styles.statLabel}>Restante</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{tempoRestante} min</Text>
                        <Text style={styles.statLabel}>Restante</Text>
                    </View>
                </View>
            </View>

            {/* Barra de progresso */}
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
                <Text style={styles.progressText}>
                    Passo {step + 1} de {instrucoes.length}
                </Text>
            </View>

            {/* Instrução principal */}
            <View style={styles.instructionCard}>
                <Text style={styles.instructionIcon}>🗣️</Text>
                <Text style={styles.instructionText}>{instrucoes[step]?.texto}</Text>
                
                {/* Indicador de voz */}
                {isSpeaking && (
                    <View style={styles.speakingIndicator}>
                        <Text style={styles.speakingText}>🔊 Falando...</Text>
                    </View>
                )}
            </View>

            {/* Mini mapa/visualização da rota (simulado) */}
            <View style={styles.routePreview}>
                <Text style={styles.previewTitle}>Próximos passos:</Text>
                {instrucoes.slice(step + 1, step + 4).map((inst, idx) => (
                    <Text key={idx} style={styles.previewText}>
                        → {inst.texto}
                    </Text>
                ))}
                {step + 4 < instrucoes.length && (
                    <Text style={styles.previewMore}>
                        + {instrucoes.length - (step + 4)} instruções restantes
                    </Text>
                )}
            </View>

            {/* Botões de controle */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                    style={[styles.button, styles.repeatButton]} 
                    onPress={repeatInstruction}
                    disabled={isSpeaking}
                >
                    <Text style={styles.buttonText}>🔊 Repetir</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.prevButton]} 
                    onPress={prevStep}
                    disabled={step === 0}
                >
                    <Text style={styles.buttonText}>◀ Anterior</Text>
                </TouchableOpacity>

                {step < instrucoes.length - 1 ? (
                    <TouchableOpacity 
                        style={[styles.button, styles.nextButton]} 
                        onPress={nextStep}
                    >
                        <Text style={styles.nextButtonText}>Próximo ▶</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        style={[styles.button, styles.finishButton]} 
                        onPress={finishNavigation}
                    >
                        <Text style={styles.finishButtonText}>✓ Finalizar</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Informações adicionais */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    📍 Saindo de: {origem?.nome || 'Sua localização'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: colors.primary,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    exitButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        padding: 8,
    },
    exitButtonText: {
        color: colors.white,
        fontSize: 14,
        opacity: 0.8,
    },
    destino: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.secondary,
    },
    statLabel: {
        fontSize: 12,
        color: colors.white,
        opacity: 0.8,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: colors.white,
        opacity: 0.3,
    },
    progressContainer: {
        padding: 20,
        backgroundColor: colors.black,
    },
    progressBar: {
        height: 4,
        backgroundColor: colors.secondary,
        borderRadius: 2,
        marginBottom: 8,
    },
    progressText: {
        fontSize: 12,
        color: colors.gray,
        textAlign: 'center',
    },
    instructionCard: {
        margin: 20,
        padding: 30,
        backgroundColor: colors.black,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
    },
    instructionIcon: {
        fontSize: 48,
        marginBottom: 20,
    },
    instructionText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
        marginBottom: 16,
    },
    speakingIndicator: {
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 10,
    },
    speakingText: {
        color: colors.white,
        fontSize: 12,
    },
    routePreview: {
        marginHorizontal: 20,
        padding: 16,
        backgroundColor: colors.black,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.gray,
    },
    previewTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.secondary,
        marginBottom: 12,
    },
    previewText: {
        fontSize: 13,
        color: colors.white,
        marginBottom: 6,
        opacity: 0.8,
    },
    previewMore: {
        fontSize: 12,
        color: colors.gray,
        marginTop: 8,
        fontStyle: 'italic',
    },
    buttonsContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 10,
        marginTop: 'auto',
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    repeatButton: {
        backgroundColor: colors.gray,
    },
    prevButton: {
        backgroundColor: colors.primary,
    },
    nextButton: {
        backgroundColor: colors.secondary,
    },
    finishButton: {
        backgroundColor: colors.success,
    },
    buttonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 14,
    },
    nextButtonText: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: 14,
    },
    finishButtonText: {
        color: colors.black,
        fontWeight: 'bold',
        fontSize: 14,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.gray,
    },
    footerText: {
        fontSize: 11,
        color: colors.gray,
        textAlign: 'center',
    },
});
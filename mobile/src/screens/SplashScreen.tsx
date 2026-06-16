//  Tela de abertura do Routex


import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface Props {
    navigation: any;
}

export default function SplashScreen({ navigation }: Props) {
    const { colors, isDark } = useTheme();
    
    // Animações
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const logoAnim = useRef(new Animated.Value(0)).current;
    const textAnim = useRef(new Animated.Value(0)).current;
    const dot1Anim = useRef(new Animated.Value(0)).current;
    const dot2Anim = useRef(new Animated.Value(0)).current;
    const dot3Anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animação do logo (rotação/bounce)
        Animated.spring(logoAnim, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
        }).start();

        // Animação de fade e scale da tela
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(textAnim, {
                toValue: 1,
                duration: 1000,
                delay: 300,
                useNativeDriver: true,
            }),
        ]).start();

        // Animação dos dots (loading)
        Animated.loop(
            Animated.sequence([
                Animated.timing(dot1Anim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(dot2Anim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(dot3Anim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(500),
                Animated.parallel([
                    Animated.timing(dot1Anim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot2Anim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot3Anim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        ).start();

        // Aguardar e navegar
        const timer = setTimeout(() => {
            navigation.replace('Home');
        }, 3500);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={[styles.container, { backgroundColor: isDark ? colors.dark : colors.primary }]}>
            {/* Logo animado */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { scale: scaleAnim },
                            {
                                rotate: logoAnim.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: ['0deg', '10deg', '0deg'],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <View style={[styles.logoCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                    <Text style={styles.logoIcon}>🗺️</Text>
                </View>
            </Animated.View>

            {/* Nome do app */}
            <Animated.Text
                style={[
                    styles.logoText,
                    {
                        color: isDark ? colors.white : '#FFF',
                        opacity: textAnim,
                        transform: [{ translateY: textAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                        }) }],
                    },
                ]}
            >
                ROUTEX
            </Animated.Text>

            {/* Tagline */}
            <Animated.Text
                style={[
                    styles.tagline,
                    {
                        color: isDark ? colors.gray : 'rgba(255,255,255,0.8)',
                        opacity: textAnim,
                    },
                ]}
            >
                Seu GPS inteligente
            </Animated.Text>

            {/* Loading dots animados */}
            <View style={styles.loadingContainer}>
                <View style={styles.dotsContainer}>
                    <Animated.View
                        style={[
                            styles.dot,
                            {
                                backgroundColor: isDark ? colors.secondary : '#FFF',
                                opacity: dot1Anim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.2, 1],
                                }),
                                transform: [
                                    {
                                        scale: dot1Anim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.8, 1.2],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.dot,
                            {
                                backgroundColor: isDark ? colors.secondary : '#FFF',
                                opacity: dot2Anim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.2, 1],
                                }),
                                transform: [
                                    {
                                        scale: dot2Anim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.8, 1.2],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.dot,
                            {
                                backgroundColor: isDark ? colors.secondary : '#FFF',
                                opacity: dot3Anim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.2, 1],
                                }),
                                transform: [
                                    {
                                        scale: dot3Anim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.8, 1.2],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />
                </View>
                <Text style={[styles.loadingText, { color: isDark ? colors.gray : 'rgba(255,255,255,0.6)' }]}>
                    Carregando...
                </Text>
            </View>

            {/* Versão */}
            <Text style={[styles.version, { color: isDark ? colors.gray : 'rgba(255,255,255,0.4)' }]}>
                versão 1.0.0
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 20,
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    logoIcon: {
        fontSize: 60,
    },
    logoText: {
        fontSize: 42,
        fontWeight: 'bold',
        letterSpacing: 3,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 14,
        letterSpacing: 1,
        marginBottom: 80,
    },
    loadingContainer: {
        position: 'absolute',
        bottom: 100,
        alignItems: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 12,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    loadingText: {
        fontSize: 12,
        letterSpacing: 1,
    },
    version: {
        position: 'absolute',
        bottom: 30,
        fontSize: 10,
    },
});
// Tela de abertura

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';

interface Props {
  navigation: any;
}

export default function SplashScreen({ navigation }: Props) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.logo}>ROUTEX</Text>
        <Text style={styles.slogan}>A estrada feita pra você</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { alignItems: 'center' },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textShadowColor: colors.secondary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  slogan: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
  },
});
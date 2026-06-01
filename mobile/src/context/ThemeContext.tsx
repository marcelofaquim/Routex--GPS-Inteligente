// gerenciar modo escuro/claro

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorsDark, colorsLight } from '../constants/colors';

type ThemeType = 'dark' | 'light';

interface ThemeContextData {
    theme: ThemeType;
    colors: typeof colorsDark;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeType>('dark')

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('@Routex:theme');
            if (savedTheme === 'light' || savedTheme === 'dark') {
                setTheme(savedTheme);
            }
        } catch (error) {
            console.error('Erro ao carregar Tema', error);
        }
    }; 

    const saveTheme = async (newTheme: ThemeType) => {
        try {
            await AsyncStorage.setItem('@Routex:theme', newTheme);
        } catch (error) {
            console.error('Erro ao salvar tema:', error);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        saveTheme(newTheme);
    };

    const colors = theme === 'dark' ? colorsDark : colorsLight;

    return (
        <ThemeContext.Provider
            value={{
                theme,
                colors,
                toggleTheme,
                isDark: theme === 'dark',
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);





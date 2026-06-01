//Gerenciar preço dos combustiveis

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FuelPriceContext {
    diesel: number;
    gasolina: number;
    etanol: number;
    setDiesel: (value: number) => void;
    setGasolina: (value: number) => void;
    setEtanol: (value: number) => void;
    getPrecoPorTipo: (tipo: string) => number;    
}


const FuelPriceContext = createContext<FuelPriceContextData>({} as FuelPriceContextData);

export const FuelPriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [diesel, setDieselState] = useState(5.60);
    const [gasolina, setGasolinaState] = useState(6.20);
    const [etanol, setEtanolState] = useState(4.30);

    //carregar preços salvos
    useEffect(() => {
        loadPrices();
    }, []);

    const loadPrices = async () => {
        try {
            const savedDiesel = await AsyncStorage.getItem('@Routex:dieselPrice');
            const savedGasolina = await AsyncStorage.getItem('@Routex:gasolinaPrice');
            const savedEtanol = await AsyncStorage.getItem('@Routex:etanolPrice');

            if (savedDiesel) setDieselState(parseFloat(savedDiesel));
            if (savedGasolina) setDieselState(parseFloat(savedGasolina));
            if (savedEtanol) setDieselState(parseFloat(savedEtanol));
        } catch (error) {
            console.error ('Erro ao carregar o preço', error);
        }
    };

    const setDiesel = async (value: number) => {
        setDieselState(value);
        await AsyncStorage.setItem('@Routex:dieselPrice', value.toString());
    };

    const setGasolina = async (value: number) => {
        setGasolinaState(value);
        await AsyncStorage.setItem('@Routex:gasolinaPrice', value.toString());
    };
    
    const setEtanol = async (value: number) => {
        setEtanolState(value);
        await AsyncStorage.setItem('@Routex:etanolPrice', value.toString());
    };
    
    const getPrecoPorTipo = (tipo: string): number => {
        switch (tipo) {
            case 'diesel': return diesel;
            case 'gasolina': return gasolina;
            case 'etanol': return etanol;
            default: return gasolina;
        }
    };

    return (
        <FuelPriceContext.Provider value={{
            diesel, gasolina, etanol,
            setDiesel, setGasolina, setEtanol,
            getPrecoPorTipo
        }}>

            {children}
        </FuelPriceContext.Provider>
    )

}

export const useFuelPrice =() => useContext(FuelPriceContext);
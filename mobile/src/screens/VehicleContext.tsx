import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Vehicle {
    id: number;
    placa: string;
    marca: string;
    modelo: string;
    consumo_medio: number;
}

interface VehicleContextData {
    activeVehicle: Vehicle | null;
    setActiveVehicle: (vehicle: Vehicle) => void;
    clearActiveVehicle: () => void;
}

const VehicleContext = createContext<VehicleContextData>({} as VehicleContextData);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeVehicle, setActiveVehicleState] = useState<Vehicle | null>(null);

    useEffect(() => {
        loadSavedVehicle();
    }, []);

     const loadSavedVehicle = async () => {
        const saved = await AsyncStorage.getItem('@Routex:activeVehicle');
        if (saved) {
            setActiveVehicleState(JSON.parse(saved));
        }
    };

    const setActiveVehicle = async (vehicle: Vehicle) => {
        setActiveVehicleState(vehicle);
        await AsyncStorage.setItem('@Routex:activeVehicle', JSON.stringify(vehicle));
    };

    const clearActiveVehicle = async () => {
        setActiveVehicleState(null);
        await AsyncStorage.removeItem('@Routex:activeVehicle');
    };

    return (
        <VehicleContext.Provider value={{ activeVehicle, setActiveVehicle, clearActiveVehicle }}>
            {children}
        </VehicleContext.Provider>
    );
};

export const useVehicle = () => useContext(VehicleContext);


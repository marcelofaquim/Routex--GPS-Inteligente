// Gerenciar destinos favoritos

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface favoritos {
    id: string;
    nome: string;
    latitude: number;
    longitude: number;
    endereco: string;
}
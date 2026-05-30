// routeService.ts - Integração com OpenRouteService 

import axios from 'axios';

// Sua API Key do OpenRouteService
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjJkYzE5MmQ3Y2YwZjRhYzM5MmI3YzQ5OGMzMDI5NzY2IiwiaCI6Im11cm11cjY0In0='; // ← COLOQUE SUA CHAVE AQUI

// Base URL da API
const ORS_URL = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

interface Coordinates {
    lat: number;
    lng: number;
}

interface RouteResult {
    distancia: number;  // km
    duracao: number;    // minutos
    pontos: Array<{ latitude: number; longitude: number }>; // polyline
    instrucoes?: string[];
}

export const routeService = {
    /**
     * Calcular rota entre dois pontos
     * @param origem - { lat, lng } coordenadas de partida
     * @param destino - { lat, lng } coordenadas de chegada
     * @returns Objeto com distância, duração e pontos da rota
     */
    calcularRota: async (origem: Coordinates, destino: Coordinates): Promise<RouteResult> => {
        try {
            console.log('📍 Calculando rota real...');
            console.log('Origem:', origem);
            console.log('Destino:', destino);

            const requestBody = {
                coordinates: [
                    [origem.lng, origem.lat],  // [longitude, latitude] - ORS usa essa ordem!
                    [destino.lng, destino.lat],
                ],
                format: 'geojson',
                units: 'km',
                language: 'pt-BR',  // Instruções em português
            };

            const response = await axios.post(ORS_URL, requestBody, {
                headers: {
                    'Authorization': ORS_API_KEY,
                    'Content-Type': 'application/json',
                },
                timeout: 15000,
            });

            console.log('✅ Resposta recebida!');

            // Extrair dados da resposta
            const feature = response.data.features[0];
            const properties = feature.properties;
            const summary = properties.summary;
            const geometry = feature.geometry;

            // Extrair distância (metros -> km) e duração (segundos -> minutos)
            const distancia = parseFloat((summary.distance / 1000).toFixed(1));
            const duracao = Math.round(summary.duration / 60);

            // Extrair pontos da rota para o mapa (polyline)
            const pontos = geometry.coordinates.map(coord => ({
                longitude: coord[0],
                latitude: coord[1],
            }));

            // Extrair instruções passo a passo
            const instrucoes = properties.segments[0]?.steps?.map(
                (step: any) => step.instruction
            ) || [];

            console.log(`📏 Distância: ${distancia} km | ⏱️ Duração: ${duracao} min`);

            return {
                distancia,
                duracao,
                pontos,
                instrucoes,
            };

        } catch (error: any) {
            console.error('❌ Erro ao calcular rota:', error?.message);
            
            // Fallback: retornar valores simulados
            console.warn('⚠️ Usando fallback simulado');
            return {
                distancia: 5.2,
                duracao: 12,
                pontos: [],
                instrucoes: ['Siga em frente', 'Vire à direita', 'Continue', 'Você chegou'],
            };
        }
    },

    /**
     * Buscar coordenadas por endereço (Geocoding)
     * @param endereco - Nome do lugar ou endereço
     * @returns { lat, lng } ou null se não encontrar
     */
    geocoding: async (endereco: string): Promise<Coordinates | null> => {
        try {
            const url = `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(endereco)}&size=1`;
            const response = await axios.get(url);

            if (response.data.features && response.data.features.length > 0) {
                const coords = response.data.features[0].geometry.coordinates;
                return { lat: coords[1], lng: coords[0] };
            }
            return null;
        } catch (error) {
            console.error('Erro no geocoding:', error);
            return null;
        }
    },
};

export default routeService;
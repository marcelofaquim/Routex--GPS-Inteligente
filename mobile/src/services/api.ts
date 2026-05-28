// Conexão com o backend
import axios from 'axios';

//Para testar no celular fisico, use o IP do seu computador
//EX: ' http://192.168.1.1000:3000/api'
//Para testar no emulador Android ' https//10.0.2.2:3000/api'

const API_URL = 'http://localhost:3000/api'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

//Serviço de veiculos
export const veiculoService = {
    //Listar veiculos o usuario
    listar: async (usuarioId: number = 1) => {
        const response = await api.get(`/veiculos?usuario_id=${usuarioId}`);
        return response.data;
    },

    //Cadastrar veiculos novos
    cadastrar: async (veiculo: any) => {
        const response = await api.post('/veiculos', veiculo);
        return response.data
    },

    // Buscar veiculo por ID
    buscarPorId: async (id: number) => {
        const response = await api.get(`/veiculos/${id}`);
        return response.data
    },

    //atualizar veiculos
    atualizar: async (id: number, veiculo: any) => {
        const response = await api.put(`/veiculos/${id}`, veiculo);
        return response.data
    },

    //Delete Veiculo
    deletar: async (id: number) => {
        const response = await api.delete(`/veiculos/${id}`);
        return response.data
    },
};

export default api;
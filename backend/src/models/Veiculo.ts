// models/Veiculo.ts
// Modelo de veículo usando MOCK (banco em memória)

import mockDb, { Veiculo as MockVeiculo } from '../database/mocKDb';

// Exportar a interface Veiculo
export interface Veiculo extends MockVeiculo {}

// Classe com os métodos CRUD
export class VeiculoModel {
    
    // Criar novo veículo
    static async create(veiculo: Omit<Veiculo, 'id'>): Promise<Veiculo> {
        // Validações básicas
        if (!veiculo.placa) throw new Error('Placa é obrigatória');
        if (!veiculo.marca) throw new Error('Marca é obrigatória');
        if (!veiculo.modelo) throw new Error('Modelo é obrigatório');
        if (!veiculo.ano) throw new Error('Ano é obrigatório');
        if (!veiculo.tipo) throw new Error('Tipo é obrigatório');
        if (!veiculo.combustivel) throw new Error('Combustível é obrigatório');
        if (!veiculo.consumo_medio) throw new Error('Consumo médio é obrigatório');
        
        return mockDb.createVeiculo(veiculo);
    }

    // Buscar veículos por usuário
    static async findByUsuario(usuario_id: number): Promise<Veiculo[]> {
        if (!usuario_id) throw new Error('Usuário ID é obrigatório');
        return mockDb.findVeiculosByUsuario(usuario_id);
    }

    // Buscar veículo por ID
    static async findById(id: number): Promise<Veiculo | null> {
        if (!id) throw new Error('ID é obrigatório');
        return mockDb.findVeiculoById(id);
    }

    // Atualizar veículo
    static async update(id: number, veiculo: Partial<Veiculo>): Promise<Veiculo | null> {
        if (!id) throw new Error('ID é obrigatório');
        return mockDb.updateVeiculo(id, veiculo);
    }

    // Deletar veículo
    static async delete(id: number): Promise<boolean> {
        if (!id) throw new Error('ID é obrigatório');
        return mockDb.deleteVeiculo(id);
    }

    // Listar todos os veículos (para debug)
    static async listarTodos(): Promise<Veiculo[]> {
        return mockDb.listarTodos();
    }
}
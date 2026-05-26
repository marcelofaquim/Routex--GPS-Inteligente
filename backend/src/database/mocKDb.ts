// database/mockDb.ts
// Banco de dados em memória (MOCK) - Não precisa de PostgreSQL

export interface Veiculo {
    id?: number;
    usuario_id: number;
    placa: string;
    marca: string;
    modelo: string;
    ano: number;
    tipo: 'carro' | 'moto' | 'caminhao';
    combustivel: 'gasolina' | 'etanol' | 'diesel';
    consumo_medio: number;
    peso_veiculo?: number;
    capacidade_carga?: number;
    ativo?: boolean;
    created_at?: Date;
}

// Dados em memória
let veiculos: Veiculo[] = [];
let nextId = 1;

// Funções do banco mock
export const mockDb = {
    // Criar veículo
    createVeiculo: async (veiculo: Omit<Veiculo, 'id'>): Promise<Veiculo> => {
        const novo: Veiculo = {
            ...veiculo,
            id: nextId++,
            ativo: true,
            created_at: new Date()
        };
        veiculos.push(novo);
        console.log('✅ Veículo criado (mock):', novo);
        return novo;
    },

    // Buscar veículos por usuário
    findVeiculosByUsuario: async (usuario_id: number): Promise<Veiculo[]> => {
        const resultado = veiculos.filter(v => v.usuario_id === usuario_id && v.ativo !== false);
        console.log(`📋 Buscando veículos do usuário ${usuario_id}: ${resultado.length} encontrados`);
        return resultado;
    },

    // Buscar veículo por ID
    findVeiculoById: async (id: number): Promise<Veiculo | null> => {
        const veiculo = veiculos.find(v => v.id === id && v.ativo !== false);
        if (veiculo) {
            console.log(`🔍 Veículo encontrado (ID: ${id})`);
        } else {
            console.log(`❌ Veículo não encontrado (ID: ${id})`);
        }
        return veiculo || null;
    },

    // Atualizar veículo
    updateVeiculo: async (id: number, updates: Partial<Veiculo>): Promise<Veiculo | null> => {
        const index = veiculos.findIndex(v => v.id === id && v.ativo !== false);
        if (index === -1) {
            console.log(`❌ Falha ao atualizar: veículo ${id} não encontrado`);
            return null;
        }
        
        veiculos[index] = { ...veiculos[index], ...updates };
        console.log(`✏️ Veículo atualizado (ID: ${id})`);
        return veiculos[index];
    },

    // Deletar veículo (soft delete)
    deleteVeiculo: async (id: number): Promise<boolean> => {
        const index = veiculos.findIndex(v => v.id === id && v.ativo !== false);
        if (index === -1) {
            console.log(`❌ Falha ao deletar: veículo ${id} não encontrado`);
            return false;
        }
        
        veiculos[index].ativo = false;
        console.log(`🗑️ Veículo deletado (ID: ${id})`);
        return true;
    },

    // Listar todos (para debug)
    listarTodos: async (): Promise<Veiculo[]> => {
        return veiculos.filter(v => v.ativo !== false);
    }
};

export default mockDb;
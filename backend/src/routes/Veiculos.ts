import { Router } from "express";
import { VeiculoModel } from "../models/Veiculo";

const router = Router();

//GET/api/veiculos - listar Veiculos do usuario
router.get('/', async (require, res) => {
    try {
        //usuario_id fixo 
        const usuario_id = 1;
        const veiculos = await VeiculoModel.findByUsuario(usuario_id);
        res.json({ sucess: true, data: veiculos });
    } catch (error) {
        res.status(500).json({ sucess: false, error: error.message });
    }
});

// POST /api/veiculos - Cadastrar novo veículo
router.post('/', async (req, res) => {
    try {
        const veiculo = {
            usuario_id: 1, // Temporário
            ...req.body
        };
        const novoVeiculo = await VeiculoModel.create(veiculo);
        res.status(201).json({ success: true, data: novoVeiculo });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/veiculos/:id - Buscar veículo por ID
router.get('/:id', async (req, res) => {
    try {
        const veiculo = await VeiculoModel.findById(parseInt(req.params.id));
        if (!veiculo) {
            return res.status(404).json({ success: false, error: 'Veículo não encontrado' });
        }
        res.json({ success: true, data: veiculo });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/veiculos/:id - Atualizar veículo
router.put('/:id', async (req, res) => {
    try {
        const veiculo = await VeiculoModel.update(parseInt(req.params.id), req.body);
        if (!veiculo) {
            return res.status(404).json({ success: false, error: 'Veículo não encontrado' });
        }
        res.json({ success: true, data: veiculo });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/veiculos/:id - Remover veículo
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await VeiculoModel.delete(parseInt(req.params.id));
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Veículo não encontrado' });
        }
        res.json({ success: true, message: 'Veículo removido com sucesso' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
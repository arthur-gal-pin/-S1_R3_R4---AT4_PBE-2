import { Request, Response } from "express";
import clienteRepository from "../repositories/clienteRepository";
import { Cliente } from '../models/Cliente';
import { Telefone } from '../models/Telefone';
import { Endereco } from '../models/Endereco';
import { validarCPF } from "../utils/validarCpf";
import { limparNumero } from "../utils/limparNumero";
import consultarCep from "../utils/buscarCep";

// --- CLIENTE CONTROLLER ---
const clienteController = {
    criar: async (Req: Request, Res: Response) => {
        try {
            let { nomeCliente, sobrenomeCliente, cpf, email, numeroTelefone, tipoTelefone, cep, numeroEndereco, complemento } = Req.body;

            cpf = limparNumero(cpf);
            cep = limparNumero(cep);
            numeroTelefone = limparNumero(numeroTelefone);

            if (!validarCPF(cpf)) {
                return Res.status(400).json({ message: 'CPF inválido.' });
            }

            const informacaoEndereco = await consultarCep(cep);

            const cliente = Cliente.criar({ nomeCliente, sobrenomeCliente, cpf, email });
            const telefone = Telefone.criar({
                idCliente: 0, // Será definido pelo Repository via insertId
                tipo: tipoTelefone,
                numero: numeroTelefone
            });
            const endereco = Endereco.criar({
                idCliente: 0,
                cep: cep,
                UF: informacaoEndereco.uf,
                logradouro: informacaoEndereco.logradouro,
                cidade: informacaoEndereco.localidade,
                bairro: informacaoEndereco.bairro,
                numero: numeroEndereco,
                complemento: complemento || informacaoEndereco.complemento
            });

            const result = await clienteRepository.clienteRepository.create(cliente, telefone, endereco);
            return Res.status(201).json({ message: 'Cliente, telefone e endereço registrados com sucesso!', data: result });
        } catch (error: any) {
            return Res.status(500).json({ message: 'Erro ao criar cliente.', error: error.message });
        }
    },

    listar: async (Req: Request, Res: Response) => {
        try {
            const { idCliente, nomeCliente } = Req.query;
            const id = idCliente ? Number(idCliente) : undefined;
            const nome = nomeCliente ? String(nomeCliente) : undefined;

            const result = await clienteRepository.clienteRepository.read(nome, id);

            if (result.length === 0) {
                return Res.status(200).json({ message: 'Nenhum registro encontrado.', data: [] });
            }

            return Res.status(200).json({ message: 'Requisição bem sucedida', data: result });
        } catch (error: any) {
            return Res.status(500).json({ message: 'Erro ao listar clientes.', error: error.message });
        }
    },

    atualizar: async (Req: Request, Res: Response) => {
        try {
            const id = Number(Req.params.id || Req.query.id);
            const { nome, sobrenome, cpf, email } = Req.body;

            // Busca os dados atuais para não perder informações não enviadas no body
            const dadosAtuais = await clienteRepository.clienteRepository.read(undefined, id);
            if (dadosAtuais.length === 0) {
                return Res.status(404).json({ message: 'Cliente não encontrado.' });
            }

            const antigo = dadosAtuais[0];

            const cliente = Cliente.editar({
                idCliente: id,
                nomeCliente: nome || antigo.NomeCliente,
                sobrenomeCliente: sobrenome || antigo.SobrenomeCliente,
                cpf: cpf ? limparNumero(cpf) : antigo.CPF,
                email: email || antigo.email
            });

            const result = await clienteRepository.clienteRepository.update(cliente);
            return Res.status(200).json({ message: 'Dados do cliente atualizados!', data: result });
        } catch (error: any) {
            return Res.status(500).json({ message: 'Erro ao atualizar cliente.', error: error.message });
        }
    },

    excluir: async (Req: Request, Res: Response) => {
        try {
            const id = Number(Req.params.id);
            const result = await clienteRepository.clienteRepository.delete(id);
            return Res.status(200).json({ message: 'Cliente e dependências excluídos.', data: result });
        } catch (error: any) {
            return Res.status(500).json({ message: 'Erro ao excluir cliente.', error: error.message });
        }
    }
};

// --- TELEFONE CONTROLLER ---
const telefoneController = {
    criar: async (Req: Request, Res: Response) => {
        try {
            let { idCliente, numero, tipo } = Req.body;
            const telefone = Telefone.criar({ idCliente, numero: limparNumero(numero), tipo });
            const result = await clienteRepository.telefoneRepository.create(telefone);
            return Res.status(201).json({ message: 'Telefone adicionado.', data: result });
        } catch (error: any) {
            return Res.status(500).json({ message: 'Erro ao adicionar telefone.', error: error.message });
        }
    },

    listar: async (Req: Request, Res: Response) => {
        try {
            const { idCliente, numero } = Req.query;
            const result = await clienteRepository.telefoneRepository.read(
                numero ? String(numero) : undefined, 
                undefined, 
                idCliente ? Number(idCliente) : undefined
            );
            return Res.status(200).json({ data: result });
        } catch (error: any) {
            return Res.status(500).json({ error: error.message });
        }
    },

    atualizar: async (Req: Request, Res: Response) => {
        try {
            const idTelefone = Number(Req.params.id);
            const { numero, tipo, idCliente } = Req.body;

            // Busca telefone atual para mesclagem
            const lista = await clienteRepository.telefoneRepository.read(undefined, idTelefone);
            if (lista.length === 0) return Res.status(404).json({ message: 'Telefone não encontrado.' });
            
            const antigo = lista[0];

            const telefone = Telefone.editar({
                id: idTelefone,
                numero: numero ? limparNumero(numero) : antigo.numero,
                tipo: tipo || antigo.tipo,
                idCliente: idCliente || antigo.idCliente
            });

            const result = await clienteRepository.telefoneRepository.update(telefone);
            return Res.status(200).json({ message: 'Telefone atualizado.', data: result });
        } catch (error: any) {
            return Res.status(500).json({ error: error.message });
        }
    },

    excluir: async (Req: Request, Res: Response) => {
        try {
            const result = await clienteRepository.telefoneRepository.delete(Number(Req.params.id));
            return Res.status(200).json({ message: 'Telefone removido.', result });
        } catch (error: any) {
            return Res.status(500).json({ error: error.message });
        }
    }
};

// --- ENDERECO CONTROLLER ---
const enderecoController = {
    criar: async (Req: Request, Res: Response) => {
        try {
            let { idCliente, cep, numero, complemento } = Req.body;
            cep = limparNumero(cep);
            const info = await consultarCep(cep);

            const endereco = Endereco.criar({
                idCliente,
                cep,
                UF: info.uf,
                logradouro: info.logradouro,
                cidade: info.localidade,
                bairro: info.bairro,
                numero,
                complemento: complemento || info.complemento
            });

            const result = await clienteRepository.enderecoRepository.create(endereco);
            return Res.status(201).json({ message: 'Endereço salvo.', data: result });
        } catch (error: any) {
            return Res.status(500).json({ error: error.message });
        }
    },

    listar: async (Req: Request, Res: Response) => {
        try {
            const { idCliente } = Req.query;
            const result = await clienteRepository.enderecoRepository.read(undefined, idCliente ? Number(idCliente) : undefined);
            return Res.status(200).json({ data: result });
        } catch (error: any) {
            return Res.status(500).json({ error: error.message });
        }
    },

    atualizar: async (Req: Request, Res: Response) => {
        try {
            const idEndereco = Number(Req.params.id);
            let { cep, numero, complemento } = Req.body;

            const lista = await clienteRepository.enderecoRepository.read(idEndereco);
            if (lista.length === 0) return Res.status(404).json({ message: 'Endereço não encontrado.' });
            
            const antigo = lista[0];
            let infoCep = { 
                uf: antigo.UF, 
                logradouro: antigo.logradouro, 
                localidade: antigo.cidade, 
                bairro: antigo.bairro 
            };

            // Se o CEP mudou, busca as novas informações na API
            if (limparNumero(cep) !== antigo.cep) {
                cep = limparNumero(cep);
                const novaInfo = await consultarCep(cep);
                infoCep = { ...novaInfo };
            } else {
                cep = antigo.cep;
            }

            const endereco = Endereco.editar({
                idEndereco,
                idCliente: antigo.idCliente,
                cep,
                UF: infoCep.uf,
                logradouro: infoCep.logradouro,
                cidade: infoCep.localidade,
                bairro: infoCep.bairro,
                numero: numero || antigo.numero,
                complemento: complemento !== undefined ? complemento : antigo.complemento
            });

            const result = await clienteRepository.enderecoRepository.update(endereco);
            return Res.status(200).json({ message: 'Endereço atualizado.', data: result });
        } catch (error: any) {
            return Res.status(500).json({ error: error.message });
        }
    },

    excluir: async (Req: Request, Res: Response) => {
        try {
            const id = Req.params.id;
            const result = await clienteRepository.enderecoRepository.delete(Number(id));
            return Res.status(200).json({ message: 'Endereço removido.', result });
        } catch (error: any) {
            return Res.status(500).json({ error: error.message });
        }
    }
};

export { clienteController, enderecoController, telefoneController };
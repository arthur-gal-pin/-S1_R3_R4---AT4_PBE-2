import axios from 'axios';

interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}


export default async function consultarCep(cep: string) {
    try {
        const { data } = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`);

        if (data.erro) {
            throw new Error("O CEP informado não existe na base de dados.");
        }

        console.log("Dados recebidos:", data);
        return data;

    } catch (error: any) {
        throw new Error;
    }
}
export class Endereco {
    private _id: number | null;
    private _idCliente: number;
    private _cep: string;
    private _UF: string;
    private _logradouro: string;
    private _cidade: string;
    private _bairro: string |null;
    private _numero: string;
    private _complemento: string | null;

    constructor(id: number | null, idCliente: number, cep: string, UF: string, logradouro: string, cidade: string, bairro: string, numero: string, complemento: string | null) {
        this._id = id;
        this._idCliente = idCliente;
        this._cep = cep;
        this._UF = UF;
        this._cidade = cidade;
        this._bairro = bairro;
        this._logradouro = logradouro;
        this._numero = numero;
        this._complemento = complemento;
    }
    get id(): number | null { return this._id };
    get idCliente(): number { return this._idCliente };
    get cep(): string { return this._cep };
    get UF(): string { return this._UF };
    get logradouro(): string { return this._logradouro };
    get cidade(): string { return this._cidade };
    get bairro(): string | null{ return this._bairro };
    get numero(): string { return this._numero };
    get complemento(): string | null{return this._complemento};

    // --- Métodos de Validação ---

    private validarId(value: number) {
        if (value === undefined || isNaN(value) || value < 0) {
            throw new Error('O ID deve ser um número válido.');
        }
    }

    private validarCEP(value: string) {
        if (!value || value.length !== 8) {
            throw new Error("O CEP deve ser um cojunto de caracteres de 8 digitos.");
        }
    }

    private validarNumero(value: string) {
        if (!value || value === undefined || value.length > 6) {
            throw new Error("O valor numerico do telefone deve existir.")
        }
    }

    private validarComplemento(value: string | null) {
        if(!value || value === undefined || value.length < 4){
            throw new Error('O Complemento é obrigatório e deve ser uma frase');
        }
    }
    // --- SETTERS COM VALIDAÇÃO ---

    set idCliente(value: number) {
        this.validarId(value);
        this._idCliente = value;
    }
    set cep(value: string) {
        this.validarCEP(value);
        this._cep = value;
    }
    set numero(value: string) {
        this.validarNumero(value);
        this._numero = value
    }

    set complemento(value: string | null){
        this.validarComplemento(value);
        this._complemento = value;
    }

    set id(value: number) { this._id = value };
    set UF(value: string) { this._UF = value };
    set logradouro(value: string) { this._logradouro = value };
    set cidade(value: string) { this._cidade = value };
    set bairro(value: string | null) { this._bairro = value };


    // --- FACTORY METHODS ---
    static criar(dados: any) {
        return new Endereco(
            0,
            dados.idCliente,
            dados.cep,
            dados.UF,
            dados.logradouro,
            dados.cidade,
            dados.bairro,
            dados.numero,
            dados.complemento
        );
    }

    static editar(dados: any) {
        return new Endereco(
            dados.id,
            dados.idCliente,
            dados.cep,
            dados.UF,
            dados.logradouro,
            dados.cidade,
            dados.bairro,
            dados.numero,
            dados.complemento
        );
    }
}

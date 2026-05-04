export class Telefone {
    private _id: number | null;
    private _idCliente: number | null;
    private _tipo: string;
    private _numero: string;

    constructor(id: number | null, idCliente: number | null, tipo: string, numero: string) {
        this._id = id;
        this._idCliente = idCliente;
        this._tipo = tipo;
        this._numero = numero;
    }
    get id(): number | null { return this._id };
    get idCliente(): number | null { return this._idCliente };
    get tipo(): string { return this._tipo };
    get numero(): string { return this._numero };

    // --- SETTERS COM VALIDAÇÃO ---
    set idCliente(value: number) {
        this.validarId(value);
        this._idCliente = value;
    }

    set tipo(value: string) {
        this.validarTipo(value);
        this._tipo = value;
    }

    set numero(value: string) {
        this.validarNumero(value);
        this._numero = value;
    }

    // --- Métodos de Validação ---

    private validarId(value: number) {
        if (value === undefined || isNaN(value) || value < 0) {
            throw new Error('O ID deve ser um número válido.');
        }
    }

    private validarTipo(value: string) {
        if (!value || value !== "movel" && value !== "fixo" && value !== "trabalho") {
            throw new Error("O tipo do telefone deve ser ou 'movel', ou 'fixo' ou 'trabalho'.")
        }
    }

    private validarNumero(value: string) {
        if (!value || value === undefined || value.length !== 11) {
            throw new Error("O valor numerico do telefone deve existir.")
        }
    }

    // --- FACTORY METHODS ---
    static criar(dados: any) {
        return new Telefone(
            0,
            dados.idCliente,
            dados.tipo,
            dados.numero,
        );
    }

    static editar(dados: any) {
        return new Telefone(
            dados.id,
            dados.idCliente,
            dados.tipo,
            dados.numero,
        );
    }
}
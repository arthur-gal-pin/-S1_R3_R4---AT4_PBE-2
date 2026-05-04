export class Pedidos {
    private _id: number | null;
    private _clienteId: number;
    private _subTotal: number;
    private _status: string;
    private _dataCad: string;
    private _dataMod: string;

    // Constructor 
    constructor(
        clienteId: number = 0,
        subTotal: number = 0,
        status: string = 'Pendente',
        id: number | null = null
    ) {
        this._id = id;
        this._clienteId = clienteId;
        this._subTotal = subTotal;
        this._status = status;
        this._dataCad = new Date().toISOString();
        this._dataMod = new Date().toISOString();
    }

    // Getters
    get id(): number | null {
        return this._id;
    }

    get clienteId(): number {
        return this._clienteId;
    }

    get subTotal(): number {
        return this._subTotal;
    }

    get status(): string {
        return this._status;
    }

    get dataCad(): string {
        return this._dataCad;
    }

    get dataMod(): string {
        return this._dataMod;
    }

    //Métodos Auxiliares
    private validarId(value: number) {
        if (value === undefined || isNaN(value) || value <= 0) {
            throw new Error('O ID deve ser um número válido.');
        }
    }

    private validarSubTotal(value: number) {
        if (value === undefined || isNaN(value) || value <= 0) {
            throw new Error('O SUbtotal deve ser um número racional maior que 0.')
        }
    }

    private validarStatus(value: string) {
        if (value === undefined || value.length < 5) {
            throw new Error('Esse status para pedido ~e inválido ')
        }
    }

    // Setters
    set id(value: number | null) {
        if (value !== null) {
            this.validarId(value);
        }
        this._id = value;
    }

    set clienteId(value: number) {
        this.validarId(value);
        this._clienteId = value;
    }

    set subTotal(value: number) {
        this._subTotal = value;
    }

    set status(value: string) {
        this._status = value;
    }

    set dataCad(value: string) {
        this._dataCad = value;
    }

    set dataMod(value: string) {
        this._dataMod = value;
    }


    //Design Pattern
    static criar(dados: any) {
        return new Pedidos(dados.clienteId, dados.subTotal, dados.status, null);
    }
    static editar(dados: any, id: number) {
        return new Pedidos(dados.clienteId, dados.subTotal, dados.status, id);
    }
}
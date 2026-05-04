export class Produto {
    private _idProduto: number = 0;
    private _idCategoria: number = 0;
    private _nome: string = '';
    private _vinculoImagem: string = '';
    private _valor: number = 0;

    constructor(nome: string, idCategoria: number, valor: number, vinculoImagem: string, idProduto: number) {
        this.nome = nome;
        this.idCategoria = idCategoria;
        this.valor = valor;
        this.vinculoImagem = vinculoImagem;
        this.idProduto = idProduto;
    }

    // --- GETTERS ---
    get nome(): string { return this._nome; }
    get vinculoImagem(): string { return this._vinculoImagem; }
    get valor(): number { return this._valor; }
    get idProduto(): number { return this._idProduto; }
    get idCategoria(): number { return this._idCategoria; }

    // --- SETTERS COM VALIDAÇÃO ---
    set nome(value: string) {
        this.validarNome(value);
        this._nome = value;
    }

    set idProduto(value: number) {
        this._idProduto = value;
    }

    set idCategoria(value: number) {
        this.validarId(value);
        this._idCategoria = value;
    }

    set valor(value: number) {
        this.validarValor(value);
        this._valor = value;
    }

    set vinculoImagem(value: string) {
        this.validarPathImagem(value);
        this._vinculoImagem = value;
    }

    // --- MÉTODOS DE VALIDAÇÃO ---
    private validarNome(value: string) {
        if (!value || value.trim().length < 3 || value.trim().length > 45) {
            throw new Error('O campo nome é obrigatório e deve conter entre 3 e 45 caracteres');
        }
    }

    private validarPathImagem(value: string) {
        if (!value || value.trim().length > 255 || value.trim().length < 10) {
            throw new Error('O path da imagem é obrigatório e deve ter entre 10 e 255 caracteres');
        }
    }

    private validarValor(value: number) {
        if (value === undefined || isNaN(value) || value <= 0) {
            throw new Error('O valor do produto deve ser um número válido e maior que 0.');
        }
    }

    private validarId(value: number) {
        if (value === undefined || isNaN(value) || value < 0) {
            throw new Error('O ID deve ser um número válido.');
        }
    }

    // --- FACTORY METHODS ---
    static criar(dados: any) {
        return new Produto(
            dados.nome, 
            dados.idCategoria, 
            dados.valor, 
            dados.vinculoImagem, 
            0 // ID inicial para novos registros
        );
    }

    static editar(id: number, dados: any) {
        return new Produto(
            dados.nome, 
            dados.idCategoria, 
            dados.valor, 
            dados.vinculoImagem, 
            id
        );
    }
}
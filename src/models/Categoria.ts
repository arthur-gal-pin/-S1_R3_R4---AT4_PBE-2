export class Categoria {
    private _id: number | null = null;
    private _nome: string = '';
    private _descricao: string | null = '';

    constructor(nome: string, descricao: string, id: number | null = null) {
        this.nome = nome;
        this.descricao = descricao;
        this._id = id;
    }

    get nome(): string {
        return this._nome;
    }

    get descricao(): string | null {
        return this._descricao;
    }

    get id(): number | null {
        return this._id;
    }

    set nome(value: string) {
        this.validarNome(value)
        this._nome = value;
    }

    set descricao(value: string | null) {
        this.validarDescricao(value);
        this._descricao = value;
    }

    set id(value: number) {
        this.validarId(value);
        this._id = value;
    }

    private validarNome(value: string) {
        if (!value || value.trim().length < 3 || value.trim().length > 45) {
            throw new Error('O campo nome é obrigatório e deve conter entre 3 e 45 caracteres');
        }
    }
    private validarDescricao(value: string | null) {
        if (value && (value.trim().length > 150 || value.trim().length < 5)) {
            throw new Error('O campo descrição deve ter entre 5 e 150 caracteres');
        }
    }
    private validarId(value: number) {
        // Se não for null, deve ser um número positivo e válido
        if (isNaN(value) || value <= 0) {
            throw new Error('O ID deve ser um número válido e maior que zero');
        }
    }

    //Design Patern: Factory
    static criar(dados: any) {
        return new Categoria(dados.nome, dados.descricao);
    }
    static editar(id: number, dados: any) {
        return new Categoria(dados.nome, dados.descricao, id)
    }
}
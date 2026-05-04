export class Cliente {
    private _idCliente: number | null;
    private _nomeCliente: string;
    private _sobrenomeCliente: string;
    private _cpf: string;
    private _email: string;

    constructor(idCliente: number | null, nomeCliente: string, sobrenomeCliente: string, cpf: string, email: string) {
        if (idCliente !== null) this.validarId(idCliente);
        this.validarNome(nomeCliente);
        this.validarSobrenome(sobrenomeCliente);
        this.validarCPF(cpf);
        this.validarEmail(email);

        this._idCliente = idCliente;
        this._nomeCliente = nomeCliente;
        this._sobrenomeCliente = sobrenomeCliente;
        this._cpf = cpf;
        this._email = email;
    }

    // --- Getters ---
    get idCliente(): number | null { return this._idCliente; }
    get nomeCliente(): string { return this._nomeCliente; }
    get sobrenomeCliente(): string { return this._sobrenomeCliente; }
    get cpf(): string { return this._cpf; }
    get email(): string { return this._email; }

    // --- Setters com Validação ---
    set idCliente(value: number | null) {
        if (value !== null) this.validarId(value);
        this._idCliente = value;
    }

    set nomeCliente(value: string) {
        this.validarNome(value);
        this._nomeCliente = value;
    }

    set sobrenomeCliente(value: string) {
        this.validarSobrenome(value);
        this._sobrenomeCliente = value;
    }

    set cpf(value: string) {
        this.validarCPF(value);
        this._cpf = value;
    }

    set email(value: string) {
        this.validarEmail(value);
        this._email = value;
    }

    // --- Métodos de Validação ---
    private validarId(value: number) {
        if (isNaN(value) || value <= 0) {
            throw new Error("O ID do cliente deve ser um número válido.");
        }
    }

    private validarNome(value: string) {
        if (!value || value.trim().length === 0 || value.length > 30) {
            throw new Error("O nome é obrigatório e deve ter no máximo 30 caracteres.");
        }
    }

    private validarSobrenome(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error("O sobrenome é obrigatório.");
        }
    }

    private validarCPF(value: string) {
        const cpfLimpo = value?.replace(/\D/g, '');
        if (!cpfLimpo || cpfLimpo.length !== 11) {
            throw new Error("O CPF deve conter exatamente 11 dígitos numéricos.");
        }
    }

    private validarEmail(value: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
            throw new Error("O email fornecido é inválido.");
        }
    }

    // --- Factory Methods ---
    static criar(dados: any) {
        return new Cliente(
            null,
            dados.nomeCliente,
            dados.sobrenomeCliente,
            dados.cpf,
            dados.email
        );
    }

    static editar(dados: any) {
        return new Cliente(
            dados.idCliente,
            dados.nomeCliente,
            dados.sobrenomeCliente,
            dados.cpf,
            dados.email
        );
    }
}


import { validate } from 'gerador-validador-cpf';
import { InvalidArgumentException } from '../../dtos/Error';

export default class DealerValidator {
    validateEmail(email: string) {
        if (!(/\S+@\S+\.\S+/.test(email))) {
            throw new InvalidArgumentException('O email informado é inválido.');
        }
    }

    validatePassword(password: string) {
        if (password.length < 6) {
            throw new InvalidArgumentException('A senha precisa ter, pelo menos, 6 caracteres.');
        }
    }

    validateCpf(cpf: string) {
        if (!validate(cpf)) {
            throw new InvalidArgumentException('O cpf informado é inválido.');
        }
    }

    validateDealerRequest(args: {
    cpf: string;
    email: string;
    password: string;
  }) {
        this.validateCpf(args.cpf);
        this.validateEmail(args.email);
        this.validatePassword(args.password);
    }
}
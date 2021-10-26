export class HttpException extends Error {
    public statusCode: number;

    constructor(name: string, message: string, statusCode: number) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    }
}

export default class NotFoundException extends HttpException {
    constructor(message: string) {
        super('NotFoundException', message, 404);
    }
}

export class InvalidArgumentException extends HttpException {
    constructor(message: string) {
        super('InvalidArgumentException', message, 400);
    }
}

export class InternalErrorException extends HttpException {
    constructor(message: string) {
        super('InternalErrorException', message, 500);
    }
}

export class ConflictException extends HttpException {
    constructor(message: string) {
        super('ConflictException', message, 409);
    }
}

export class AuthenticationException extends HttpException {
    constructor(message: string) {
        super('AuthenticationException', message, 401);
    }
}
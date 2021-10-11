export class HttpException extends Error {
    public statusCode: number;

    constructor(name: string, message: string, statusCode: number) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    }
}

export class NotFoundException extends HttpException {
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
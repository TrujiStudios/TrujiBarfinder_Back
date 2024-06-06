class GeneralError extends Error {
    code: number;
    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }

    getCode(): number {
        if (this instanceof BadRequest) {
            return 400;
        } if (this instanceof NotFound) {
            return 404;
        } if (this instanceof Unauthorized) {
            return 401;
        } if (this instanceof Forbidden) {
            return 403;
        } if (this instanceof Conflict) {
            return 409;
        } if (this instanceof InternalServerError) {
            return 500;
        }
        return 500;
    }
}

class BadRequest extends GeneralError {
    constructor(message: string = 'Bad Request') {
        super(message, 400);
    }
}

class NotFound extends GeneralError {
    constructor(message: string = 'Not found') {
        super(message, 404);
    }
}

class Unauthorized extends GeneralError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
    }
}

class Forbidden extends GeneralError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
    }
}

class Conflict extends GeneralError {
    constructor(message: string = 'Conflict') {
        super(message, 409);
    }
}

class InternalServerError extends GeneralError {
    constructor(message: string = 'Internal Server Error') {
        super(message, 500);
    }
}

export {
    GeneralError,
    BadRequest,
    NotFound,
    Unauthorized,
    Forbidden,
    Conflict,
    InternalServerError
}
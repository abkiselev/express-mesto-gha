const OK_CODE = 200;
const CREATED_CODE = 201;

class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 400;
    }
}

class UnautorizedError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 401;
    }
}

class ForbiddenError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 403;
    }
}

class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 404;
    }
}

class ConflictError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = 409;
    }
}

module.exports = {
    OK_CODE,
    CREATED_CODE,
    BadRequestError,
    UnautorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
};
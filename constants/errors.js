const OK_CODE = 200;
const CREATED_CODE = 201;
// module.exports.BAD_REQUEST_CODE = 400;
// module.exports.UNAUTORIZED_CODE = 401;
// module.exports.FORBIDDEN_CODE = 403;
// module.exports.NOT_FOUND_CODE = 404;
const DEFAULT_CODE = 404;


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
      this.statusCode = 404;
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
    DEFAULT_CODE,
    BadRequestError,
    UnautorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
};
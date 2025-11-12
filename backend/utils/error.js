class ErrorHandler extends Error {
  constructor(message, statusCode, id) {
    super(message);

    this.statusCode = statusCode;
    this.id = id;
  }
}

export default ErrorHandler;

class AppError extends Error {
  constructor(messsage, statusCode) {
    super();
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.message = messsage;
    this.isExplicity = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

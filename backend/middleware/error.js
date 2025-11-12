export const errorMiddleware = (err, req, res, next) => {
  console.log("errorMiddleware", err);
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const validationErrors = Object.values(err.errors).map(
      (error) => error.message
    );
    err.message = validationErrors.join(", ");
    err.statusCode = 400;
  }

  // Handle duplicate key errors (MongoDB 11000 error)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    err.message = `${field} '${value}' already exists`;
    err.statusCode = 400;
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    id: err.id,
  });
};

export const asyncError = (passedFunc) => (req, res, next) => {
  Promise.resolve(passedFunc(req, res, next)).catch(next);
};

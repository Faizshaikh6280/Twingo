function errorController(err, req, res, next) {
  console.log("Error 💥", err);

  res.status(err.statusCode || 500).json({
    status: err.status || "fail",
    message: err.message,
  });
}

export default errorController;

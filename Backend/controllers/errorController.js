function errorController(err, req, res, next) {
  console.log("Error 💥", err);
  res.send(`Error 💥${err.message}`);
}

export default errorController;

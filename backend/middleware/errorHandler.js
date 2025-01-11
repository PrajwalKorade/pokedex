const { logger } = require("./logger");

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
  });

  res.status(err.status || 500).json({
    ok: false,
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
};

module.exports = errorHandler;

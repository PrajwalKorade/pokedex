const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

const loggerMiddleware = (req, res, next) => {
  logger.info({
    method: req.method,
    query: req.query,
    params: req.params,
    ip: req.ip,
  });
  next();
};

module.exports = { logger, loggerMiddleware };

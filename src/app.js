const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { loggerMiddleware } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(loggerMiddleware);

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;

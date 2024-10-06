const express = require('express')
const routes = require("./routes")
const bodyParser = require('body-parser')
const {logger} = require("./middleware/logger")
const {errorHandler} = require("./middleware/errorHandler")
const cookieParser = require("cookie-parser")
const cors = require('cors')
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 4500
app.use(logger)

// Middleware for parsing JSON
app.use(express.json());
app.use(bodyParser.json()); // Correct usage
app.use(bodyParser.urlencoded({ extended: true }));

// Use the cookie-parser middleware
app.use(cookieParser());

//routes
app.use("/", routes);

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler)

app.listen(PORT, ()=> console.log(`server running on port ${PORT}`));
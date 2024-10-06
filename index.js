const express = require('express');
const routes = require("./routes");
const { logger } = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const corsOptions = require("./config/corsOptions");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4500;

// Use the logger middleware
app.use(logger);

// Use CORS middleware
app.use(cors(corsOptions));

// Middleware for parsing JSON
app.use(express.json()); // Use built-in express.json() only
app.use(express.urlencoded({ extended: true })); // Use built-in express.urlencoded()

// Use the cookie-parser middleware
app.use(cookieParser());

// Routes
app.use("/", routes);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

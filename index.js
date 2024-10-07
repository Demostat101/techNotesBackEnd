const express = require('express');
const userRoutes = require("./routes/userRoutes");
const notesRoutes = require("./routes/noteRoutes")
const { logger, logEvents } = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const corsOptions = require("./config/corsOptions");
const {connectDB} = require("./config/dbConnection")
const mongoose = require('mongoose')
require("dotenv").config();

console.log(process.env.NODE_ENV);
connectDB();


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
// app.use("/", routes);

app.use("/users", userRoutes)
app.use("/notes", notesRoutes)

// Error handling middleware
app.use(errorHandler);

mongoose.connection.once('open', ()=>{
    console.log('Connected to MongoDB');
    
// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

mongoose.connection.on('error', (err)=>{
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,"mongoErrLog.log")
})



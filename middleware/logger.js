const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");

const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    const logPath = path.join(__dirname, logFileName); // Specify the path to the log file
    await fsPromise.appendFile(logPath, logItem); // Append the log item to the file
  } catch (error) {
    console.error("Error writing to log file", error);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqlog.log");
  console.log(`${req.method} ${req.path}`);
  console.log(`${req.method} ${req.url}`);
  next();
};

module.exports = { logEvents, logger };

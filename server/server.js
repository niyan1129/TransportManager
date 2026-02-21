const express = require("express");
const helmet = require('helmet');
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(helmet()); // as a middleware

const mongoDB = process.env.mongodb_URI || "mongodb://localhost:27017/NiYan-database";

// connect to MongoDB
async function main() {
    await mongoose.connect(mongoDB);
    console.log("Connected to MongoDB");
  }
  
  // main
  main().catch((err) => console.error("MongoDB connection error:", err));

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors()); //set up cors

// middleware
app.use((req, res, next) => {
    console.log(`Received request for route: ${req.originalUrl}`);
    next();
  });

const mainRouter = require("./src/routes/index");
app.use("/api", mainRouter);

const port = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;

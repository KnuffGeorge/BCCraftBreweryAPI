const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const Brewery = require("./models/Brewery")
//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });


//Connect To Database
connectDB();

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));


app.get('/api/', async (req, res) => {
  const brews = await Brewery.find()
  res.send(brews)
});

app.get('/api/:name', async (req, res) => {
  const brews = await Brewery.find({name: req.params.id})
  res.send(brews)
});



//Use flash messages for errors, info, ect...
app.use(flash());




//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});

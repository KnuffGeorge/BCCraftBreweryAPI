const mongoose = require("mongoose");

const BrewerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  brewer:{
  type: String,
},
  img:{
    type: String,
  },
  email:{
    type: String,
  },
  website:{
    type: String,
  },
  address:{
    type: String,
  },
  city:{
    type: String
  },
  phone:{
    type: String
  },
  brewer:{
    type: String,
  },
  established:{
    type: String
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  }
});

module.exports = mongoose.model("Brewery", BrewerySchema);
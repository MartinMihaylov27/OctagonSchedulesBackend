const express = require("express");
const mongoose = require("mongoose");
var cors = require('cors');
const bcrypt = require("bcrypt");
const saltRounds = 11;
//clerk

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/octagonUser", {useNewUrlParser: true});

const octagonUserSchema = new mongoose.Schema ({
  username: String,
  password: String,
  followedFighters: [{ type: String }],
  followedEvents: [{ type: String }]
});

const User = new mongoose.model("octagonUser", octagonUserSchema);

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username })
 .then((docs)=>{
  if (docs !== null) {
    res.send("Username already in use.")
  } else {
    bcrypt.hash(password, saltRounds)
  .then(function (hash) {
    const newUser = new User({
      username: username,
      password: hash
    });

    newUser.save()
    .then(function () {
      res.send("Success!");
    }) 
    .catch(function (err){
      res.send("There was an error, please try again.");
    })
  })
  .catch(function (err) {
    res.send("There was an error, please try again.");
  })
  }
 })
 .catch((err)=>{
    res.send("There was an error, please try again.")
 });
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username })
  .then((user) => {
    bcrypt.compare(password, user.password, function(err, result){
      if(err){
        res.send("Invalid username or password. Please check your credentials and try again.");
      }
      if (result === true){
        res.send("Success!");
      } else {
        res.send("Invalid username or password. Please check your credentials and try again.");
      }
    })
  })
  .catch(err => {
    res.send("There was an error, please try again.");
  })
});

app.listen(8080, () => {
    console.log("app listening on port 8080");
});
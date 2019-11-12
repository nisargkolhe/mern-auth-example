require("dotenv").config();

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

router.post("/register", (req, res) => {
  console.log(req.body);
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      res.status(400).json({ msg: "Email already exists" });
    } else {
      // Create new User object
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;

          // Calling .save inserts the mongo object into the collection
          newUser
            .save()
            .then(user => res.send(user)) // .save is a promise, send the response when promise is executed
            .catch(err => res.send(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email
        };

        // Sign token
        jwt.sign(
          payload,
          process.env.SECRET,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: token
            });
          }
        );
      } else {
        res.status(400).json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.get("/protected", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      res.status(400).json({ msg: "There was an error" });
      console.log(err);
    }

    if (!user) {
      res.status(404).json({ msg: "Invalid token." });
    }

    //User found, send a custom message
    res.send({
      msg: `Hi ${user.name}, welcome to the app!`
    });
  })(req, res, next);
});

module.exports = router;

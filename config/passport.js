const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
var bcrypt = require("bcryptjs");

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const strategy = new LocalStrategy(
  customFields,
  async (username, password, done) => {
    try {
      // Find the user with the provided username
      const user = await User.findOne({ email: username });
      // If the user is not found, return with a message
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // If the passwords match, log the user in
          return done(null, user);
        } else {
          // If the passwords do not match, return with a message
          return done(null, false, { message: "Incorrect password" });
        }
      });
    } catch (err) {
      return done(err);
    }
  }
);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});

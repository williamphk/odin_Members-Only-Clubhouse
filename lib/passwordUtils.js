const crypto = require("crypto");

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  console.log("salt " + salt);
  console.log("genHash " + genHash);
  return {
    salt: salt,
    genHash: genHash,
  };
}

function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  console.log("password " + password);
  console.log("hash " + hash);
  console.log("salt " + salt);
  console.log("hashVerify " + hashVerify);
  return hash === hashVerify;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;

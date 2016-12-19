var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');


var sha512Encode = function(password, salt) {
  password = salt + password;
  var result = crypto.createHash('sha512').update(password).digest();
  for (var i = 0; i < 512; i++) {
    result = crypto.createHash('sha512').update(result).digest();
  }
  return result.toString('base64');
}



module.exports = {
  secret: sails.config.jwtSettings.secret,
  issuer: sails.config.jwtSettings.issuer,
  audience: sails.config.jwtSettings.audience,

  hashPassword: function(user) {
    if (user.password && !user.salt) {
      salt = crypto.randomBytes(36).toString('base64');
      user.salt = salt;
      user.password = sha512Encode(user.password, user.salt);
    } else if (user.origin == 'leancloud' &&
      user.password && user.salt) { //leancloud user migration
      user.password = sha512Encode(user.password, user.salt);
    }
  },

  comparePassword: function(password, user) {
    var realPassword = user.password;
    var inputPassword = password;
    var salt = user.salt;

    hashedPassword = sha512Encode(inputPassword, salt);

    sails.log.debug("input: " + inputPassword);
    sails.log.debug("real: " + realPassword);
    sails.log.debug("hashed: " + hashedPassword);

    return (realPassword == hashedPassword) ? true : false;
  },

  createToken: function(user) {
    return jwt.sign({
        user: user.toJSON()
      },
      sails.config.jwtSettings.secret,
      {
        algorithm: sails.config.jwtSettings.algorithm,
        expiresIn: sails.config.jwtSettings.expiresInMinutes,
        issuer: sails.config.jwtSettings.issuer,
        audience: sails.config.jwtSettings.audience
      }
    );
  },

   verifyToken: function(token, callback) {
     return jwt.verify(
       token, // The token to be verified
       sails.config.jwtSettings.secret, // Same token used to sign
       {}, // No Option
       callback //Pass errors or decoded token to callback
     );
   }

};

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

/**
 * basic auth configuration
 */
const PASSPORT_LOCAL_CONFIG = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: false
}

// Triggers after user is authenticated via local strategy
const _onLocalStrategyAuth = (email, password, next) => {
  User.findOne({
      where: {email: email},
      include: IncludeService.UserInclude(['Reviews']),
    })
    .then((user) => {
      if (!user) return next(null, false, {
        code: 'E_USER_NOT_FOUND',
        message: email + ' is not found'
      });

      if (!CipherService.comparePassword(password, user))
        return next(null, false, {
          code: 'E_WRONG_PASSWORD',
          message: 'Password is wrong'
        });

      return next(null, user, {});
    })
    .catch((err) => {
      sails.log.error(err.message);
      next(err);
    });
}

passport.use(new LocalStrategy(PASSPORT_LOCAL_CONFIG, _onLocalStrategyAuth))


/**
 * JWT auth configuration
 */
const JWT_CONFIG = {
  expiresInMinutes: 60 * 60 * 24 * 60, // two months in seconds
  secret: process.env.tokenSecret || "huoshui_rock",
  algorithm: "HS256",
  issuer: "api.huoshui.org", // issuer of JWT
  audience: "huoshui.org", // resource being acccessed
}

const PASSPORT_JWT_CONFIG = {
  secretOrKey: JWT_CONFIG.secret,
  issuer: JWT_CONFIG.issuer,
  audience: JWT_CONFIG.audience,
  passReqToCallback: false,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const _onJwtStrategyAuth = (payload, next) => {
  var user = payload.user
  return next(null, user, {})
}

passport.use(new JwtStrategy(PASSPORT_JWT_CONFIG, _onJwtStrategyAuth))

// export jwt config
module.exports.jwtSettings = JWT_CONFIG

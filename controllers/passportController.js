const db = require('./databaseController');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY,
};

const strategy = new JwtStrategy(options, (payload, next) => {
  //Get user from DB and put on response
  db.select('*')
    .from('login')
    .where('id', '=', payload.id)
    .then(userArr => {
      const user = userArr[0];
      next(null, user);
    });
});
passport.use(strategy);

module.exports = passport;

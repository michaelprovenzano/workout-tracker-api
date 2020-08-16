const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./databaseController');
const passport = require('./passportController');

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(401).json('Some fields are empty');

  db.select('*')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      const user = data[0];
      if (!user.id) return res.status(401).send('User not found');

      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const payload = { id: user.id };
          const token = jwt.sign(payload, process.env.SECRET_OR_KEY, { expiresIn: '90d' });
          user.password = null;

          const cookieOptions = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          };
          if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

          res.cookie('jwt', token, cookieOptions);
          return res.send({ status: 'success', token, ...user });
        }
        return res.status(401).send('Incorrect user name or password');
      });
    })
    .catch(err => res.status(401).send('Incorrect user name or password'));
};

exports.logout = (req, res) => {
  if (req.headers && req.headers.authorization) {
    let authorization = req.headers.authorization.split(' ')[1],
      decoded;
    try {
      decoded = jwt.verify(authorization, process.env.SECRET_OR_KEY);
    } catch (e) {
      return res.status(401).send('unauthorized');
    }

    let userId = decoded.id;
    const payload = { id: userId };
    const token = jwt.sign(payload, process.env.SECRET_OR_KEY, { expiresIn: 1 });
    return res.send({ token });
  }
};

exports.protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false });
  next();
};

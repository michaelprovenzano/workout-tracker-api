const { promisify } = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./databaseController');
const passport = require('./passportController');
const catchAsync = require('../utils/catchAsync');

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(401).json('Some fields are empty');

  const data = await db.select('*').from('login').where('email', '=', email);

  let user = await data[0];
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
      return res.status(200).json({ status: 'success', token, ...user });
    }

    return res.status(401).json({
      status: 'fail',
      message: 'Incorrect user name or password',
    });
  });
});

exports.logout = catchAsync((req, res) => {
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
});

exports.protect = catchAsync(async (req, res, next) => {
  passport.authenticate('jwt', { session: false });

  let token;

  // Get the token and check if it's there
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(404).send('not found');
  }

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_OR_KEY);
  const user = await db.select('*').from('login').where('id', '=', decoded.id);

  if (user.length > 0) req.user = user[0];

  next();
});

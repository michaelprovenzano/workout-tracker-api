const { promisify } = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./databaseController');
const passport = require('./passportController');
const catchAsync = require('../utils/catchAsync');

const sendCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  return res.cookie('jwt', token, cookieOptions);
};

const signToken = payload => {
  const token = jwt.sign(payload, process.env.SECRET_OR_KEY, { expiresIn: '90d' });

  return token;
};

exports.register = (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(401).json('Some fields are empty');
  bcrypt.hash(password, 10, (err, hash) => {
    db.transaction(trx => {
      trx
        .insert({
          email: email,
          password: hash,
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: email,
              name: name,
              created_at: new Date(),
              role: 'user',
            })
            .then(data => {
              let user = data[0];

              const token = signToken({ id: user.user_id });

              sendCookie(res, token);

              return res.status(200).json({ status: 'success', token, ...user });
            })
            .catch(err => res.status(400).json(err));
        })
        .then(trx.commit)
        .catch(trx.rollback);
    });
  });
};

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(401).json('Some fields are empty');

  const data = await db('login')
    .join('users', 'login.email', '=', 'users.email')
    .where('login.email', '=', email);

  let user = await data[0];
  if (!user.user_id) return res.status(401).send('User not found');

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      const token = signToken({ id: user.user_id });

      sendCookie(res, token);
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

    let userId = decoded.user_id;
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
  const user = await db('login')
    .join('users', 'login.email', '=', 'users.email')
    .where('users.user_id', '=', decoded.id);

  if (user.length > 0) req.user = user[0];

  next();
});

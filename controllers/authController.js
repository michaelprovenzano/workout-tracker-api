const { promisify } = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./databaseController');
const passport = require('./passportController');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');
const frontEndUrl = 'http://localhost:3000/';
if (process.env.NODE_ENV === 'production') frontEndUrl = 'http://trackbody.heroku.com';

const sendCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  return res.cookie('jwt', token, cookieOptions);
};

const signToken = (payload, expires = '90d') => {
  const token = jwt.sign(payload, process.env.SECRET_OR_KEY, { expiresIn: expires });

  return token;
};

exports.forgotPassword = catchAsync(async (req, res) => {
  // Generate a 'Forgot Password' token for the email provided
  const { email } = req.body;
  if (!email) return res.status(401).json({ status: 'fail', data: 'Please provide your email' });

  const user = await db('login')
    .join('users', 'login.email', '=', 'users.email')
    .where('login.email', '=', email)
    .first();

  if (!user)
    return res.status(404).json({ status: 'fail', data: 'No user with exists with that email.' });

  const tokenExpiration = 60 * 10; // Expiration and iat is calculated in seconds NOT milliseconds
  const token = signToken({ id: user.user_id }, tokenExpiration);

  const resetUrl = `${frontEndUrl}/reset-password/${token}`;

  // Send token via email
  await new Email(user, resetUrl).sendPasswordReset();

  res.status(200).json({
    status: 'success',
    data: {},
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { password, passwordConfirm } = req.body;
  const { token } = req.params;

  // Validate passwords
  if (password !== passwordConfirm)
    return res.status(401).json({
      status: 'fail',
      data: 'Passwords do not match',
    });

  // Decode token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_OR_KEY);
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      data: err,
    });
  }

  // Update password
  try {
    bcrypt.hash(password, 10, (err, hash) => {
      db.transaction(async trx => {
        try {
          const user = await trx.table('users').where('user_id', '=', decoded.id).first();
          await trx('login')
            .update({
              password: hash,
            })
            .where('email', '=', user.email);

          trx.commit;

          const newToken = signToken({ id: user.user_id });

          sendCookie(res, newToken);

          return res.status(200).json({ status: 'success', token: newToken, ...user });
        } catch (err) {
          trx.rollback;
          return res.status(400).json(err);
        }
      });
    });
  } catch (err) {
    return res.status(400).json({
      status: 'fail',
      data: 'Something went wrong when changing your password',
    });
  }
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(401).json({ status: 'fail', message: 'Please fill out all fields' });

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

              const url = `${req.protocol}://${req.get('host')}/dashboard`;

              // new Email(newUser, url).sendWelcome();

              return res.status(200).json({ status: 'success', token, ...user });
            })
            .catch(err => res.status(400).json(err));
        })
        .then(trx.commit)
        .catch(err => {
          trx.rollback;
          res.status(400).json(err);
        });
    });
  });
};

exports.sendMail = catchAsync(async (req, res) => {});

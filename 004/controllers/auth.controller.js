const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const uuid = require('uuid');

dotenv.config();

exports.auth = (req, res, next) => {
  let token;

  if(req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if(typeof token !== 'string') {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if(err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

exports.access = (req, res) => {
  if(!req.body.username) {
    return res.sendStatus(403);
  }

  const user = {
    id: uuid.v4(),
    username: req.body.username
  }

  const token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
  return res.json(token);
}

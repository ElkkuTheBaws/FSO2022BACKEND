const User = require('../models/user');
const jwt = require('jsonwebtoken');

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(400).send({ error: 'token missing or invalid' });
  }
  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  } else {
    request.token = null;
  }

  next();
};

const userExtractor = async (request, response, next) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET);
  } catch (err) {
    return response.status(401).json({ error: err.message });
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token not valid' });
  }
  try {
    const user = await User.findById(decodedToken.id);
    request.user = user;
  } catch {
    return response.status(400).json({ error: 'user not found' });
  }
  next();
};
module.exports = { errorHandler, tokenExtractor, userExtractor };

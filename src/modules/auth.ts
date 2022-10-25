import jwt from 'jsonwebtoken';

export const createJWT = user => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET
  );

  return token;
};

export const protect = (req, res, next) => {
  // do we need thse return statements?
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'not authorized' });
    return;
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    res.status(401).json({ message: 'token provided incorrectly' });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).json({ message: 'invalid token' });
    return;
  }
};

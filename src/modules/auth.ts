import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// on signin
export const comparePasswords = (plainTextPassword, hashedPassword) => {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};

// on signup
export const hashPassword = plainTextPassword => {
  return bcrypt.hash(plainTextPassword, Number(process.env.SALT));
};

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
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'authorization not provided' });
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ message: 'not authorized' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

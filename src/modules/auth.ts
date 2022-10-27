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
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ message: 'authorization not provided' });
  }

  // 'Bearer <token>' -> '<token>'
  const [, token] = accessToken.split(' ');

  if (!token) {
    return res.status(401).json({ message: 'not authorized' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    // success -> augment req object with authorized user
    req.user = user;
    next();
  } catch (e) {
    e.type = 'auth';
    next(e);
  }
};

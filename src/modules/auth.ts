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

export const protect = (req, _res, next) => {
  try {
    const accessToken = req.cookies.access_token;

    // 'Bearer <token>' -> '<token>'
    const [, token] = accessToken.split(' ');

    const user = jwt.verify(token, process.env.JWT_SECRET);
    // success -> augment req object with authorized user
    req.user = user;
    next();
  } catch (e) {
    console.error('Error in protect middleware', e);
    next({ type: 'auth', msg: 'not authorized' });
  }
};

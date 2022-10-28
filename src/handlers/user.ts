import prisma from '../db';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';

export const createNewUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: await hashPassword(password),
      },
    });

    const token = createJWT(user);

    res
      .status(201)
      .cookie('access_token', `Bearer ${token}`, {
        // cookie removed after 1 hour
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
      })
      .json({ data: user });
  } catch (e) {
    console.log('e:', e);
    // const err = { type: 'username', message: 'username already taken' };

    // if (e.code === 'P2002') {
    //   e.type = 'username';
    // } else {
    //   e.type = 'input';
    // }
    next({ type: 'username', message: 'username already taken' });
  }
};

export const signin = async (req, res, next) => {
  const error = { type: 'auth', message: 'invalid username or password' };

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    const isValid = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
      return next(error);
    }

    const token = createJWT(user);
    res.json({ token });
  } catch (e) {
    console.error(e);
    next(error);
  }
};

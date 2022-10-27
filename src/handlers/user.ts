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
    if (e.code === 'P2002') {
      e.type = 'username';
    } else {
      e.type = 'input';
    }
    next(e);
  }
};

export const signin = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });

  const isValid = await comparePasswords(req.body.password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: 'invalid password' });
  }

  const token = createJWT(user);
  res.json({ token });
};

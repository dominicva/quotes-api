import prisma from '../db';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';

export const createNewUser = async (req, res, next) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
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
      e.type = 'username taken';
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

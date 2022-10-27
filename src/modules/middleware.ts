import { body, validationResult } from 'express-validator';

export const handleInputErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const e = new Error('Invalid input');
    // @ts-ignore-next-line
    e.type = 'input';
    // @ts-ignore-next-line
    e.meta = errors.array();
    next(e);
  } else {
    next();
  }
};

const usernameValidator = body('username')
  .trim()
  .isLength({ min: 3, max: 20 })
  .custom(value => {
    return /^[a-zA-Z0-9_]+$/.test(value);
  })
  .withMessage(
    'username must be 3-20 characters long and only contain letters, numbers, and underscores'
  );

const passwordValidator = body('password')
  .trim()
  .isLength({ min: 6, max: 20 })
  .custom((value, _) => {
    return /\d/.test(value) && !/\s/.test(value);
  })
  .withMessage(
    'password must be 6-20 characters long and contain at least one number'
  );

export const validateUsernameAndPassword = [
  usernameValidator,
  passwordValidator,
  handleInputErrors,
];

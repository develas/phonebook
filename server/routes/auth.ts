import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken'

import { User } from '../models/User';

export const auth = Router();
const createToken = (user : User) => jwt.sign({ user },
  process.env.SECRET || 'my_jwt_secret',
  { expiresIn: '15m' });

auth.post('/login', (req, res, next) => {
  passport.authenticate('local', {session: false}, (err, user) => {
    if (err) next(err);
    if (!user) res.status(401).json({message: 'Incorrect username or password.'});

    // @ts-ignore
    req.logIn(user, {session: false}, (err) => {
      if (err) {
        res.send(err)
      }

      const token = createToken(user);

      return  res.json({ user, token });
    })
  })(req, res, next)
});

auth.post('/sign-up', async (req, res, next) => {
  const user = await User.create(req.body).catch(e => next(e));

  if (!user) next('Something was wrong!');

  return res.status(201).json({success: true});
});

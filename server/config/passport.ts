import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import bcrypt from 'bcrypt';

import { User } from '../models/User';

export default async ( passport ) => {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    async (email: string, password: string, done: any) => {
      const user = await User.findOne({ raw: true, where: { email } }).catch((e => done(e)));

      if (!user) done(null, false);

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) done(null, false);

      const { password: pass, ...newUser } = user;

      return done(null, { user: newUser });
    }))

  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET || 'my_jwt_secret'
  }, (jwtPayload, done) => done(null, jwtPayload)))
}

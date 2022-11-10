import { findUserForAuth, findUserWithEmailAndPassword } from 'server/db';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getMongoDb } from '../mongodb';

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((req, id, done) => {
  getMongoDb().then((db) => {
    findUserForAuth(db, id).then(
      (user) => done(null, user),
      (err) => done(err)
    );
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      const db = await getMongoDb();
      const user = await findUserWithEmailAndPassword(db, email, password);
      const status = 401; // needed for un-authenticated response

      if (!user)
        return done(
          { message: 'Email or password is incorrect.', status },
          false
        );
      if (!user.verified) {
        return done(
          { message: 'Your account is not verified.', status },
          false
        );
      }
      return done(null, user);
    }
  )
);

export default passport;

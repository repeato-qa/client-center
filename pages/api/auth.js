import { passport } from 'server/auth';
import { auths } from 'server/middlewares';
import { ncOpts } from 'server/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(...auths);

handler.post(passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

handler.delete(async (req, res) => {
  await req.session.destroy();
  res.status(204).end();
});

export default handler;

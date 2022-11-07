import { auths, ensureAuthenticated } from 'server/middlewares';
import { findUserById } from 'server/db';
import { getMongoDb } from 'server/mongodb';
import { ncOpts } from 'server/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);
handler.use(...auths, ensureAuthenticated);

handler.get(async (req, res) => {
  const db = await getMongoDb();
  const user = await findUserById(db, req.query.userId);
  res.json({ user });
});

export default handler;

import { findUserByEmail, verifyUser } from 'server/db';
import { auths } from 'server/middlewares';
import { getMongoDb } from 'server/mongodb';
import { ncOpts } from 'server/nc';
import nc from 'next-connect';
import { normalizeEmailUtil } from '@/helpers/generic';

const handler = nc(ncOpts);

handler.use(...auths);

handler.post(async (req, res) => {
  const db = await getMongoDb();
  const email = normalizeEmailUtil(req.body.email);

  const user = await findUserByEmail(db, email);

  if (!user) {
    res.status(400).json({
      error: { message: 'We couldn’t find that email. Please try again.' },
    });
    return;
  }

  await verifyUser(db, user);

  res.status(204).end();
});

export default handler;

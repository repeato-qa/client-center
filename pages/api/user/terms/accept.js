import { auths, ensureAuthenticated } from 'server/middlewares';
import { getMongoDb } from 'server/mongodb';
import { ncOpts } from 'server/nc';
import { updateUserById } from 'server/db';
import nc from 'next-connect';

const handler = nc(ncOpts);
handler.use(...auths, ensureAuthenticated);

handler.get(async (req, res) => {
  const db = await getMongoDb();
  const user = await updateUserById(db, req.user._id, {
    acceptedTermsDate: new Date().toLocaleString(),
  });

  res.status(200).json(user);
});

export default handler;

import nc from 'next-connect';
import { auths, ensureAuthenticated } from 'server/middlewares';
import { getMongoDb } from 'server/mongodb';
import { userLicense } from 'server/db';
import { ncOpts } from 'server/nc';

const handler = nc(ncOpts);
handler.use(...auths, ensureAuthenticated);

handler.get(async (req, res) => {
  const db = await getMongoDb();

  const response = await userLicense(db, { email: req.user.email });

  res.status(200).json(response);
});

export default handler;

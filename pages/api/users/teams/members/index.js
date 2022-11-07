import { ValidateProps } from 'server/constants';
import { auths, validateBody, ensureAuthenticated } from 'server/middlewares';
import { getMongoDb } from 'server/mongodb';
import { ncOpts } from 'server/nc';
import { memberOfTeams } from 'server/db';
import nc from 'next-connect';

const handler = nc(ncOpts);
handler.use(...auths, ensureAuthenticated);

handler.get(async (req, res) => {
  const db = await getMongoDb();
  const result = await db
    .collection('Users')
    .find({ email: { $in: req.user.managedUsers || [] } })
    .toArray();

  res.status(200).json(result);
});

handler.post(
  validateBody({
    type: 'object',
    properties: {
      id: ValidateProps.generic.string,
      managerId: ValidateProps.generic.string,
      email: ValidateProps.user.email,
      type: ValidateProps.generic.string,
    },
    required: ['email', 'type'],
  }),
  async (req, res) => {
    const { email, type, managerId } = req.body;
    const db = await getMongoDb();
    const result = await memberOfTeams(db, { email, type, managerId });

    res.status(200).json(result);
  }
);

export default handler;

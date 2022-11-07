import { ValidateProps } from 'server/constants';
import { inviteUser } from 'server/db';
import { auths, ensureAuthenticated, validateBody } from 'server/middlewares';
import { getMongoDb } from 'server/mongodb';
import { ncOpts } from 'server/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);
handler.use(...auths, ensureAuthenticated);

handler.post(
  validateBody({
    type: 'object',
    properties: {
      email: ValidateProps.user.email,
    },
    additionalProperties: true,
  }),
  async (req, res) => {
    const db = await getMongoDb();

    const response = await inviteUser(db, req.body.email, req.user);

    res.json(response);
  }
);

export default handler;

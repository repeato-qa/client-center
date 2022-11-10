import { ValidateProps } from 'server/constants';
import { updateUserPasswordByEmail } from 'server/db';
import { auths, validateBody } from 'server/middlewares';
import { getMongoDb } from 'server/mongodb';
import { ncOpts } from 'server/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);
handler.use(...auths);

handler.put(
  validateBody({
    type: 'object',
    properties: {
      password: ValidateProps.user.password,
      email: ValidateProps.user.email,
    },
    required: ['password', 'email'],
    additionalProperties: false,
  }),
  async (req, res) => {
    const db = await getMongoDb();

    const { email, password } = req.body;

    const success = await updateUserPasswordByEmail(db, email, password);

    if (!success) {
      res.status(401).json({
        error: { message: 'Unable to update user password.' },
      });
      return;
    }

    res.status(204).end();
  }
);

export default handler;

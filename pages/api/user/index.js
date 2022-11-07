import { ValidateProps } from 'server/constants';
import { updateUserById } from 'server/db';
import { auths, ensureAuthenticated, validateBody } from 'server/middlewares';
import { getMongoDb } from 'server/mongodb';
import { ncOpts } from 'server/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);
handler.use(...auths);

handler.get(async (req, res) => {
  if (!req.user) return res.json(null);
  return res.json(req.user);
});

handler.patch(
  ensureAuthenticated,
  validateBody({
    type: 'object',
    properties: {
      firstName: ValidateProps.user.firstName,
      lastName: ValidateProps.user.lastName,
      company: ValidateProps.user.company,
    },
    additionalProperties: true,
  }),
  async (req, res) => {
    const db = await getMongoDb();

    const { firstName, lastName, company } = req.body;

    const user = await updateUserById(db, req.user._id, {
      firstName,
      lastName,
      company,
    });

    res.json(user);
  }
);

// this can be used when url encoded params not in proper JSON - specifically for profile picture
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export default handler;

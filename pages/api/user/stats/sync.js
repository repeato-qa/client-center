import nc from 'next-connect';
import { ObjectId } from 'mongodb';
import { ValidateProps } from 'server/constants';
import { auths, ensureAuthenticated, validateBody } from 'server/middlewares';
import { getMongoDb } from 'server/mongodb';
import { ncOpts } from 'server/nc';

const handler = nc(ncOpts);
handler.use(...auths, ensureAuthenticated);

handler.patch(
  validateBody({
    type: 'object',
    properties: {
      key: ValidateProps.generic.string,
    },
    required: ['key', 'data'],
  }),
  async (req, res) => {
    const db = await getMongoDb();
    const { key, data } = req.body;

    await db
      .collection('Users')
      .updateOne(
        { _id: new ObjectId(req.user._id) },
        { $set: { [key]: data } }
      );

    res.status(204).end();
  }
);

export default handler;

import nc from 'next-connect';
import { ObjectId } from 'mongodb';
import { ValidateProps } from 'server/constants';
import { verifyLicense } from 'server/db';
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
    required: ['key'],
    additionalProperties: false,
  }),
  async (req, res) => {
    const db = await getMongoDb();
    const { key } = req.body;

    try {
      await verifyLicense(db, key, req.user._id);
    } catch (error) {
      res
        .status(error.message.includes('linked') ? 422 : 404)
        .json({ error: { message: error.message } });
      return;
    }

    await db
      .collection('Users')
      .updateOne(
        { _id: new ObjectId(req.user._id) },
        { $set: { license: key } }
      );

    res.status(204).end();
  }
);

export default handler;

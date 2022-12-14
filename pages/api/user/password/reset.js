import { ValidateProps } from 'server/constants';
import {
  createToken,
  findAndDeleteTokenByIdAndType,
  findUserByEmail,
  UNSAFE_updateUserPassword,
} from 'server/db';
import { sendMail, templates } from 'server/mail';
import { validateBody } from 'server/middlewares';
import { getMongoDb } from 'server/mongodb';
import { ncOpts } from 'server/nc';
import nc from 'next-connect';
import { normalizeEmailUtil } from '@/helpers/generic';

const handler = nc(ncOpts);

handler.post(
  validateBody({
    type: 'object',
    properties: {
      email: ValidateProps.user.email,
    },
    required: ['email'],
    additionalProperties: false,
  }),
  async (req, res) => {
    const db = await getMongoDb();

    const email = normalizeEmailUtil(req.body.email);
    const user = await findUserByEmail(db, email);

    if (!user) {
      res.status(400).json({
        error: { message: 'We couldn’t find that email. Please try again.' },
      });
      return;
    }

    const token = await createToken(db, {
      creatorId: user._id,
      type: 'passwordReset',
      expireAt: new Date(Date.now() + 1000 * 60 * 20),
    });

    const replacements = {
      '{{name}}': user.firstName || '',
      '{{resetLink}}': `${process.env.WEB_URI}/forget-password/${token._id}`,
    };
    const html = templates('resetPassword', replacements);

    await sendMail({
      to: email,
      subject: 'Password Reset',
      html,
    });

    res.status(204).end();
  }
);

handler.put(
  validateBody({
    type: 'object',
    properties: {
      password: ValidateProps.user.password,
      token: { type: 'string', minLength: 0 },
    },
    required: ['password', 'token'],
    additionalProperties: false,
  }),
  async (req, res) => {
    const db = await getMongoDb();

    const deletedToken = await findAndDeleteTokenByIdAndType(
      db,
      req.body.token,
      'passwordReset'
    );
    if (!deletedToken) {
      res.status(403).end();
      return;
    }
    await UNSAFE_updateUserPassword(
      db,
      deletedToken.creatorId,
      req.body.password
    );
    res.status(204).end();
  }
);

export default handler;

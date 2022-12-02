import { nanoid } from 'nanoid';
import { ObjectId } from 'mongodb';
import { ValidateProps } from 'server/constants';
import {
  findUserByEmail,
  insertUser,
  acContact,
  findUserByKey,
  updateUserById,
  findAndDeleteTokenByIdAndType,
  verifyUser,
} from 'server/db';
import { auths, validateBody } from 'server/middlewares';
import { getMongoDb } from 'server/mongodb';
import { ncOpts } from 'server/nc';
import nc from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import { normalizeEmailUtil } from '@/helpers/generic';

const handler = nc(ncOpts);

handler.post(
  validateBody({
    type: 'object',
    properties: {
      firstName: ValidateProps.user.firstName,
      password: ValidateProps.user.password,
      email: ValidateProps.user.email,
    },
    required: ['firstName', 'password', 'email'],
  }),
  ...auths,
  async (req, res) => {
    const db = await getMongoDb();

    let {
      optNewsLetter,
      company = '',
      firstName,
      email,
      password,
      invitedBy,
    } = req.body;

    email = normalizeEmailUtil(req.body.email);
    if (!isEmail(email)) {
      res
        .status(400)
        .json({ error: { message: 'The email you entered is invalid.' } });
      return;
    }

    if (!invitedBy && (await findUserByEmail(db, email))) {
      res
        .status(403)
        .json({ error: { message: 'The email has already been used.' } });
      return;
    }

    const acData = await acContact(req.body); // create or update acContact before inserting in DB

    const userData = {
      id: nanoid(),
      email,
      originalPassword: password,
      optNewsLetter,
      company,
      firstName,
      acceptedTermsDate: new Date().toLocaleString(),
      verified: false,
      acId: acData?.contact?.id,
      acStatus: acData?.response?.data?.error?.message || '200 OK',
      lastName: '',
    };

    let user = null;
    if (!invitedBy) {
      user = await insertUser(db, userData);
      await verifyUser(db, user);
    } else {
      const deletedToken = await findAndDeleteTokenByIdAndType(
        db,
        invitedBy,
        'invitedBy'
      );

      if (!deletedToken) {
        res
          .status(403)
          .json({ error: { message: 'Invalid or expired invite link.' } });
        return;
      }

      const invitedUser = await findUserByKey(
        db,
        'invitedBy',
        new ObjectId(deletedToken.creatorId)
      );
      userData.verified = true;
      userData.invite = 'confirmed';
      user = await updateUserById(db, invitedUser._id, userData);
      req.logIn(user, console.log);
    }

    res.status(201).json(user);
    // can be used for auto login - if user already verified
    // req.logIn(user, (err) => {
    //   if (err) throw err;
    //   res.status(201).json({
    //     user,
    //   });
    // });
  }
);

export default handler;

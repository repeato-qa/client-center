import { nanoid } from 'nanoid';
import { ValidateProps } from 'server/constants';
import { findUserByEmail, insertUser, acContact } from 'server/db';
import { auths, validateBody } from 'server/middlewares';
import { getMongoDb } from 'server/mongodb';
import { ncOpts } from 'server/nc';
import nc from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';

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

    let { optNewsLetter, company = '', firstName, email, password } = req.body;

    email = normalizeEmail(req.body.email);
    if (!isEmail(email)) {
      res
        .status(400)
        .json({ error: { message: 'The email you entered is invalid.' } });
      return;
    }

    if (await findUserByEmail(db, email)) {
      res
        .status(403)
        .json({ error: { message: 'The email has already been used.' } });
      return;
    }

    const acData = await acContact(req.body); // create or update acContact before inserting in DB

    const user = await insertUser(db, {
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
    });

    res.status(201).json({ user });
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

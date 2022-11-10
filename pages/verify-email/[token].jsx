import {
  findAndDeleteTokenByIdAndType,
  updateUserById,
  findUserById,
} from 'server/db';
import { getMongoDb } from 'server/mongodb';
import { VerifyEmail } from '@/page-components/VerifyEmail';
import Head from 'next/head';
import React from 'react';

export default function EmailVerifyPage({ valid, user }) {
  return (
    <React.Fragment>
      <Head>
        <title>Email verification</title>
      </Head>
      <VerifyEmail valid={valid} user={user} />
    </React.Fragment>
  );
}

export async function getServerSideProps(context) {
  const db = await getMongoDb();

  const { token } = context.params;

  const deletedToken = await findAndDeleteTokenByIdAndType(
    db,
    token,
    'emailVerify'
  );

  if (!deletedToken) return { props: { valid: false } };

  const user = await findUserById(db, deletedToken.creatorId);
  await updateUserById(db, deletedToken.creatorId, { verified: true });
  user._id = user?._id.toString(); // convert mongoDB objectId to string

  return { props: { valid: true, user } };
}

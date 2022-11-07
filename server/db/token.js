import { nanoid } from 'nanoid';

export function findTokenByIdAndType(db, id, type) {
  return db.collection('Tokens').findOne({
    _id: id,
    type,
  });
}

export function findAndDeleteTokenByIdAndType(db, id, type) {
  return db
    .collection('Tokens')
    .findOneAndDelete({ _id: id, type })
    .then(({ value }) => value);
}

export async function createToken(db, { creatorId, type, expireAt }) {
  const securedTokenId = nanoid(32);
  const token = {
    _id: securedTokenId,
    creatorId,
    type,
    expireAt,
  };
  await db.collection('Tokens').insertOne(token);
  return token;
}

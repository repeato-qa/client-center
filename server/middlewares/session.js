import { getMongoClient } from 'server/mongodb';
import MongoStore from 'connect-mongo';
import nextSession from 'next-session';
import { promisifyStore } from 'next-session/lib/compat';

const mongoStore = MongoStore.create({
  clientPromise: getMongoClient(),
  dbName: 'Repeato',
  collectionName: 'Sessions',
  stringify: false,
});
const isProd = process.env.NODE_ENV === 'production';

const getSession = nextSession({
  store: promisifyStore(mongoStore),
  cookie: {
    httpOnly: true,
    secure: isProd,
    maxAge: 2 * 7 * 24 * 60 * 60, // 2 weeks,
    path: '/',
    sameSite: isProd ? 'none' : 'strict',
  },
  touchAfter: 1 * 7 * 24 * 60 * 60, // 1 week
});

export default async function session(req, res, next) {
  await getSession(req, res);
  next();
}

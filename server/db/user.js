import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import freeEmailDomains from 'free-email-domains';
import { nanoid } from 'nanoid';
import HttpService from '@/lib/core/http-service';
import normalizeEmail from 'validator/lib/normalizeEmail';
import { AC } from 'server/constants';
import { templates, sendMail } from 'server/mail';

const httpService = new HttpService({
  baseURL: 'https://repeato-qa.api-us1.com/api/3',
});
httpService.setApiToken(process.env.AC_API_TOKEN);

export async function findUserWithEmailAndPassword(db, email, password) {
  email = normalizeEmail(email);
  const user = await db.collection('Users').findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    return { ...user, password: undefined }; // filtered out password
  }
  return null;
}

export async function findUserForAuth(db, userId) {
  return db
    .collection('Users')
    .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
    .then((user) => user || null);
}

export async function findUserById(db, userId) {
  return db
    .collection('Users')
    .findOne({ _id: new ObjectId(userId) }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

export async function findUserByEmail(db, email) {
  email = normalizeEmail(email); // normalize
  return db
    .collection('Users')
    .findOne({ email }, { projection: dbProjectionUsers() })
    .then((user) => user || null);
}

export async function updateUserById(db, id, data) {
  return db
    .collection('Users')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after', projection: { password: 0 } }
    )
    .then(({ value }) => value);
}

export async function insertUser(db, userData) {
  const password = await bcrypt.hash(userData.originalPassword, 10);
  delete userData.originalPassword; // remove the original password from params as we are inserting encrypting password
  const { insertedId } = await db
    .collection('Users')
    .insertOne({ ...userData, password });
  userData._id = insertedId;
  return userData;
}

export async function updateUserPasswordByOldPassword(
  db,
  id,
  oldPassword,
  newPassword
) {
  const user = await db.collection('Users').findOne(new ObjectId(id));
  if (!user) return false;
  const matched = await bcrypt.compare(oldPassword, user.password);
  if (!matched) return false;
  const password = await bcrypt.hash(newPassword, 10);
  await db
    .collection('Users')
    .updateOne({ _id: new ObjectId(id) }, { $set: { password } });
  return true;
}

export async function UNSAFE_updateUserPassword(db, id, newPassword) {
  const password = await bcrypt.hash(newPassword, 10);
  await db
    .collection('Users')
    .updateOne({ _id: new ObjectId(id) }, { $set: { password } });
}

export function dbProjectionUsers(prefix = '') {
  return {
    [`${prefix}password`]: 0,
    [`${prefix}email`]: 0,
    [`${prefix}emailVerified`]: 0,
  };
}

export async function memberOfTeams(db, { email, managerId, type = 'fetch' }) {
  let result = [];

  if (type === 'fetch') {
    result = await db
      .collection('Users')
      .find({ managedUsers: email })
      .toArray();
  } else if (type === 'remove') {
    result = await db
      .collection('Users')
      .updateOne({ id: managerId }, { $pull: { managedUsers: email } });
  }

  return result;
}

export const acContact = async (data) => {
  const { email, firstName = '', lastName = '', optNewsLetter } = data;
  const body = {
    contact: {
      email,
      firstName,
      lastName,
      fieldValues: [
        {
          field: AC.FIELD,
          value: optNewsLetter ? 'yes' : 'no',
        },
      ],
    },
  };
  let response = {};
  let contactId = null;

  // const response = await context.http.delete({ url: `${baseURL}/contacts/1671`, body, encodeBodyAsJSON: true, headers }); // to delete contact

  const getContacts = await httpService.get(
    `/contacts?email=${encodeURIComponent(email)}`
  );
  const contacts = getContacts.contacts; // filtered contacts

  // update contact if exist OR create if not found
  if (contacts.length) {
    response = await httpService.put(`/contacts/${contacts[0].id}`, body);
    contactId = contacts[0].id;
  } else {
    response = await httpService.post(`/contacts`, body);
    contactId = response.contact.id;
  }

  // if contact created or found then add to lists if opted by user
  if (contactId) {
    const domain = email.split('@')[1];
    // check if it's company email then add the tag to all found users and new registerd user as well
    if (!freeEmailDomains.includes(domain)) {
      const getCompanyContacts = await httpService.get(
        `/contacts?limit=100&email_like=${domain}`
      );
      const companyContacts = getCompanyContacts.contacts; // filtered contacts

      if (companyContacts.length) {
        const tagContactsIds = [
          contactId,
          ...companyContacts.map((contact) => contact.id),
        ];

        const tagPromises = [];
        tagContactsIds.length &&
          tagContactsIds.forEach((id) => {
            const tagBody = { contactTag: { contact: `${id}`, tag: '3' } }; // tag 3 is for team

            const promise = httpService.post(`/contactTags`, tagBody);
            tagPromises.push(promise);
          });
        await Promise.all(tagPromises);
      }
    }

    const contactLists = [
      {
        list: AC.ONBOARDING_LIST, // Onboarding emails
        contact: contactId,
        status: '1',
      },
      {
        list: AC.DIRECT_COMMUNICATION_LIST, // Direct communications
        contact: contactId,
        status: '1',
      },
      {
        list: AC.PRODUCT_NEWSLETTER_LIST, // Product newsletter
        contact: contactId,
        status: '1',
      },
    ];

    const listPromises = [];
    contactLists.forEach((contactList) => {
      if (!optNewsLetter && contactList.list === AC.PRODUCT_NEWSLETTER_LIST)
        return; // this list should be subscribed only when opt-in newsletter
      listPromises.push(httpService.post('/contactLists', { contactList }));
    });
    await Promise.all(listPromises);
  }

  return response;
};

export async function inviteUser(db, email, sender) {
  const user = await db.collection('Users').findOne({ email });
  let response = {};

  // user already exist
  if (user) {
    const removeLink = `${process.env.WEB_URI}`;
    const replacements = {
      '{{name}}': user.firstName || 'there',
      '{{senderName}}': sender.firstName,
      '{{senderCompany}}': sender.company,
      '{{removeLink}}': removeLink,
    };
    const html = templates('inviteExistingUser', replacements);

    await sendMail({
      to: email,
      subject: 'Team Invitation',
      html,
    });

    await db
      .collection('Users')
      .updateOne(
        { _id: new ObjectId(sender._id) },
        { $push: { managedUsers: email } }
      );
    response = user; // status => pending
  } else {
    const signUpLink = `${process.env.WEB_URI}/sign-up?email=${email}&company=${sender.company}&invited=true`;
    const data = {
      email,
      firstName: '',
      lastName: '',
      verified: false,
      invite: 'pending',
      invitedBy: sender._id,
      id: nanoid(),
      company: sender.company,
    };
    await db.collection('Users').insertOne(data);

    const replacements = {
      '{{name}}': 'there',
      '{{senderName}}': sender.firstName,
      '{{senderCompany}}': sender.company,
      '{{confirmLink}}': signUpLink,
    };
    const html = templates('inviteNewUser', replacements);
    await sendMail({
      to: email,
      subject: 'Invitation',
      html,
    });

    await db
      .collection('Users')
      .updateOne({ id: sender.id }, { $push: { managedUsers: email } });
    response = data; // status => pending
  }

  return response;
}

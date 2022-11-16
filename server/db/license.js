import { memberOfTeams } from '.';

export async function verifyLicense(db, key, ignoreUserId) {
  const license = await db.collection('Licences').findOne({ key });
  if (!license) throw new Error('Invalid license.');

  const isLinkedToUser = await db.collection('Users').findOne({ license: key });
  if (isLinkedToUser && !ignoreUserId?.equals(isLinkedToUser?._id))
    throw new Error('License is already linked to another user.');

  return license;
}

export async function userLicense(db, { email }) {
  const user = await db.collection('Users').findOne({ email });
  const managers = await memberOfTeams(db, { email }); // get managers of user first
  const licenseKeys = managers?.map((manager) => manager.license) || []; // filter all license keys
  if (user.license) licenseKeys.push(user.license);

  const licenses = await db
    .collection('Licences')
    .find({ key: { $in: licenseKeys } })
    .toArray(); // fetch all license keys data

  const licenseData = {
    maxTestCountAndroid: 10,
    maxTestCountIos: 10,
    batchRunExportCountMax: 10,
    workspacesEnabled: false,
    maxStepsPerTest: 30,
    schedulerSupported: false,
  };

  // check if user has own license then set maxManagedUsers property
  const useLicense = licenses.find((l) => l.key === user.license);
  const maxManagedUsers = useLicense ? useLicense.maxManagedUsers || 0 : 0;
  const userOwnLicense = !!useLicense; // might needed to check if user has own license too

  // take max values for each property
  licenses?.forEach((license) => {
    const {
      maxTestCountAndroid = 10,
      maxTestCountIos = 10,
      batchRunExportCountMax = 10,
      workspacesEnabled = false,
      maxStepsPerTest = 30,
      schedulerSupported = false,
    } = license.licenseOptions;

    licenseData.maxTestCountAndroid = Math.max(
      licenseData.maxTestCountAndroid,
      maxTestCountAndroid
    );
    licenseData.maxTestCountIos = Math.max(
      licenseData.maxTestCountIos,
      maxTestCountIos
    );
    licenseData.batchRunExportCountMax = Math.max(
      licenseData.batchRunExportCountMax,
      batchRunExportCountMax
    );
    licenseData.maxStepsPerTest = Math.max(
      licenseData.maxStepsPerTest,
      maxStepsPerTest
    );
    licenseData.workspacesEnabled = workspacesEnabled
      ? workspacesEnabled
      : licenseData.workspacesEnabled;
    licenseData.schedulerSupported = schedulerSupported
      ? schedulerSupported
      : licenseData.schedulerSupported;
  });

  return { licenseOptions: licenseData, maxManagedUsers, userOwnLicense };
}

import admin from 'firebase-admin';
import smartEduServiceAccount from '../../smartedu-86e0a-firebase-adminsdk-k33ow-f2e7128bbc.json';
import kirdLmsServiceAccount from '../../kird-lms-firebase-adminsdk-1xo87-721d51bcdd.json';

let messaging = null;
function initMessaging() {
  if(messaging !== null) return;

  const serviceAccount = smartEduServiceAccount;

  const kirdAdmin = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
  }, 'smartedu');

  return kirdAdmin.messaging();
}
messaging = messaging ?? initMessaging();

export {messaging};

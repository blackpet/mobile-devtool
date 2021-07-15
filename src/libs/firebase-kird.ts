import admin from 'firebase-admin';
import serviceAccount from '../../smartedu-86e0a-firebase-adminsdk-k33ow-f2e7128bbc.json';

let messaging = null;
function initMessaging() {
  if(messaging !== null) return;

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
  }, 'smartedu');

  return admin.messaging();
}
messaging = messaging ?? initMessaging();

export {messaging};

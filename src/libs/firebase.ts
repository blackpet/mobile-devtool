import admin from 'firebase-admin';
import serviceAccount from '../../firb-mobile-firebase-adminsdk-auwn5-a15fb79415.json';

let db = null;
function initDatabase() {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
  });

  return admin.firestore();
}
db = db ?? initDatabase();

export {db};

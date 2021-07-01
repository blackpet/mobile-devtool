import admin from 'firebase-admin';
import path from 'path';
import serviceAccount from '../../firb-mobile-firebase-adminsdk-auwn5-a15fb79415.json';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
  }),
});

export const db = admin.firestore();

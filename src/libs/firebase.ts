import admin from 'firebase-admin';
import serviceAccount from '../../mobile-devtool-firebase-adminsdk-x7tc5-b785e1c67b.json';

let firebase = null;
let db = null;
let messaging = null;

function initFirebase() {
	if (firebase !== null) return firebase;

	console.log('initFirebase', firebase);

	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: serviceAccount.project_id,
			clientEmail: serviceAccount.client_email,
			privateKey: serviceAccount.private_key
		})
	});

	return admin;
}

firebase = initFirebase();
db = db ?? firebase.firestore();
messaging = messaging ?? firebase.messaging();

console.log('firebase db messaging', db, messaging);

export { db, messaging };

import admin from 'firebase-admin';
import serviceAccount from '../../icodi-f97e8-firebase-adminsdk-ni6tp-a7c9557013.json';

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

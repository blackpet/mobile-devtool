import { messaging } from '../../libs/firebase';

export async function post({ url, body }) {
	const { message, token, os, ...rest } = body;

	const endpoint = `${url.origin}/push-receive`;
	let res;
	let data;

	console.log('url', url);
	console.log('body', body);
	console.log('rest', rest);

	if (os === 'ios') {
		data = {
			notification: { body: message },
			token,
			data: { endpoint, ...rest }
		};
	} else {
		// android
		data = {
			token,
			data: {
				body: message,
				endpoint,
				...rest
			}
		};
	}

	try {
		await messaging.send(data);
		res = { status: 200, data };
	} catch (err) {
		res = { status: 500, err };
	}

	return {
		body: res
	};
}

import { messaging } from '../../libs/firebase';

export async function post({ body }) {
	const { title, body: content, url, token } = body;
	let res;

	console.log(body);

	const data = {
		notification: { title, body: content },
		token,
		data: { targetUrl: url }
	};

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

import {messaging} from '../../libs/firebase-kird';

export async function post({body}) {
  const {title, body: content, url, token} = body;
  console.log(body);

  await messaging.send({
    notification: {title, body: content},
    token,
    data: {targetUrl: url},
  });

  return {
    body: {
      status: 200,
      ...body
    }
  };
}

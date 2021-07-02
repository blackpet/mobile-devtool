import {db} from '../../libs/firebase';

export async function get() {
  const res = await collection().get();
  const ver = {};
  res.docs.forEach(doc => ver[doc.id] = doc.data());

  return {
    body: ver
  };
}

export async function post({body}) {
  const {id, download, version} = body;
  console.log(body);
  await collection().doc(id).set({download, version});

  return {
    body
  };
}

const collection = () => db.collection('version');

import {db} from '../../libs/firebase';

export async function get() {
  const res = await version().get();
  const ver = {};
  res.docs.forEach(doc => ver[doc.id] = doc.data());

  return {
    body: ver
  };
}

export async function post({body}) {
  const {id, download, version} = body;
  const url = await version().doc(id).set({download, version});

  return {
    body
  };
}

const version = () => db.collection('version');

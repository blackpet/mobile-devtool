import {db} from '../../libs/firebase';

export async function get() {
  const list = await urls().get();

  return {
    body: list.docs.map(doc => ({id: doc.id, ...doc.data()}))
  };
}

export async function post({body}) {
  const url = await urls().add(body);

  return {
    body: {
      id: url.id,
      ...body
    }
  };
}

export async function del({body: {id}}) {
  const url = await urls().doc(id).delete();

  return {
    body: {
      id
    }
  }
}


const urls = () => db.collection('urls');
const version = () => db.collection('version');

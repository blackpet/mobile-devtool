import {db} from '../../libs/firebase';

export async function get() {
  const list = await collection().get();

  return {
    body: list.docs.map(doc => ({id: doc.id, ...doc.data()}))
  };
}

export async function post({body}) {
  const url = await collection().add(body);

  return {
    body: {
      id: url.id,
      ...body
    }
  };
}

export async function del({body: {id}}) {
  const url = await collection().doc(id).delete();

  return {
    body: {
      id
    }
  }
}


const collection = () => db.collection('urls');

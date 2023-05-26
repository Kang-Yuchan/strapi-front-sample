import axios from 'axios';

export async function getPrivates() {
  const res = await axios.get(
    `http://127.0.0.1:1337/api/privacy-contents`,
  );
  return res.data;
}

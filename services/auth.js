import axios from 'axios';
import Router from 'next/router';
import Cookies from 'js-cookie';

export const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
console.log(strapiUrl);
export async function signIn({ email, password }) {
  const res = await axios.post(`${strapiUrl}/api/auth/local/`, {
    identifier: email,
    password,
  });
  return res.data;
}

export async function signUp({ username, email, password }) {
  const res = await axios.post(
    `${strapiUrl}/api/auth/local/register`,
    {
      username,
      email,
      password,
    },
  );
  return res.data;
}

export const setToken = (data) => {
  if (typeof window === 'undefined') {
    return;
  }
  Cookies.set('id', data.user.id);
  Cookies.set('jwt', data.user.jwt);
  Cookies.set('username', data.user.username);
  if (Cookies.get('username')) {
    Router.reload('/');
  }
};

export const unsetToken = () => {
  if (typeof window === 'undefined') {
    return;
  }
  Cookies.remove('id');
  Cookies.remove('jwt');
  Cookies.remove('username');

  Router.reload('/');
};

export const getUsernameFromCookie = () => {
  return Cookies.get('username');
};

export const getIdFromLocalCookie = () => {
  return Cookies.get('id');
};

export const getJwtFromServerCookie = (req) => {
  if (!req.headers.cookie || '') {
    return undefined;
  }

  const jwtCookie = req.headers.cookie
    .split(';')
    .find((c) => c.trim().startsWith('jwt='));
  if (!jwtCookie) {
    return undefined;
  }

  const jwt = jwtCookie.split('=')[1];
  return jwt;
};

export const getIdFromServerCookie = (req) => {
  if (!req.headers.cookie || '') {
    return undefined;
  }

  const idCookie = req.headers.cookie
    .split(';')
    .find((c) => c.trim().startsWith('id='));
  if (!idCookie) {
    return undefined;
  }

  const id = jwtCookie.split('=')[1];
  return id;
};

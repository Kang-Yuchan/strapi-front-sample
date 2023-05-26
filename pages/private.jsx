import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export default function Private({ privates }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contents, setContents] = useState([]);

  const fetchUserData = useCallback(async () => {
    if (session) {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users-permissions/roles/${session.id}`,
        )
        .then((res) => {
          console.log(res.data.role.name);
          if (!res.data.role.name === "'Authenticated'")
            return router.push('/');
        })
        .catch((err) => {
          console.log(err);
          router.push('/');
        });
    } else {
      router.push('/');
    }
  }, [session, router]);

  useEffect(() => {
    if (status !== 'loading') {
      fetchUserData();
    }
    return () => {
      console.log('unmount');
    };
  }, [fetchUserData, status]);

  if (status === 'loading') {
    return 'Loading...';
  }
  return (
    session && (
      <ul>
        {privates.map(({ attributes: { title, content } }, i) => (
          <li key={i}>
            <h1>{title}</h1>
            <p>{content}</p>
          </li>
        ))}
      </ul>
    )
  );
}

export async function getStaticProps() {
  const privates = await (
    await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/privacy-contents`,
    )
  ).data.data;
  return {
    props: {
      privates,
    },
  };
}
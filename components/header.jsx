import { Button, Flex, Link } from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log(status);

  useEffect(() => {
    if (session == null) return;
    console.log('session.jwt', session);
  }, [session]);

  const onClickSign = () => {
    if (session) {
      signOut();
    } else {
      router.push('/signIn');
    }
  };

  return (
    <Flex
      justifyContent={'space-between'}
      width="100vw"
      paddingTop={5}
      paddingLeft={10}
      paddingRight={10}
    >
      <div>
        <Button bgColor="blue.200">
          <Link
            href="/
          "
            as={NextLink}
          >
            HOME
          </Link>
        </Button>
      </div>
      <div>
        <Button bgColor="green.200" onClick={onClickSign}>
          {session ? 'ログアウト' : 'ログイン'}
        </Button>
        {!session && (
          <Button bgColor="yellow.200" marginLeft={10}>
            <Link href="/signUp" as={NextLink}>
              会員登録
            </Link>
          </Button>
        )}
      </div>
    </Flex>
  );
};

export default Header;

import {
  Box,
  Button,
  Center,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, [router, session]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (result.ok) {
      router.replace('/');
      toast.success('ログイン成功', {
        hideProgressBar: false,
        delay: 1000,
      });
      return;
    }
    toast.error('ログイン失敗', {
      hideProgressBar: true,
    });
  };
  if (status === 'loading') {
    return 'Loading...';
  }
  return (
    <Center h="100vh">
      <Box>
        <Text fontWeight={'bold'} fontSize="2xl" textAlign={'center'}>
          ログイン
        </Text>
        <form onSubmit={onSubmit}>
          <Stack spacing={3} marginTop="3">
            <Input
              type={'email'}
              name="email"
              width="200px"
              value={email}
              h="40px"
              border={'1px'}
              borderRadius="base"
              placeholder="email"
              size="md"
              paddingLeft={'3'}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type={'password'}
              name="password"
              value={password}
              width="200px"
              h="40px"
              placeholder="password"
              border={'1px'}
              borderRadius="base"
              size="md"
              paddingLeft={'3'}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" marginTop={'3'}>
              Log In
            </Button>
          </Stack>
        </form>
      </Box>
    </Center>
  );
}

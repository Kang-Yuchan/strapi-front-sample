import {
  Box,
  Button,
  Center,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import {
  useElements,
  useStripe,
  CardElement,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { signUp } from '../services/auth';

const SubscriptionForm = () => {
  const router = useRouter();

  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const onClickCreateSubscription = useCallback(async () => {
    try {
      const card = elements.getElement('card');
      const paymentMethod = await stripe.createPaymentMethod({
        type: 'card',
        card,
      });

      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          email,
          paymentMethod: paymentMethod.paymentMethod.id,
        }),
      });

      if (!response.ok)
        return toast.error('決済に失敗しました。', { delay: 500 });

      const result = await response.json();
      console.log(result);
      setIsSubscribed(true);
      return alert('決済に成功しました。');
    } catch (err) {
      console.log(err);
      alert('決済に失敗しました。');
    }
  }, [email, username, stripe, elements, setIsSubscribed]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await signUp({
      username,
      email,
      password,
    });
    if (result.jwt) {
      router.replace('/');
      alert('会員登録成功');
      return;
    }
    alert('会員登録失敗');
  };

  return (
    <Center h="100vh">
      <Box>
        <Text fontWeight={'bold'} fontSize="2xl" textAlign={'center'}>
          会員登録
        </Text>
        <form onSubmit={onSubmit}>
          <Stack spacing={3} marginTop="3">
            <Input
              type={'username'}
              name="username"
              width="400px"
              value={username}
              h="40px"
              border={'1px'}
              borderRadius="base"
              placeholder="username"
              size="md"
              paddingLeft={'3'}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Input
              type={'email'}
              name="email"
              width="400px"
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
              width="400px"
              h="40px"
              placeholder="password"
              border={'1px'}
              borderRadius="base"
              size="md"
              paddingLeft={'3'}
              onChange={(e) => setPassword(e.target.value)}
            />
            <CardElement
              options={{ hidePostalCode: true, hideIcon: false }}
            />
            <Button type="button" onClick={onClickCreateSubscription}>
              定期購読を開始する
            </Button>
            <Button
              type="submit"
              marginTop={'3'}
              isDisabled={!isSubscribed}
            >
              登録
            </Button>
          </Stack>
        </form>
      </Box>
    </Center>
  );
};

export default SubscriptionForm;

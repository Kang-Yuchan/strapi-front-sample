import { ChakraProvider, extendBaseTheme } from '@chakra-ui/react';
// `@chakra-ui/theme` is a part of the base install with `@chakra-ui/react`
import chakraTheme from '@chakra-ui/theme';
import { SessionProvider } from 'next-auth/react';
import RootLayout from '../app/layout';
import { RecoilRoot } from 'recoil';

const { Button, Link, List, Container, Form, Input } =
  chakraTheme.components;
const fonts = chakraTheme.fonts;

const theme = extendBaseTheme({
  components: {
    Button,
    Link,
    List,
    Container,
    Form,
    Input,
  },
  fonts,
});

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        </ChakraProvider>
      </RecoilRoot>
    </SessionProvider>
  );
}

export default App;

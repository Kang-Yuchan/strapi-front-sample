import axios from 'axios';
import {
  Container,
  Flex,
  Link,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Box } from '@chakra-ui/react';
import { strapiUrl } from '../services/auth';

export default function Home({ notices }) {
  return (
    <>
      <Container
        display={'flex'}
        flexDirection={'column'}
        justifyContent="center"
        alignItems={'center'}
        paddingTop={'30'}
      >
        <Flex
          height="100vh"
          alignItems={'center'}
          justifyContent="space-between"
          width="xl"
        >
          <Box>
            <Text marginBottom={'5'}>お知らせ</Text>
            <List spacing={3}>
              {notices.map((notice, i) => (
                <ListItem key={i}>{notice.attributes.title}</ListItem>
              ))}
            </List>
          </Box>
          <Link
            href="/private"
            as={NextLink}
            bgColor="ButtonHighlight"
            border={'1px'}
            borderRadius={'md'}
            height={'10'}
            width={'52'}
            display="flex"
            alignItems={'center'}
            justifyContent="center"
          >
            会員専用ページへ
          </Link>
        </Flex>
      </Container>
    </>
  );
}

export async function getStaticProps() {
  const notices = await (
    await axios.get(`${strapiUrl}/api/notices`)
  ).data.data;
  return {
    props: {
      notices,
    },
  };
}

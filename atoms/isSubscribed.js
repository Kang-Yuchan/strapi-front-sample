import { atom } from 'recoil';

export const isSubscribedAtom = atom({
  key: 'IsSubscribed',
  default: false,
});

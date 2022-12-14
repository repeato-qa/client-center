import { useContext } from 'react';
import { StoreContext } from '@/helpers/store-provider';
import RootStore from '@/stores/root-store';

export const useStore = (): RootStore => {
  return useContext(StoreContext);
};


import { useOrderProductCreation } from './useOrderProductCreation';

export const useOrderProductsSync = (orderId: string | undefined, refetchProducts: () => void) => {
  return useOrderProductCreation(orderId, refetchProducts);
};

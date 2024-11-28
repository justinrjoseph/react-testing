import { Theme } from '@radix-ui/themes';

import { QueryClient, QueryClientProvider } from 'react-query';
import { PropsWithChildren } from 'react';

import { CartProvider } from '../src/providers/CartProvider';

const AllProviders = ({ children }: PropsWithChildren): JSX.Element => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Theme>
            {children}
          </Theme>
        </CartProvider>
      </QueryClientProvider>
    </>
  )
};

export default AllProviders;
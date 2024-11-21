import { QueryClient, QueryClientProvider } from "react-query";
import { PropsWithChildren } from "react";

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
        {children}
      </QueryClientProvider>
    </>
  )
};

export default AllProviders;
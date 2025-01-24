import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { AuthProvider } from '@/auth/providers/JWTProvider';
import {
  LayoutProvider,
  LoadersProvider,
  MenusProvider,
  SettingsProvider,
  SnackbarProvider,
  TranslationProvider
} from '@/providers';
import { HelmetProvider } from 'react-helmet-async';
import store from '@/redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const queryClient = new QueryClient();

const ProvidersWrapper = ({ children }: PropsWithChildren) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <AuthProvider>
            <SettingsProvider>
              <TranslationProvider>
                <HelmetProvider>
                  <LayoutProvider>
                    <LoadersProvider>
                      <MenusProvider>
                        {children}
                        <ToastContainer />
                      </MenusProvider>
                    </LoadersProvider>
                  </LayoutProvider>
                </HelmetProvider>
              </TranslationProvider>
            </SettingsProvider>
          </AuthProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export { ProvidersWrapper };

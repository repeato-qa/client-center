import '@/assets/base.css';
import '@/assets/index.css';
import createStore from '@/helpers/create-store';
import { Layout } from '@/components/Layout';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { config } from '@/helpers/generic';
import { StoreProvider } from '@/helpers/store-provider';

let envConfig = config();
const nodeEnv = process.env.NODE_ENV;

const { rootStore } = createStore({ envConfig });

if (nodeEnv === 'development') {
  // for debugging
  console.log(rootStore, envConfig);
}

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <StoreProvider value={rootStore}>
        <Layout>
          <Component {...pageProps} />
          <Toaster />
        </Layout>
      </StoreProvider>
    </ThemeProvider>
  );
}

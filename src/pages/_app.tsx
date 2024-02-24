import { ApolloProvider } from '@apollo/client';
import apolloClient from '../lib/apolloClient';
import '../styles/globals.css'; // Adjust the path to your global styles if necessary
import type { AppProps } from 'next/app'; // Import AppProps type
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

function MyApp({ Component, pageProps }: AppProps) {
  // Define ThemedComponent inside MyApp to ensure it has access to ThemeProvider's context
  const ThemedComponent = () => {
    const { theme } = useTheme();

    return (
      <div className={theme}>
        <Component {...pageProps} />
      </div>
    );
  };

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <ThemedComponent />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;

import { ApolloProvider } from '@apollo/client'
import apolloClient from '../lib/apolloClient'
import '../app/globals.css' // Adjust the path to your global styles if necessary
import type { AppProps } from 'next/app' // Import AppProps type

function MyApp({ Component, pageProps }: AppProps) {
  // Use AppProps to type the props
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp

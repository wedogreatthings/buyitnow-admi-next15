import React from 'react';
import { GlobalProvider } from './GlobalProvider';
import './globals.css'; // Import CSS normal, pas dynamique
import Head from './head';
import Header from '@/components/layouts/Header';

// eslint-disable-next-line react/prop-types
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head />
      <body>
        <GlobalProvider>
          <Header />
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}

// components/Layout.tsx
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode; // Define the type for children here
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen"> {/* Ensure the container is a flex column container */}
        <Header />
          <main className="flex-grow"> {/* Main content takes up all available space */}
            {children}
          </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;

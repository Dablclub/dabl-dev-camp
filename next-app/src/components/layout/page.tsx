import React from 'react';
import Navbar from './navbar';
import Footer from './footer';

const NAVBAR_HEIGHT = '80px'; // 5rem / h-20 tw

export interface NavbarProps {
  title?: string;
  navTitle?: string;
}

const PageWithNavbar: React.FC<NavbarProps & { children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Navbar />
      <main
        className={`absolute h-[calc(100vh-80px)] top-[${NAVBAR_HEIGHT}] flex w-full flex-col items-center overflow-x-hidden overflow-y-scroll`}
      >
        {children}
        <Footer isHomePage={false} />
      </main>
    </>
  );
};

export default PageWithNavbar;

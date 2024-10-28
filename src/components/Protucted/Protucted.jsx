import React from 'react';
import MyNavbar from '../Navbar/Navbar.jsx';
import Footer from '../Footer/Footer.jsx';

export default function Protucted({ children }) {
  return (
    <>
        <MyNavbar/>
      {children} {/* Render protected routes here */}
      <Footer/>
    </>
  );
}

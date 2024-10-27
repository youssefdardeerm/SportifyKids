import React from 'react';
import './Homepage.css'; // Don't forget to import your custom CSS
import { Helmet } from 'react-helmet';


export default function HomePage() {
  return (
    <>
    <Helmet>
        <title>HomePage</title>
        <meta name="description" content="Explore KSA HomePage" />
      </Helmet>
    <h1 className='text-center my-5'>Welcome in SportifyKids </h1>
    </>
  )
}


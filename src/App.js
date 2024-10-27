import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DataContextFunction from './context/context';
import Layout from './components/layout/Layout.jsx';
import WelcomePage from './components/WelcomePage/WelcomePage.jsx';
import { ToastContainer } from 'react-toastify';
import Notfoundpage from './components/Notfoundpage/Notfoundpage.jsx';
import HomePage from './components/HomePage/HomePage.jsx';


export default function App() {
  // Set up the router
  let router = createBrowserRouter([
    {
      path: '',
      element: <Layout />,
      children: [
        { index: true, element: <WelcomePage /> },
        { path: '/HomePage', element: <HomePage />},

        { path: "*", element: <Notfoundpage /> }
      ]
    }
  ]);

  return (
    <DataContextFunction>
      <RouterProvider router={router} />
      <ToastContainer /> {/* Include ToastContainer here if you need to display notifications */}
    </DataContextFunction>
  );
}

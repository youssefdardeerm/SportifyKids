import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DataContextFunction from './context/context';
import Layout from './components/layout/Layout.jsx';
import WelcomePage from './components/WelcomePage/WelcomePage.jsx';
import { ToastContainer } from 'react-toastify';
import Notfoundpage from './components/Notfoundpage/Notfoundpage.jsx';
import HomePage from './components/HomePage/HomePage.jsx';

import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import cookies from "js-cookie"
import Protucted from './components/Protucted/Protucted.jsx';
import VideosTraining from './components/videostraining/VideosTraining.jsx';
import HealthyEating from './components/healthyEating/HealthyEating.jsx';
import ActiviteStories from './components/ActiviteStories/ActiviteStories.jsx';
import Childdata from './components/childdata/Childdata.jsx';
import SportsComdy from './components/sportscomdy/SportsComdy.jsx';
import Challengeday from './components/challengeday/Challengeday.jsx';
import Quiz from './components/quiz/Quiz.jsx';
import Entertainment from './components/entertainment/Entertainment.jsx';
i18n.use(initReactI18next).use(LanguageDetector).use(HttpApi).init({

    fallbackLng: "en",
    detection :{
      order: [ 'cookie','htmlTag', 'localStorage', 'sessionStorage', 'navigator', 'path', 'subdomain'], 
      caches: ['cookie']
    },
    backend:{
      loadPath: '/locale/{{lng}}/translation.json'
    },
    react : {
      useSuspense: false // لإيقاف انتظار تحميل الترجمة
    }
  });

  // Childdata
export default function App() {
  const { t } = useTranslation();
  // Set up the router
  let router = createBrowserRouter([
    {
      path: '',
      element: <Layout />,
      children: [
        { index: true, element: <WelcomePage /> },
        { path: '/HomePage', element: <Protucted><HomePage /></Protucted> },
        { path: '/videos', element: <Protucted><VideosTraining /></Protucted> },
        { path: '/healthy-eating', element: <Protucted><HealthyEating /></Protucted> },
        { path: '/activity-stories', element: <Protucted><ActiviteStories /></Protucted> },
        { path: '/child-data', element: <Protucted><Childdata /></Protucted> },
        { path: '/sports-comedy', element: <Protucted><SportsComdy /></Protucted> },
        { path: '/challenge', element: <Protucted><Challengeday /></Protucted> },
        { path: '/game', element: <Protucted><Quiz /></Protucted> },
        { path: '/entertainment', element: <Protucted><Entertainment /></Protucted> },
        { path: "*", element: <Notfoundpage /> }
      ]
    }
  ]);
  const lng = cookies.get('i18next') || 'en';
useEffect(() => {
  window.document.dir = i18n.dir();
}, [lng]);
  return (
    <DataContextFunction>
      {/* <button onClick={() => i18n.changeLanguage('en')}>English</button>
      <button onClick={() => i18n.changeLanguage('ar')}>arabic</button> */}
      <RouterProvider router={router} />
      <ToastContainer /> {/* Include ToastContainer here if you need to display notifications */}
    </DataContextFunction>
  );
}

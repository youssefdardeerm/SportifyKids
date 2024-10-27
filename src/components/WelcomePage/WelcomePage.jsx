import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import './WelcomePage.css';

export default function WelcomePage() {
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    // طلب الـ token من السيرفر وتوليد QR code بناءً عليه
    axios.get("https://sportify-kids-backend.vercel.app/generate-qr")
      .then((response) => {
        const token = response.data.token;  // استلام token من الاستجابة
        const qrCodeURL = `https://sportify-kids-backend.vercel.app/verify-token?token=${token}`;  // تضمين token في الرابط
        axios.post("https://sportify-kids-backend.vercel.app/generate-qr", { url: qrCodeURL })
          .then((qrResponse) => setQrCode(qrResponse.data.qrCode))
          .catch((error) => console.error("Error generating QR code", error));
      })
      .catch((error) => console.error("Error fetching token", error));
  }, []);

  return (
    <div className="bg">
      <div className="welcome-container d-flex justify-content-center align-items-center">
        <Helmet>
          <title>SportifyKids - موقع الرياضة للأطفال</title>
          <meta name="description" content="موقع ترفيهي وتعليمي يشجع الأطفال على ممارسة الرياضة" />
        </Helmet>
        
        <div className="text-center">
          <h1 className="welcome-title mb-4">SportifyKids مرحبا بكم في</h1>
          <p className="welcome-text lead mb-4">لبدء رحلتك الرياضية شجع أطفالك على ممارسة الرياضة والاستمتاع بأنشطة صحية ممتعة</p>
          <p className="welcome-text lead mb-4">للدخول بالموقع QR Code رجاءا قم بمسح</p>
          {qrCode ? (
            <img src={qrCode} alt="QR Code" className="qr-code-image mb-4" />
          ) : (
            <p>جاري تحميل رمز QR...</p>
          )}
        </div>
      </div>
    </div>
  );
}

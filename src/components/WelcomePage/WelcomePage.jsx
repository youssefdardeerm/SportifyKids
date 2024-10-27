import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './WelcomePage.css';

export default function WelcomePage() {
  const [qrCode, setQrCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // استخراج التوكين من URL إذا كان موجودًا
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  useEffect(() => {
    // توليد الـ QR code عند تحميل الصفحة
    axios.get("https://sportify-kids-backend.vercel.app/generate-qr")
      .then((response) => {
        setQrCode(response.data.qrCode);
      })
      .catch((error) => console.error("Error fetching QR code", error));
  }, []);

  useEffect(() => {
    // التحقق من صلاحية التوكين تلقائيًا إذا كان موجودًا
    if (token) {
      axios.get(`https://sportify-kids-backend.vercel.app/verify-token?token=${token}`)
        .then((response) => {
          if (response.data.valid) {
            // التوجيه إلى الصفحة الرئيسية في حالة التوكين صحيح
            navigate("/HomePage", { replace: true });
          } else {
            console.error("Invalid token.");
          }
        })
        .catch((error) => {
          console.error("Error verifying token", error);
        });
    }
  }, [token, navigate]);

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

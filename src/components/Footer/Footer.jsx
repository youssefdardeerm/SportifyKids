// Footer.js
import React from 'react';
import './Footer.css'; // Don't forget to import your CSS
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <h2>{t('footer.logo')}</h2>
                </div>

                <div className="footer-social">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        {t('footer.facebook')}
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        {t('footer.twitter')}
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        {t('footer.instagram')}
                    </a>
                </div>
            </div>
            <div className="footer-copyright">
                {t('footer.copyright')}
            </div>
        </footer>
    );
}

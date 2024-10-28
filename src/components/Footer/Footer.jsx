// Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css'; // استيراد ملف CSS الخاص بالـ Footer
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <Container>
                <Row className="footer-content">
                    <Col className="footer-logo text-center">
                        <h2>{t('footer.logo')}</h2>
                    </Col>
                </Row>
                <Row className="footer-social text-center">
                    <Col>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                            {t('footer.facebook')}
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                            {t('footer.twitter')}
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                            {t('footer.instagram')}
                        </a>
                    </Col>
                </Row>
                <Row>
                    <Col className="footer-copyright text-center">
                        {t('footer.copyright')}
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

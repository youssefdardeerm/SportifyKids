// Navbar.jsx
import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import i18n from 'i18next';
import "./Navbar.css"
function MyNavbar() {
  const { t } = useTranslation();
  const currentLang = i18n.language;

  // Toggle language between 'ar' and 'en'
  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Navbar className="bg-dark" expand="lg" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <Container>
        {/* Toggle button with white color */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'white', color: 'white' }}>
          <span style={{ color: 'white' }}>☰</span> {/* Custom icon */}
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="text-light" as={Link} to="/HomePage">{t('home')}</Nav.Link>
            <Nav.Link className="text-light" as={Link} to="/videos">{t('videos')}</Nav.Link>
            <Nav.Link className="text-light" as={Link} to="/healthy-eating">{t('healthyEating')}</Nav.Link>
            
            {/* Dropdown with white arrow */}
            <NavDropdown className="custom-dropdown" title={<span style={{ color: 'white' }}>{t('more')}</span>} id="basic-nav-dropdown" menuVariant="dark">
              <NavDropdown.Item className="text-light" as={Link} to="/activity-stories">{t('activityStories')}</NavDropdown.Item>
              <NavDropdown.Item className="text-light" as={Link} to="/child-data">{t('childData')}</NavDropdown.Item>
              <NavDropdown.Item className="text-light" as={Link} to="/sports-comedy">{t('sportsComedy')}</NavDropdown.Item>
              <NavDropdown.Item className="text-light" as={Link} to="/challenge">{t('challenge')}</NavDropdown.Item>
              <NavDropdown.Item className="text-light" as={Link} to="/entertainment">{t('entertainment')}</NavDropdown.Item>
              <NavDropdown.Item className="text-light" as={Link} to="/game">{t('game')}</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link className="text-light" onClick={toggleLanguage}>
              {currentLang === 'en' ? 'AR' : 'EN'}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;

import React from 'react';
import './Homepage.css';
import { Helmet } from 'react-helmet';
import { Carousel } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import img1 from '../../images/bg.png';
import img2 from '../../images/bg2.png';
import img3 from '../../images/bg3.png';
import img4 from '../../images/bg4.png';
import runImg from '../../images/running.png';
import swimImg from '../../images/swimming.png';
import footballImg from '../../images/football.png';
import tennisImg from '../../images/tennis.png';
import jumpImg from '../../images/jumping.png';
import boxingImg from '../../images/boxing.png';
import fruits from '../../images/fruits.png';
import salad from '../../images/salad.png';
import milk from '../../images/milks.png';
import salmon from '../../images/salamon.png';
import eggs from '../../images/eggs.png';
import nuts from '../../images/mksrat.jpeg';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('title')}</title>
        <meta name="description" content={t('homepageDescription')} />
      </Helmet>
      <section className="header-section">
        <Carousel id="carouselExampleControls" className="carousel-container">
          {[img1, img2, img3, img4].map((img, index) => (
            <Carousel.Item key={index}>
              <div className="carousel-item-bg" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6)), url(${img})`, backgroundPosition: "center", backgroundSize: "100% 100%" }}>
                <div className="carousel-caption d-block">
                  <h1>{t(`carouselTitle${index + 1}`)}</h1>
                  <p className="fw-bold">{t(`carouselDescription${index + 1}`)}</p>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* sports */}
      <section className="sports-section my-3">
        <h2>{t('sportsSectionTitle')}</h2>
        <div className="container">
          <div className="row">
            {[{ img: runImg, title: t('runningTitle'), description: t('runningDescription') },
              { img: swimImg, title: t('swimmingTitle'), description: t('swimmingDescription') },
              { img: footballImg, title: t('footballTitle'), description: t('footballDescription') },
              { img: tennisImg, title: t('tennisTitle'), description: t('tennisDescription') },
              { img: jumpImg, title: t('jumpingTitle'), description: t('jumpingDescription') },
              { img: boxingImg, title: t('boxingTitle'), description: t('boxingDescription') }
            ].map((sport, index) => (
              <div className="col-md-6 mb-4" key={index}>
                <div className="sport-item" style={{ backgroundImage: `url(${sport.img})`, backgroundPosition: "center", backgroundSize: "100% 100%" }}>
                  <div className="overlay">
                    <h3>{sport.title}</h3>
                    <p>{sport.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Healthy food */}
      <section className="sports-section my-3">
        <h2>{t('healthyFoodSectionTitle')}</h2>
        <div className="container">
          <div className="row">
            {[{ img: fruits, title: t('fruitsTitle'), description: t('fruitsDescription') },
              { img: salad, title: t('saladTitle'), description: t('saladDescription') },
              { img: milk, title: t('milkTitle'), description: t('milkDescription') },
              { img: salmon, title: t('salmonTitle'), description: t('salmonDescription') },
              { img: eggs, title: t('eggsTitle'), description: t('eggsDescription') },
              { img: nuts, title: t('nutsTitle'), description: t('nutsDescription') }
            ].map((food, index) => (
              <div className="col-md-6 mb-4" key={index}>
                <div className="sport-item" style={{ backgroundImage: `url(${food.img})`, backgroundPosition: "center", backgroundSize: "100% 100%" }}>
                  <div className="overlay">
                    <h3>{food.title}</h3>
                    <p>{food.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section my-3" style={{ position: "relative", overflow: "hidden", height: "500px" }}>
        <div className="video-overlay" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" }}></div>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/el5qOwrBZUY?autoplay=1&mute=1&controls=0&showinfo=0&loop=1&playlist=el5qOwrBZUY"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        ></iframe>
      </section>

      {/* Tips Section */}
      <section className="tips-section my-3">
        <h2>{t('tipsSectionTitle')}</h2>
        <div className="container">
          <div className="row">
            {[{ title: t('tip1Title'), description: t('tip1Description') },
              { title: t('tip2Title'), description: t('tip2Description') },
              { title: t('tip3Title'), description: t('tip3Description') },
              { title: t('tip4Title'), description: t('tip4Description') }
            ].map((tip, index) => (
              <div className="col-md-6 mb-4" key={index}>
                <div className="tip-item">
                  <h3>{tip.title}</h3>
                  <p>{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
     
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import { useTranslation } from 'react-i18next';
import './ActiviteStories.css';
import { Helmet } from 'react-helmet';

export default function ActiviteStories() {
  const { t } = useTranslation();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://sportify-kids-backend.vercel.app/api/Physicalactivity/getvideos')
      .then(response => response.json())
      .then(data => {
        setVideos(data.videos);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching videos:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Container>
          <Helmet>
          <title>activitestories - قصص النشاطات</title>
          <meta name="description" content="موقع ترفيهي وتعليمي يشجع الأطفال على ممارسة الرياضة" />
        </Helmet>
      <h2 className="text-center my-4">{t('activityStoriesTitle')}</h2>

      {loading ? (
       <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
       <i className="fa fa-spin fa-spinner" style={{ fontSize: '50px' }}></i>
     </div>
      ) : (
        <>
          {/* Awareness stories section */}
          
          
          <Row>
            {videos.map((video, index) => (
              <Col key={video._id} xs={12} sm={6} md={4} className="mb-4">
                <div className="video-card">
                  <ReactPlayer url={video.url} controls width="100%" height="200px" />
                </div>
              </Col>
            ))}
          </Row>
          {/* Videos section */}
          <h3 className="text-center my-4">{t('awarenessStories')}</h3>
          <Row className="mb-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((story, index) => (
              <Col key={index} xs={12} sm={6} md={3} className="mb-4">
                <Card className="story-card">
                  <Card.Body>
                    <Card.Title>{t(`story${story}Title`)}</Card.Title>
                    <Card.Text>{t(`story${story}Description`)}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}

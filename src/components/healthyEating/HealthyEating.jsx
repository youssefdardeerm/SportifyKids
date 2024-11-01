import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form, Alert, Pagination, ProgressBar, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { useTranslation } from 'react-i18next';
import './HealthyEating.css';
import { Helmet } from 'react-helmet';

export default function HealthyEating() {
  const { t } = useTranslation();
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const videosPerPage = 4; // Number of videos per page

  const healthyTips = [
    { title: "Variety of Fruits", tip: "Eat a variety of colorful fruits and vegetables." },
    { title: "Stay Hydrated", tip: "Drink plenty of water throughout the day." },
    { title: "Whole Grains", tip: "Choose whole grains over refined grains." },
    { title: "Limit Sugars", tip: "Limit sugary snacks and beverages." },
    { title: "Lean Proteins", tip: "Eat lean proteins like chicken and fish." },
    { title: "Avoid Processed Foods", tip: "Avoid processed foods when possible." },
    { title: "Sleep Well", tip: "Get plenty of sleep to help your body grow strong." },
    { title: "Regular Exercise", tip: "Exercise regularly to stay healthy and active." },
  ];

  useEffect(() => {
    fetchVideos();
  }, [page]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://sportify-kids-backend.vercel.app/api/Healthood/getvideos?page=${page}`);
      setVideos(response.data.videos);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!videoUrl) {
      setUploadError(t('Please enter a video URL.'));
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadProgress(0);

    try {
      const response = await axios.post(
        'https://sportify-kids-backend.vercel.app/api/Healthood/uploadvideoshealthfood',
        { url: videoUrl },
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        }
      );

      // Add the new video directly to the list without refreshing
      setVideos((prevVideos) => [{ _id: response.data.video._id, url: videoUrl }, ...prevVideos]);
      setShowModal(false);
      setPage(1); // reset to first page to show the latest video
    } catch (error) {
      setUploadError(t('Failed to upload the video, please try again.'));
    } finally {
      setIsUploading(false);
      setVideoUrl('');
    }
  };

  return (
    <Container className="my-5">
          <Helmet>
          <title>healtheating - الاكل الصحي</title>
          <meta name="description" content="موقع ترفيهي وتعليمي يشجع الأطفال على ممارسة الرياضة" />
        </Helmet>
      {/* Healthy Tips Section */}
      <Row className="mb-4 text-center">
        <Col>
          <h2>{t('Healthy Eating Tips')}</h2>
        </Col>
      </Row>
      <Row className="text-center mb-5">
        {healthyTips.map((tip, index) => (
          <Col md={3} key={index} className="mb-4">
            <Card className="h-100 card-hover">
              <Card.Body>
                <Card.Title className="fw-bold">{t(tip.title)}</Card.Title>
                <Card.Text>{t(tip.tip)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Educational Videos Section */}
      <Row className="text-center mb-4">
        <Col>
          <h3>{t('Educational Videos')}</h3>
        </Col>
      </Row>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        </div>
      ) : (
        <Row>
          {videos.map((video) => (
            <Col key={video._id} md={6} className="mb-3 text-center">
              <ReactPlayer url={video.url} controls width="100%" height="100%" />
            </Col>
          ))}
          <Pagination className="justify-content-center mt-4">
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === page}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Row>
      )}

      {/* Upload Video Button */}
      <Row className="justify-content-center mt-5">
        <Button variant="primary" className="my-3" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faUpload} /> {t('uploadButtonHealthyEating')}
        </Button>
      </Row>

      {/* Upload Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('uploadTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {uploadError && <Alert variant="danger">{uploadError}</Alert>}
          <Form>
            <Form.Group>
              <Form.Label>{t('enterVideoUrl')}</Form.Label>
              <Form.Control
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder={t('enter Url video')}
              />
              <Form.Text className="text-danger fs-6 fw-bold">
                {t('uploadNote')}<br />
                {t('youtube Or External')} (e.g., Cloudinary, Google Drive, AWS S3)
              </Form.Text>
            </Form.Group>
            {isUploading && <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>{t('cancel')}</Button>
          <Button variant="primary" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? `${t('uploading')}...` : t('upload')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

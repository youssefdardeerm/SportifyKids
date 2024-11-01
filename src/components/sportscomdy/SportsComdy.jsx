import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert, Row, Col, Container, Spinner } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from 'react-helmet';
export default function SportsComedy() {
  const { t } = useTranslation();
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true); // حالة التحميل

  // Fetch videos from API
  const fetchVideos = async (page = 1) => {
    setLoading(true); // بدء تحميل البيانات
    try {
      const response = await axios.get(`https://sportify-kids-backend.vercel.app/api/sportscomdy/videos?page=${page}`);
      setVideos(response.data.videos);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false); // انتهاء التحميل
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle video upload
  const handleUpload = async () => {
    if (!videoUrl) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      await axios.post('https://sportify-kids-backend.vercel.app/api/sportscomdy/videos', { url: videoUrl });
      setVideoUrl('');
      setShowModal(false);
      fetchVideos(currentPage); // Refetch current page videos
    } catch (error) {
      setUploadError(error.response?.data?.message || 'Error uploading video');
    } finally {
      setIsUploading(false);
    }
  };

  // Pagination controls
  const handlePageChange = (page) => {
    fetchVideos(page);
    setCurrentPage(page);
  };

  return (
    <div className="">
        <Helmet>
          <title>SportsComdy - كوكيديا الرياضة</title>
          <meta name="description" content="موقع ترفيهي وتعليمي يشجع الأطفال على ممارسة الرياضة" />
        </Helmet>
      <Container className="my-4">
        <h1 className="text-center mb-4">{t('sportsComedyTitle')}</h1>
        
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
            <i className="fa fa-spin fa-spinner" style={{ fontSize: '50px' }}></i>
          </div>
        ) : (
          <Row>
            {videos.map((video) => (
              <Col key={video._id} md={4} className="mb-4">
                <ReactPlayer url={video.url} controls width="100%" height="200px" />
              </Col>
            ))}
          </Row>
        )}

        {/* Pagination Controls */}
        <div className="d-flex justify-content-center my-3">
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='w-auto'
          >
            Previous
          </Button>
          <span className="mx-3">{`${currentPage} / ${totalPages}`}</span>
          <Button
            variant="secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='w-auto'
          >
            Next
          </Button>
        </div>

        {/* Add Funny Video Button */}
        <div className="text-center mt-4">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            {t('addFunnyVideo')}
          </Button>
        </div>

        {/* Upload Video Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{t('uploadTitlefunny')}</Modal.Title>
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
                  placeholder={t('enterVideoUrl')}
                />
                <Form.Text className="text-danger fs-6 fw-bold">
                  {t('uploadNotefunny')}<br />
                  {t('youtubeOrExternal')}
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {t('cancel')}
            </Button>
            <Button variant="primary" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? `${t('uploading')}...` : t('upload')}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

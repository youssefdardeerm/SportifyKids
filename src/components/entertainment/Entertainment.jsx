import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Pagination, Alert, Modal, Form, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faUpload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import ReactPlayer from 'react-player';
export default function Entertainment() {
    const { t } = useTranslation();
    const [videos, setVideos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [uploadError, setUploadError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
    const fetchVideos = async (page = 1) => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://sportify-kids-backend.vercel.app/api/Entertainment?page=${page}`);
        setVideos(response.data.videos);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (error) {
        console.error(t('errorFetchingVideos'));
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchVideos(currentPage);
    }, [currentPage]);
  
    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    };
  
    const handleUpload = async () => {
      if (!videoUrl) return;
  
      setIsUploading(true);
  
      try {
        await axios.post('https://sportify-kids-backend.vercel.app/api/Entertainment', { url: videoUrl });
        setShowModal(false);
        setUploadError(null);
        setVideoUrl('');
        fetchVideos(currentPage);
      } catch (error) {
        setUploadError(t('uploadError'));
      } finally {
        setIsUploading(false);
      }
    };
  
    return (
 
        <Container className="mt-4">
          <Helmet>
            <title>Entertainment - الترفيه</title>
            <meta name="description" content={t('homepageDescription')} />
          </Helmet>
          <h2 className="text-center mb-4">{t('videoEntertainment')}</h2>
    
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
              <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            </div>
          ) : (
            <Row>
              {videos.length > 0 ? (
                videos.map((video) => (
                  <Col md={3} key={video._id} className="mb-3">
                    <div className="video-container">
                      <ReactPlayer
                        url={video.url}
                        width="100%"
                        height="100%"
                        controls
                        onError={() => console.error(`Error playing video: ${video.url}`)}
                      />
                    </div>
                  </Col>
                ))
              ) : (
                <Alert variant="warning">{t('noVideos')}</Alert>
              )}
            </Row>
          )}
    
          <Pagination className="justify-content-center mt-4">
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          </Pagination>
    
          <div className="text-center mt-4">
            <Button variant="primary" className="my-5" onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon={faUpload} /> {t('uploadButtonEntertainment')}
            </Button>
          </div>
    
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
       
      );
}

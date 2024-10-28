import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Pagination, Alert, Modal, Form, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

export default function VideosTraining() {
  const { t } = useTranslation();
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const fetchVideos = async (page = 1) => {
    try {
      const response = await axios.get(`https://sportify-kids-backend.vercel.app/api/Trainingvideolibrary/getvideos?page=${page}`);
      setVideos(response.data.videos);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error(t('errorFetchingVideos'));
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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('videolibrary', selectedFile);

    setIsUploading(true);

    try {
      const response = await axios.post('https://sportify-kids-backend.vercel.app/api/Trainingvideolibrary/uploadvideos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percent = Math.floor((loaded * 100) / total);
          setUploadProgress(percent);
        },
      });
      setShowModal(false);
      setUploadError(null);
      setUploadProgress(0);
      fetchVideos(currentPage);
    } catch (error) {
      setUploadError(t('uploadError'));
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Helmet>
        <title>{t('libraryvideo')}</title>
        <meta name="description" content={t('homepageDescription')} />
      </Helmet>
      <h2 className="text-center mb-4">{t('videoSectionTitle')}</h2>
      <Row>
        {videos.length > 0 ? (
          videos.map((video) => (
            <Col md={3} key={video._id} className="mb-3">
              <div className="video-container">
                <video controls src={video.url} className="w-100 rounded" />
              </div>
            </Col>
          ))
        ) : (
          <Alert variant="warning">{t('noVideos')}</Alert>
        )}
      </Row>

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
        <Button variant="primary" className="my-3" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faUpload} /> {t('uploadButton')}
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
              <Form.Label>{t('selectFile')}</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} accept=".mp4" />
              <Form.Text className="text-danger fs-6 fw-bold">{t('uploadNote')}</Form.Text>
            </Form.Group>
            {isUploading && <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />}
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

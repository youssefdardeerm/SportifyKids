import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReactPlayer from 'react-player';
import { Container, Row, Col, Button, Table, Pagination, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const challengeSchema = Yup.object().shape({
  firstRunner: Yup.object().shape({
    name: Yup.string().required('Name is required'),
    age: Yup.number().required('Age is required'),
  }),
  secondRunner: Yup.object().shape({
    name: Yup.string().required('Name is required'),
    age: Yup.number().required('Age is required'),
  }),
});

const videoSchema = Yup.object().shape({
  url: Yup.string().url('Invalid URL format').required('URL is required'),
});

export default function Challengeday() {
  const { t } = useTranslation();
  const [challenges, setChallenges] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [videoPage, setVideoPage] = useState(1);
  const [totalChallengePages, setTotalChallengePages] = useState(1);
  const [totalVideoPages, setTotalVideoPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const [firstRunnerTimer, setFirstRunnerTimer] = useState({ hours: 0, minutes: 0, seconds: 0, steps: 0 });
  const [secondRunnerTimer, setSecondRunnerTimer] = useState({ hours: 0, minutes: 0, seconds: 0, steps: 0 });

  const [firstRunnerRunning, setFirstRunnerRunning] = useState(false);
  const [secondRunnerRunning, setSecondRunnerRunning] = useState(false);

  const [firstRunnerDisabled, setFirstRunnerDisabled] = useState(true);
  const [secondRunnerDisabled, setSecondRunnerDisabled] = useState(true);

  useEffect(() => {
    fetchChallenges(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchVideos(videoPage);
  }, [videoPage]);

  useEffect(() => {
    let interval;
    if (firstRunnerRunning) {
      interval = setInterval(() => {
        setFirstRunnerTimer(prev => ({
          hours: prev.minutes >= 59 && prev.seconds >= 59 ? prev.hours + 1 : prev.hours,
          minutes: prev.seconds >= 59 ? (prev.minutes + 1) % 60 : prev.minutes,
          seconds: (prev.seconds + 1) % 60,
          steps: prev.steps + (prev.seconds % 3 === 0 ? 1 : 0),
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [firstRunnerRunning]);

  useEffect(() => {
    let interval;
    if (secondRunnerRunning) {
      interval = setInterval(() => {
        setSecondRunnerTimer(prev => ({
          hours: prev.minutes >= 59 && prev.seconds >= 59 ? prev.hours + 1 : prev.hours,
          minutes: prev.seconds >= 59 ? (prev.minutes + 1) % 60 : prev.minutes,
          seconds: (prev.seconds + 1) % 60,
          steps: prev.steps + (prev.seconds % 3 === 0 ? 1 : 0),
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [secondRunnerRunning]);

  const fetchChallenges = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`https://sportify-kids-backend.vercel.app/api/challengeday/challenges?page=${page}`);
      setChallenges(res.data.challenges);
      setTotalChallengePages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (error) {
      console.error("Failed to fetch challenges", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async (page = 1) => {
    setVideoLoading(true);
    try {
      const res = await axios.get(`https://sportify-kids-backend.vercel.app/api/challengeday/videos?page=${page}`);
      setVideos(res.data.videos);
      setTotalVideoPages(res.data.totalPages);
      setVideoPage(res.data.currentPage);
    } catch (error) {
      console.error("Failed to fetch videos", error);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleChallengeSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      await axios.post('https://sportify-kids-backend.vercel.app/api/challengeday/challenges', {
        firstRunner: { ...values.firstRunner, steps: firstRunnerTimer.steps, time: `${firstRunnerTimer.hours}:${firstRunnerTimer.minutes}:${firstRunnerTimer.seconds}` },
        secondRunner: { ...values.secondRunner, steps: secondRunnerTimer.steps, time: `${secondRunnerTimer.hours}:${secondRunnerTimer.minutes}:${secondRunnerTimer.seconds}` }
      });
      fetchChallenges(currentPage);
      resetForm();
      setFirstRunnerTimer({ hours: 0, minutes: 0, seconds: 0, steps: 0 });
      setSecondRunnerTimer({ hours: 0, minutes: 0, seconds: 0, steps: 0 });
      setFirstRunnerRunning(false);
      setSecondRunnerRunning(false);
    } catch (error) {
      console.error("Failed to submit challenge", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSubmit = async (values, { resetForm }) => {
    setVideoLoading(true);
    try {
      await axios.post('https://sportify-kids-backend.vercel.app/api/challengeday/videos', values);
      fetchVideos(videoPage);
      resetForm();
      setUploadError(null);
    } catch (error) {
      setUploadError(t('uploadError'));
    } finally {
      setVideoLoading(false);
    }
  };

  const formatTime = (timer) => `${String(timer.hours).padStart(2, '0')}:${String(timer.minutes).padStart(2, '0')}:${String(timer.seconds).padStart(2, '0')}`;

  // Check if today is Saturday
  const isSaturday = new Date().getDay() === 5; // 6 represents Saturday

  return (
    <Container>
          <Helmet>
          <title>challengeday - تحدي اليوم</title>
          <meta name="description" content="موقع ترفيهي وتعليمي يشجع الأطفال على ممارسة الرياضة" />
        </Helmet>
      <h2 className="text-center my-5 py-5">{t('challengeDay')}</h2>
      {!isSaturday && (
       <div className='mt-5'>
        <Alert variant="warning fs-3 my-5 py-5" className='d-flex justify-content-center align-item-center h-100'>
          {t('This page is only accessible on Friday.')} 🗓️
        </Alert>
       </div>
        
      )}
      {isSaturday && (
        <>
          <Formik
            initialValues={{
              firstRunner: { name: '', age: '' },
              secondRunner: { name: '', age: '' },
            }}
            validationSchema={challengeSchema}
            onSubmit={handleChallengeSubmit}
            validate={(values) => {
              setFirstRunnerDisabled(!values.firstRunner.name || !values.firstRunner.age);
              setSecondRunnerDisabled(!values.secondRunner.name || !values.secondRunner.age);
            }}
          >
            {() => (
              <Form>
                <Row>
                  <Col>
                    <h4>{t('firstRunner')}</h4>
                    <Field name="firstRunner.name" placeholder={t('name')} className="form-control" />
                    <ErrorMessage name="firstRunner.name" component="div" className="text-danger" />
                    <Field name="firstRunner.age" placeholder={t('age')} type="number" className="form-control mt-2" />
                    <ErrorMessage name="firstRunner.age" component="div" className="text-danger" />
                    <div className="mt-3">
                      <div>{t('timechallenge')}: {formatTime(firstRunnerTimer)}</div>
                      <div>{t('steps')}: {firstRunnerTimer.steps}</div>
                      <Button variant="primary" onClick={() => setFirstRunnerRunning(!firstRunnerRunning)} disabled={firstRunnerDisabled}>
                        {firstRunnerRunning ? t('stop') : t('start')}
                      </Button>
                    </div>
                  </Col>
                  <Col>
                    <h4>{t('secondRunner')}</h4>
                    <Field name="secondRunner.name" placeholder={t('name')} className="form-control" />
                    <ErrorMessage name="secondRunner.name" component="div" className="text-danger" />
                    <Field name="secondRunner.age" placeholder={t('age')} type="number" className="form-control mt-2" />
                    <ErrorMessage name="secondRunner.age" component="div" className="text-danger" />
                    <div className="mt-3">
                      <div>{t('timechallenge')}: {formatTime(secondRunnerTimer)}</div>
                      <div>{t('steps')}: {secondRunnerTimer.steps}</div>
                      <Button variant="primary" onClick={() => setSecondRunnerRunning(!secondRunnerRunning)} disabled={secondRunnerDisabled}>
                        {secondRunnerRunning ? t('stop') : t('start')}
                      </Button>
                    </div>
                  </Col>
                </Row>
                <Button type="submit" className="btn btn-success mt-4" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : t('submitChallenge')}
                </Button>
              </Form>
            )}
          </Formik>

          <h4 className="mt-5">{t('challenges')}</h4>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>{t('date')}</th>
                  <th>{t('firstRunner')}</th>
                  <th>{t('secondRunner')}</th>
                </tr>
              </thead>
              <tbody>
                {challenges.map((challenge, index) => (
                  <tr key={index}>
                    <td>{new Date(challenge.date).toLocaleDateString()}</td>
                    <td>{challenge.firstRunner.name} - {t('age')}: {challenge.firstRunner.age} - {t('steps')}: {challenge.firstRunner.steps} - {t('timechallenge')}: {challenge.firstRunner.time}</td>
                    <td>{challenge.secondRunner.name} - {t('age')}: {challenge.secondRunner.age} - {t('steps')}: {challenge.secondRunner.steps} - {t('timechallenge')}: {challenge.secondRunner.time}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <Pagination className="justify-content-center mt-4">
            <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
            {[...Array(totalChallengePages)].map((_, index) => (
              <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalChallengePages))} disabled={currentPage === totalChallengePages} />
          </Pagination>
          <h3>{t('uploadVideo')}</h3>
          <Formik
            initialValues={{ url: '' }}
            validationSchema={videoSchema}
            onSubmit={handleVideoSubmit}
          >
            {() => (
              <Form>
                <Field name="url" placeholder={t('videoUrl')} className="form-control" />
                <ErrorMessage name="url" component="div" className="text-danger" />
                <Button type="submit" className="btn btn-primary mt-2" disabled={videoLoading}>
                  {videoLoading ? <Spinner animation="border" size="sm" /> : t('upload')}
                </Button>
                {uploadError && <Alert variant="danger" className="mt-2">{uploadError}</Alert>}
              </Form>
            )}
          </Formik>
          <h4 className="mt-5">{t('videos')}</h4>
          {videoLoading ? (
            <Spinner animation="border" />
          ) : (
            <Row>
              {videos.length > 0 ? (
                videos.map((video, index) => (
                  <Col md={4} key={index} className="mb-4">
                    <ReactPlayer url={video.url} controls width="100%" />
                  </Col>
                ))
              ) : (
                <Alert variant="warning">{t('noVideos')}</Alert>
              )}
            </Row>
          )}

          <Pagination className="justify-content-center mt-4">
            <Pagination.Prev onClick={() => setVideoPage((prev) => Math.max(prev - 1, 1))} disabled={videoPage === 1} />
            {[...Array(totalVideoPages)].map((_, index) => (
              <Pagination.Item key={index} active={index + 1 === videoPage} onClick={() => setVideoPage(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setVideoPage((prev) => Math.min(prev + 1, totalVideoPages))} disabled={videoPage === totalVideoPages} />
          </Pagination>
        </>
      )}
    </Container>
  );
}

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, Form as BootstrapForm, Alert, Container, Row, Col, Pagination } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './Childdata.css';
import { Helmet } from 'react-helmet';

// التحقق من البيانات باستخدام Yup
const ChildSchema = Yup.object().shape({
  name: Yup.string().required('الاسم مطلوب'),
  age: Yup.number().min(1, 'العمر يجب أن يكون أكبر من 0').required('العمر مطلوب'),
});

export default function Childdata() {
  const { t, i18n } = useTranslation();
  const [countdown, setCountdown] = useState(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [childrenData, setChildrenData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);



  const startTraining = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setCountdown(null);
          setIsTraining(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    let timer;
    if (isTraining) {
      timer = setInterval(() => {
        setSeconds((prev) => (prev + 1) % 60);
        if (seconds === 59) {
          setMinutes((prev) => (prev + 1) % 60);
          if (minutes === 59 && seconds === 59) setHours((prev) => prev + 1);
        }
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isTraining, seconds]);

  const stopTraining = async (values, resetForm) => {
    setIsTraining(false);

    try {
      const response = await axios.post('https://sportify-kids-backend.vercel.app/api/childrendata/addchildren', {
        ...values,
        trainingDuration: { hours, minutes, seconds },
      });
      setMessage(t('message.added_successfully'));
      resetForm();
      setShowCelebration(true);

      setTimeout(() => setShowCelebration(false), 2000);
      setTimeout(() => setMessage(''), 3000);

      fetchChildrenData(page);
    } catch (error) {
      setMessage(t('message.add_error'));
      setTimeout(() => setMessage(''), 3000);
    }
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const fetchChildrenData = async (currentPage = 1) => {
    try {
      const response = await axios.get(`https://sportify-kids-backend.vercel.app/api/childrendata/getchildrens?page=${currentPage}`);
      setChildrenData(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      setMessage(t('message.fetch_error'));
      setTimeout(() => setMessage(''), 3000);
    }
  };

  useEffect(() => {
    fetchChildrenData(page);
  }, [page]);

  return (
    <Container>
          <Helmet>
          <title>childdata - بيانات الاطفال</title>
          <meta name="description" content="موقع ترفيهي وتعليمي يشجع الأطفال على ممارسة الرياضة" />
        </Helmet>
      {showCelebration && <div className="streamers">🎉🎉 {t('celebration_message')} 🎉🎉</div>}
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <h2 className="my-3 text-center">{t('titledata.register_activity')}</h2>
          {message && <Alert variant="info">{message}</Alert>}
          <Formik
            initialValues={{ name: '', age: '' }}
            validationSchema={ChildSchema}
            onSubmit={(values, { resetForm }) => {
              if (!isTraining) startTraining();
              else stopTraining(values, resetForm);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <BootstrapForm.Group controlId="name">
                  <BootstrapForm.Label>{t('form.name')}</BootstrapForm.Label>
                  <Field name="name" className="form-control" />
                  {errors.name && touched.name ? <div className="text-danger">{errors.name}</div> : null}
                </BootstrapForm.Group>

                <BootstrapForm.Group controlId="age">
                  <BootstrapForm.Label>{t('form.age')}</BootstrapForm.Label>
                  <Field name="age" type="number" className="form-control" />
                  {errors.age && touched.age ? <div className="text-danger">{errors.age}</div> : null}
                </BootstrapForm.Group>

                <div className="text-center">
                  <Button variant={isTraining ? 'danger' : 'primary'} type="submit" className="my-3">
                    {isTraining ? t('button.stop') : t('button.start_training')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          {countdown !== null && <h3 className="mt-3">{t('countdown')} : {countdown}</h3>}
          {isTraining && (
            <h5 className="mt-3">
              {t('training_duration')}: {hours} {t('time.hours')} {minutes} {t('time.minutes')} {seconds} {t('time.seconds')}
            </h5>
          )}
        </Col>
      </Row>

      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <h2>{t('titledata.child_data')}</h2>
          <Row>
            {childrenData.map((child, index) => (
              <Col key={index} md={4} sm={12} className="p-3">
                <div className="p-3 border rounded">
                  <h5>{t('form.name')}: {child.name}</h5>
                  <p>{t('form.age')}: {child.age}</p>
                  <p>
                    {t('training_duration')}: {child.trainingDuration.hours} {t('time.hours')} {child.trainingDuration.minutes} {t('time.minutes')} {child.trainingDuration.seconds} {t('time.seconds')}
                  </p>
                  <p>{t('status')}: {child.status}</p>
                </div>
              </Col>
            ))}
          </Row>

          <Pagination className="justify-content-center mt-3">
            <Pagination.Prev onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} />
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item key={i} active={i + 1 === page} onClick={() => setPage(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages} />
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
}

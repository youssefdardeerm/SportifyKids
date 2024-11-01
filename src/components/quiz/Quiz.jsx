// src/Quiz.jsx
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Quiz.css';
import questions from '../../data/questions.js';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function Quiz() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setFinalScore(0);
    setShowResult(false);
  };

  const handleAnswerSelect = (index) => {
    if (answers[currentQuestionIndex] === undefined) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = index;
      setAnswers(newAnswers);

      if (index === questions[currentQuestionIndex].correct) {
        setCorrectAnswers((prev) => prev + 1);
      } else {
        setIncorrectAnswers((prev) => prev + 1);
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        const score = correctAnswers + (index === questions[currentQuestionIndex].correct ? 1 : 0);
        setFinalScore(score);
        setShowResult(true);

        // إرسال البيانات بعد انتهاء الأسئلة
        const quizData = {
          name,
          age,
          correctAnswers: correctAnswers + (index === questions[currentQuestionIndex].correct ? 1 : 0),
          incorrectAnswers: incorrectAnswers + (index !== questions[currentQuestionIndex].correct ? 1 : 0),
          finalScore: score,
        };

        axios.post('https://sportify-kids-backend.vercel.app/api/quiz', quizData)
          .then(response => console.log('Data sent successfully', response.data))
          .catch(error => console.error('Error sending data', error));
      }
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: "600px" }}>
      <h1 className="text-center">{t('quizTitle')}</h1>

      {!quizStarted && (
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>{t('contestantName')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('enterName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formAge">
            <Form.Label>{t('contestantAge')}</Form.Label>
            <Form.Control
              type="number"
              placeholder={t('enterAge')}
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Form.Group>

          <Button
            variant={quizStarted ? "success" : "primary"}
            onClick={handleStartQuiz}
            disabled={!name || !age}
            className="my-3"
          >
            {t('startQuiz')}
          </Button>
        </Form>
      )}

      {quizStarted && !showResult && (
        <div className="my-4">
          <h5>{questions[currentQuestionIndex].question}</h5>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <Button
              key={index}
              variant="outline-primary"
              className="me-2 my-2"
              onClick={() => handleAnswerSelect(index)}
              disabled={answers[currentQuestionIndex] !== undefined}
            >
              {option}
            </Button>
          ))}
        </div>
      )}

      {showResult && (
        <div className="my-4">
          <Alert variant="info">
            <strong>{t('contestantName')}:</strong> {name}<br />
            <strong>{t('age')}:</strong> {age}<br />
            <strong>{t('correctAnswers')}:</strong> {correctAnswers}<br />
            <strong>{t('incorrectAnswers')}:</strong> {incorrectAnswers}<br />
            <strong>{t('finalScore')}:</strong> {finalScore} {t('outOf')} 30
          </Alert>
          <h5>
            {finalScore > 20
              ? t('likeAli')
              : finalScore > 15
              ? t('likeSalah')
              : finalScore > 10
              ? t('likeBenzema')
              : finalScore > 5
              ? t('likeMbappe')
              : t('betterLuck')}
          </h5>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Typography, message, Card, Row, Col, Switch } from 'antd';
import axios from 'axios';
import './PredictImpression.css'; // Import the external CSS

const { Title, Paragraph } = Typography;

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
  };
}

const PredictImpression: React.FC = () => {
  const [impression, setImpression] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [randomImage, setRandomImage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Dark mode by default

  useEffect(() => {
    fetch(
      'https://api.unsplash.com/search/photos?page=1&query=social-media&client_id=pjRveTX4WeHbNgPOzshXx2y4uw2kl65hoG5HkKqn-1w'
    )
      .then((response) => response.json())
      .then((data) => {
        setImages(data.results);
        if (data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          setRandomImage(data.results[randomIndex].urls.regular);
        }
      })
      .catch((error) => console.error('Error fetching images:', error));
  }, []);

  const handleThemeSwitch = (checked: boolean) => {
    setIsDarkMode(checked);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('https://instagram-reach-analysis.onrender.com/predict', {
        likes: values.likes,
        saves: values.saves,
        comments: values.comments,
        shares: values.shares,
        profile_visits: values.profileVisits,
        follows: values.follows,
      });
      setImpression(response.data.impression);
      message.success('Prediction successful!');
    } catch (error) {
      message.error('Error predicting impression');
      setImpression(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`predict-impression-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`} // Use CSS classes for styling
      style={{ backgroundImage: randomImage ? `url(${randomImage})` : 'none' }}
    >
      <Card className="predict-impression-card">
        <Row justify="space-between">
          <Col>
          <div className="header">
    <Title className="header-title" level={2}>
      <span className="header-icon" role="img" aria-label="star">⭐</span>
      Predict Impressions
    </Title>
  </div>
          </Col>
          <Col>
            <Switch
              checkedChildren="Dark"
              unCheckedChildren="Light"
              defaultChecked={isDarkMode}
              onChange={handleThemeSwitch}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]} justify="center">
          {/* Left Column - Input Form */}
          <Col xs={24} md={12}>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item label="Likes" name="likes" rules={[{ required: true, message: 'Please input the number of likes!' }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Saves" name="saves" rules={[{ required: true, message: 'Please input the number of saves!' }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label="Comments"
                name="comments"
                rules={[{ required: true, message: 'Please input the number of comments!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Shares" name="shares" rules={[{ required: true, message: 'Please input the number of shares!' }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label="Profile Visits"
                name="profileVisits"
                rules={[{ required: true, message: 'Please input the number of profile visits!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Follows" name="follows" rules={[{ required: true, message: 'Please input the number of follows!' }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Predict
                </Button>
              </Form.Item>
            </Form>
          </Col>

          {/* Right Column - Predicted Impression */}
          <Col span={12} className="impression-result-container">
            {impression !== null ? (
              <div className="animated-impression">
                <Title className="impression-value" level={1}>
                  {impression} <span role="img" aria-label="celebrate">🎉</span>
                </Title>
                <Title className="impression-label" level={4}>
                  Predicted Impressions
                </Title>
                <Paragraph className="impression-explanation">
                  Based on your inputs: <br />
                  <span role="img" aria-label="thumbs-up">👍</span> Likes, <span role="img" aria-label="bookmark">🔖</span> Saves, <span role="img" aria-label="comment">💬</span> Comments, <span role="img" aria-label="share">🔗</span> Shares, 
                  <span role="img" aria-label="eye">👁</span> Profile Visits, and <span role="img" aria-label="follow">➕</span> Follows, <br />
                  we predict this will be your reach on Instagram!
                </Paragraph>
              </div>
            ) : (
              <Title className="no-prediction-text" level={3}>
                No prediction yet <span role="img" aria-label="thinking">🤔</span>
              </Title>
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PredictImpression;

import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Typography, message, Card, Row, Col, Switch } from 'antd';
import axios from 'axios';
import './PredictImpression.css'; // Import CSS for custom animations

const { Title } = Typography;

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
      style={{
        backgroundImage: randomImage ? `url(${randomImage})` : 'none',
        backgroundColor: isDarkMode ? '#121212' : '#f0f0f0', // Dark or light background
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        color: isDarkMode ? 'white' : 'black', // White text in dark mode, black in light mode
      }}
    >
      <Card
        style={{
          width: '80%',
          padding: '20px',
          borderRadius: '15px',
          backgroundColor: isDarkMode ? '#19222B' : '#ccc',
          backdropFilter: isDarkMode ? 'blur(10px)' : 'none',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Row justify="space-between">
          <Col>
            <Title level={2} style={{ color: isDarkMode ? 'white' : 'black' }}>
              Predict Impressions
            </Title>
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
        <Row gutter={32}>
          {/* Left Column - Input Form */}
          <Col span={12}>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label={<span style={{ color: isDarkMode ? 'white' : 'black' }}>Likes</span>}
                name="likes"
                rules={[{ required: true, message: 'Please input the number of likes!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label={<span style={{ color: isDarkMode ? 'white' : 'black' }}>Saves</span>}
                name="saves"
                rules={[{ required: true, message: 'Please input the number of saves!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label={<span style={{ color: isDarkMode ? 'white' : 'black' }}>Comments</span>}
                name="comments"
                rules={[{ required: true, message: 'Please input the number of comments!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label={<span style={{ color: isDarkMode ? 'white' : 'black' }}>Shares</span>}
                name="shares"
                rules={[{ required: true, message: 'Please input the number of shares!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label={<span style={{ color: isDarkMode ? 'white' : 'black' }}>Profile Visits</span>}
                name="profileVisits"
                rules={[{ required: true, message: 'Please input the number of profile visits!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                label={<span style={{ color: isDarkMode ? 'white' : 'black' }}>Follows</span>}
                name="follows"
                rules={[{ required: true, message: 'Please input the number of follows!' }]}
              >
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
          <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {impression !== null ? (
              <div
                className="animated-impression" // Apply the animation
                style={{
                  textAlign: 'center',
                  backgroundColor: isDarkMode ? '#1f1f1f' : '#fafafa',
                  padding: '30px',
                  borderRadius: '15px',
                  width: '100%',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                  color: isDarkMode ? 'white' : 'black',
                }}
              >
                <Title level={1} style={{ fontSize: '60px', color: '#00e676' }}>
                  {impression}
                </Title>
                <Title level={4} style={{ marginTop: '10px', color: isDarkMode ? 'white' : 'black' }}>
                  Predicted Impression
                </Title>
              </div>
            ) : (
              <Title level={3} style={{ textAlign: 'center', color: isDarkMode ? '#888' : '#444' }}>
                No prediction yet
              </Title>
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PredictImpression;

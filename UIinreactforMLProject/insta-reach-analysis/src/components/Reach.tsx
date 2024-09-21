import React, { useState } from 'react';
import { Form, InputNumber, Button, Typography, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const PredictImpression: React.FC = () => {
  const [impression, setImpression] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/predict', {
        likes: values.likes,
        saves: values.saves,
        comments: values.comments,
        shares: values.shares,
        profile_visits: values.profileVisits,
        follows: values.follows
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
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <Title level={2}>Predict Impressions</Title>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item label="Likes" name="likes" rules={[{ required: true, message: 'Please input the number of likes!' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Saves" name="saves" rules={[{ required: true, message: 'Please input the number of saves!' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Comments" name="comments" rules={[{ required: true, message: 'Please input the number of comments!' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Shares" name="shares" rules={[{ required: true, message: 'Please input the number of shares!' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Profile Visits" name="profileVisits" rules={[{ required: true, message: 'Please input the number of profile visits!' }]}>
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

      {impression !== null && (
        <Title level={3}>Predicted Impression: {impression}</Title>
      )}
    </div>
  );
};

export default PredictImpression;

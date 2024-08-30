import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Image, Input, Row, message } from 'antd';
import { EditFilled, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import axios from 'axios'; // Import Axios to make HTTP requests
import cover from '../pages/cover.png';

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  console.log("Token:", localStorage.getItem('token'));

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
        const token = localStorage.getItem('token');
if (!token) {
  message.error('No authentication token found. Please log in again.');
  return;
}
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users/get_profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        console.log("profile",response.data);
        
        form.setFieldsValue(response.data); // Populate form with user data
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        message.error('Failed to load profile data.');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [form]);

  // Handle form submission to update profile
  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.put('http://127.0.0.1:8000/api/users/edit_profile/', values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      message.success('Profile updated successfully.');
      setTimeout(() => {
        window.location.href = '/profile';
      }, 2000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      message.error('Failed to update profile.');
    }
  };

  return (
    <div style={{ margin: 0, backgroundColor: 'white' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={8}>
          {/* Profile Picture Card */}
          {
            userData && (
                <Card style={{ display: 'flex', flexDirection: 'column' }}>
                <Form layout="vertical" className="ant-advanced-search-form">
                  <Row gutter={24}>
                    <Col xs={24}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <Image
                          preview={false}
                          width="100%"
                          height={150}
                          style={{ borderRadius: 8 }}
                          src={cover}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: -50 }}>
                          <Image
                            preview={false}
                            width={150}
                            height={150}
                            style={{ borderRadius: 80, borderColor: '#bd0402', border: 'solid 5px #bd0402' }}
                            src="https://wallpapers.com/images/hd/tanjiro-pfp-fanart-m7948nta0dowve8r.jpg"
                          />
                          {/* <p className='profile-text-bold'>
                            Edit photo <EditFilled style={{ color: '#bd0402' }} />
                          </p> */}
                          <p className='profile-text'>{userData?.username ? userData.username.toUpperCase() : 'N/A'}</p>
                          <p className='profile-text-italic'><MailOutlined /> {userData.email}</p>
                          <p className='profile-text-italic'><PhoneOutlined /> {userData.phone} +33 07 6074 1111</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Form>
                <br />
              </Card>
            )
          }
         
        </Col>
        <Col xs={24} sm={24} md={16}>
          {/* General Information Card */}
          <Card style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
            <h3>General informations</h3>
            <br />
            <Form
              form={form}
              layout="vertical"
              className="ant-advanced-search-form"
              onFinish={handleFormSubmit}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item required label="First name" name="first_name">
                    <Input placeholder="First name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item required label="Last name" name="last_name">
                    <Input placeholder="Last name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item required label="Email" name="email">
                    <Input placeholder="Email" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} style={{ textAlign: 'right' }}>
                  <Button style={{ backgroundColor: '#bd0402', color: 'white', borderColor: '#bd0402' }}
                   htmlType="submit">
                    Save
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={() => form.resetFields()}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Profile;

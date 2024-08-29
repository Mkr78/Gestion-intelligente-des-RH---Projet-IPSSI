import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddRecruiter = () => {
    const navigate = useNavigate();

    const handleSave = async (values) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/users/add_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                console.log('Recruiter saved successfully!');
                navigate(-1);
            } else {
                console.error('Failed to save recruiter:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving recruiter:', error.message);
        }
    };

    const onFinish = (values) => {
        console.log('Received values of form:', values);
        handleSave(values);
    };

    return (
        <div style={{ padding: 20 }}>
            <Col xs={24} sm={24} md={16}>
                <Card style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3>Add Recruiter</h3>
                        <h4 onClick={() => navigate(-1)} style={{ color: "red", cursor: 'pointer' }}>
                            <ArrowLeftOutlined /> Return
                        </h4>
                    </div>
                    <br />
                    <Form layout="vertical" className="ant-advanced-search-form" onFinish={onFinish}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter the email' }]}>
                                    <Input placeholder="Email" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please enter the username' }]}>
                                    <Input placeholder="Username" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: 'Please enter the first name' }]}>
                                    <Input placeholder="First Name" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: 'Please enter the last name' }]}>
                                    <Input placeholder="Last Name" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={24} style={{ textAlign: 'right' }}>
                                <Button className="custom-button" htmlType="submit">
                                    Save
                                </Button>
                                <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Col>
        </div>
    );
};

export default AddRecruiter;

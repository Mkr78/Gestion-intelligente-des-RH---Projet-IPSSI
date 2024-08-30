import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const UpdateCandidate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm(); // Use form instance
    const location = useLocation();
    const { initialValues } = location.state || {};

    const handleSave = async (values) => {
        try {
            // Omit the password field if it's not provided
            const { password, ...updatedValues } = values;
            const response = await fetch(`http://127.0.0.1:8000/api/users/${id}/update_recruiter/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedValues), // Send updated values without the password if not provided
            });

            if (response.ok) {
                Swal.fire('Success!', 'Recruiter updated successfully!', 'success');
                navigate(-1); 
            } else {
                const errorData = await response.json();
                Swal.fire('Error!', `Failed to update recruiter: ${errorData.non_field_errors ? errorData.non_field_errors.join(', ') : response.statusText}`, 'error');
            }
        } catch (error) {
            Swal.fire('Error!', `Error updating recruiter: ${error.message}`, 'error');
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
                        <h3>Update Candidate</h3>
                        <h4 onClick={() => navigate(-1)} style={{ color: 'red', cursor: 'pointer' }}>
                            <ArrowLeftOutlined /> Return
                        </h4>
                    </div>
                    <br />
                    <Form
                        form={form}
                        layout="vertical"
                        className="ant-advanced-search-form"
                        onFinish={onFinish}
                        initialValues={initialValues}
                    >
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

export default UpdateCandidate;

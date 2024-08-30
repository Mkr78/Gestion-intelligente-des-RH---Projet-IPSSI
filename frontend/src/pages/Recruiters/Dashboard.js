import { Button, Card, Table, Modal, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import './styles.css';
import { DeleteOutlined, EditOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const style = {
    backgroundColor: 'white',
    color: '#bb3493',
    fontSize: 16,
    fontWeight: 'bold',
}

const Dashboard = () => {

    const [recruiters, setRecruiters] = useState([]);
    const [selectedRecruiter, setSelectedRecruiter] = useState();
    const [recruiterToDelete, setRecruiterToDelete] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecruiters = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/users/get_recruiters');
                setRecruiters(response.data);
                console.log("Recruiters:", response.data);
            } catch (error) {
                console.error('Error fetching recruiters:', error);
            }
        };

        fetchRecruiters();
    }, []);

    const handleOpenChange = (visible) => {
        setOpen(visible);
    };

    const handleViewRecruiter = (recruiter) => {
        setSelectedRecruiter(recruiter);
        setOpen(true);
    };
    const handleDeleteRecruiter = async (id) => {
        if (!id) {
            console.error('ID is undefined');
            return;
        }
        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/${id}/`);
            setRecruiters(recruiters.filter(recruiter => recruiter.id !== id));
            setModalVisible(false);
        } catch (error) {
            console.error('Error deleting recruiter:', error);
        }
    };

    const handleEditRecruiter = (record) => {
        navigate(`/updaterecruiter/${record.id}`, { state: { initialValues: record } });
    };

    const columns = [
        {
            title: <span className="custom-table-span-column">Username</span>,
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: <span className="custom-table-span-column">First Name</span>,
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: <span className="custom-table-span-column">Last Name</span>,
            dataIndex: 'last_name',
            key: 'last_name',
            render: (text) => <span>{text}</span>,
            className: 'custom-column',
        },
        {
            title: <span className="custom-table-span-column">Email</span>,
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: <span className="custom-table-span-column">Actions</span>,
            key: 'actions',
            render: (text, record) => {
                console.log('Record for actions:', record);  // Debugging line
                return (
                    <span>
                        <EyeOutlined onClick={() => handleViewRecruiter(record)} style={{ color: 'black', fontSize: 18, marginRight: 8, cursor: 'pointer' }} />
                        <DeleteOutlined onClick={() => { setRecruiterToDelete(record); setModalVisible(true); }} style={{ color: 'black', fontSize: 18, marginRight: 8, cursor: 'pointer' }} />
                        <EditOutlined onClick={() => handleEditRecruiter(record)} style={{ color: 'orange', fontSize: 18, cursor: 'pointer' }} />
                    </span>
                );
            },
        },
    ];

    return (
        <div>
            <div style={{ padding: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '77%' }}>
                    <h2>Recruiters Overview</h2>
                    <Modal
                        centered
                        open={open}
                        onOk={() => setOpen(false)}
                        onCancel={() => setOpen(false)}
                        width={1000}
                    >
                        <h3 style={{ marginBottom: 15, color: 'black' }}>Recruiter Details</h3>
                        {selectedRecruiter ? (
                            <div>
                                <p><strong>Username:</strong> {selectedRecruiter.username}</p>
                                <p><strong>First Name:</strong> {selectedRecruiter.first_name}</p>
                                <p><strong>Last Name:</strong> {selectedRecruiter.last_name}</p>
                                <p><strong>Email:</strong> {selectedRecruiter.email}</p>
                            </div>
                        ) : (
                            <p>No Recruiter selected</p>
                        )}
                    </Modal>
                    <Modal
                        title="Confirm Deletion"
                        centered
                        open={modalVisible}
                        onOk={() => handleDeleteRecruiter(recruiterToDelete.id)}
                        onCancel={() => setModalVisible(false)}
                    >
                        <p>Are you sure you want to delete this recruiter?</p>
                    </Modal>
                </div>
            </div>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24}>
                    <div style={{ display: 'flex' }}>
                        <Card className='custom-card-clients-overview'>
                            <p className='title-card'>Total Recruiters</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '250px' }}>
                                <p className='content-card'>{recruiters.length}</p>
                                <div className='circle-icon'>
                                    <UserOutlined style={{ fontSize: 24, color: 'black' }} />
                                </div>
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xs={24} sm={24} md={16} style={{ width: 1200 }}>
                    <div style={{ display: 'flex', justifyContent: 'end', minWidth: 1200 }}>
                        <Button onClick={() => navigate('/add_recruiter')} className="custom-button-add-product">
                            Add New Recruiter
                        </Button>
                    </div>
                    <Table style={{ width: '100%', minWidth: 1200 }} columns={columns} dataSource={recruiters} />
                </Col>
            </Row>
        </div>
    );
}

export default Dashboard;

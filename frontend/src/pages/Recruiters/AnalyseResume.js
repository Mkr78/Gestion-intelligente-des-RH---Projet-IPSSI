import React, { useEffect, useRef, useState } from 'react';
import { FileExcelFilled, FileDoneOutlined } from '@ant-design/icons';
import { Button, Card, Input, Progress, Spin, Table, Tabs, Tag, Upload, message } from 'antd';
import './importcsv.css';
import { green, red, orange } from '@ant-design/colors';

const { Dragger } = Upload;
const { TabPane } = Tabs;

const AnalyseResume = () => {
  const [fileList, setFileList] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [spinnerval, setSpinnerval] = useState(0);
  const [cards, setCards] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
  });
  const [showButton, setShowButton] = useState(false);
  const containerRef = useRef(null);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 5) { 
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleFileChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    setFileList(info.fileList);
  };

  const showLoader = () => {
    setSpinning(true);
    let ptg = -10;
    const interval = setInterval(() => {
      ptg += 5;
      setSpinnerval(ptg);
      if (ptg > 120) {
        clearInterval(interval);
        setSpinning(false);
        setSpinnerval(0);
      }
    }, 100);
  };

  const handleSubmit = () => {
    showLoader();
    setTimeout(() => {
      // Simulated card data for the analysis of CV
      const newCard = {
        candidateName: 'John Doe',
        score: 8,
        risk: 'High',
        skillsTable: [{ Skill: 'Skill1', Proficiency: 'High', Type: 'Technical' }],
        recommendations: 'Recommendation text for the candidate'
      };
      setCards((prevCards) => [...prevCards, newCard]);
    }, 3000);
  };

  const columns = [
    { title: 'Skill', dataIndex: 'Skill' },
    { title: 'Proficiency', dataIndex: 'Proficiency' },
    { title: 'Type', dataIndex: 'Type' },
  ];

  const renderCard = (card) => {
    const steps = 8;
    const percent = (card.score / steps) * 100;

    const items = [
      {
        key: '2',
        label: 'Score level',
        children: (
          <div>
            <p style={{ fontFamily: 'Poppins', fontSize: 16, color: '#bb3493' }}>Results :</p>
            <Progress
              percent={percent}
              steps={steps}
              strokeColor={[green[6], green[4], green[3], orange[5], orange[4], orange[3], red[3], red[4], red[5], red[6]]}
              format={() => <span style={{ color: 'black', fontWeight: '600', fontFamily: 'Poppins' }}>{card.score}</span>}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontFamily: 'Poppins', fontSize: 16 }}>
                Candidate <span style={{ fontWeight: 'bold', color: '#4f3971' }}>{card.candidateName}</span><span> has a score of {card.score}</span>.
              </p>
            </div>
            <p style={{ fontFamily: 'Poppins', fontSize: 16, color: '#bb3493' }}>Recommendations :<br/> <Tag color='volcano' style={{color:'black',fontWeight:'300'}}>{card.recommendations} .</Tag></p>
          </div>
        ),
      },
      {
        key: '1',
        label: 'Skills',
        children: (
          <Table
            style={{ width: 500 }}
            columns={columns}
            dataSource={card.skillsTable}
            size="small"
            pagination={{ pageSize: 5 }}
          />
        ),
      }
    ];
    return (
      <div>
        <Card
          bordered={true}
          key={card.candidateName}
          headStyle={{
            backgroundColor: 'white',
            color: '#4f3971',
            fontSize: 16,
            fontWeight: 'bold',
          }}
          title={`Candidate : ${card.candidateName}`}
        >
          <Tabs items={items} defaultActiveKey="0" />
        </Card>
        <br />
      </div>
    );
  };

  return (
    <div style={{ height: 1000 }}>
      <h1 style={{ color: '#bd0402', fontSize: 25 }}>Upload Resume</h1>
      <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
        <Input
          placeholder="Enter candidate details"
          style={{ width: '50%' }}
        />
        <br />
        <Dragger
          name="file"
          multiple={false}
          fileList={fileList}
          customRequest={({ file, onSuccess }) => {
            setTimeout(() => {
              onSuccess('ok');
            }, 0);
          }}
          onChange={handleFileChange}
          onRemove={() => {
            setFileList([]);
          }}
          style={{ width: '100%', borderColor: '#bd0402' }}
        >
          <p className="ant-upload-drag-icon">
            <FileExcelFilled color="#bd0402" style={{ color: '#bd0402' }} />
          </p>
          <p className="ant-upload-text">Select a resume file to import</p>
          <p className="ant-upload-hint">
            or drag and drop it here.
            <br />
            Support for a single upload. Strictly prohibited from uploading company data or other banned files.
          </p>
        </Dragger>
        <br />
        <Button onClick={handleSubmit}>Analyze Resume</Button>
      </div>
      <br />
      <Spin spinning={spinning} percent={spinnerval} fullscreen />
      <div ref={containerRef} style={{ width: '100%', alignSelf: 'center', marginRight: 5, overflowY: 'auto', overflowX: 'hidden', maxHeight: 500 }}>
        {cards.map((card) => renderCard(card))}
        {showButton && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', bottom: '30px', width: '100%', zIndex: 999 }}>
            <Button
              type="primary"
              className="save-button"
              style={{
                backgroundColor: '#4f3971',
                fontFamily: 'Poppins',
                height: 50,
                color: 'white',
                width: '50%',
              }}
            >
              <FileDoneOutlined />
              Save & generate a report
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyseResume;

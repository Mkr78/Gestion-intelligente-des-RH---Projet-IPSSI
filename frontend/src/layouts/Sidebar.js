import React, { useState } from 'react';
import { AppstoreAddOutlined, FacebookFilled, HomeOutlined, InfoCircleOutlined, InstagramFilled, LogoutOutlined, MailOutlined, PhoneOutlined, SettingOutlined, TwitterCircleFilled, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Image, Layout, Menu } from 'antd';
import { useNavigate ,Outlet} from 'react-router-dom';
// import image from '../assets/images/stock_logo.png';
import logo from './logo.png'
const { Header, Content, Footer, Sider } = Layout;

const Sidebar = () => {
  const [open, setOpen] = useState(false);


  const navigate = useNavigate();


  const handleMenuClick = (key) => {
    navigate(`/${key}`);
  };
  const logout=()=>{
    localStorage.clear()
    window.location.href = '/login';
  }
  const user = JSON.parse(localStorage.getItem('user'));


 
  // Profile menu items
  const itemsProfile = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),  // Add the correct route for profile
    },
    {
      key: 'settings',
      label: 'Account settings',
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings'),  // Add the correct route for settings
    },
    {
      key: 'privacypolicy',
      label: 'Privacy policy',
      icon: <InfoCircleOutlined />,
      onClick: () => navigate('/privacy-policy'),  // Add the correct route for privacy policy
    },
    {
      key: 'signout',
      label: 'Sign out',
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.removeItem('token'); // Example logic for sign out
        navigate('/login');
      }
    }
  ];

  // Profile menu for avatar dropdown
  const profileMenu = (
    <Menu>
      {itemsProfile.map((itemP) => (
        <Menu.Item key={itemP.key} onClick={itemP.onClick}>
          {itemP.icon} {itemP.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  // Handlers for drawer visibility
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };


  return (
    <Layout>
      <div style={{backgroundColor: '#bd0402'}}>
      <div style={{ justifyContent: 'space-between', display: 'flex', backgroundColor: '#bd0402', width: '80%', alignSelf: 'center', margin: 'auto' }}>
        {/* first part  */}
        <div style={{ backgroundColor: '#bd0402', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 5 }}>
          <p style={{ textAlign: 'start', margin: 0, color: 'white', fontSize: 14,fontFamily:'revert-layer',marginRight:10 }}> <MailOutlined style={{ fontSize: 14 }} /> contact@email.com</p>
          <br />
          <p style={{ textAlign: 'start', margin: 0, color: 'white', fontSize: 14, marginLeft: 5,fontFamily:'revert-layer'  }}> <PhoneOutlined style={{ fontSize: 14 }} /> +33 07 6074 1111</p>
        </div>
        {/* second part  */}
        <div style={{ backgroundColor: '#bd0402', display: 'flex',justifyContent: 'flex-start', padding: 5 }}>
          <TwitterCircleFilled style={{ marginRight: 10,color:'white', }} />
          <FacebookFilled style={{ marginRight: 10,color:'white' }} />
          <InstagramFilled style={{ marginRight: 5,color:'white' }} />
        </div>
      </div>
      </div>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white' }}>
      <div style={{ display: 'flex', position: 'absolute', right: 50 }}>
      <Dropdown overlay={profileMenu} trigger={['click']}>
        <Avatar
          style={{ backgroundColor: 'white', marginRight: 10, cursor: 'pointer' }}
          icon={<UserOutlined style={{ color: '#bd0402', fontSize: 25 }} />}
        />
      </Dropdown>
    </div>

       <div className="demo-logo" style={{marginTop:30}}>
          <Image src={logo} width={100} preview={false} />
        </div>
        
        {/* <Menu
          mode="horizontal"
          style={{ flex: 1, minWidth: 0, backgroundColor: 'white', marginLeft: 100 }}
        >
          <Menu.Item
            onClick={() => handleMenuClick('dashboard')}
            style={{ fontFamily: 'Poppins' }}
          >
            <HomeOutlined style={{ marginRight: 10 }} />
            Home
          </Menu.Item>
        </Menu> */}
      </Header>

      <Content style={{ padding: '0 0px' }}>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider style={{ background: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} width={250}>
            <Menu
              className="custom-menu"
              mode="inline"
              defaultSelectedKeys={['dashboard']}
              defaultOpenKeys={['dashboard']}
              style={{ height: '100%', marginTop: 25 }}
            >
              {
                user.role === "admin" ?
                <>
                <Menu.Item
                onClick={() => handleMenuClick('dashboard')}
              >
                <AppstoreAddOutlined />
                <span style={{ fontFamily: 'Poppins' }}>List of Recruiters</span>
              </Menu.Item>
              <Menu.Item
              onClick={() => handleMenuClick('candidates')}
            >
              <AppstoreAddOutlined />
              <span style={{ fontFamily: 'Poppins' }}>Liste of candidates</span>
            </Menu.Item>
                </>
              :
              <>
              <Menu.Item
                onClick={() => handleMenuClick('candidates')}
              >
                <AppstoreAddOutlined />
                <span style={{ fontFamily: 'Poppins' }}>Liste of candidates</span>
              </Menu.Item>
              <Menu.Item
              onClick={() => handleMenuClick('analyse_resume')}
            >
              <AppstoreAddOutlined />
              <span style={{ fontFamily: 'Poppins' }}>Analyse resume</span>
            </Menu.Item>
              </>
              }
             
              
              <Menu.Item
                onClick={() => handleMenuClick('upload')}
              >
                <AppstoreAddOutlined />
                <span style={{ fontFamily: 'Poppins' }}>A propos</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content style={{ padding: '24px', minHeight: '100vh',backgroundColor:'white' }}>
            {/* This will render child routes */}
            <Outlet />
          </Content>
        </Layout>  
      </Content>
      <Footer style={{ textAlign: 'center' }}>
      IPSSI ©{new Date().getFullYear()} Created by CHIHAB MEZRIGUI 
      </Footer>
    </Layout>
  );
};

export default Sidebar;
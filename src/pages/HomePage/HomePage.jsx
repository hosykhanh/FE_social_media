import React, { useEffect, useState } from 'react';
import styles from './HomePage.module.scss';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Col, Menu, Row } from 'antd';
import PostFrame from '../../components/PostFrame/PostFrame';
import SliderComponent from '../../components/Slider/Slider';
import { slide } from '../../assets';

const cx = classNames.bind(styles);

const HomePage = () => {
    const user = useSelector((state) => state.user);
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (user?.name) {
            setUsername(user?.name);
        }
    }, [user?.name, username]);

    const items = [
        {
            key: '1',
            icon: user?.avatar ? (
                <Avatar src={user?.avatar} size={30} />
            ) : (
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} size={30} />
            ),
            label: `${username}`,
        },
        {
            key: '2',
            icon: <DesktopOutlined />,
            label: 'Option 2',
        },
        {
            key: '3',
            icon: <ContainerOutlined />,
            label: 'Option 3',
        },
        {
            key: 'sub1',
            label: 'Navigation One',
            icon: <MailOutlined />,
            children: [
                {
                    key: '5',
                    label: 'Option 5',
                },
                {
                    key: '6',
                    label: 'Option 6',
                },
                {
                    key: '7',
                    label: 'Option 7',
                },
                {
                    key: '8',
                    label: 'Option 8',
                },
            ],
        },
        {
            key: 'sub2',
            label: 'Navigation Two',
            icon: <AppstoreOutlined />,
            children: [
                {
                    key: '9',
                    label: 'Option 9',
                },
                {
                    key: '10',
                    label: 'Option 10',
                },
                {
                    key: 'sub3',
                    label: 'Submenu',
                    children: [
                        {
                            key: '11',
                            label: 'Option 11',
                        },
                        {
                            key: '12',
                            label: 'Option 12',
                        },
                    ],
                },
            ],
        },
    ];

    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={cx('wapper')}>
            <Row>
                <Col span={6}>
                    <div className={cx('navbar-left')}>
                        <Menu
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                            theme="light"
                            inlineCollapsed={collapsed}
                            items={items}
                            className={cx('menu')}
                        />
                    </div>
                    <Button type="primary" onClick={toggleCollapsed} className={cx('collapsed-btn')}>
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </Button>
                </Col>
                <Col span={12}>
                    <div className={cx('content')}>
                        <div className={cx('post-content')}>
                            <PostFrame />
                            <PostFrame />
                        </div>
                    </div>
                </Col>
                <Col span={6}>
                    <div className={cx('content-right')}>
                        <div className={cx('slide-wrapper')}>
                            <div className={cx('slider')}>
                                <SliderComponent alt="slider" width="20%" images={slide} />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default HomePage;

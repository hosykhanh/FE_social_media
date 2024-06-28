import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProfilePage.module.scss';
import images from '../../assets';
import { Button, Col, Image, Modal, Row } from 'antd';
import {
    CameraOutlined,
    EditOutlined,
    EnvironmentOutlined,
    MailOutlined,
    PhoneOutlined,
    ScheduleOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons';

const cx = classNames.bind(styles);

const ProfilePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrapper-image')}>
                <Image width="100%" src={images.anhnen} alt="anhnen" className={cx('image')} />
                <div className={cx('button-image')}>
                    <Button>
                        <CameraOutlined />
                        Thêm ảnh bìa
                    </Button>
                </div>
                <div className={cx('wrapper-avatar')}>
                    <Image src={images.avatar} className={cx('avatar')} />
                    <div className={cx('username')}>Hồ Sỹ Khanh</div>
                </div>
                <div className={cx('edit-profile')}>
                    <Button type="primary" onClick={showModal}>
                        <EditOutlined /> Chỉnh sửa trang cá nhân
                    </Button>
                    <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                    </Modal>
                </div>
            </div>
            <div className={cx('content')}>
                <div className={cx('wrapper-content')}>
                    <Row>
                        <Col span={8}>
                            <div className={cx('information')}>
                                <p>Thông tin chung</p>
                                <div className={cx('field')}>
                                    <label htmlFor="Ngày sinh">
                                        <ScheduleOutlined /> Ngày sinh
                                    </label>
                                    <div>11-08-2002</div>
                                </div>
                                <div className={cx('field')}>
                                    <label htmlFor="Giới tính">
                                        <UserSwitchOutlined /> Giới tính
                                    </label>
                                    <div>Nam</div>
                                </div>
                                <div className={cx('field')}>
                                    <label htmlFor="Số điện thoại">
                                        <PhoneOutlined /> Số điện thoại
                                    </label>
                                    <div>0916262253</div>
                                </div>
                                <div className={cx('field')}>
                                    <label htmlFor="Email">
                                        <MailOutlined /> Email
                                    </label>
                                    <div>hosykhanh1108@gmail.com</div>
                                </div>
                                <div className={cx('field')}>
                                    <label htmlFor="Địa chỉ">
                                        <EnvironmentOutlined /> Địa chỉ
                                    </label>
                                    <div>Thôn 8 xã Lạng Sơn huyện Anh Sơn tỉnh Nghệ An</div>
                                </div>
                                <div>
                                    <Button type="primary" onClick={showModal}>
                                        <EditOutlined /> Chỉnh sửa chi tiết
                                    </Button>
                                    <Modal
                                        title="Basic Modal"
                                        open={isModalOpen}
                                        onOk={handleOk}
                                        onCancel={handleCancel}
                                    >
                                        <p>Some contents...</p>
                                        <p>Some contents...</p>
                                        <p>Some contents...</p>
                                    </Modal>
                                </div>
                            </div>
                        </Col>
                        <Col span={16}>
                            <div className={cx('posts')}>post</div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

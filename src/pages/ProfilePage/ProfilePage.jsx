import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProfilePage.module.scss';
import images from '../../assets';
import { Avatar, Button, Col, Image, message, Modal, Row } from 'antd';
import {
    CameraOutlined,
    EditOutlined,
    EnvironmentOutlined,
    MailOutlined,
    PhoneOutlined,
    ScheduleOutlined,
    UserOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useMutation } from 'react-query';
import checkStatusResponse from '../../utils/checkStatusResponse';
import * as userService from '../../services/userService';
import { success, error } from '../../components/Message/Message';
import { updateUser } from '../../redux/slice/userSlice';
import convertISODateToLocalDate from '../../utils/convertISODateToLocalDate';
import InputUpload from '../../components/InputUpload/InputUpload';
import { useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [user, setUser] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenAvatar, setIsModalOpenAvatar] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [gender, setGender] = useState('Male');
    const [dateOfBirth, setDateOfBirth] = useState('');

    const mutation = useMutation({
        mutationFn: (data) => {
            const { id, ...rests } = data;
            return userService.updateUser(id, rests);
        },
    });

    const { data, isLoading, isSuccess, isError } = mutation;

    const mutationAvatar = useMutation({
        mutationFn: (data) => {
            const { id, ...avatar } = data;
            return userService.updateAvatar(id, avatar);
        },
        onSuccess: (data) => {
            // Cập nhật thông tin người dùng trong Redux store
            dispatch(updateUser({ ...user, avatar: data.avatar }));
            message.success('Avatar cập nhật thành công!');
        },
        onError: (error) => {
            message.error('Có lỗi xảy ra khi cập nhật avatar.');
        },
    });

    useEffect(() => {
        const HandleGetUser = async () => {
            const res = await userService.getUser(id);
            setUser(res);
        };
        HandleGetUser();
    }, [id]);

    useEffect(() => {
        if (isSuccess && checkStatusResponse(data)) {
            dispatch(updateUser({ _id: user.id, ...data?.data }));
            success('Cập nhật thành công');
        } else if (isError) {
            error('Cập nhật thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError, data]);

    useEffect(() => {
        if (user) {
            setEmail(user.email);
            setName(user.name);
            setPhone(user.phone);
            setAddress(user.address);
            setAvatar(user.avatar);
            setGender(user.gender);
            setDateOfBirth(user.dateOfBirth);
        }
    }, [user]);

    const handleOnChangeAvatar = (file) => {
        setAvatar(file);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showModalAvatar = () => {
        setIsModalOpenAvatar(true);
    };

    const handleOkAvatar = () => {
        console.log(avatar);
        setIsModalOpenAvatar(false);
        mutationAvatar.mutate({ id, avatar });
    };

    const handleCancelAvatar = () => {
        setIsModalOpenAvatar(false);
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
                    {user?.avatar ? (
                        <Image src={user?.avatar} className={cx('avatar')} />
                    ) : (
                        <Avatar
                            style={{ backgroundColor: '#87d068', border: '5px solid #ffffff' }}
                            icon={<UserOutlined />}
                            size={175}
                        />
                    )}

                    <div className={cx('username')}>{name}</div>
                </div>
                <div className={cx('upload-avatar')}>
                    <div onClick={showModalAvatar}>
                        <CameraOutlined />
                    </div>
                    <Modal
                        title="Chỉnh sửa ảnh"
                        open={isModalOpenAvatar}
                        onOk={handleOkAvatar}
                        onCancel={handleCancelAvatar}
                    >
                        <InputUpload type="file" avatar={avatar} onChange={handleOnChangeAvatar} />
                    </Modal>
                </div>
                <div className={cx('edit-profile')}>
                    <Button type="primary" onClick={showModal}>
                        <EditOutlined /> Chỉnh sửa trang cá nhân
                    </Button>
                    <Modal title="Chỉnh sửa trang cá nhân" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
                                    <div>{convertISODateToLocalDate(dateOfBirth || '2000-01-01')}</div>
                                </div>
                                <div className={cx('field')}>
                                    <label htmlFor="Giới tính">
                                        <UserSwitchOutlined /> Giới tính
                                    </label>
                                    <div>{gender}</div>
                                </div>
                                <div className={cx('field')}>
                                    <label htmlFor="Số điện thoại">
                                        <PhoneOutlined /> Số điện thoại
                                    </label>
                                    <div>{phone}</div>
                                </div>
                                <div className={cx('field')}>
                                    <label htmlFor="Email">
                                        <MailOutlined /> Email
                                    </label>
                                    <div>{email}</div>
                                </div>
                                <div className={cx('field')}>
                                    <label htmlFor="Địa chỉ">
                                        <EnvironmentOutlined /> Địa chỉ
                                    </label>
                                    <div>{address}</div>
                                </div>
                                <div>
                                    <Button type="primary" onClick={showModal}>
                                        <EditOutlined /> Chỉnh sửa chi tiết
                                    </Button>
                                    <Modal
                                        title="Chỉnh sửa chi tiết"
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

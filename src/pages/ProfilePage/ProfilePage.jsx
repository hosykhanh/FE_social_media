import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';

import classNames from 'classnames/bind';
import styles from './ProfilePage.module.scss';
import images from '../../assets';
import { Avatar, Button, Col, DatePicker, Image, Input, message, Modal, Radio, Row } from 'antd';
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
import checkStatusResponse from '../../utils/checkStatusResponse';
import * as userService from '../../services/userService';
import * as postsService from '../../services/postsService';
import { updateUser } from '../../redux/slice/userSlice';
import convertISODateToLocalDate from '../../utils/convertISODateToLocalDate';
import InputUpload from '../../components/InputUpload/InputUpload';
import Loading from '../../components/Loading/Loading';
import dayjs from 'dayjs';
import PostFrame from '../../components/PostFrame/PostFrame';

const cx = classNames.bind(styles);

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const users = useSelector((state) => state.user);
    const [user, setUser] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenAvatar, setIsModalOpenAvatar] = useState(false);
    const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [gender, setGender] = useState('Male');
    const [dateOfBirth, setDateOfBirth] = useState('');

    const [statePosts, setStatePosts] = useState([]);

    useEffect(() => {
        const getPostsByUserId = async () => {
            const data = await postsService.getPostsByUserId(id);
            setStatePosts(data);
        };
        getPostsByUserId();
    }, [id]);

    const mutation = useMutation({
        mutationFn: (data) => {
            const { id, ...rests } = data;
            return userService.updateUser(id, rests);
        },
    });

    const mutationAvatar = useMutation({
        mutationFn: (data) => {
            const { id, ...avatar } = data;
            return userService.updateAvatar(id, avatar);
        },
        onSuccess: (data) => {
            // Cập nhật thông tin người dùng trong Redux store
            dispatch(updateUser({ id: users.id, ...data }));
            message.success('Avatar cập nhật thành công!');
        },
        onError: (error) => {
            message.error('Có lỗi xảy ra khi cập nhật avatar.');
        },
    });

    const { data, isLoading, isSuccess, isError } = mutation;

    useEffect(() => {
        const HandleGetUser = async () => {
            const res = await userService.getUser(id);
            setUser(res);
        };
        HandleGetUser();
    }, [id]);

    useEffect(() => {
        if (isSuccess && checkStatusResponse(data)) {
            dispatch(updateUser({ id: users.id, ...data?.data }));
            message.success('Cập nhật thành công');
        } else if (isError) {
            message.error('Cập nhật thất bại');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError, data]);

    useEffect(() => {
        if (users) {
            setEmail(users.email);
            setName(users.name);
            setPhone(users.phone);
            setAddress(users.address);
            setAvatar(users.avatar);
            setGender(users.gender);
            setDateOfBirth(users.dateOfBirth);
        }
    }, [users]);

    const handleOnChangeAvatar = (file) => {
        setAvatar(file);
    };

    const handleOnChangeName = (e) => {
        setName(e.target.value);
    };

    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleOnChangePhone = (e) => {
        setPhone(e.target.value);
    };

    const handleOnChangeAddress = (e) => {
        setAddress(e.target.value);
    };

    const handleOnChangeGender = (e) => {
        setGender(e.target.value);
    };

    const handleOnChangeDate = (value) => {
        if (value) {
            setDateOfBirth(value.$d.toISOString());
        }
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
        setIsModalOpenAvatar(false);
        mutationAvatar.mutate({ id, avatar });
    };

    const handleCancelAvatar = () => {
        setIsModalOpenAvatar(false);
    };

    const showModalDetail = () => {
        setIsModalOpenDetail(true);
    };

    const handleOkDetail = () => {
        setIsModalOpenDetail(false);
        mutation.mutate({ id: users?.id, name, email, phone, address, gender, dateOfBirth });
    };

    const handleCancelDetail = () => {
        setIsModalOpenDetail(false);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrapper-image')}>
                <Image width="100%" src={images.anhnen} alt="anhnen" className={cx('image')} />
                {users.id === user._id ? (
                    <div>
                        <div className={cx('button-image')}>
                            <Button>
                                <CameraOutlined />
                                Thêm ảnh bìa
                            </Button>
                        </div>
                        <div className={cx('wrapper-avatar')}>
                            {users?.avatar ? (
                                <Image src={users?.avatar} className={cx('avatar')} />
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
                            <Modal
                                title="Chỉnh sửa trang cá nhân"
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
                ) : (
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

                        <div className={cx('username')}>{user?.name}</div>
                    </div>
                )}
            </div>
            <div className={cx('content')}>
                <div className={cx('wrapper-content')}>
                    <Row>
                        <Col span={9}>
                            <Loading isLoading={isLoading}>
                                <div className={cx('information')}>
                                    <p>Thông tin chung</p>
                                    <div className={cx('field')}>
                                        <label htmlFor="Ngày sinh">
                                            <ScheduleOutlined /> Ngày sinh
                                        </label>
                                        <div>
                                            {users.id === user._id
                                                ? convertISODateToLocalDate(dateOfBirth || '2000-01-01')
                                                : convertISODateToLocalDate(user.dateOfBirth || '2000-01-01')}
                                        </div>
                                    </div>
                                    <div className={cx('field')}>
                                        <label htmlFor="Giới tính">
                                            <UserSwitchOutlined /> Giới tính
                                        </label>
                                        <div>{users.id === user._id ? gender : user.gender}</div>
                                    </div>
                                    <div className={cx('field')}>
                                        <label htmlFor="Số điện thoại">
                                            <PhoneOutlined /> Số điện thoại
                                        </label>
                                        <div>{users.id === user._id ? phone : user.phone}</div>
                                    </div>
                                    <div className={cx('field')}>
                                        <label htmlFor="Email">
                                            <MailOutlined /> Email
                                        </label>
                                        <div>{users.id === user._id ? email : user.email}</div>
                                    </div>
                                    <div className={cx('field')}>
                                        <label htmlFor="Địa chỉ">
                                            <EnvironmentOutlined /> Địa chỉ
                                        </label>
                                        <div>{users.id === user._id ? address : user.address}</div>
                                    </div>
                                    {users.id === user._id ? (
                                        <div>
                                            <Button type="primary" onClick={showModalDetail}>
                                                <EditOutlined /> Chỉnh sửa chi tiết
                                            </Button>
                                            <Modal
                                                title="Chỉnh sửa chi tiết"
                                                open={isModalOpenDetail}
                                                onOk={handleOkDetail}
                                                onCancel={handleCancelDetail}
                                            >
                                                <div className={cx('modal-detail')}>
                                                    <label htmlFor="name">Tên người dùng:</label>
                                                    <Input value={name} onChange={handleOnChangeName}></Input>
                                                </div>
                                                <div className={cx('modal-detail')}>
                                                    <label htmlFor="email">Email:</label>
                                                    <Input value={email} onChange={handleOnChangeEmail}></Input>
                                                </div>
                                                <div className={cx('modal-detail')}>
                                                    <label htmlFor="dateOfBirth">Ngày sinh:</label>

                                                    <DatePicker
                                                        format={'YYYY-MM-DD'}
                                                        value={dayjs(
                                                            convertISODateToLocalDate(dateOfBirth || '2000-01-01'),
                                                            'YYYY-MM-DD',
                                                        )}
                                                        onChange={handleOnChangeDate}
                                                        size="middle"
                                                        style={{ width: '100%' }}
                                                    />
                                                </div>
                                                <div className={cx('modal-detail')}>
                                                    <label htmlFor="gender">Giới tính:</label>
                                                    <br />
                                                    <Radio.Group defaultValue={gender} onChange={handleOnChangeGender}>
                                                        <Radio value="Male">Male</Radio>
                                                        <Radio value="Female">Femail</Radio>
                                                        <Radio value="Other">Other</Radio>
                                                    </Radio.Group>
                                                </div>
                                                <div className={cx('modal-detail')}>
                                                    <label htmlFor="phone">Điện thoại:</label>
                                                    <Input value={phone} onChange={handleOnChangePhone}></Input>
                                                </div>
                                                <div className={cx('modal-detail')}>
                                                    <label htmlFor="address">Địa chỉ:</label>
                                                    <Input value={address} onChange={handleOnChangeAddress}></Input>
                                                </div>
                                            </Modal>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </Loading>
                        </Col>
                        <Col span={15}>
                            <div className={cx('posts')}>
                                {statePosts.length ? (
                                    statePosts
                                        ?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                                        .map((post) => {
                                            return (
                                                <PostFrame
                                                    key={post?._id}
                                                    _id={post?._id}
                                                    image={post?.image}
                                                    description={post?.description}
                                                    favorites={post?.favorites}
                                                    author={post?.user}
                                                    createdAt={post?.createdAt}
                                                    updatedAt={post?.updatedAt}
                                                />
                                            );
                                        })
                                ) : (
                                    <div className={cx('no-posts')}>Chưa có bài viết nào</div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

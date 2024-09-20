import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { Avatar, Col, Popover, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import images from '../../../assets';
import Search from 'antd/es/transfer/search';
import { useDispatch, useSelector } from 'react-redux';
import * as authService from '../../../services/authService';
import * as userService from '../../../services/userService';
import { resetUser } from '../../../redux/slice/userSlice';
import { LogoutOutlined, MessageOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import Loading from '../../../components/Loading/Loading';

const cx = classNames.bind(styles);

const Header = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [searchData, setSearchData] = useState();

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const handleNavigateHome = () => {
        navigate('/');
    };

    const handleNavigateProfile = (id) => {
        navigate(`/user/${id}`);
    };

    const handleNavigateSystemAdmin = () => {
        navigate('/system/admin');
    };

    useEffect(() => {
        if (user?.name) {
            setUsername(user?.name);
        }
    }, [user?.name, username]);

    const handleLogout = async () => {
        setLoading(true);
        await authService.logoutUser();
        dispatch(resetUser());
        localStorage.removeItem('access_token');
        navigate('/sign-in');
        setLoading(false);
    };

    const onSearch = async (e) => {
        setSearchValue(e.target.value);
    };

    useEffect(() => {
        const searchUsers = async () => {
            if (searchValue.trim()) {
                const res = await userService.searchUsers(user.id, searchValue);
                setSearchData(res);
            } else {
                setSearchData([]);
            }
        };
        searchUsers();
    }, [user.id, searchValue]);

    const content = () => {
        return (
            <div>
                <div className={cx('wrapper-avatar-name')}>
                    <div className={cx('avatar-name')} onClick={() => handleNavigateProfile(user?.id)}>
                        {user?.avatar ? (
                            <Avatar src={user?.avatar} size={40} />
                        ) : (
                            <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} size={40} />
                        )}
                        <span className={cx('name')}>{username}</span>
                    </div>
                    <div className={cx('profile')} onClick={() => handleNavigateProfile(user?.id)}>
                        Xem trang cá nhân
                    </div>
                </div>
                {user?.isAdmin === true ? (
                    <div className={cx('logout')} onClick={handleNavigateSystemAdmin}>
                        <UnorderedListOutlined style={{ fontSize: 30 }} />
                        <div>Quản lý hệ thống</div>
                    </div>
                ) : (
                    <></>
                )}
                <div className={cx('logout')} onClick={handleLogout}>
                    <LogoutOutlined style={{ fontSize: 30 }} />
                    <div className={cx('logout-span')}>Đăng xuất</div>
                </div>
            </div>
        );
    };

    const contentSearch = () => {
        return (
            <div style={{ width: '300px' }}>
                {searchData?.length > 0 ? (
                    searchData.map((users, index) => (
                        <div className={cx('user')} key={index} onClick={() => handleNavigateProfile(users._id)}>
                            {users?.avatar ? (
                                <Avatar src={users?.avatar} size={40} />
                            ) : (
                                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} size={40} />
                            )}
                            <span className={cx('name')}>{users?.name}</span>
                        </div>
                    ))
                ) : (
                    <div>Hãy nhập từ khóa để tìm kiếm</div> // Hiển thị nếu không có kết quả tìm kiếm
                )}
            </div>
        );
    };

    return (
        <header className={cx('header')}>
            <div className={cx('wrapper')}>
                <Row className={cx('row-wrapper')}>
                    <Col span={4}>
                        <div className={cx('app-name')} onClick={handleNavigateHome}>
                            <img src={images.logo} alt="logo" className={cx('logo')} />
                            <div className={cx('name')}>HSK Social Media</div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <Popover content={contentSearch()} trigger="click" placement="bottomLeft">
                            <div onClick={(e) => e.stopPropagation()}>
                                <Search
                                    className={cx('search-input')}
                                    placeholder="Tìm kiếm..."
                                    allowClear
                                    enterButton="Tìm kiếm"
                                    size="large"
                                    onChange={onSearch}
                                    value={searchValue}
                                />
                            </div>
                        </Popover>
                    </Col>
                    <Col span={8}>
                        <div className={cx('wrapper-account')}>
                            <div className={cx('message')}>
                                <MessageOutlined style={{ fontSize: 20, color: '#000000', cursor: 'pointer' }} />
                            </div>
                            <Loading isLoading={loading}>
                                <div>
                                    {user?.name ? (
                                        <>
                                            <Popover content={content} trigger="click">
                                                <div className={cx('avatar')}>
                                                    {user?.avatar ? (
                                                        <Avatar src={user?.avatar} size={40} />
                                                    ) : (
                                                        <Avatar
                                                            style={{ backgroundColor: '#87d068' }}
                                                            icon={<UserOutlined />}
                                                            size={40}
                                                        />
                                                    )}
                                                </div>
                                            </Popover>
                                        </>
                                    ) : (
                                        <div>
                                            <div className={cx('login')} onClick={handleLogout}>
                                                Đăng nhập/ Đăng kí
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Loading>
                        </div>
                    </Col>
                </Row>
            </div>
        </header>
    );
};

export default Header;

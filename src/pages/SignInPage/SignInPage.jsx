import React, { useEffect, useState } from 'react';

import styles from './SignInPage.module.scss';
import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { loginUser } from '../../services/authService';
import * as userService from '../../services/userService';
import * as messages from '../../components/Message/Message';
import { updateUser } from '../../redux/slice/userSlice';
import checkStatusResponse from '../../utils/checkStatusResponse';
import { jwtDecode } from 'jwt-decode';
import { Button, Image, Input, message } from 'antd';
import Loading from '../../components/Loading/Loading';
import images from '../../assets';
import { MailOutlined, SignatureOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const location = useLocation();

    const navigate = useNavigate();

    // function call API
    const mutation = useMutation({
        mutationFn: (data) => loginUser(data),
    });

    const { isLoading, isSuccess, data } = mutation;

    const handleGetDetailUser = async (id, access_token) => {
        const res = await userService.getUser(id, access_token);
        dispatch(updateUser({ ...res?.data, access_token }));
    };

    useEffect(() => {
        if (isSuccess && checkStatusResponse(data)) {
            messages.success('Đăng nhập thành công');
            localStorage.setItem('access_token', JSON.stringify(data?.access_token));
            if (data?.access_token) {
                const decoded = jwtDecode(data?.access_token);
                if (decoded?.id) {
                    handleGetDetailUser(decoded?.id, data?.access_token);
                }
            }
            if (location?.state) {
                navigate(location?.state);
            } else {
                navigate('/');
            }
        } else if (data?.status === 'err') {
            message.error(data?.message);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, data]);

    // function handle UI
    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleOnChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({
            email,
            password,
        });
    };

    return (
        <div className={cx('wapper')}>
            <div className={cx('wapper-content')}>
                <form onSubmit={(e) => handleSubmit(e)} className={cx('content')}>
                    <div className={cx('app-name')}>
                        <img src={images.logo} alt="" width="25px" /> HSK SOCIAL MEDIA
                    </div>
                    <div className={cx('form')}>
                        <div className={cx('form-title')}>Login</div>
                        <div className={cx('form-link')}>
                            Don't you have an account yet? <a href="/sign-up">Register</a>
                        </div>

                        <div className={cx('form-label')}>
                            <label htmlFor="Email">
                                <MailOutlined /> Email
                            </label>
                            <Input
                                onChange={handleOnChangeEmail}
                                value={email}
                                id="email"
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className={cx('form-label')}>
                            <label htmlFor="Password">
                                <SignatureOutlined /> Password
                            </label>
                            <Input.Password
                                type="password"
                                onChange={handleOnChangePassword}
                                value={password}
                                id="password"
                                required
                                placeholder="Enter your pasword"
                            />
                        </div>

                        <a className={cx('forgot-password')} href="/">
                            Forgot password?
                        </a>
                        <Loading isLoading={isLoading}>
                            <Button className={cx('btn-form')} type="primary">
                                Login
                            </Button>
                        </Loading>
                    </div>
                </form>
            </div>
            <div className={cx('image')}>
                <Image
                    preview={false}
                    style={{ height: '500px', objectFit: 'cover' }}
                    src={images.imageLogin}
                    alt="sign up"
                />
            </div>
        </div>
    );
};

export default SignInPage;

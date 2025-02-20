import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './VerifyOtpPage.module.scss';
import { Image, message } from 'antd';
import images from '../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { MuiOtpInput } from 'mui-one-time-password-input';
import * as userService from '../../services/userService';
import * as authService from '../../services/authService';
import { updateUser } from '../../redux/slice/userSlice';
import checkStatusResponse from '../../utils/checkStatusResponse';
import * as messages from '../../components/Message/Message';
import { jwtDecode } from 'jwt-decode';

const cx = classNames.bind(styles);

const VerifyOtpPage = () => {
    const user = useSelector((state) => state.user);
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const loginRespone = location.state?.loginRespone;

    const handleChangeOtp = (newValue) => {
        setOtp(newValue);
    };

    const handleGetDetailUser = async (id, access_token) => {
        const res = await userService.getUser(id);
        dispatch(updateUser({ ...res, access_token }));
    };

    useEffect(() => {
        if (otp.length === 6) {
            const handleSubmit = async () => {
                const decoded = jwtDecode(loginRespone.access_token);
                const res = await authService.verifyOtp(decoded?.id, {otp: otp}, loginRespone.access_token);
                if (checkStatusResponse(res)) {
                    messages.success('Đăng nhập thành công');
                    localStorage.setItem('access_token', JSON.stringify(res?.access_token));
                    
                    if (res?.access_token) {
                        const decoded = jwtDecode(res?.access_token);
                        if (decoded?.id) {
                            handleGetDetailUser(decoded?.id, res?.access_token);
                        }
                    }
                    navigate('/');
                } else if (res?.status === 'err') {
                    message.error(res?.message);
                }
            };
    
            handleSubmit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp, user?.id]);
    
    return (
        <div className={cx('wapper')}>
            <div className={cx('wapper-content')}>
                <form className={cx('content')}>
                    {loginRespone?.qrCode ? (
                        <div>
                            <div className={cx('app-name')}>
                                <img src={images.logo} alt="" width="25px" /> <span>HSK SOCIAL MEDIA</span>
                            </div>
                            <div className={cx('form')}>
                                <img className={cx('qrcode')} src={loginRespone?.qrCode} alt="qrcode" />
                            </div>
                        </div>
                    ) : (
                        <div className={cx('noqrcode-content')}>
                            <div className={cx('app-name')}>
                                <img src={images.logo} alt="" width="25px" /> <span>HSK SOCIAL MEDIA</span>
                            </div>
                        </div>
                    )}
                    <div className={cx('otp')}>
                        <MuiOtpInput
                            value={otp}
                            onChange={handleChangeOtp}
                            length={6}
                            autoFocus
                            sx={{ width: 350 }}
                            gap={1}
                            validateChar={(char) => /^\d$/.test(char)}
                            TextFieldsProps={{
                                type: 'text',
                                size: 'medium',
                                placeholder: String('-'),
                            }}
                        />
                    </div>
                </form>
            </div>
            <div className={cx('image')}>
                <Image
                    preview={false}
                    style={{ height: '500px', objectFit: 'cover' }}
                    src={images.imageLogin}
                    alt="verify otp"
                />
            </div>
        </div>
    );
};

export default VerifyOtpPage;

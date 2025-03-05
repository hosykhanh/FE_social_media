import axios from 'axios';
import axiosJWT from './axiosService';

const loginUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, data);
    return res.data;
};

const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`);
    return res.data;
};

const verifyOtp = async (id, data, token) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/verify-otp/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

const refreshToken = async () => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/auth/refresh`);
    return res.data;
};

const getDecryptedPrivateKey = async (encryptedPrivateKey, aesEncryptedKey, iv) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/auth/decrypt-private-key`, {
        encryptedPrivateKey,
        aesEncryptedKey,
        iv,
    });
    return res.data;
};

export { loginUser, logoutUser, verifyOtp, refreshToken, getDecryptedPrivateKey };

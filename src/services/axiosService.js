import axios from 'axios';
import tokenValid from '../utils/checkExpireToken';

const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(async function (config) {
    let token = JSON.parse(localStorage.getItem('access_token'));
    console.log('>>token', token);
    if (token && tokenValid(token)) {
        config.headers.Accept = 'application/json';
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosJWT;
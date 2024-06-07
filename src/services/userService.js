import axios from 'axios';
import axiosJWT from './axiosService';

const signUpUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/users`, data);
    console.log(data);
    return res.data;
};

const getUser = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/users/${id}`);
    return res.data;
};

const getAllUser = async ({ name }) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/users`, {
        params: {
            name: name,
        },
    });
    return res.data;
};

export { signUpUser, getUser, getAllUser, axiosJWT };

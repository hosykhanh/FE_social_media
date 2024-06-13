import axios from 'axios';

const loginUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, data);
    return res.data;
};

const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/log-out`);
    return res.data;
};

export { loginUser, logoutUser };

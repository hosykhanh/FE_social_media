import axios from 'axios';

const loginUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/sign-in`, data);
    return res.data;
};

const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/log-out`);
    return res.data;
};

export { loginUser, logoutUser };

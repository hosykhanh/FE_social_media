import axios from 'axios';
import axiosJWT from './axiosService';

const signUpUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/users`, data);
    return res.data;
};

const createUsersFromExcel = async (data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/users/upload-file-excel`, data);
    return res.data;
};

const getUser = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/users/${id}`);
    return res.data;
};

const getAllUser = async () => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/users`);
    return res.data;
};

const searchUsers = async (id, search) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/users/${id}/suggestions?search=${search}`);
    return res.data;
};

const updateUser = async (id, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/users/${id}`, data);
    return res.data;
};

const updateAvatar = async (id, avatar) => {
    const formData = new FormData();
    formData.append('avatar', avatar.avatar);

    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/users/${id}/avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return res.data;
};

const deleteUser = async (id) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/users/${id}`);
    return res.data;
};

const deleteManyUser = async (data) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/users/delete-many`, { data });
    return res.data;
};

export {
    signUpUser,
    getUser,
    getAllUser,
    updateUser,
    updateAvatar,
    deleteUser,
    searchUsers,
    deleteManyUser,
    createUsersFromExcel,
    axiosJWT,
};

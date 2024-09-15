import axios from 'axios';
import axiosJWT from './axiosService';

const createComment = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/comment`, data);
    return res.data;
};

const getComment = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/comment/${id}`);
    return res.data;
};

const getAllComment = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/comment`);
    return res.data;
};

const getCommentByPostID = async (postId) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/comment/${postId}/comments`);
    return res.data;
};

const updateComment = async (id, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL}/comment/${id}`, data);
    return res.data;
};

const deleteComment = async (id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/comment/${id}`);
    return res.data;
};

export { createComment, getComment, getAllComment, getCommentByPostID, updateComment, deleteComment };
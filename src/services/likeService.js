import axios from 'axios';

const createLike = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/like`, data);
    return res.data;
};

const getLikeByPostAndUser = async (postId, userId) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/like/${postId}/likes/${userId}`);
    return res.data;
};

const getLikeByPostId = async (postId) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/like/${postId}/likes`);
    return res.data;
};

const updateLike = async (id, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL}/like/${id}`, data);
    return res.data;
};

const deleteLike = async (id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/like/${id}`);
    return res.data;
};

export { createLike, getLikeByPostAndUser, getLikeByPostId, updateLike, deleteLike };

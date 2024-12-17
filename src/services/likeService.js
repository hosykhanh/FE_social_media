import axiosJWT from './axiosService';

const createLike = async (data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/like`, data);
    return res.data;
};

const getLikeByPostAndUser = async (postId, userId) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/like/${postId}/likes/${userId}`);
    return res.data;
};

const getLikeByPostId = async (postId) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/like/${postId}/likes`);
    return res.data;
};

const updateLike = async (id, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/like/${id}`, data);
    return res.data;
};

const deleteLike = async (id) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/like/${id}`);
    return res.data;
};

export { createLike, getLikeByPostAndUser, getLikeByPostId, updateLike, deleteLike };

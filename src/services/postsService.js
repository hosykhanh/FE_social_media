import axiosJWT from './axiosService';

const createPosts = async (data) => {
    const formData = new FormData();
    for (const key in data) {
        if (key === 'image') {
            formData.append(key, data[key]);
        } else {
            formData.append(key, data[key]);
        }
    }
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/posts`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

const getPosts = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/posts/${id}`);
    return res.data;
};

const getAllPosts = async () => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/posts`);
    return res.data;
};

const getPostsSortedByWeight = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/posts/weight/posts/${id}`);
    return res.data;
};

const getPostsByUserId = async (userId) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/posts/${userId}/post`);
    return res.data;
};

const updatePosts = async (id, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/posts/${id}`, data);
    return res.data;
};

const deletePosts = async (id) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/posts/${id}`);
    return res.data;
};

const deleteManyPosts = async (data) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/posts/delete-many`, { data });
    return res.data;
};

export {
    createPosts,
    getPosts,
    getAllPosts,
    updatePosts,
    deletePosts,
    getPostsByUserId,
    deleteManyPosts,
    getPostsSortedByWeight,
    axiosJWT,
};

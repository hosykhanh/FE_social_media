import axiosJWT from './axiosService';

export const createChat = async (data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/chatRooms`, data);
    return res.data;
};

export const createPrivateChatRoom = async (data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/chatRooms/private`, data);
    return res.data;
};

export const addUsersToChatRoom = async (id, data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/chatRooms/${id}/addUsers`, data);
    return res.data;
};

export const getChatRoomsByUserId = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/chatRooms/user/${id}`);
    return res?.data;
};

export const updateChatRoom = async (id, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/chatRooms/${id}`, data);
    return res.data;
};

export const getMessages = async (id) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/messages/${id}`);
    return res?.data;
};

export const createMessage = async (payload) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/messages/`, payload);
    return res?.data;
};

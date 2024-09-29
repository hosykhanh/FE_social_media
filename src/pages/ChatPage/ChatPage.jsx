import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import styles from './ChatPage.module.scss';
import UserItem from '../../components/UserItem/UserItem';
import BoxChat from '../../components/BoxChat/BoxChat';
import * as chatService from '../../services/chatService';
import Loading from '../../components/Loading/Loading';
// import SearchUser from '../../components/SearchUser/SearchUser';
// import { useQuery } from 'react-query';

const cx = classNames.bind(styles);

function ChatPage() {
    const user = useSelector((state) => state.user);

    const [tempChat, setTempChat] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [sendMessage, setSendMessage] = useState(null);
    const [receivedMessage, setReceivedMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setDataChat] = useState();

    const socket = useRef();

    // Set up connect to socket socket
    useEffect(() => {
        if (user?.id) {
            socket.current = io(process.env.REACT_APP_SOCKET_URL);
            socket.current.emit('new-user-add', user?.id);
            socket.current.on('get-users', (user) => {
                setOnlineUser(user);
            });
        }
    }, [user.id]);

    // Sending message to socket server
    useEffect(() => {
        if (sendMessage) {
            if (sendMessage.receiverId.length === 1) {
                const messageToSend = {
                    ...sendMessage,
                    receiverId: sendMessage.receiverId[0],
                };
                socket.current.emit('send-message', messageToSend);
            } else {
                sendMessage.receiverId.forEach((receiverId) => {
                    const messageToSend = {
                        ...sendMessage,
                        receiverId: receiverId, // Gửi tới từng receiverId
                    };
                    socket.current.emit('send-message', messageToSend);
                });
            }
            const updatedChats = data.map((chat) => {
                if (chat._id === sendMessage?.chatRoom) {
                    return {
                        ...chat,
                        lastMessageSentAt: sendMessage.createdAt, // Cập nhật thời gian tin nhắn gần nhất
                    };
                }
                return chat;
            });

            const sortedChats = updatedChats.sort(
                (a, b) => new Date(b.lastMessageSentAt) - new Date(a.lastMessageSentAt),
            );
            // Chỉ cập nhật nếu có sự thay đổi
            if (JSON.stringify(sortedChats) !== JSON.stringify(data)) {
                setDataChat(sortedChats);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendMessage]);

    // Receive message from socket server
    useEffect(() => {
        if (socket.current) {
            socket.current.on('receive-message', (dataChat) => {
                setReceivedMessage(dataChat);
                // Cập nhật danh sách phòng chat khi nhận được tin nhắn
                const updatedChats = data.map((chat) => {
                    if (chat._id === receivedMessage?.chatRoom) {
                        return {
                            ...chat,
                            lastMessageSentAt: receivedMessage.createdAt, // Cập nhật thời gian tin nhắn gần nhất
                        };
                    }
                    return chat;
                });
                const sortedChats = updatedChats.sort(
                    (a, b) => new Date(b.lastMessageSentAt) - new Date(a.lastMessageSentAt),
                );
                setDataChat(sortedChats);
            });
        }
        // Cleanup khi component unmount
        return () => {
            if (socket.current) {
                socket.current.off('receive-message');
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        const getAllChats = async () => {
            setIsLoading(true);
            if (user.id) {
                const res = await chatService.getChatRoomsByUserId(user.id);
                setDataChat(res);
            }
            setIsLoading(false);
        };

        getAllChats();
    }, [user.id]);

    return (
        <Loading isLoading={isLoading}>
            <div className={cx('wrapper')}>
                <div className={cx('wrapper-content')}>
                    <div className={cx('list-user')}>
                        <div className={cx('title')}>Đoạn Chat</div>
                        {/* <div className={cx('search')}>
                            <SearchUser refetchChats={refetch} setTempChat={setTempChat} />
                        </div> */}
                        <div className={cx('chats')}>
                            {data?.length > 0 &&
                                data
                                    ?.sort((a, b) => new Date(b.lastMessageSentAt) - new Date(a.lastMessageSentAt))
                                    .map((chat, index) => {
                                        return (
                                            <UserItem
                                                key={index}
                                                data={chat}
                                                currentUserId={user.id}
                                                tempChat={tempChat}
                                                setTempChat={setTempChat}
                                                onlineUser={onlineUser}
                                            />
                                        );
                                    })}
                        </div>
                    </div>
                    <div className={cx('box-chat')}>
                        <BoxChat
                            data={tempChat}
                            currentUserId={user?.id}
                            receivedMessage={receivedMessage}
                            setSendMessage={setSendMessage}
                        />
                    </div>
                </div>
            </div>
        </Loading>
    );
}

export default ChatPage;

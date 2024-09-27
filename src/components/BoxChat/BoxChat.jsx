import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import InputEmoji from 'react-input-emoji';
import moment from 'moment';

import * as userService from '../../services/userService';
import * as chatService from '../../services/chatService';
import styles from './BoxChat.module.scss';
import Button from '../Button/Button';
import images from '../../assets';

const cx = classNames.bind(styles);

function BoxChat({ data, currentUserId, setSendMessage, receivedMessage }) {
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const [partner, setPartner] = useState(null);
    const scroll = useRef();

    // fetch data info of partner user
    useEffect(() => {
        const partnerId = data?.participants.find((id) => id !== currentUserId);
        const getUserData = async (partnerId) => {
            try {
                const userData = await userService.getUser(partnerId);
                setPartner(userData);
            } catch (error) {
                console.log(error);
            }
        };

        if (currentUserId && partnerId) {
            getUserData(partnerId);
        }
    }, [currentUserId, data]);

    useEffect(() => {
        if (receivedMessage && receivedMessage?.chatRoom === data?._id) {
            setConversation([...conversation, receivedMessage]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receivedMessage]);

    // fetch message between two user
    useEffect(() => {
        const getMessages = async () => {
            try {
                const messagesData = await chatService.getMessages(data?._id);
                setConversation(messagesData);
            } catch (error) {}
        };

        if (data) getMessages();
    }, [data]);

    const handleChange = (value) => {
        setMessage(value);
    };

    const handleSendMessage = async () => {
        try {
            const payload = {
                chatRoom: data?._id,
                sender: currentUserId,
                content: message,
            };

            // Send message to database
            const result = await chatService.createMessage(payload);
            setMessage('');
            setConversation([...conversation, result]);

            // Send message to socket server
            const receiverId = data?.participants.find((id) => id !== currentUserId);
            setSendMessage({ ...payload, receiverId });
        } catch (error) {}
    };

    // scroll to bottom
    useEffect(() => {
        scroll.current?.scrollTo({
            top: scroll.current?.scrollHeight,
            behavior: 'smooth',
        });
    }, [conversation]);

    return (
        <div className={cx('wrapper')}>
            {data ? (
                <>
                    <div className={cx('header')}>
                        <img src={partner?.avatar || images.defaultAvatar} alt="avt" className={cx('avatar')} />
                        <span className={cx('username')}>{partner?.name}</span>
                    </div>
                    <div className={cx('content')} ref={scroll}>
                        {conversation &&
                            conversation?.map((chat, index) => {
                                return chat?.sender === currentUserId ? (
                                    <div key={index} className={cx('message', 'message-right')}>
                                        <span className={cx('message-content')}>{chat?.content}</span>
                                        <span className={cx('message-time')}>{moment(chat?.createdAt).fromNow()}</span>
                                    </div>
                                ) : (
                                    <div key={index} className={cx('message', 'message-left')}>
                                        <span className={cx('message-content')}>{chat?.content}</span>
                                        <span className={cx('message-time')}>{moment(chat?.createdAt).fromNow()}</span>
                                    </div>
                                );
                            })}
                    </div>
                    <div className={cx('footer')}>
                        <div className={cx('input')}>
                            <InputEmoji value={message} onChange={handleChange} placeholder="Nhập nội dung tin nhắn" />
                        </div>
                        <Button primary onClick={handleSendMessage}>
                            Gửi
                        </Button>
                    </div>
                </>
            ) : (
                <div>
                    <h2>Vui lòng chọn phòng trò chuyện</h2>
                </div>
            )}
        </div>
    );
}

export default BoxChat;

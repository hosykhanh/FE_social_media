import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import InputEmoji from 'react-input-emoji';
import moment from 'moment';

import * as userService from '../../services/userService';
import * as chatService from '../../services/chatService';
import * as authService from '../../services/authService';
import styles from './BoxChat.module.scss';
import Button from '../Button/Button';
import images from '../../assets';
import { decryptMessage, encryptGroupMessage } from '../../security/encryptMessage/encryption';

const cx = classNames.bind(styles);

function BoxChat({ data, currentUserId, setSendMessage, receivedMessage }) {
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const [partner, setPartner] = useState(null);
    const [partners, setPartners] = useState([]);
    const [groupPublicKeys, setGroupPublicKeys] = useState([]);
    const [privateKey, setPrivateKey] = useState('');
    const scroll = useRef();

    // fetch data info of partner user
    useEffect(() => {
        const getUserData = async (partnerId) => {
            try {
                const userData = await userService.getUser(partnerId);
                setPartner(userData);
            } catch (error) {
                console.log(error);
            }
        };

        const getUsersData = async (partnerIds) => {
            try {
                // Fetch dữ liệu của từng partner
                const usersData = await Promise.all(partnerIds.map((partnerId) => userService.getUser(partnerId)));
                setPartners(usersData);
            } catch (error) {
                console.log(error);
            }
        };

        if (currentUserId && data?.participants) {
            const fetchKeys = async () => {
                const keys = await Promise.all(
                    data?.participants.map(async (member) => {
                        const userKeys = await userService.getUser(member);
                        return userKeys.publicKey;
                    }),
                );
                setGroupPublicKeys(keys);
                const userKeys = await userService.getUser(currentUserId);
                const userPrivateKey = await authService.getDecryptedPrivateKey(
                    userKeys.encryptedPrivateKey,
                    userKeys.aesEncryptedKey,
                    userKeys.iv,
                );
                setPrivateKey(userPrivateKey);
            };
            fetchKeys();

            if (data?.participants.length > 2) {
                const otherParticipants = data.participants.filter((_id) => _id !== currentUserId);
                const selectedParticipants = otherParticipants.slice(0, 2);
                getUsersData(selectedParticipants);
            } else {
                const partnerId = data?.participants.find((_id) => _id !== currentUserId);
                getUserData(partnerId);
            }
        }
    }, [currentUserId, data]);

    useEffect(() => {
        const getReceivedMessage = async () => {
            if (receivedMessage && receivedMessage?.chatRoom === data?._id) {
                const decryptedMessage = await decryptMessage(privateKey, receivedMessage.content);
                receivedMessage.content = decryptedMessage;
                setConversation([...conversation, receivedMessage]);
            }
        };
        getReceivedMessage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receivedMessage]);

    // fetch message between two user
    useEffect(() => {
        const getMessages = async () => {
            try {
                const messagesData = await chatService.getMessages(data?._id);
                const decryptedMessagesData = await Promise.all(
                    messagesData.map(async (message) => {
                        const decryptedMessage = await decryptMessage(privateKey, message.content);
                        return {
                            ...message,
                            content: decryptedMessage,
                        };
                    }),
                );
                setConversation(decryptedMessagesData);
            } catch (error) {}
        };

        if (data) getMessages();
    }, [data, privateKey]);

    const handleChange = (value) => {
        setMessage(value);
    };

    const handleSendMessage = async () => {
        try {
            const encryptedMessage = await encryptGroupMessage(groupPublicKeys, message);
            const payload = {
                chatRoom: data?._id,
                sender: currentUserId,
                content: encryptedMessage,
            };

            // Send message to database
            const result = await chatService.createMessage(payload);
            result.content = message;
            setMessage('');
            setConversation([...conversation, result]);

            // Send message to socket server
            const receiverIds = data?.participants.filter((id) => id !== currentUserId);
            setSendMessage({
                ...payload,
                receiverId: receiverIds,
                createdAt: result.createdAt,
                sender: result.sender,
            });

            const dataChat = { lastMessageSentAt: result.createdAt };
            const res = chatService.updateChatRoom(data._id, dataChat);
            return res;
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
                        {data?.participants.length <= 2 ? (
                            <>
                                <img src={partner?.avatar || images.defaultAvatar} alt="AVT" className={cx('avatar')} />
                                <span className={cx('username')}>{partner?.name}</span>
                            </>
                        ) : (
                            <>
                                <div className={cx('wrapper-avatar')}>
                                    <img
                                        src={partners[0]?.avatar || images.defaultAvatar}
                                        alt="AVT1"
                                        className={cx('avatar-group', 'first-avatar')}
                                    />
                                    <img
                                        src={partners[1]?.avatar || images.defaultAvatar}
                                        alt="AVT2"
                                        className={cx('avatar-group', 'second-avatar')}
                                    />
                                </div>
                                <span className={cx('username')}>{data?.nameRoom}</span>
                            </>
                        )}
                    </div>
                    <div className={cx('content')} ref={scroll}>
                        {conversation &&
                            conversation?.map((chat, index) => {
                                return chat?.sender?._id === currentUserId ? (
                                    <div key={index} className={cx('message', 'message-right')}>
                                        <div className={cx('message-content-time', 'content-time-right')}>
                                            <span className={cx('message-content')}>{chat?.content}</span>
                                            <span className={cx('message-time')}>
                                                {moment(chat?.createdAt).fromNow()}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={index} className={cx('message', 'message-left')}>
                                        <img
                                            src={chat?.sender?.avatar || images.defaultAvatar}
                                            alt="message-AVT"
                                            className={cx('message-avatar')}
                                        />
                                        <div className={cx('message-content-time', 'content-time-left')}>
                                            <span className={cx('message-content')}>{chat?.content}</span>
                                            <span className={cx('message-time')}>
                                                {moment(chat?.createdAt).fromNow()}
                                            </span>
                                        </div>
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

import classNames from 'classnames/bind';
import { useEffect, useMemo, useState } from 'react';

import styles from './UserItem.module.scss';
import * as userService from '../../services/userService';
import images from '../../assets';

const cx = classNames.bind(styles);

function UserItem({ data, tempChat, setTempChat, currentUserId, onlineUser }) {
    const [partner, setPartner] = useState(null);
    const [partners, setPartners] = useState([]);

    const status = useMemo(() => {
        const chatMembers = data?.participants.filter((id) => id !== currentUserId);
        return onlineUser?.some((user) => chatMembers.includes(user.userId));
    }, [onlineUser, data, currentUserId]);

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

    return (
        <div
            className={cx('wrapper', { active: tempChat?._id === data?._id ? true : false })}
            onClick={() => setTempChat(data)}
        >
            {data?.participants.length <= 2 ? (
                <>
                    <img src={partner?.avatar || images.defaultAvatar} alt="AVT" className={cx('avatar')} />
                    <div className={cx('wrapper-content')}>
                        <span className={cx('username')}>{partner?.name}</span>
                        <span className={cx('status', { offline: !status })}>
                            {status ? 'Trực tuyến' : 'Ngoại tuyến'}
                        </span>
                    </div>
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
                    <div className={cx('wrapper-content')}>
                        <span className={cx('username')}>{data?.nameRoom}</span>
                        <span className={cx('status', { offline: !status })}>
                            {status ? 'Trực tuyến' : 'Ngoại tuyến'}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}

export default UserItem;

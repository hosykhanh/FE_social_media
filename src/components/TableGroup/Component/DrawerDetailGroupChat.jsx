import classNames from 'classnames/bind';
import styles from './DrawerDetailGroupChat.module.scss';
import DrawerComp from '../../DrawerComp/DrawerComp';
import Loading from '../../Loading/Loading';
import { useEffect, useState } from 'react';
import * as chatService from '../../../services/chatService';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function DrawerDetailGroupChat({ isOpenDrawer, setIsOpenDrawer, rowSelected, refetch }) {
    const [dataChat, setDataChat] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const HandleNavigate = (id) => {
        navigate(`/user/${id}`);
    };

    useEffect(() => {
        const getChatRoom = async () => {
            setIsLoading(true);
            const data = await chatService.getChatRoom(rowSelected);
            setDataChat(data);
            setIsLoading(false);
        };
        if (rowSelected) {
            getChatRoom();
        }
    }, [rowSelected]);

    const date = new Date(dataChat?.createdAt);

    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours() + 7;
    const minutes = date.getUTCMinutes();

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    return (
        <DrawerComp title="Thông tin chi tiết phòng chat" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)}>
            <Loading isLoading={isLoading}>
                <div className={cx('information')}>
                    <label htmlFor="Tên nhóm chat">Tên nhóm chat:</label>
                    <span>{dataChat?.nameRoom}</span>
                </div>
                <div className={cx('information')}>
                    <label htmlFor="Số thành viên">Số thành viên:</label>
                    <span>{dataChat?.participants.length}</span>
                </div>
                <div className={cx('information')}>
                    <label htmlFor="Thời gian tạo nhóm">Thời gian tạo nhóm:</label>
                    <span>{formattedDate}</span>
                </div>
                <div>
                    <div className={cx('member')}>Các thành viên trong nhóm chat</div>
                    {dataChat?.participants?.map((users, index) => (
                        <div className={cx('user')} key={index} onClick={() => HandleNavigate(users?._id)}>
                            {users?.avatar ? (
                                <Avatar src={users?.avatar} size={40} />
                            ) : (
                                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} size={40} />
                            )}
                            <span className={cx('name')}>{users?.name}</span>
                        </div>
                    ))}
                </div>
            </Loading>
        </DrawerComp>
    );
}

export default DrawerDetailGroupChat;

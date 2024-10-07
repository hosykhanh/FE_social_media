import { Menu } from 'antd';
import { useState } from 'react';
import { getItem } from '../../utils';
import { FormOutlined, UserOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';

import styles from './AdminPage.module.scss';
import TableUser from '../../components/TableUser/TableUser';
import * as postsService from '../../services/postsService';
import { useQuery } from 'react-query';
import TablePosts from '../../components/TablePosts/TablePosts';

const cx = classNames.bind(styles);

function AdminPage() {
    const [keySelected, setKeySelected] = useState('user');
    const items = [getItem('Người dùng', 'user', <UserOutlined />), getItem('Bài viết', 'posts', <FormOutlined />)];
    const handleOnClick = ({ key }) => {
        setKeySelected(key);
    };

    // --- API GET ALL POSTS ---
    const getAllPosts = async () => {
        const res = await postsService.getAllPosts();
        return res;
    };

    const {
        isLoading: isLoadingPosts,
        data: dataPosts,
        refetch: refetchPosts,
    } = useQuery(['posts'], getAllPosts, {
        enabled: keySelected === 'posts',
    });

    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return <TableUser />;
            case 'posts':
                return <TablePosts isLoading={isLoadingPosts} data={dataPosts} refetch={refetchPosts} />;
            default:
                return <></>;
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Menu
                defaultSelectedKeys={keySelected}
                mode="inline"
                onClick={handleOnClick}
                style={{ width: 256, height: '100%', marginTop: '10px' }}
                items={items}
            />
            <div className={cx('wrapper-content')}>{renderPage(keySelected)}</div>
        </div>
    );
}

export default AdminPage;

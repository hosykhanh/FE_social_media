import React from 'react';
import styles from './HomePage.module.scss';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

const HomePage = () => {
    const user = useSelector((state) => state.user);
    return <div className={cx('wapper')}>Home {user.name}</div>;
};

export default HomePage;

import React from 'react';
import classNames from 'classnames/bind';
import styles from './FullLayout.module.scss';
import Header from '../components/Header/Header';

const cx = classNames.bind(styles);

const FullLayout = ({ children }) => {
    return (
        <div>
            <Header></Header>
            <div className={cx('container')}>{children}</div>
        </div>
    );
};

export default FullLayout;

import React from 'react';
import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);

const DefaultLayout = ({ children }) => {
    return (
        <div>
            <div className={cx('container')}>{children}</div>
        </div>
    );
};

export default DefaultLayout;

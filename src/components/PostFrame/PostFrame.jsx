import React from 'react';
import styles from './PostFrame.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const PostFrame = () => {
    return <div className={cx('post')}>post</div>;
};

export default PostFrame;

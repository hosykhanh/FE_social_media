import React from 'react';
import styles from './PostFrame.module.scss';
import classNames from 'classnames/bind';
import { Avatar, Image } from 'antd';
import {
    CloseOutlined,
    CommentOutlined,
    EllipsisOutlined,
    LikeOutlined,
    ShareAltOutlined,
    UserOutlined,
} from '@ant-design/icons';
import images from '../../assets';

const cx = classNames.bind(styles);

const PostFrame = () => {
    return (
        <div className={cx('posts')}>
            <div className={cx('posts-header')}>
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} size={40} />
                <div className={cx('name-time')}>
                    <span className={cx('name')}>Hồ Sỹ Khanh</span>
                    <div className={cx('time')}>6 giờ</div>
                </div>
                <div className={cx('func')}>
                    <div className={cx('func-icon')}>
                        <EllipsisOutlined style={{ fontSize: '20px' }} />
                    </div>
                    <div className={cx('func-icon')}>
                        <CloseOutlined style={{ fontSize: '18px' }} />
                    </div>
                </div>
            </div>
            <div className={cx('posts-container')}>
                <div className={cx('content')}>Ánh mắt của kẻ si tình bao nhiêu năm vẫn vậy</div>
                <div className={cx('image')}>
                    <Image style={{ maxHeight: '600px', objectFit: 'cover' }} src={images.avatar}></Image>
                </div>
            </div>
            <div className={cx('posts-footer')}>
                <div className={cx('quantity')}>
                    <div className={cx('number-like')}>
                        <div className={cx('like')}>
                            <LikeOutlined style={{ color: '#0080ff' }} />
                        </div>
                        <div className={cx('number')}>20</div>
                    </div>
                    <div className={cx('number-comment')}>
                        <div className={cx('number')}>16</div>
                        <div className={cx('comment')}>bình luận</div>
                    </div>
                    <div className={cx('number-share')}>
                        <div className={cx('number')}>5</div>
                        <div className={cx('share')}>lượt chia sẻ</div>
                    </div>
                </div>
                <div className={cx('action')}>
                    <div className={cx('action-item')}>
                        <LikeOutlined style={{ fontSize: '20px' }} />
                        <span>Thích</span>
                    </div>
                    <div className={cx('action-item')}>
                        <CommentOutlined style={{ fontSize: '20px' }} />
                        <span>Bình luận</span>
                    </div>
                    <div className={cx('action-item')}>
                        <ShareAltOutlined style={{ fontSize: '20px' }} />
                        <span>Chia sẻ</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostFrame;

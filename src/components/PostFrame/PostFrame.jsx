import React, { useEffect, useState } from 'react';
import styles from './PostFrame.module.scss';
import classNames from 'classnames/bind';
import { Avatar, Image, Modal } from 'antd';
import {
    CloseOutlined,
    CommentOutlined,
    EllipsisOutlined,
    LikeOutlined,
    ShareAltOutlined,
    UserOutlined,
} from '@ant-design/icons';
import * as commentService from '../../services/commentService';
import Loading from '../Loading/Loading';

const cx = classNames.bind(styles);

const PostFrame = ({ _id, image, description, favorites, author, createdAt, updatedAt }) => {
    const [stateComment, setStateComment] = useState([]);
    const [isModalOpenComment, setIsModalOpenComment] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getCommentByPostId = async () => {
            setIsLoading(true);
            const data = await commentService.getCommentByPostID(_id);
            setStateComment(data);
            console.log(data);
            setIsLoading(false);
        };
        getCommentByPostId();
    }, [_id]);

    const timeUpdate = new Date(updatedAt);

    const now = new Date();
    const diffInMilliseconds = now - timeUpdate;

    const diffInMinutes = Math.floor(diffInMilliseconds / 1000 / 60);
    const diffInHours = Math.floor(diffInMilliseconds / 1000 / 60 / 60);
    const diffInDays = Math.floor(diffInMilliseconds / 1000 / 60 / 60 / 24);

    let timeAgo;

    if (diffInDays > 7) {
        timeAgo = timeUpdate.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }); // Hiển thị ngày cụ thể nếu quá 7 ngày
    } else if (diffInDays >= 1) {
        timeAgo = `${diffInDays} ngày trước`;
    } else if (diffInHours >= 1) {
        timeAgo = `${diffInHours} giờ trước`;
    } else {
        timeAgo = `${diffInMinutes} phút trước`;
    }

    const showModalComment = () => {
        setIsModalOpenComment(true);
    };

    const handleOkComment = () => {
        setIsModalOpenComment(false);
    };

    const handleCancelComment = () => {
        setIsModalOpenComment(false);
    };

    return (
        <div className={cx('posts')}>
            <div className={cx('posts-header')}>
                {author?.avatar ? (
                    <Avatar src={author?.avatar} size={40} />
                ) : (
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} size={40} />
                )}
                <div className={cx('name-time')}>
                    <span className={cx('name')}>{author?.name}</span>
                    <div className={cx('time')}>{timeAgo}</div>
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
                <div className={cx('content')}>{description}</div>
                <div className={cx('image')}>
                    <Image style={{ maxHeight: '600px', objectFit: 'cover' }} src={image} />
                </div>
            </div>
            <div className={cx('posts-footer')}>
                <div className={cx('quantity')}>
                    <div className={cx('number-like')}>
                        <div className={cx('like')}>
                            <LikeOutlined style={{ color: '#0080ff' }} />
                        </div>
                        <div className={cx('number')}>{favorites}</div>
                    </div>
                    <div className={cx('number-comment')}>
                        <div className={cx('number')}>{stateComment.length}</div>
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
                    <div className={cx('action-item')} onClick={showModalComment}>
                        <CommentOutlined style={{ fontSize: '20px' }} />
                        <span>Bình luận</span>
                    </div>
                    <Modal
                        title={
                            <div
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                }}
                            >
                                Bài viết của {author?.name}
                            </div>
                        }
                        open={isModalOpenComment}
                        onOk={handleOkComment}
                        onCancel={handleCancelComment}
                        width="45%"
                    >
                        <Loading isLoading={isLoading}>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                        </Loading>
                    </Modal>
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

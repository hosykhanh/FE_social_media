import React from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import images from '../../../assets';
import Search from 'antd/es/transfer/search';

const cx = classNames.bind(styles);

const Header = () => {
    const navigate = useNavigate();

    const handleNavigateHome = () => {
        navigate('/');
    };

    return (
        <header className={cx('header')}>
            <div className={cx('wrapper')}>
                <Row className={cx('row-wrapper')}>
                    <Col span={4}>
                        <div className={cx('app-name')}>
                            <img onClick={handleNavigateHome} src={images.logo} alt="logo" className={cx('logo')} />
                            <div className={cx('name')}>HSK Social Media</div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <Search
                            className={cx('search-input')}
                            placeholder="Tìm kiếm..."
                            allowClear
                            enterButton="Tìm kiếm"
                            size="large"
                            enter="true"
                        />
                    </Col>
                </Row>
            </div>
        </header>
    );
};

export default Header;

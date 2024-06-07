import React from 'react';
import { Button, DatePicker, Form, Image, Input, Radio, Select } from 'antd';
import images from '../../assets/index';

import styles from './SignUpPage.module.scss';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { signUpUser } from '../../services/userService';
import * as messages from '../../components/Message/Message';

const cx = classNames.bind(styles);

const { Option } = Select;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const SignUpPage = () => {
    const navigate = useNavigate();

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const res = await signUpUser(values);
            if (res.status === 'err') {
                messages.error(res.message);
                return;
            }
            messages.success('Đăng kí thành công');
            navigate('/sign-in');
        } catch (error) {
            messages.error('Đăng kí thất bại');
        }
    };
    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="84">+84</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );

    return (
        <div className={cx('wapper')}>
            <div className={cx('wapper-content')}>
                <div className={cx('content')}>
                    <div className={cx('app-name')}>
                        <img src={images.logo} alt="" width="25px" /> HSK SOCIAL MEDIA
                    </div>
                    <div className={cx('header')}>Register</div>
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="register"
                        onFinish={onFinish}
                        initialValues={{
                            prefix: '84',
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label="Nickname"
                            tooltip="What do you want others to call you?"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your nickname!',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error('The new password that you entered do not match!'),
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            label="Gender"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select gender!',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio value="Male">Male</Radio>
                                <Radio value="Female">Femail</Radio>
                                <Radio value="Other">Other</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="dateOfBirth"
                            label="Date"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your date!',
                                },
                            ]}
                        >
                            <DatePicker />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Phone Number"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone number!',
                                },
                            ]}
                        >
                            <Input
                                addonBefore={prefixSelector}
                                style={{
                                    width: '100%',
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your address!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <div className={cx('navigation-login')}>
                                Do you have an account? <a href="/sign-in">Login</a>
                            </div>
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className={cx('image')}>
                <Image
                    preview={false}
                    style={{ height: '500px', objectFit: 'cover' }}
                    src={images.imageLogin}
                    alt="sign up"
                />
            </div>
        </div>
    );
};

export default SignUpPage;

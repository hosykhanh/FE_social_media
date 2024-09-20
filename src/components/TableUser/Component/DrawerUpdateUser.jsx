import { Form, Input, Button as ButtonFinish, Radio } from 'antd';
import DrawerComp from '../../DrawerComp/DrawerComp';
import Loading from '../../Loading/Loading';
import InputUpload from '../../InputUpload/InputUpload';
import { useEffect, useState } from 'react';
import * as userService from '../../../services/userService';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import * as message from '../../Message/Message';
import checkStatusResponse from '../../../utils/checkStatusResponse';

function DrawerUpdateUser({ isOpenDrawer, setIsOpenDrawer, rowSelected, refetch }) {
    const user = useSelector((state) => state.user);
    const initialUser = {
        name: '',
        address: '',
        email: '',
        isAdmin: false,
        phone: '',
        gender: 'Female',
        avatar: '',
    };
    const [stateUserDetail, setStateUserDetail] = useState(initialUser);
    const [isLoading, setIsLoading] = useState(false);
    const [formUpdate] = Form.useForm();

    const mutationUpdate = useMutation({
        mutationFn: (data) => {
            const { id, dataUser } = data;
            return userService.updateUser(id, dataUser);
        },
    });

    const { data: dataUpdated, isSuccess: isSuccessUpdated } = mutationUpdate;

    useEffect(() => {
        if (rowSelected && user && isOpenDrawer) {
            const getProductDetail = async (rowSelected) => {
                setIsLoading(true);
                const res = await userService.getUser(rowSelected);
                setStateUserDetail({
                    name: res?.name,
                    address: res?.address,
                    email: res?.email,
                    isAdmin: res?.isAdmin,
                    phone: res?.phone,
                    gender: res?.gender,
                    avatar: res?.avatar,
                });
                setIsLoading(false);
            };
            getProductDetail(rowSelected);
        }
    }, [rowSelected, user, isOpenDrawer]);

    useEffect(() => {
        formUpdate.setFieldsValue(stateUserDetail);
    }, [formUpdate, stateUserDetail]);

    useEffect(() => {
        if (isSuccessUpdated && checkStatusResponse(dataUpdated)) {
            setIsOpenDrawer(false);
            formUpdate.resetFields();
            setStateUserDetail({});
            message.success('Cập nhật người dùng thành công');
            if (refetch) {
                refetch();
            }
        } else if (dataUpdated?.status === 'err') {
            message.error(dataUpdated?.message);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessUpdated, dataUpdated]);

    const onUpdate = () => {
        mutationUpdate.mutate({ id: rowSelected, dataUser: stateUserDetail });
    };

    const handleOnChangeDetail = (e) => {
        setStateUserDetail({ ...stateUserDetail, [e.target.name]: e.target.value });
    };

    const handleOnChangeImageDetail = (url) => {
        setStateUserDetail({ ...stateUserDetail, image: url });
    };

    const handleOnChangeRole = (e) => {
        setStateUserDetail({ ...stateUserDetail, [e.target.name]: e.target.value });
    };

    return (
        <DrawerComp title="Chi tiết người dùng" isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)}>
            <Loading isLoading={isLoading} delay="200">
                <Form
                    name="basic"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 18,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    onFinish={onUpdate}
                    autoComplete="off"
                    form={formUpdate}
                >
                    <Form.Item
                        label="Tên"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên người dùng',
                            },
                        ]}
                    >
                        <Input value={stateUserDetail.name} onChange={handleOnChangeDetail} name="name" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email',
                            },
                        ]}
                    >
                        <Input value={stateUserDetail.type} onChange={handleOnChangeDetail} name="email" />
                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập địa chỉ',
                            },
                        ]}
                    >
                        <Input value={stateUserDetail.address} onChange={handleOnChangeDetail} name="address" />
                    </Form.Item>
                    <Form.Item
                        label="Điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại',
                            },
                        ]}
                    >
                        <Input value={stateUserDetail.phone} onChange={handleOnChangeDetail} name="phone" />
                    </Form.Item>

                    <Form.Item label="Giới tính" name="gender">
                        <Radio.Group onChange={handleOnChangeDetail} name="gender" value={stateUserDetail.gender}>
                            <Radio value="Male">Nam</Radio>
                            <Radio value="Female">Nữ</Radio>
                            <Radio value="Other">Khác</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Vai trò" name="isAdmin">
                        <Radio.Group onChange={handleOnChangeRole} name="isAdmin" value={stateUserDetail.isAdmin}>
                            <Radio value={false}>Người dùng</Radio>
                            <Radio value={true}>Quản trị viên</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Hình đại diện" name="avatar">
                        <InputUpload avatar={stateUserDetail.avatar} onChange={handleOnChangeImageDetail} />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <ButtonFinish type="primary" htmlType="submit">
                            Áp dụng
                        </ButtonFinish>
                    </Form.Item>
                </Form>
            </Loading>
        </DrawerComp>
    );
}

export default DrawerUpdateUser;

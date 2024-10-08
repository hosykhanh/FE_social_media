import classNames from 'classnames/bind';
import { DeleteOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { useMutation } from 'react-query';
import Highlighter from 'react-highlight-words';

import styles from './TableGroup.module.scss';
import TableComp from '../TableComp/TableComp';
import { useRef, useState } from 'react';
import * as chatService from '../../services/chatService';
import * as userService from '../../services/userService';
import ModalConfirm from '../ModalConfirm/ModalConfirm';
import { Button, Input, message, Space, Upload } from 'antd';
import DrawerDetailGroupChat from './Component/DrawerDetailGroupChat';

const cx = classNames.bind(styles);

function TableGroup({ isLoading, data, refetch }) {
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');

    // ----- RENDER TABLE GROUP CHAT -----
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const renderAction = () => {
        return (
            <div className={cx('action')}>
                <div style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setIsOpenDrawer(true)}>
                    Xem chi tiết
                </div>
                <DeleteOutlined
                    style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }}
                    onClick={() => setIsDeleteModalOpen(true)}
                />
            </div>
        );
    };

    const setTime = (time) => {
        const date = new Date(time);
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();
        const hours = date.getUTCHours() + 7;
        const minutes = date.getUTCMinutes();

        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
        return formattedDate;
    };

    // Search group chat
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Cài lại
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Lọc
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Đóng
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => {
            const keys = dataIndex.split('.');
            const recordValue = keys.reduce((acc, key) => acc && acc[key], record);
            return recordValue ? recordValue.toString().toLowerCase().includes(value.toLowerCase()) : false;
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const columns = [
        {
            title: 'Tên nhóm chat',
            dataIndex: 'nameRoom',
            sorter: (a, b) => a.nameRoom.length - b.nameRoom.length,
            ...getColumnSearchProps('nameRoom'),
        },
        {
            title: 'Số thành viên',
            dataIndex: 'participants',
            render: (text, record) => record.participants.length,
        },
        {
            title: 'Thời gian tạo nhóm',
            dataIndex: 'createdAt',
            render: (text, record) => setTime(record.createdAt),
        },
        {
            title: 'Hoạt động',
            dataIndex: 'action',
            render: renderAction,
        },
    ];

    // ----- DELETE GROUP CHAT -----
    const mutation = useMutation({
        mutationFn: (data) => chatService.deleteChatRoom(data),
    });

    const mutationDelMany = useMutation({
        mutationFn: (data) => chatService.deleteManyChatRoom(data),
    });
    // -----

    const beforeUpload = (file) => {
        const isExcel =
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel';
        if (!isExcel) {
            message.error('You can only upload Excel files!');
        }
        return isExcel;
    };

    const handleOnChangeFile = async (info) => {
        if (info.file.status === 'done') {
            message.success('File uploaded successfully!');
        } else if (info.file.status === 'error') {
            message.error('File upload failed!');
        }
    };

    // Custom request để xử lý upload file
    const customRequest = async (options) => {
        const { onSuccess, onError, file } = options;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await userService.createUsersFromExcel(formData);
            refetch();

            if (res.status === 'success') {
                onSuccess(res, file);
                message.success(res.message || 'Upload thành công!');
            } else {
                onError(res);
                message.error(res.message || 'Có lỗi xảy ra trong quá trình upload!');
            }
        } catch (error) {
            onError(error);
            message.error('Không thể kết nối tới server hoặc upload thất bại!');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>Quản lý nhóm chat</div>
            <div className={cx('upload-file')}>
                <Upload
                    customRequest={customRequest}
                    onChange={(file) => handleOnChangeFile(file)}
                    beforeUpload={beforeUpload}
                >
                    <Button type="primary">
                        <UploadOutlined />
                        Import file
                    </Button>
                </Upload>
            </div>
            <div className={cx('table')}>
                <TableComp
                    columns={columns}
                    data={data}
                    isLoading={isLoading}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setRowSelected(record._id);
                            },
                        };
                    }}
                    refetch={refetch}
                    mutation={mutationDelMany}
                />
            </div>

            {/* Drawer detail group chat */}
            <DrawerDetailGroupChat
                isOpenDrawer={isOpenDrawer}
                setIsOpenDrawer={setIsOpenDrawer}
                rowSelected={rowSelected}
                refetch={refetch}
            />

            {/* Modal delete group chat */}
            <ModalConfirm
                isOpen={isDeleteModalOpen}
                setIsOpen={setIsDeleteModalOpen}
                rowSelected={rowSelected}
                title="Bạn có chắc chắn xóa nhóm chat này không"
                refetch={refetch}
                mutation={mutation}
            />
        </div>
    );
}

export default TableGroup;

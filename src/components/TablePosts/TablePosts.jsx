import classNames from 'classnames/bind';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation } from 'react-query';
import Highlighter from 'react-highlight-words';

import styles from './TablePostst.module.scss';
import TableComp from '../TableComp/TableComp';
import { useRef, useState } from 'react';
import * as postsService from '../../services/postsService';
import ModalConfirm from '../ModalConfirm/ModalConfirm';
import { Button, Input, Space } from 'antd';
import DrawerDetailPosts from './Component/DrawerDetailPosts';

const cx = classNames.bind(styles);

function TablePosts({ isLoading, data, refetch }) {
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');

    // ----- RENDER TABLE POSTS -----
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

    // Search posts
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
            title: 'Tên người đăng',
            dataIndex: 'user',
            sorter: (a, b) => a.user.name.length - b.user.name.length,
            ...getColumnSearchProps('user.name'),
            render: (text, record) => record.user.name,
        },
        {
            title: 'Email người đăng',
            dataIndex: 'user',
            sorter: (a, b) => a.user.email.localeCompare(b.user.email),
            ...getColumnSearchProps('user.email'),
            render: (text, record) => record.user.email,
        },
        {
            title: 'Nội dung bài viết',
            dataIndex: 'description',
        },
        {
            title: 'Thời gian đăng bài',
            dataIndex: 'createdAt',
        },
        {
            title: 'Hoạt động',
            dataIndex: 'action',
            render: renderAction,
        },
    ];

    // ----- DELETE POST -----
    const mutation = useMutation({
        mutationFn: (data) => postsService.deletePosts(data),
    });

    const mutationDelMany = useMutation({
        mutationFn: (data) => postsService.deleteManyPosts(data),
    });
    // -----
    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>Quản lý bài viết</div>
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

            {/* Drawer detail posts */}
            <DrawerDetailPosts
                isOpenDrawer={isOpenDrawer}
                setIsOpenDrawer={setIsOpenDrawer}
                rowSelected={rowSelected}
                refetch={refetch}
            />

            {/* Modal delete posts */}
            <ModalConfirm
                isOpen={isDeleteModalOpen}
                setIsOpen={setIsDeleteModalOpen}
                rowSelected={rowSelected}
                title="Bạn có chắc chắn xóa bài viết này không"
                refetch={refetch}
                mutation={mutation}
            />
        </div>
    );
}

export default TablePosts;

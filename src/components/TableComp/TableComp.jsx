import { Button, Dropdown, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import Loading from '../Loading/Loading';
import * as message from '../Message/Message';

function TableComp({
    selectionType = 'checkbox',
    data = [],
    isLoading = false,
    columns = [],
    onRow,
    refetch,
    mutation,
}) {
    const user = useSelector((state) => state?.user);
    const [rowSelectedKey, setRowSelectedKey] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKey(selectedRowKeys);
        },
    };
    // add _id to data table
    const dataTable = useMemo(
        () =>
            data?.length &&
            data?.map((product) => {
                return { ...product, key: product._id };
            }),
        [data],
    );

    // -----

    useEffect(() => {
        if (mutation?.isSuccess) {
            setIsSuccess(mutation?.isSuccess);
        }
    }, [mutation?.isSuccess]);

    useEffect(() => {
        if (mutation?.isLoading) {
            setIsUpdateLoading(mutation?.isLoading);
        }
    }, [mutation?.isLoading]);

    useEffect(() => {
        if (isSuccess) {
            message.success('Xóa thành công');
            setIsUpdateLoading(false);
            refetch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);
    const handleDeleteAll = () => {
        if (user && rowSelectedKey) {
            mutation.mutate({ ids: rowSelectedKey });
        }
    };

    const items = [
        {
            key: '1',
            label: (
                <span onClick={handleDeleteAll} style={{ color: 'red' }}>
                    Xóa đã chọn
                </span>
            ),
        },
    ];
    return (
        <Loading isLoading={isUpdateLoading || isLoading}>
            {rowSelectedKey.length > 0 && (
                <Dropdown menu={{ items }} placement="bottom">
                    <Button>Hoạt động</Button>
                </Dropdown>
            )}

            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={dataTable}
                onRow={onRow}
                pagination={{
                    position: ['bottomCenter'],
                    defaultPageSize: 6,
                    total: data?.total,
                }}
                style={{ marginTop: '12px' }}
            />
        </Loading>
    );
}

export default TableComp;
